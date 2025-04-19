const axios = require('axios');
const chalk = require('chalk');
const ora = require('ora');

const API_BASE_URL = 'http://localhost:5000/api';

// Test data
const testData = {
  // Auth test data
  login: {
    admin: {
      email: 'admin@example.com',
      password: 'Admin@123'
    },
    user: {
      email: 'user@example.com',
      password: 'User@123'
    }
  },

  // Restaurant test data
  restaurant: {
    create: {
      name: "Tasty Bites",
      address: "123 Food Street",
      city: "Delhi",
      cuisine: "Indian",
      image: "https://example.com/restaurant.jpg",
      description: "Authentic Indian cuisine with modern twist"
    },
    update: {
      name: "Tasty Bites Updated",
      address: "456 Food Street",
      city: "Mumbai",
      cuisine: "Fusion",
      image: "https://example.com/restaurant-updated.jpg",
      description: "Modern fusion cuisine with Indian flavors"
    }
  }
};

// Test functions
async function testAuth() {
  const spinner = ora('Testing authentication...').start();
  try {
    // Test admin login
    const adminResponse = await axios.post(`${API_BASE_URL}/auth/login`, testData.login.admin);
    console.log(chalk.green('\nAdmin Login Successful:'));
    console.log(chalk.blue('Token:'), adminResponse.data.token);
    
    // Test user login
    const userResponse = await axios.post(`${API_BASE_URL}/auth/login`, testData.login.user);
    console.log(chalk.green('\nUser Login Successful:'));
    console.log(chalk.blue('Token:'), userResponse.data.token);
    
    spinner.succeed('Authentication tests completed');
    return {
      adminToken: adminResponse.data.token,
      userToken: userResponse.data.token
    };
  } catch (error) {
    spinner.fail('Authentication tests failed');
    console.error(chalk.red('Error:'), error.response?.data || error.message);
    return null;
  }
}

async function testRestaurants(token) {
  const spinner = ora('Testing restaurant endpoints...').start();
  try {
    // Create restaurant
    const createResponse = await axios.post(
      `${API_BASE_URL}/restaurants`,
      testData.restaurant.create,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    console.log(chalk.green('\nRestaurant Created:'));
    console.log(createResponse.data);

    const restaurantId = createResponse.data.id;

    // Get all restaurants
    const getAllResponse = await axios.get(`${API_BASE_URL}/restaurants`);
    console.log(chalk.green('\nAll Restaurants:'));
    console.log(getAllResponse.data);

    // Get single restaurant
    const getOneResponse = await axios.get(`${API_BASE_URL}/restaurants/${restaurantId}`);
    console.log(chalk.green('\nSingle Restaurant:'));
    console.log(getOneResponse.data);

    // Update restaurant
    const updateResponse = await axios.put(
      `${API_BASE_URL}/restaurants/${restaurantId}`,
      testData.restaurant.update,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    console.log(chalk.green('\nRestaurant Updated:'));
    console.log(updateResponse.data);

    // Delete restaurant
    const deleteResponse = await axios.delete(
      `${API_BASE_URL}/restaurants/${restaurantId}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    console.log(chalk.green('\nRestaurant Deleted:'));
    console.log(deleteResponse.data);

    spinner.succeed('Restaurant tests completed');
    return true;
  } catch (error) {
    spinner.fail('Restaurant tests failed');
    console.error(chalk.red('Error:'), error.response?.data || error.message);
    return false;
  }
}

// Run all tests
async function runTests() {
  console.log(chalk.blue('\n🚀 Starting API Tests\n'));

  // Test authentication
  const tokens = await testAuth();
  if (!tokens) {
    console.log(chalk.red('\n❌ Authentication tests failed. Stopping further tests.'));
    return;
  }

  // Test restaurant endpoints with admin token
  await testRestaurants(tokens.adminToken);

  console.log(chalk.green('\n🎉 All tests completed!'));
}

// Run the tests
runTests().catch(error => {
  console.error(chalk.red('\n❌ Fatal error:'), error);
  process.exit(1); 