const { v4: uuidv4 } = require('uuid');
const { session } = require('../config/neo4j');

// Hàm kiểm tra sự tồn tại của cuộc hẹn
const checkAppointmentExists = async (appointmentId) => {
    const result = await session.run(
        `MATCH (a:Appointment {id: $appointmentId})
         RETURN a`,
        { appointmentId }
    );
    return result.records.length > 0;
};

// Hàm kiểm tra sự tồn tại của bác sĩ
const checkDoctorExists = async (doctorId) => {
    const result = await session.run(
        `MATCH (d:Doctor {id: $doctorId})
         RETURN d`,
        { doctorId }
    );
    return result.records.length > 0;
};

// Kiểm tra sự tồn tại của bác sĩ, bệnh nhân, và trạm xá
const checkEntitiesExist = async (doctorId, patientId, clinicId) => {
    const result = await session.run(
        `MATCH (d:Doctor {id: $doctorId}), (p:Patient {id: $patientId}), (c:Clinic {id: $clinicId})
         RETURN d, p, c`,
        { doctorId, patientId, clinicId }
    );
    return result.records.length > 0;
};

// Kiểm tra thời gian cuộc hẹn trong giờ mở cửa của trạm xá
const checkClinicOpeningHours = async (clinicId, appointmentDate, duration) => {
    const startTime = new Date(appointmentDate);
    const endTime = new Date(startTime.getTime() + duration * 60000);

    const result = await session.run(
        `MATCH (c:Clinic {id: $clinicId})
         WHERE time($startTime) >= time(c.openTime) AND time($endTime) <= time(c.closeTime)
         RETURN c`,
        { clinicId, startTime: startTime.toISOString(), endTime: endTime.toISOString() }
    );
    return result.records.length > 0;
};

// Kiểm tra thời gian trong lịch làm việc của bác sĩ
const checkDoctorWorkShift = async (doctorId, appointmentDate, duration) => {
    const dayOfWeek = new Date(appointmentDate).toLocaleDateString('en-US', { weekday: 'long' });
    const startTime = new Date(appointmentDate);
    const endTime = new Date(startTime.getTime() + duration * 60000);

    const result = await session.run(
        `MATCH (d:Doctor {id: $doctorId})-[:HAS_WORK_SHIFT]->(ws:WorkShift)
         WHERE ws.day = $dayOfWeek AND time($startTime) >= time(ws.startTime) AND time($endTime) <= time(ws.endTime)
         RETURN ws`,
        { doctorId, dayOfWeek, startTime: startTime.toISOString(), endTime: endTime.toISOString() }
    );
    return result.records.length > 0;
};

// Hàm kiểm tra xung đột lịch hẹn của bác sĩ
const checkDoctorAppointmentConflict = async (doctorId, appointmentDate, duration) => {
    const startTime = new Date(appointmentDate);
    const endTime = new Date(startTime.getTime() + duration * 60000);

    const result = await session.run(
        `MATCH (d:Doctor {id: $doctorId})-[:ATTENDS]->(a:Appointment)
         WHERE datetime(a.AppointmentDate) < datetime($endTime) AND
               datetime(a.AppointmentDate) + duration('PT' + a.duration + 'M') > datetime($startTime) AND
               a.Status = 'Scheduled'
         RETURN a`,
        { doctorId, startTime: startTime.toISOString(), endTime: endTime.toISOString() }
    );
    return result.records.length > 0; // Trả về true nếu có xung đột
};

// Hàm kiểm tra xung đột lịch hẹn của bệnh nhân
const checkPatientAppointmentConflict = async (patientId, appointmentDate, duration) => {
    const startTime = new Date(appointmentDate);
    const endTime = new Date(startTime.getTime() + duration * 60000);

    const result = await session.run(
        `MATCH (p:Patient {id: $patientId})-[:HAS_APPOINTMENT]->(a:Appointment)
         WHERE datetime(a.AppointmentDate) < datetime($endTime) AND
               datetime(a.AppointmentDate) + duration('PT' + a.duration + 'M') > datetime($startTime) AND
               a.Status = 'Scheduled'
         RETURN a`,
        { patientId, startTime: startTime.toISOString(), endTime: endTime.toISOString() }
    );
    return result.records.length > 0; // Trả về true nếu có xung đột
};



// Tạo cuộc hẹn
const createAppointment = async (doctorId, patientId, clinicId, appointmentDate, duration) => {
    const id = uuidv4();
    const createdAt = new Date().toISOString();

    const result = await session.run(
        `MATCH (d:Doctor {id: $doctorId}), (p:Patient {id: $patientId}), (c:Clinic {id: $clinicId})
         CREATE (a:Appointment {
             id: $id,
             AppointmentDate: $appointmentDate,
             duration: $duration,
             Status: 'Scheduled',
             CreatedAt: $createdAt,
             UpdatedAt: $createdAt
         })
         CREATE (p)-[:HAS_APPOINTMENT]->(a)
         CREATE (a)-[:OCCURS_AT]->(c)
         CREATE (d)-[:ATTENDS]->(a)
         RETURN a`,
        { id, doctorId, patientId, clinicId, appointmentDate, duration, createdAt }
    );
    return result.records[0].get('a').properties;
};


// Cập nhật trạng thái cuộc hẹn trong Neo4j
const updateAppointmentStatus = async (appointmentId, newStatus) => {
    const result = await session.run(
        `MATCH (a:Appointment {id: $appointmentId})
         SET a.Status = $newStatus, a.UpdatedAt = datetime()
         RETURN a`,
        { appointmentId, newStatus }
    );

    if (result.records.length > 0) {
        return result.records[0].get('a').properties; // Trả về thông tin cuộc hẹn sau khi cập nhật
    }
    return null; // Không tìm thấy cuộc hẹn
};

// Hàm xoá cuộc hẹn bằng id
const deleteAppointment = async (appointmentId) => {
    try {
        const result = await session.run(
            `MATCH (a:Appointment {id: $appointmentId})
             DETACH DELETE a`,
            { appointmentId }
        );

        // Kiểm tra xem có thực sự xoá được nút không
        return result.summary.counters.nodesDeleted > 0;
    } catch (error) {
        console.error('Error deleting appointment:', error);
        throw new Error('Error deleting appointment');
    }
};


// Hàm lấy thông tin của cuộc hẹn bằng id
const getAppointmentById = async (appointmentId) => {
    const result = await session.run(
        `MATCH (a:Appointment {id: $appointmentId})
         RETURN a`,
        { appointmentId }
    );

    // Trả về null nếu không tìm thấy
    if (result.records.length === 0) {
        return null;
    }

    // Trả về thuộc tính của cuộc hẹn
    return result.records[0].get('a').properties;
};

// Lấy danh sách các bác sĩ trong cuộc hẹn
const getDoctorsByAppointmentId = async (appointmentId) => {
    const result = await session.run(
        `MATCH (d:Doctor)-[:PARTICIPATES_IN]->(a:Appointment {id: $appointmentId})
         RETURN d`,
        { appointmentId }
    );

    if (result.records.length === 0) {
        // Trả về null nếu không tìm thấy bác sĩ
        return null;
    }

    return result.records.map(record => record.get('d').properties);
};

// Lấy danh sách bệnh nhân trong cuộc hẹn
const getPatientsByAppointmentId = async (appointmentId) => {
    try {
        const result = await session.run(
            `MATCH (p:Patient)-[:PARTICIPATES_IN]->(a:Appointment {id: $appointmentId})
             RETURN p`,
            { appointmentId }
        );

        if (result.records.length === 0) {
            // Trả về null nếu không tìm thấy bệnh nhân
            return null;
        }

        return result.records.map(record => record.get('p').properties);
    } catch (error) {
        throw new Error(`Error fetching patients: ${error.message}`);
    }
};


const getClinicByAppointmentId = async (appointmentId) => {
    try {
        const result = await session.run(
            `MATCH (c:Clinic)-[:HOSTS]->(a:Appointment {id: $appointmentId})
             RETURN c`,
            { appointmentId }
        );

        // Trả về null nếu không tìm thấy phòng khám
        if (result.records.length === 0) {
            return null;
        }

        return result.records[0].get('c').properties;
    } catch (error) {
        throw new Error(`Error fetching clinic: ${error.message}`);
    }
};


// Hàm thêm bác sĩ vào cuộc hẹn
const addDoctorToAppointment = async (appointmentId, doctorId) => {
    const result = await session.run(
        `MATCH (d:Doctor {id: $doctorId}), (a:Appointment {id: $appointmentId})
         CREATE (d)-[:ATTENDS]->(a)
         RETURN a`,
        { doctorId, appointmentId }
    );
    return result.records[0].get('a').properties;
};



// Xuất các hàm
module.exports = {
    checkAppointmentExists,
    checkDoctorExists,
    checkEntitiesExist,
    checkClinicOpeningHours,
    checkDoctorWorkShift,
    checkDoctorAppointmentConflict,
    checkPatientAppointmentConflict,
    createAppointment,
    updateAppointmentStatus,
    deleteAppointment,
    getAppointmentById,
    getDoctorsByAppointmentId,
    getPatientsByAppointmentId,
    getClinicByAppointmentId,
    addDoctorToAppointment
};
