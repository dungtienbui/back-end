const { v4: uuidv4 } = require('uuid');
const { runQuery } = require('../config/neo4j');

// Hàm thêm bác sĩ
const createDoctor = async (name, specialization, phone) => {
    const id = uuidv4();
    const query = `
        CREATE (d:Doctor {
            id: $id, 
            name: $name, 
            specialization: $specialization, 
            phone: $phone
        })
        RETURN d
    `;
    const params = { id, name, specialization, phone };
    const result = await runQuery(query, params);
    return result.records[0].get('d').properties;
};

// Lấy danh sách bác sĩ
const getAllDoctors = async () => {
    const query = 'MATCH (d:Doctor) RETURN d';
    const result = await runQuery(query, {});
    return result.records.map(record => record.get('d').properties);
};

// Lấy thông tin bác sĩ theo ID
const getDoctorById = async (id) => {
    const query = 'MATCH (d:Doctor {id: $id}) RETURN d';
    const params = { id };
    const result = await runQuery(query, params);
    if (result.records.length === 0) return null;
    return result.records[0].get('d').properties;
};

// Sửa thông tin bác sĩ
const updateDoctor = async (id, updates) => {
    const queryParts = [];
    const params = { id };
    Object.keys(updates).forEach((key, index) => {
        queryParts.push(`d.${key} = $${key}`);
        params[key] = updates[key];
    });

    const query = `
        MATCH (d:Doctor {id: $id}) 
        SET ${queryParts.join(', ')} 
        RETURN d
    `;
    const result = await runQuery(query, params);
    if (result.records.length === 0) return null;
    return result.records[0].get('d').properties;
};

// Xóa bác sĩ
const deleteDoctor = async (id) => {
    const query = 'MATCH (d:Doctor {id: $id}) DELETE d RETURN d';
    const params = { id };
    const result = await runQuery(query, params);
    return result.summary.counters.updates().nodesDeleted;
};

const formatDate = (neo4jDate) => {

    if (!neo4jDate) return null; // Trả về null nếu không có giá trị

    const year = neo4jDate.year.low;
    const month = String(neo4jDate.month.low).padStart(2, '0');
    const day = String(neo4jDate.day.low).padStart(2, '0');

    return `${day}-${month}-${year}`;
};

// Tìm danh sách trạm xá mà một bác sĩ đang làm việc
const getClinicsByDoctor = async (doctorId) => {
    const query = `
        MATCH (d:Doctor {id: $doctorId})-[r:WORK_AT]->(c:Clinic)
        RETURN c {.*, startDate: r.startDate } AS clinic
    `;
    const params = { doctorId };
    const result = await runQuery(query, params);

    return result.records.map(record => {
        const clinic = record.get('clinic');
        const startDate = clinic.startDate;

        // Chuyển đổi startDate
        clinic.startDate = formatDate(startDate);

        return clinic;
    });
};

module.exports = {
    createDoctor,
    getAllDoctors,
    getDoctorById,
    updateDoctor,
    deleteDoctor,
    getClinicsByDoctor
};
