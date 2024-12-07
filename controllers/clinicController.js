const clinicModel = require('../models/clinicModel');
const doctorModel = require('../models/doctorModel');

// Hàm thêm trạm xá
const createClinic = async (req, res) => {
    try {
        const { name, address, phoneNumber, openTime, closeTime } = req.body;

        // Kiểm tra định dạng thời gian hợp lệ
        const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
        if (!timeRegex.test(openTime) || !timeRegex.test(closeTime)) {
            return res.status(400).json({ error: 'Invalid time format. Use HH:mm format.' });
        }

        // Kiểm tra openTime nhỏ hơn closeTime
        if (openTime >= closeTime) {
            return res.status(400).json({ error: 'openTime must be earlier than closeTime.' });
        }

        const newClinic = await clinicModel.createClinic(name, address, phoneNumber, openTime, closeTime);
        res.status(201).json(newClinic);
    } catch (error) {
        console.error('Error creating clinic:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};


// Hàm lấy danh sách trạm xá
const getAllClinics = async (req, res) => {
    try {
        const clinics = await clinicModel.getAllClinics();
        res.status(200).json(clinics);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

const fetchClinicByID = async (req, res) => {
    try {
        const { id } = req.params;
        const clinic = await clinicModel.getClinicByID(id);

        if (!clinic) {
            return res.status(404).json({ message: 'Clinic not found' });
        }

        res.status(200).json(clinic);
    } catch (error) {
        res.status(500).json({ message: error.message});
    }
};

// Hàm cập nhật thông tin trạm xá
const updateClinic = async (req, res) => {
    try {
        const id = req.params.id;
        const updates = req.body;

        // Kiểm tra định dạng thời gian hợp lệ (nếu có cập nhật)
        const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
        if (updates.openTime && !timeRegex.test(updates.openTime)) {
            return res.status(400).json({ error: 'Invalid openTime format. Use HH:mm format.' });
        }
        if (updates.closeTime && !timeRegex.test(updates.closeTime)) {
            return res.status(400).json({ error: 'Invalid closeTime format. Use HH:mm format.' });
        }

        // Kiểm tra openTime nhỏ hơn closeTime (nếu cả hai đều được cung cấp)
        if (
            updates.openTime &&
            updates.closeTime &&
            updates.openTime >= updates.closeTime
        ) {
            return res.status(400).json({ error: 'openTime must be earlier than closeTime.' });
        }

        const updatedClinic = await clinicModel.updateClinic(id, updates);
        if (updatedClinic) {
            res.status(200).json(updatedClinic);
        } else {
            res.status(404).json({ error: 'Clinic not found' });
        }
    } catch (error) {
        console.error('Error updating clinic:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Hàm xoá trạm xá
const deleteClinic = async (req, res) => {
    try {
        const id = req.params.id;
        const isDeleted = await clinicModel.deleteClinic(id);
        if (isDeleted) {
            res.status(200).json({ message: 'Clinic deleted successfully' });
        } else {
            res.status(404).json({ error: 'Clinic not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Lấy danh sách bác sĩ của một trạm xá cụ thể
const getDoctorsByClinic = async (req, res) => {
    const { id } = req.params;

    try {
        const doctors = await clinicModel.getDoctorsByClinic(id);

        res.status(200).json({ doctors });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};


// Thêm bác sĩ vào trạm xá
const assignDoctorToClinic = async (req, res) => {
    const { doctorId, clinicId } = req.params;
    const { startDate } = req.body;

    try {
        // Kiểm tra bác sĩ có tồn tại không
        const doctor = await doctorModel.getDoctorById(doctorId);
        if (!doctor) {
            return res.status(404).json({ error: 'Doctor not found' });
        }

        // Kiểm tra trạm xá có tồn tại không
        const clinic = await clinicModel.getClinicByID(clinicId);
        if (!clinic) {
            return res.status(404).json({ error: 'Clinic not found' });
        }

        // Thêm mối quan hệ bác sĩ và trạm xá
        const relationship = await clinicModel.addDoctorToClinic(doctorId, clinicId, startDate);
        
        if (!relationship) {
            return res.status(400).json({ error: 'Failed to add doctor to clinic.' });
        }

        return res.status(201).json({ message: 'Doctor added to clinic successfully.' });
    } catch (error) {
        console.error('Error adding doctor to clinic:', error);
        return res.status(500).json({ error: 'Internal server error.' });
    }
};



// Sửa thông tin ngày bắt đầu làm việc
const changeStartDateWorkAtClinic = async (req, res) => {
    const { doctorId, clinicId } = req.params;
    const { newStartDate } = req.body;

    try {
        const updatedRelationship = await clinicModel.updateStartDateWorkAtClinic(doctorId, clinicId, newStartDate);
        if (!updatedRelationship) {
            return res.status(404).json({ error: 'Doctor or clinic relationship not found.' });
        }

        return res.status(200).json({ message: 'Start date updated successfully.' });
    } catch (error) {
        console.error('Error updating start date:', error);
        res.status(500).json({ error: 'Internal server error.' });
    }
};


// Xóa mối quan hệ làm việc
const deleteWorkClinic = async (req, res) => {
    const { doctorId, clinicId } = req.params;

    try {
        const success = await clinicModel.deleteWorkRelationship(doctorId, clinicId);
        if (!success) {
            return res.status(404).json({ error: 'Doctor or clinic relationship not found.' });
        }

        return res.status(200).json({ message: 'Relationship deleted successfully.' });
    } catch (error) {
        console.error('Error deleting relationship:', error);
        res.status(500).json({ error: 'Internal server error.' });
    }
};


module.exports = {
    createClinic,
    getAllClinics,
    fetchClinicByID,
    updateClinic,
    deleteClinic,
    getDoctorsByClinic,
    assignDoctorToClinic,
    changeStartDateWorkAtClinic,
    deleteWorkClinic
};
