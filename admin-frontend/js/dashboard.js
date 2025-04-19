async function fetchUsers() {
    const res = await fetch('http://localhost:5000/api/admin/users', {
      headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') }
    });
    const users = await res.json();
    const usersList = document.getElementById('usersList');
    usersList.innerHTML = users.map(user => `<li>${user.name} - ${user.email}</li>`).join('');
  }
  
  document.getElementById('addRestaurantForm').addEventListener('submit', async (e) => {
    e.preventDefault();
  
    const name = document.getElementById('name').value;
    const address = document.getElementById('address').value;
    const city = document.getElementById('city').value;
    const image = document.getElementById('image').value;
  
    const res = await fetch('http://localhost:5000/api/admin/restaurants', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      },
      body: JSON.stringify({ name, address, city, image })
    });
  
    if (res.ok) {
      alert('Restaurant Added');
    } else {
      const data = await res.json();
      alert(data.message || 'Error adding restaurant');
    }
  });
  
  function logout() {
    localStorage.removeItem('token');
    window.location.href = 'index.html';
  }
  
  fetchUsers();
  