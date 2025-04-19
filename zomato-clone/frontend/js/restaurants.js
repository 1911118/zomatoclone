let restaurants = [];
let currentPage = 1;
const perPage = 6; // Show 6 restaurants per page

// Fetch restaurants from backend
async function fetchRestaurants() {
    try {
        const response = await fetch('http://localhost:5000/api/restaurants');
        
        if (!response.ok) {
            throw new Error('Failed to fetch restaurants');
        }

        const data = await response.json();
        if (data.success) {
            restaurants = data.data;
            displayRestaurants(restaurants);
            populateFilters(restaurants);
        }
    } catch (error) {
        console.error('Error fetching restaurants:', error);
        showError('Failed to load restaurants. Please try again later.');
    }
}

// Display restaurants on the page with pagination
function displayRestaurants(restaurantsToDisplay) {
    const container = document.getElementById('restaurant-list');
    if (!container) return;

    const start = (currentPage - 1) * perPage;
    const end = start + perPage;
    const paginatedRestaurants = restaurantsToDisplay.slice(start, end);

    container.innerHTML = paginatedRestaurants.map(restaurant => `
        <div class="restaurant-card">
            <div class="restaurant-image">
                <img src="${restaurant.image_url || 'images/default-restaurant.jpg'}" alt="${restaurant.name}">
            </div>
            <div class="restaurant-info">
                <h2>${restaurant.name}</h2>
                <p class="cuisine">${restaurant.cuisine}</p>
                <p class="location">📍 ${restaurant.location}</p>
                <p class="price-range">${restaurant.price_range || 'Price not specified'}</p>
                <p class="description">${restaurant.description || 'No description available'}</p>
                <div class="restaurant-actions">
                    <button onclick="viewRestaurant(${restaurant.id})" class="view-btn">View Details</button>
                </div>
            </div>
        </div>
    `).join('');

    // Show/hide load more button
    const loadMoreBtn = document.getElementById('loadMore');
    if (loadMoreBtn) {
        loadMoreBtn.style.display = restaurantsToDisplay.length > end ? 'block' : 'none';
    }
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

// Apply filters and search
function applyFilter() {
    const searchInput = document.getElementById('searchInput').value.toLowerCase();
    const cuisineFilter = document.getElementById('cuisineFilter').value;
    const locationFilter = document.getElementById('locationFilter').value;
    const priceFilter = document.getElementById('priceFilter').value;

    const filteredRestaurants = restaurants.filter(restaurant => {
        const matchesSearch = restaurant.name.toLowerCase().includes(searchInput) ||
                            restaurant.location.toLowerCase().includes(searchInput) ||
                            restaurant.cuisine.toLowerCase().includes(searchInput);
        const matchesCuisine = !cuisineFilter || restaurant.cuisine === cuisineFilter;
        const matchesLocation = !locationFilter || restaurant.location === locationFilter;
        const matchesPrice = !priceFilter || restaurant.price_range === priceFilter;

        return matchesSearch && matchesCuisine && matchesLocation && matchesPrice;
    });

    currentPage = 1; // Reset to first page when applying new filters
    displayRestaurants(filteredRestaurants);
}

// Load more restaurants
function loadMore() {
    currentPage++;
    const searchInput = document.getElementById('searchInput').value.toLowerCase();
    const cuisineFilter = document.getElementById('cuisineFilter').value;
    const locationFilter = document.getElementById('locationFilter').value;
    const priceFilter = document.getElementById('priceFilter').value;

    const filteredRestaurants = restaurants.filter(restaurant => {
        const matchesSearch = restaurant.name.toLowerCase().includes(searchInput) ||
                            restaurant.location.toLowerCase().includes(searchInput) ||
                            restaurant.cuisine.toLowerCase().includes(searchInput);
        const matchesCuisine = !cuisineFilter || restaurant.cuisine === cuisineFilter;
        const matchesLocation = !locationFilter || restaurant.location === locationFilter;
        const matchesPrice = !priceFilter || restaurant.price_range === priceFilter;

        return matchesSearch && matchesCuisine && matchesLocation && matchesPrice;
    });

    displayRestaurants(filteredRestaurants);
}

// View restaurant details
function viewRestaurant(id) {
    window.location.href = `restaurant-details.html?id=${id}`;
}

// Show error message
function showError(message) {
    const container = document.getElementById('restaurant-list');
    if (container) {
        container.innerHTML = `
            <div class="error-message">
                <p>${message}</p>
            </div>
        `;
    }
}

// Add event listeners for search and filters
document.addEventListener('DOMContentLoaded', () => {
    fetchRestaurants();
    
    const searchInput = document.getElementById('searchInput');
    const cuisineFilter = document.getElementById('cuisineFilter');
    const locationFilter = document.getElementById('locationFilter');
    const priceFilter = document.getElementById('priceFilter');

    searchInput.addEventListener('input', applyFilter);
    cuisineFilter.addEventListener('change', applyFilter);
    locationFilter.addEventListener('change', applyFilter);
    priceFilter.addEventListener('change', applyFilter);
}); 