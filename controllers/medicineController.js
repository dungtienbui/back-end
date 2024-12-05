const {
    createMedicine,
    getAllMedicines,
    getMedicineByID,
    updateMedicine,
    deleteMedicine,
} = require('../models/medicineModel');

exports.getAll = async (req, res) => {
    try {
        const medicines = await getAllMedicines();
        res.status(200).json(medicines);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving medicines', error });
    }
};

exports.getByID = async (req, res) => {
    const { id } = req.params;
    try {
        const medicine = await getMedicineByID(parseInt(id));
        if (!medicine) return res.status(404).json({ message: 'Medicine not found' });
        res.status(200).json(medicine);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving medicine', error });
    }
};

exports.add = async (req, res) => {
    const { MedicationID, Name, Dosage, Administration, SideEffects } = req.body;
    try {
        const newMedicine = await createMedicine(MedicationID, Name, Dosage, Administration, SideEffects);
        res.status(201).json({ message: 'Medicine successfully added', medicine: newMedicine });
    } catch (error) {
        res.status(500).json({ message: 'Error adding medicine', error });
    }
};

exports.update = async (req, res) => {
    const { id } = req.params;
    const updates = req.body;
    try {
        const updatedMedicine = await updateMedicine(parseInt(id), updates);
        if (!updatedMedicine) return res.status(404).json({ message: 'Medicine not found' });
        res.status(200).json({ message: 'Medicine successfully updated', medicine: updatedMedicine });
    } catch (error) {
        res.status(500).json({ message: 'Error updating medicine', error });
    }
};

exports.delete = async (req, res) => {
    const { id } = req.params;
    try {
        const isDeleted = await deleteMedicine(parseInt(id));
        if (!isDeleted) return res.status(404).json({ message: 'Medicine not found' });
        res.status(200).json({ message: 'Medicine successfully deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting medicine', error });
    }
};
