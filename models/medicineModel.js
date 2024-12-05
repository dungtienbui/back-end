const { session } = require('../config/neo4j');

// Thêm một loại thuốc mới
const createMedicine = async (MedicationID, Name, Dosage, Administration, SideEffects, $Quantity = 0) => {
    const result = await session.run(
        `
        CREATE (m:Medicine {
            MedicationID: $MedicationID,
            Name: $Name,
            Dosage: $Dosage,
            Administration: $Administration,
            SideEffects: $SideEffects,
            Quantity: $Quantity
        }) RETURN m
        `,
        { MedicationID, Name, Dosage, Administration, SideEffects, Quantity}
    );
    return result.records[0].get('m').properties;
};

// Lấy danh sách tất cả các loại thuốc
const getAllMedicines = async () => {
    const result = await session.run('MATCH (m:Medicine) RETURN m');
    return result.records.map(record => record.get('m').properties);
};

// Tìm thuốc theo ID
const getMedicineByID = async (MedicationID) => {
    const result = await session.run(
        'MATCH (m:Medicine {MedicationID: $MedicationID}) RETURN m',
        { MedicationID }
    );
    if (result.records.length === 0) return null;
    return result.records[0].get('m').properties;
};

// Cập nhật thông tin thuốc
const updateMedicine = async (MedicationID, updates) => {
    const { Name, Dosage, Administration, SideEffects } = updates;
    const result = await session.run(
        `
        MATCH (m:Medicine {MedicationID: $MedicationID})
        SET m += {Name: $Name, Dosage: $Dosage, Administration: $Administration, SideEffects: $SideEffects}
        RETURN m
        `,
        { MedicationID, Name, Dosage, Administration, SideEffects }
    );
    if (result.records.length === 0) return null;
    return result.records[0].get('m').properties;
};

// Xóa một loại thuốc
const deleteMedicine = async (MedicationID) => {
    const result = await session.run(
        'MATCH (m:Medicine {MedicationID: $MedicationID}) DELETE m RETURN m',
        { MedicationID }
    );
    return result.records.length > 0;
};

module.exports = { createMedicine, getAllMedicines, getMedicineByID, updateMedicine, deleteMedicine };
