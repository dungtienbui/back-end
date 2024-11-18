const { session } = require('../config/neo4j');

const createUser = async (username, password, role) => {
    const result = await session.run(
        'CREATE (u:User {username: $username, password: $password, role: $role}) RETURN u',
        { username, password, role }
    );
    return result.records[0].get('u').properties;
};

const findUserByUsername = async (username) => {
    const result = await session.run(
        'MATCH (u:User {username: $username}) RETURN u',
        { username }
    );
    if (result.records.length === 0) return null;
    return result.records[0].get('u').properties;
};

module.exports = { createUser, findUserByUsername };
