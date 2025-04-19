const { exec } = require('child_process');
const axios = require('axios');
const readline = require('readline');
const chalk = require('chalk');
const ora = require('ora');
const figlet = require('figlet');

// Create readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const API_BASE_URL = 'http://localhost:5000/api';

// Clear console and show welcome message
function showWelcome() {
  console.clear();
  console.log(chalk.blue(figlet.textSync('Zomato Admin Test', { horizontalLayout: 'full' })));
  console.log(chalk.yellow('\n🚀 Starting Automated Admin System Test\n'));
}

// Run command with spinner
async function runCommandWithSpinner(command, message) {
  const spinner = ora(message).start();
  try {
    await new Promise((resolve, reject) => {
      exec(command, (error, stdout, stderr) => {
        if (error) {
          spinner.fail(`Failed: ${error.message}`);
          reject(error);
          return;
        }
        spinner.succeed();
        resolve(stdout);
      });
    });
    return true;
  } catch (error) {
    return false;
  }
}

// Test database connection
async function testDatabase() {
  const spinner = ora('Testing database connection...').start();
  try {
    const pool = require('../config/db');
    await pool.query('SELECT 1');
    spinner.succeed('Database connection successful');
    return true;
  } catch (error) {
    spinner.fail(`Database connection failed: ${error.message}`);
    return false;
  }
}

// Test server connection
async function testServer() {
  const spinner = ora('Testing server connection...').start();
  try {
    await axios.get('http://localhost:5000');
    spinner.succeed('Server is running');
    return true;
  } catch (error) {
    spinner.fail('Server is not running');
    return false;
  }
}

// Test admin login
async function testAdminLogin() {
  const spinner = ora('Testing admin login...').start();
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/login`, {
      email: 'admin@example.com',
      password: 'Admin@123'
    });
    spinner.succeed('Admin login successful');
    return response.data.token;
  } catch (error) {
    spinner.fail(`Admin login failed: ${error.response?.data?.message || error.message}`);
    return null;
  }
}

// Test admin routes
async function testAdminRoutes(token) {
  const routes = [
    { path: '/admin/dashboard', name: 'Dashboard' },
    { path: '/admin/users', name: 'Users' },
    { path: '/admin/restaurants', name: 'Restaurants' }
  ];

  for (const route of routes) {
    const spinner = ora(`Testing ${route.name} access...`).start();
    try {
      await axios.get(`${API_BASE_URL}${route.path}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      spinner.succeed(`${route.name} access successful`);
    } catch (error) {
      spinner.fail(`${route.name} access failed: ${error.response?.data?.message || error.message}`);
      return false;
    }
  }
  return true;
}

// Main test function
async function runTests() {
  showWelcome();

  // Test database
  if (!await testDatabase()) {
    console.log(chalk.red('\n❌ Database test failed. Please check your database configuration.'));
    process.exit(1);
  }

  // Test server
  if (!await testServer()) {
    console.log(chalk.yellow('\n⚠️ Server not running. Starting server...'));
    await runCommandWithSpinner('node server.js', 'Starting server');
    await new Promise(resolve => setTimeout(resolve, 3000));
  }

  // Test admin login
  const token = await testAdminLogin();
  if (!token) {
    console.log(chalk.yellow('\n⚠️ Admin login failed. Creating admin user...'));
    await runCommandWithSpinner('node utils/createAdmin.js', 'Creating admin user');
    const newToken = await testAdminLogin();
    if (!newToken) {
      console.log(chalk.red('\n❌ Admin setup failed. Please check the logs.'));
      process.exit(1);
    }
  }

  // Test admin routes
  if (!await testAdminRoutes(token)) {
    console.log(chalk.red('\n❌ Admin routes test failed.'));
    process.exit(1);
  }

  // Show success message
  console.log(chalk.green('\n🎉 All tests completed successfully!'));
  console.log(chalk.blue('\nAdmin System Status:'));
  console.log(chalk.green('✓ Database: Connected'));
  console.log(chalk.green('✓ Server: Running'));
  console.log(chalk.green('✓ Admin Login: Working'));
  console.log(chalk.green('✓ Admin Routes: Accessible'));

  // Ask if user wants to run cleanup
  rl.question('\nDo you want to run cleanup? (y/n): ', async (answer) => {
    if (answer.toLowerCase() === 'y') {
      await runCommandWithSpinner('node utils/cleanup.js', 'Running cleanup');
    }
    rl.close();
  });
}

// Run the tests
runTests().catch(error => {
  console.error(chalk.red('\n❌ Fatal error:', error.message));
  process.exit(1); 
}); 