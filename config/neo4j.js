const neo4j = require('neo4j-driver');
require('dotenv').config();

const driver = neo4j.driver(
    process.env.NEO4J_URI || 'bolt://localhost:7687',
    neo4j.auth.basic(process.env.NEO4J_USER || 'neo4j', process.env.NEO4J_PASSWORD || 'password')
);

async function checkConnectivity() {
    try {
        const serverInfo = await driver.getServerInfo();
        console.log('Kết nối đến Neo4j thành công. Thông tin máy chủ:', serverInfo);
    } catch (error) {
        console.error('Không thể kết nối đến Neo4j:', error);
        process.exit(1); // Thoát ứng dụng nếu kết nối thất bại
    }
}

checkConnectivity();

process.on('SIGINT', async () => {
    await driver.close();
    console.log('Kết nối Neo4j đã được đóng');
    process.exit(0);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('Lỗi không được xử lý tại:', promise, 'lý do:', reason);
});

// Hàm chạy truy vấn với session được tạo mới
async function runQuery(query, params) {
    const session = driver.session();
    try {
        const result = await session.run(query, params);
        return result;
    } catch (error) {
        console.error('Lỗi khi chạy truy vấn:', error);
        throw error; // Ném lại lỗi để xử lý ở nơi gọi
    } finally {
        await session.close();
    }
}

module.exports = { driver, runQuery };
