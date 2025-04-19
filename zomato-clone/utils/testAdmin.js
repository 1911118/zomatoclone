const axios = require('axios');

const API_BASE_URL = 'http://localhost:5000/api';

const testAdminSystem = async () => {
  console.log('🔍 Testing Admin Authentication System...\n');

  try {
    // 1. Test Server Connection
    console.log('1. Testing Server Connection...');
    try {
      const serverResponse = await axios.get('http://localhost:5000');
      console.log('✅ Server is running:', serverResponse.data);
    } catch (error) {
      console.error('❌ Server connection failed. Make sure the server is running!');
      console.error('Error:', error.message);
      return;
    }
    console.log('\n');

    // 2. Test Admin Login
    console.log('2. Testing Admin Login...');
    try {
      const loginResponse = await axios.post(`${API_BASE_URL}/auth/login`, {
        email: 'admin@example.com',
        password: 'Admin@123'
      });

      const { token, user } = loginResponse.data;
      console.log('✅ Login successful!');
      console.log('User:', user);
      console.log('Token received\n');

      // 3. Test Admin Dashboard Access
      console.log('3. Testing Admin Dashboard Access...');
      const dashboardResponse = await axios.get(`${API_BASE_URL}/admin/dashboard`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log('✅ Dashboard access successful!');
      console.log('Dashboard data:', dashboardResponse.data);
      console.log('\n');

      // 4. Test Admin Users Access
      console.log('4. Testing Admin Users Access...');
      const usersResponse = await axios.get(`${API_BASE_URL}/admin/users`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log('✅ Users access successful!');
      console.log('Users data:', usersResponse.data);
      console.log('\n');

      // 5. Test Admin Restaurants Access
      console.log('5. Testing Admin Restaurants Access...');
      const restaurantsResponse = await axios.get(`${API_BASE_URL}/admin/restaurants`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log('✅ Restaurants access successful!');
      console.log('Restaurants data:', restaurantsResponse.data);
      console.log('\n');

      // 6. Test Invalid Token
      console.log('6. Testing Invalid Token...');
      try {
        await axios.get(`${API_BASE_URL}/admin/dashboard`, {
          headers: {
            Authorization: 'Bearer invalid_token'
          }
        });
      } catch (error) {
        console.log('✅ Invalid token test successful!');
        console.log('Expected error:', error.response?.data?.message || error.message);
      }

      console.log('\n🎉 All tests completed successfully!');

    } catch (error) {
      console.error('❌ Test failed:', error.response?.data?.message || error.message);
      console.error('Full error:', error.response?.data || error);
    }
  } catch (error) {
    console.error('❌ Unexpected error:', error.message);
  }
};

// Run the tests
testAdminSystem(); 