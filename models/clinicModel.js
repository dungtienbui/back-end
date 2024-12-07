const { v4: uuidv4 } = require('uuid');
const { runQuery } = require('../config/neo4j');

// Hàm thêm trạm xá với ID được hệ thống tự tạo
const createClinic = async (name, address, phoneNumber, openTime, closeTime) => {
    const id = uuidv4(); // Tạo ID duy nhất

    const query = `
        CREATE (c:Clinic {
            id: $id,
            name: $name, 
            address: $address, 
            phoneNumber: $phoneNumber, 
            openTime: $openTime,
            closeTime: $closeTime
        })
        RETURN c
    `;
    const params = { id, name, address, phoneNumber, openTime, closeTime };
    const result = await runQuery(query, params);

    return result.records[0].get('c').properties;
};

// Hàm lấy danh sách trạm xá
const getAllClinics = async () => {
    const query = 'MATCH (c:Clinic) RETURN c';
    const result = await runQuery(query, {});
    return result.records.map(record => record.get('c').properties);
};

// Hàm lấy thông tin trạm xá theo ID
const getClinicByID = async (id) => {
    try {
        const query = `
            MATCH (c:Clinic {id: $id})
            RETURN c
        `;
        const params = { id };
        const result = await runQuery(query, params);

        if (result.records.length === 0) {
            return null;
        }

        return result.records[0].get('c').properties;
    } catch (error) {
        console.error('Error fetching clinic by ID:', error);
        throw error;
    }
};

// Hàm cập nhật thông tin trạm xá
const updateClinic = async (id, updates) => {
    const queryParts = [];
    const params = { id };

    Object.keys(updates).forEach((key) => {
        queryParts.push(`c.${key} = $${key}`);
        params[key] = updates[key];
    });

    const query = `
        MATCH (c:Clinic {id: $id}) 
        SET ${queryParts.join(', ')}
        RETURN c
    `;
    const result = await runQuery(query, params);

    if (result.records.length === 0) {
        return null;
    }

    return result.records[0].get('c').properties;
};

// Hàm xoá trạm xá
const deleteClinic = async (id) => {
    const query = `
        MATCH (c:Clinic {id: $id}) DELETE c RETURN c
    `;
    const params = { id };
    const result = await runQuery(query, params);
    return result.summary.counters.updates().nodesDeleted > 0;
};

const formatDate = (neo4jDate) => {

    if (!neo4jDate) return null; // Trả về null nếu không có giá trị

    const year = neo4jDate.year.low;
    const month = String(neo4jDate.month.low).padStart(2, '0');
    const day = String(neo4jDate.day.low).padStart(2, '0');

    return `${day}-${month}-${year}`;
};

// Lấy danh sách bác sĩ của một trạm xá cụ thể, bao gồm ngày bắt đầu làm việc
const getDoctorsByClinic = async (id) => {
    try {
        const query = `
            MATCH (c:Clinic {id: $id})<-[r:WORK_AT]-(d:Doctor)
            RETURN d, r.startDate AS startDate
        `;
        const params = { id };
        const result = await runQuery(query, params);

        // Trả về danh sách bác sĩ với thông tin ngày bắt đầu làm việc
        return result.records.map(record => ({
            ...record.get('d').properties,
            startDate: formatDate(record.get('startDate'))
        }));
    } catch (error) {
        console.error('Error fetching doctors by clinic:', error);
        throw error;
    }
};




// Thêm bác sĩ vào trạm xá với ngày bắt đầu làm việc
const addDoctorToClinic = async (doctorId, clinicId, startDate) => {
    const query = `
        MATCH (d:Doctor {id: $doctorId}), (c:Clinic {id: $clinicId})
        MERGE (d)-[r:WORK_AT {startDate: date($startDate)}]->(c)
        RETURN d, c, r
    `;
    const params = { doctorId, clinicId, startDate };

    const result = await runQuery(query, params);

    if (result.records.length === 0) {
        return null;
    }

    return result.records[0].get('r').properties;
};

// Sửa thông tin ngày bắt đầu làm việc của bác sĩ tại trạm xá
const updateStartDateWorkAtClinic = async (doctorId, clinicId, newStartDate) => {
    const query = `
        MATCH (d:Doctor {id: $doctorId})-[r:WORK_AT]->(c:Clinic {id: $clinicId})
        SET r.startDate = date($newStartDate)
        RETURN r
    `;
    const params = { doctorId, clinicId, newStartDate };

    const result = await runQuery(query, params);

    if (!result.records.length) {
        return null;
    }
    return result.records[0].get('r').properties;
};

// Xóa mối quan hệ làm việc
const deleteWorkRelationship = async (doctorId, clinicId) => {
    const query = `
        MATCH (d:Doctor {id: $doctorId})-[r:WORK_AT]->(c:Clinic {id: $clinicId})
        DELETE r
    `;
    const params = { doctorId, clinicId };

    const result = await runQuery(query, params);
    return result.summary.counters.updates().relationshipsDeleted > 0;
};

module.exports = {
    createClinic,
    getAllClinics,
    getClinicByID,
    updateClinic,
    deleteClinic,
    getDoctorsByClinic,
    addDoctorToClinic,
    updateStartDateWorkAtClinic,
    deleteWorkRelationship
};
