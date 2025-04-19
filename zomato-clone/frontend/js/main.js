// Configuration
const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:5000/api'; // Will be replaced by Vercel environment variable
let currentPage = 1;
const ITEMS_PER_PAGE = 9;
let isLoading = false;
let hasMore = true;

// DOM Elements
const searchInput = document.getElementById('search');
const cuisineFilter = document.getElementById('cuisineFilter');
const priceFilter = document.getElementById('priceFilter');
const restaurantList = document.getElementById('restaurant-list');
const loadMoreBtn = document.getElementById('loadMoreBtn');

// Debounce function to limit API calls
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Load restaurants with current filters
async function loadRestaurants(resetPage = false) {
    if (resetPage) {
        currentPage = 1;
        restaurantList.innerHTML = '<div class="loading"><div class="loading-spinner"></div></div>';
    }

    if (isLoading || !hasMore) return;
    isLoading = true;

    try {
        const searchParams = new URLSearchParams({
            page: currentPage,
            limit: ITEMS_PER_PAGE,
            search: searchInput.value,
            cuisine: cuisineFilter.value,
            price_range: priceFilter.value
        });

        const response = await fetch(`${API_BASE_URL}/restaurants?${searchParams}`);
        const data = await response.json();

        if (!data.success) {
            throw new Error(data.message || 'Failed to load restaurants');
        }

        if (resetPage) {
            restaurantList.innerHTML = '';
        }

        if (data.restaurants.length === 0) {
            if (currentPage === 1) {
                restaurantList.innerHTML = '<div class="no-results">No restaurants found</div>';
            }
            hasMore = false;
            loadMoreBtn.style.display = 'none';
            return;
        }

        data.restaurants.forEach(restaurant => {
            const card = createRestaurantCard(restaurant);
            restaurantList.appendChild(card);
        });

        hasMore = data.hasMore;
        loadMoreBtn.style.display = hasMore ? 'block' : 'none';
        currentPage++;
    } catch (error) {
        console.error('Error:', error);
        showToast('Error loading restaurants', 'error');
        if (currentPage === 1) {
            restaurantList.innerHTML = '<div class="error">Failed to load restaurants. Please try again later.</div>';
        }
    } finally {
        isLoading = false;
    }
}

// Create restaurant card element
function createRestaurantCard(restaurant) {
    const card = document.createElement('div');
    card.className = 'restaurant-card';
    card.innerHTML = `
        <div class="restaurant-image-container">
            ${restaurant.image_url ? `
                <img src="${restaurant.image_url}" alt="${restaurant.name}" class="restaurant-image">
            ` : `
                <div class="restaurant-image-placeholder">
                    <i class="fas fa-utensils"></i>
                </div>
            `}
        </div>
        <div class="restaurant-content">
            <h2 class="restaurant-title">${restaurant.name}</h2>
            <div class="restaurant-meta">
                <span class="location"><i class="fas fa-map-marker-alt"></i> ${restaurant.location}</span>
                <span class="cuisine"><i class="fas fa-utensils"></i> ${restaurant.cuisine}</span>
                <span class="price"><i class="fas fa-dollar-sign"></i> ${restaurant.price_range}</span>
            </div>
            <p class="restaurant-description">${restaurant.description}</p>
        </div>
    `;
    return card;
}

// Show toast notification
function showToast(message, type) {
    const toastContainer = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    toastContainer.appendChild(toast);

    setTimeout(() => {
        toast.remove();
    }, 3000);
}

// Event Listeners
searchInput.addEventListener('input', debounce(() => {
    loadRestaurants(true);
}, 500));

cuisineFilter.addEventListener('change', () => {
    loadRestaurants(true);
});

priceFilter.addEventListener('change', () => {
    loadRestaurants(true);
});

loadMoreBtn.addEventListener('click', () => {
    loadRestaurants();
});

// Initial load
document.addEventListener('DOMContentLoaded', () => {
    loadRestaurants(true);
}); 