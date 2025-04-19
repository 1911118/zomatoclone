// Admin Login Function
async function adminLogin(email, password) {
  try {
    const response = await fetch('http://localhost:5000/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();

    if (!response.ok) {
      alert(data.message || 'Login failed');
      return;
    }

    localStorage.setItem('token', data.token);
    alert('Login Successful!');
    window.location.href = '/dashboard.html';
  } catch (error) {
    console.error(error);
    alert('Something went wrong!');
  }
}

// Fetch Users with Token
async function fetchUsers() {
  const token = localStorage.getItem('token');
  if (!token) {
    window.location.href = '/login.html';
    return;
  }

  try {
    const response = await fetch('http://localhost:5000/api/admin/users', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      if (response.status === 401) {
        localStorage.removeItem('token');
        window.location.href = '/login.html';
        return;
      }
      throw new Error('Failed to fetch users');
    }

    const data = await response.json();
    displayUsers(data);
  } catch (error) {
    console.error(error);
    alert('Error fetching users');
  }
}

// Display Users in Table
function displayUsers(users) {
  const tableBody = document.getElementById('usersTableBody');
  if (!tableBody) return;

  tableBody.innerHTML = users.map(user => `
    <tr>
      <td>${user.id}</td>
      <td>${user.name}</td>
      <td>${user.email}</td>
      <td>${user.role}</td>
      <td>
        <button onclick="editUser(${user.id})">Edit</button>
        <button onclick="deleteUser(${user.id})">Delete</button>
      </td>
    </tr>
  `).join('');
}

// Logout Function
function logout() {
  localStorage.removeItem('token');
  window.location.href = '/login.html';
}

// Check Authentication on Page Load
document.addEventListener('DOMContentLoaded', () => {
  const token = localStorage.getItem('token');
  if (!token && window.location.pathname !== '/login.html') {
    window.location.href = '/login.html';
  } else if (token) {
    fetchUsers();
  }
}); 