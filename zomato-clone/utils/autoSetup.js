const { exec } = require('child_process');
const axios = require('axios');
const bcrypt = require('bcryptjs');
const pool = require('../config/db');

const API_BASE_URL = 'http://localhost:5000/api';

async function runCommand(command) {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`❌ Error executing ${command}:`, error);
        reject(error);
        return;
      }
      console.log(`✅ ${command} output:`, stdout);
      resolve(stdout);
    });
  });
}

async function setupDatabase() {
  console.log('\n🔧 Setting up database...');
  try {
    await runCommand('node utils/setupDatabase.js');
    console.log('✅ Database setup completed');
    return true;
  } catch (error) {
    console.error('❌ Database setup failed');
    return false;
  }
}

async function createAdminUser() {
  console.log('\n👨‍💼 Creating admin user...');
  try {
    await runCommand('node utils/createAdmin.js');
    console.log('✅ Admin user creation completed');
    return true;
  } catch (error) {
    console.error('❌ Admin user creation failed');
    return false;
  }
}

async function startServer() {
  console.log('\n🚀 Starting server...');
  try {
    // Start server in background
    exec('node server.js', (error, stdout, stderr) => {
      if (error) {
        console.error('❌ Server start failed:', error);
        return;
      }
      console.log('✅ Server started:', stdout);
    });
    
    // Wait for server to start
    await new Promise(resolve => setTimeout(resolve, 3000));
    return true;
  } catch (error) {
    console.error('❌ Server start failed');
    return false;
  }
}

async function testAdminSystem() {
  console.log('\n🔍 Testing admin system...');
  try {
    // Test server connection
    const serverResponse = await axios.get('http://localhost:5000');
    console.log('✅ Server is running:', serverResponse.data);

    // Test admin login
    const loginResponse = await axios.post(`${API_BASE_URL}/auth/login`, {
      email: 'admin@example.com',
      password: 'Admin@123'
    });

    const { token, user } = loginResponse.data;
    console.log('✅ Admin login successful');
    console.log('User:', user);

    // Test admin routes
    const routes = ['/admin/dashboard', '/admin/users', '/admin/restaurants'];
    for (const route of routes) {
      const response = await axios.get(`${API_BASE_URL}${route}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log(`✅ ${route} access successful`);
    }

    console.log('🎉 All tests passed successfully!');
    return true;
  } catch (error) {
    console.error('❌ Test failed:', error.response?.data?.message || error.message);
    return false;
  }
}

async function resetAdminPassword() {
  console.log('\n🔑 Resetting admin password...');
  try {
    const hashedPassword = await bcrypt.hash('Admin@123', 10);
    const client = await pool.connect();
    await client.query(
      'UPDATE users SET password = $1 WHERE email = $2',
      [hashedPassword, 'admin@example.com']
    );
    client.release();
    console.log('✅ Admin password reset successfully');
    return true;
  } catch (error) {
    console.error('❌ Password reset failed:', error.message);
    return false;
  }
}

async function main() {
  console.log('🚀 Starting automated setup and testing...');
  
  let attempts = 0;
  const maxAttempts = 3;
  
  while (attempts < maxAttempts) {
    attempts++;
    console.log(`\n📝 Attempt ${attempts} of ${maxAttempts}`);
    
    // Run all steps
    const dbSetup = await setupDatabase();
    const adminCreated = await createAdminUser();
    const serverStarted = await startServer();
    
    if (!dbSetup || !adminCreated || !serverStarted) {
      console.log('❌ Setup failed, retrying...');
      continue;
    }
    
    // Test the system
    const testPassed = await testAdminSystem();
    
    if (testPassed) {
      console.log('\n🎉 All tasks completed successfully!');
      break;
    } else {
      console.log('\n🔄 Some tests failed, attempting to fix...');
      
      // Try to fix common issues
      await resetAdminPassword();
      
      if (attempts === maxAttempts) {
        console.log('\n❌ Maximum attempts reached. Please check the logs for issues.');
        process.exit(1);
      }
    }
  }
}

// Run the automated setup
main().catch(error => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
}); 