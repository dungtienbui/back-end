const workShiftModel = require('../models/workShiftModel');

const addWorkShift = async (req, res) => {
    try {
        const { doctorId, day, startTime, endTime } = req.body;

        // Kiểm tra định dạng thời gian
        if (!validateTimeFormat(startTime) || !validateTimeFormat(endTime)) {
            return res.status(400).json({ error: 'Invalid time format. Use HH:mm format between 00:00 and 23:59.' });
        }

        const conflict = await workShiftModel.checkWorkShiftConflict(doctorId, day, startTime, endTime);
        if (conflict) {
            return res.status(400).json({ error: 'Work shift conflict exists for the given time period.' });
        }

        const workShift = await workShiftModel.createWorkShift(doctorId, day, startTime, endTime);
        res.status(201).json(workShift);
    } catch (error) {
        console.error('Error occurred while adding work shift:', error); // Log chi tiết lỗi ở phía server
        res.status(500).json({ error: 'An unexpected error occurred. Please try again later.' });
    }
};

const updateWorkShift = async (req, res) => {
    try {
        const { id } = req.params;
        const { doctorId, day, startTime, endTime } = req.body;

        // Kiểm tra định dạng thời gian
        if (!validateTimeFormat(startTime) || !validateTimeFormat(endTime)) {
            return res.status(400).json({ error: 'Invalid time format. Use HH:mm format between 00:00 and 23:59.' });
        }

        const conflict = await workShiftModel.checkWorkShiftConflict(doctorId, day, startTime, endTime);
        if (conflict) {
            return res.status(400).json({ error: 'Work shift conflict exists for the given time period.' });
        }

        const workShift = await workShiftModel.updateWorkShift(id, doctorId, day, startTime, endTime);
        res.status(200).json(workShift);
    } catch (error) {
        console.error('Error occurred while updating work shift:', error); // Log chi tiết lỗi ở phía server
        res.status(500).json({ error: 'An unexpected error occurred. Please try again later.' });
    }
};

const deleteWorkShift = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await workShiftModel.deleteWorkShift(id);
        if (result) {
            res.status(200).json({ message: 'Work shift deleted successfully' });
        } else {
            res.status(404).json({ error: 'Work shift not found' });
        }
    } catch (error) {
        console.error('Error occurred while deleting work shift:', error); // Log chi tiết lỗi ở phía server
        res.status(500).json({ error: 'An unexpected error occurred. Please try again later.' });
    }
};

const getWorkShiftsByDay = async (req, res) => {
    try {
        const { doctorId, day } = req.params;
        const workShifts = await workShiftModel.getWorkShiftsByDay(doctorId, day);
        res.status(200).json(workShifts);
    } catch (error) {
        console.error('Error occurred while fetching work shifts:', error); // Log chi tiết lỗi ở phía server
        res.status(500).json({ error: 'An unexpected error occurred. Please try again later.' });
    }
};


module.exports = {
    addWorkShift,
    updateWorkShift,
    deleteWorkShift,
    getWorkShiftsByDay
};
