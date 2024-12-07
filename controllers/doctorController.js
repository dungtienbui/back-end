const doctorModel = require('../models/doctorModel');

// Thêm bác sĩ
const addDoctor = async (req, res) => {
    try {
        const { name, specialization, phone } = req.body;
        const doctor = await doctorModel.createDoctor(name, specialization, phone);
        res.status(201).json(doctor);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Lấy danh sách bác sĩ
const getDoctors = async (req, res) => {
    try {
        const doctors = await doctorModel.getAllDoctors();
        res.status(200).json(doctors);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Lấy thông tin bác sĩ theo ID
const getDoctor = async (req, res) => {
    try {
        const { id } = req.params;
        const doctor = await doctorModel.getDoctorById(id);
        if (!doctor) return res.status(404).json({ error: 'Doctor not found' });
        res.status(200).json(doctor);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Sửa thông tin bác sĩ
const updateDoctor = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;
        const updatedDoctor = await doctorModel.updateDoctor(id, updates);
        if (!updatedDoctor) return res.status(404).json({ error: 'Doctor not found' });
        res.status(200).json(updatedDoctor);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Xóa bác sĩ
const deleteDoctor = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedCount = await doctorModel.deleteDoctor(id);
        if (deletedCount === 0) return res.status(404).json({ error: 'Doctor not found' });
        res.status(200).json({ message: 'Doctor deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Tìm danh sách trạm xá
const listClinicsByDoctor = async (req, res) => {
    const { doctorId } = req.params;

    try {
        const clinics = await doctorModel.getClinicsByDoctor(doctorId);

        return res.status(200).json({ clinics });
    } catch (error) {
        console.error('Error fetching clinics:', error);
        res.status(500).json({ error: 'Internal server error.' });
    }
};

module.exports = { 
    addDoctor, 
    getDoctors, 
    getDoctor, 
    updateDoctor, 
    deleteDoctor,
    listClinicsByDoctor
};
