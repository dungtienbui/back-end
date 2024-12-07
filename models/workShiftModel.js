const { session } = require('../config/neo4j');
const { v4: uuidv4 } = require('uuid');

// Kiểm tra lịch làm việc trùng lặp
const checkWorkShiftConflict = async (doctorId, day, startTime, endTime) => {
    const result = await session.run(
        `MATCH (d:Doctor {id: $doctorId})-[:HAS_WORK_SHIFT]->(ws:WorkShift)
         WHERE ws.day = $day AND (
             (ws.startTime < $endTime AND ws.endTime > $startTime)
         )
         RETURN ws`,
        { doctorId, day, startTime, endTime }
    );
    return result.records.length > 0;
};

// Thêm lịch làm việc
const createWorkShift = async (doctorId, day, startTime, endTime) => {
    const id = uuidv4();
    const result = await session.run(
        `MATCH (d:Doctor {id: $doctorId})
         CREATE (ws:WorkShift {
             id: $id,
             day: $day,
             startTime: $startTime,
             endTime: $endTime
         })
         MERGE (d)-[:HAS_WORK_SHIFT]->(ws)
         RETURN ws`,
        { doctorId, id, day, startTime, endTime }
    );
    return result.records[0].get('ws').properties;
};

// Cập nhật lịch làm việc
const updateWorkShift = async (workShiftId, doctorId, day, startTime, endTime) => {
    const result = await session.run(
        `MATCH (ws:WorkShift {id: $workShiftId})
         SET ws.day = $day, ws.startTime = $startTime, ws.endTime = $endTime
         RETURN ws`,
        { workShiftId, day, startTime, endTime }
    );
    return result.records[0].get('ws').properties;
};


// Xoá lịch làm việc
const deleteWorkShift = async (workShiftId) => {
    const result = await session.run(
        `MATCH (ws:WorkShift {id: $workShiftId})
         DETACH DELETE ws`,
        { workShiftId }
    );
    return result.summary.counters.nodesDeleted > 0;
};

// Lấy thông tin lịch làm việc (trong một ngày cụ thể, ví dụ: "Monday")
const getWorkShiftsByDay = async (doctorId, day) => {
    const result = await session.run(
        `MATCH (d:Doctor {id: $doctorId})-[:HAS_WORK_SHIFT]->(ws:WorkShift)
         WHERE ws.day = $day
         RETURN ws`,
        { doctorId, day }
    );
    return result.records.map(record => record.get('ws').properties);
};

module.exports = {
    createWorkShift,
    updateWorkShift,
    deleteWorkShift,
    getWorkShiftsByDay,
    checkWorkShiftConflict
};
