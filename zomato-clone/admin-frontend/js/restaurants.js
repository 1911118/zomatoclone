let restaurants = [];

// Check authentication on page load
document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = '/login.html';
        return;
    }
    fetchRestaurants();
});

// Fetch all restaurants
async function fetchRestaurants() {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:5000/api/restaurants', {
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
            throw new Error('Failed to fetch restaurants');
        }

        const data = await response.json();
        restaurants = data.data;
        displayRestaurants(restaurants);
        populateFilters(restaurants);
    } catch (error) {
        console.error('Error fetching restaurants:', error);
        alert('Error loading restaurants. Please try again.');
    }
}

// Display restaurants in the table
function displayRestaurants(restaurantsToDisplay) {
    const tableBody = document.getElementById('restaurantsTableBody');
    if (!tableBody) return;

    tableBody.innerHTML = restaurantsToDisplay.map(restaurant => `
        <tr>
            <td>${restaurant.name}</td>
            <td>${restaurant.location}</td>
            <td>${restaurant.cuisine}</td>
            <td>${restaurant.price_range || 'N/A'}</td>
            <td>
                <button onclick="viewRestaurant(${restaurant.id})" class="view-btn">View</button>
                <button onclick="editRestaurant(${restaurant.id})" class="edit-btn">Edit</button>
                <button onclick="deleteRestaurant(${restaurant.id})" class="delete-btn">Delete</button>
            </td>
        </tr>
    `).join('');
}

// Populate filter dropdowns
function populateFilters(restaurants) {
    const cuisineFilter = document.getElementById('cuisineFilter');
    const locationFilter = document.getElementById('locationFilter');

    // Get unique cuisines and locations
    const cuisines = [...new Set(restaurants.map(r => r.cuisine))];
    const locations = [...new Set(restaurants.map(r => r.location))];

    // Populate cuisine filter
    cuisineFilter.innerHTML = `
        <option value="">All Cuisines</option>
        ${cuisines.map(cuisine => `
            <option value="${cuisine}">${cuisine}</option>
        `).join('')}
    `;

    // Populate location filter
    locationFilter.innerHTML = `
        <option value="">All Locations</option>
        ${locations.map(location => `
            <option value="${location}">${location}</option>
        `).join('')}
    `;
}

// Filter restaurants based on search and filters
function filterRestaurants() {
    const searchInput = document.getElementById('searchInput').value.toLowerCase();
    const cuisineFilter = document.getElementById('cuisineFilter').value;
    const locationFilter = document.getElementById('locationFilter').value;

    const filteredRestaurants = restaurants.filter(restaurant => {
        const matchesSearch = restaurant.name.toLowerCase().includes(searchInput) ||
                            restaurant.location.toLowerCase().includes(searchInput) ||
                            restaurant.cuisine.toLowerCase().includes(searchInput);
        const matchesCuisine = !cuisineFilter || restaurant.cuisine === cuisineFilter;
        const matchesLocation = !locationFilter || restaurant.location === locationFilter;

        return matchesSearch && matchesCuisine && matchesLocation;
    });

    displayRestaurants(filteredRestaurants);
}

// View restaurant details
function viewRestaurant(id) {
    window.location.href = `restaurant-details.html?id=${id}`;
}

// Edit restaurant
function editRestaurant(id) {
    window.location.href = `edit-restaurant.html?id=${id}`;
}

// Delete restaurant
async function deleteRestaurant(id) {
    if (!confirm('Are you sure you want to delete this restaurant?')) {
        return;
    }

    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:5000/api/restaurants/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('Failed to delete restaurant');
        }

        // Refresh the restaurants list
        fetchRestaurants();
    } catch (error) {
        console.error('Error deleting restaurant:', error);
        alert('Error deleting restaurant. Please try again.');
    }
}

// Logout function
function logout() {
    localStorage.removeItem('token');
    window.location.href = '/login.html';
} 