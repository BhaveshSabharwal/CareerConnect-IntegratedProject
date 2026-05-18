const sequelize = require('./config/db');

async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log('✅ Connected! Server time:', new Date());
  } catch (error) {
    console.error('❌ Connection Error:', error.message);
  } finally {
    await sequelize.close();
  }
}

testConnection();
