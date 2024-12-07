const appointmentModel = require('../models/appointmentModel');

// Hàm kiểm tra định dạng ISO 8601
const isValidISODate = (dateString) => {
    const isoDateRegex = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])T([01]\d|2[0-3]):([0-5]\d):([0-5]\d)(\.\d+)?(Z|[+-](0[0-9]|1[0-3]):[0-5]\d)$/;
    return isoDateRegex.test(dateString);
};

// Thêm cuộc hẹn
const addAppointment = async (req, res) => {
    try {
        const { doctorId, patientId, clinicId, appointmentDate, duration } = req.body;

        // Kiểm tra định dạng thời gian (ISO 8601)
        if (!isValidISODate(appointmentDate)) {
            return res.status(400).json({ error: 'Invalid date format. Date must be in ISO 8601 format (e.g., 2024-12-01T14:30:00Z).' });
        }

        // Kiểm tra sự tồn tại của bác sĩ, bệnh nhân, và trạm xá
        const entitiesExist = await appointmentModel.checkEntitiesExist(doctorId, patientId, clinicId);
        if (!entitiesExist) {
            return res.status(400).json({ error: 'Doctor, patient, or clinic does not exist.' });
        }

        // Kiểm tra giờ mở cửa của trạm xá
        const clinicAvailable = await appointmentModel.checkClinicOpeningHours(clinicId, appointmentDate, duration);
        if (!clinicAvailable) {
            return res.status(400).json({ error: 'Appointment time is outside clinic opening hours.' });
        }

        // Kiểm tra lịch làm việc của bác sĩ
        const workShiftValid = await appointmentModel.checkDoctorWorkShift(doctorId, appointmentDate, duration);
        if (!workShiftValid) {
            return res.status(400).json({ error: 'Appointment time does not fit doctor work shifts.' });
        }

        // Kiểm tra xung đột lịch hẹn của bác sĩ
        const doctorConflict = await checkDoctorAppointmentConflict(doctorId, appointmentDate, duration);
        if (doctorConflict) {
            return res.status(400).json({ error: "Doctor's schedule conflicts with an existing appointment." });
        }

        // Kiểm tra xung đột lịch hẹn của bệnh nhân
        const patientConflict = await checkPatientAppointmentConflict(patientId, appointmentDate, duration);
        if (patientConflict) {
            return res.status(400).json({ error: "Patient's schedule conflicts with an existing appointment." });
        }

        // Tạo cuộc hẹn mới
        const appointment = await appointmentModel.createAppointment(doctorId, patientId, clinicId, appointmentDate, duration);
        res.status(201).json(appointment);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Hàm cập nhật trạng thái cuộc hẹn
const updateAppointmentStatus = async (req, res) => {
    const { appointmentId } = req.params;
    const { newStatus } = req.body;

    // Danh sách trạng thái hợp lệ
    const validStatuses = ['Scheduled', 'Cancelled', 'Completed'];

    try {
        // Kiểm tra trạng thái hợp lệ
        if (!validStatuses.includes(newStatus)) {
            return res.status(400).json({ error: `Invalid status. Valid statuses are: ${validStatuses.join(', ')}` });
        }

        // Gọi hàm cập nhật trạng thái từ model
        const updatedAppointment = await appointmentModel.updateAppointmentStatus(appointmentId, newStatus);

        // Kiểm tra kết quả từ model
        if (!updatedAppointment) {
            return res.status(404).json({ error: 'Appointment not found' });
        }

        // Thành công, trả về thông tin cuộc hẹn đã cập nhật
        res.status(200).json(updatedAppointment);
    } catch (error) {
        console.error('Error updating appointment status:', error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
};


// Hàm xoá cuộc hẹn
const deleteAppointment = async (req, res) => {
    const { appointmentId } = req.params;

    try {
        const deleted = await appointmentModel.deleteAppointment(appointmentId);
        if (!deleted) {
            return res.status(404).json({ error: 'Appointment not found' });
        }
        res.status(204).send(); // Trả về 204 No Content khi xoá thành công
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Hàm lấy thông tin của cuộc hẹn bằng id
const getAppointment = async (req, res) => {
    const { appointmentId } = req.params;

    try {
        // Gọi hàm trong model để lấy thông tin cuộc hẹn
        const appointment = await appointmentModel.getAppointmentById(appointmentId);

        // Xử lý nếu không tìm thấy cuộc hẹn
        if (!appointment) {
            return res.status(404).json({ error: 'Appointment not found' });
        }

        // Thành công: trả về thông tin cuộc hẹn
        res.status(200).json(appointment);
    } catch (error) {
        console.error('Error fetching appointment:', error.message);

        // Lỗi hệ thống (Neo4j hoặc xử lý khác)
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Lấy danh sách các bác sĩ trong cuộc hẹn
const getDoctors = async (req, res) => {
    const { appointmentId } = req.params;

    try {
        const doctors = await appointmentModel.getDoctorsByAppointmentId(appointmentId);

        if (doctors === null) {
            return res.status(404).json({ error: 'No doctors found for this appointment' });
        }

        res.status(200).json(doctors);
    } catch (error) {
        res.status(500).json({ error: `Error fetching doctors: ${error.message}` });
    }
};

// Lấy danh sách bệnh nhân trong cuộc hẹn
const getPatients = async (req, res) => {
    const { appointmentId } = req.params;

    try {
        const patients = await appointmentModel.getPatientsByAppointmentId(appointmentId);

        if (patients === null) {
            return res.status(404).json({ error: 'No patients found for this appointment' });
        }

        res.status(200).json(patients);
    } catch (error) {
        res.status(500).json({ error: `Error fetching patients: ${error.message}` });
    }
};


const getClinic = async (req, res) => {
    const { appointmentId } = req.params;

    try {
        const clinic = await appointmentModel.getClinicByAppointmentId(appointmentId);

        if (clinic === null) {
            return res.status(404).json({ error: 'Clinic not found for this appointment' });
        }

        res.status(200).json(clinic);
    } catch (error) {
        res.status(500).json({ error: `Error fetching clinic: ${error.message}` });
    }
};


// Hàm thêm một bác sĩ vào một cuộc hẹn
const addDoctorToAppointment = async (req, res) => {
    try {
        const { appointmentId, doctorId } = req.body;

        // Kiểm tra sự tồn tại của cuộc hẹn và bác sĩ
        const appointmentExists = await appointmentModel.checkAppointmentExists(appointmentId);
        const doctorExists = await appointmentModel.checkDoctorExists(doctorId);

        if (!appointmentExists || !doctorExists) {
            return res.status(404).json({ error: 'Appointment or doctor not found.' });
        }

        // Lấy thông tin cuộc hẹn
        const appointment = await appointmentModel.getAppointmentById(appointmentId);
        const appointmentDate = appointment.AppointmentDate;
        const duration = appointment.duration;

        // Kiểm tra xung đột lịch làm việc của bác sĩ
        const workShiftValid = await appointmentModel.checkDoctorWorkShift(doctorId, appointmentDate, duration);
        if (!workShiftValid) {
            return res.status(400).json({ error: 'Appointment time does not fit doctor work shifts.' });
        }

        // Kiểm tra xung đột lịch hẹn của bác sĩ
        const doctorConflict = await appointmentModel.checkDoctorAppointmentConflict(doctorId, appointmentDate, duration);
        if (doctorConflict) {
            return res.status(400).json({ error: "Doctor's schedule conflicts with an existing appointment." });
        }

        // Thêm bác sĩ vào cuộc hẹn
        const result = await appointmentModel.addDoctorToAppointment(appointmentId, doctorId);
        res.status(200).json({ message: 'Doctor added to appointment successfully.', appointment: result });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    addAppointment,
    updateAppointmentStatus,
    deleteAppointment,
    getAppointment,
    getDoctors,
    getPatients,
    getClinic,
    addDoctorToAppointment
};

