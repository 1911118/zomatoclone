const bcrypt = require('bcryptjs');
const pool = require('../config/db');

const createAdminUser = async () => {
  const adminData = {
    name: 'Admin',
    email: 'admin@example.com',
    password: 'Admin@123', // Change this to your desired password
    phone: '1234567890',
    address: 'Admin Address',
    role: 'admin'
  };

  console.log('🔧 Creating admin user...');
  console.log('Email:', adminData.email);
  console.log('Role:', adminData.role);

  const client = await pool.connect();
  try {
    // Check if admin already exists
    const existingAdmin = await client.query(
      'SELECT * FROM users WHERE email = $1',
      [adminData.email]
    );

    if (existingAdmin.rows.length > 0) {
      console.log('⚠️ Admin user already exists!');
      console.log('Admin details:', {
        id: existingAdmin.rows[0].id,
        email: existingAdmin.rows[0].email,
        role: existingAdmin.rows[0].role
      });
      return;
    }

    // Hash the password
    console.log('🔒 Hashing password...');
    const hashedPassword = await bcrypt.hash(adminData.password, 10);

    // Create admin user
    console.log('📝 Creating admin user in database...');
    const result = await client.query(
      `INSERT INTO users (name, email, password, phone, address, role)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [adminData.name, adminData.email, hashedPassword, adminData.phone, adminData.address, adminData.role]
    );

    console.log('✅ Admin user created successfully!');
    console.log('Admin details:', {
      id: result.rows[0].id,
      email: result.rows[0].email,
      role: result.rows[0].role
    });
  } catch (error) {
    console.error('❌ Error creating admin user:', error.message);
    if (error.code === '42P01') {
      console.error('Table "users" does not exist. Please run the database setup script first.');
    }
  } finally {
    client.release();
    pool.end();
  }
};

// Run the script
createAdminUser(); 