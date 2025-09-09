// State variables
let clickCount = 0;
let items = [];
let loading = true;
let apiError = null;

// DOM elements
const clickBtn = document.getElementById('clickBtn');
const refreshBtn = document.getElementById('refreshBtn');
const submitBtn = document.getElementById('submitBtn');
const clickCountSpan = document.getElementById('clickCount');
const refreshText = document.getElementById('refreshText');
const itemCounter = document.getElementById('itemCounter');
const errorContainer = document.getElementById('errorContainer');
const errorText = document.getElementById('errorText');
const loadingContainer = document.getElementById('loadingContainer');
const apiGrid = document.getElementById('apiGrid');
const statClicks = document.getElementById('statClicks');
const statItems = document.getElementById('statItems');
const browserInfo = document.getElementById('browserInfo');

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    fetchData();
    updateBrowserInfo();
    
    clickBtn.addEventListener('click', handleButtonClick);
    refreshBtn.addEventListener('click', refreshData);
    submitBtn.addEventListener('click', handleFormSubmit);
});

// Fetch API data
async function fetchData() {
    try {
        setLoading(true);
        const response = await fetch('https://jsonplaceholder.typicode.com/posts');
        
        if (!response.ok) {
            throw new Error('API request failed');
        }

        const postsData = await response.json();
        const transformedPosts = postsData.map(post => ({
            id: post.id,
            name: '',
            title: post.title,
            userId: post.userId,
            description: post.body,
            timestamp: new Date().toLocaleString()
        }));

        items = transformedPosts;
        setLoading(false);
        renderApiItems();
        updateStats();
        
    } catch (error) {
        console.error('Error fetching data:', error);
        setApiError('Failed to load data');
        setLoading(false);
    }
}

// Refresh data
async function refreshData() {
    setLoading(true);
    setApiError(null);
    
    try {
        const response = await fetch('https://jsonplaceholder.typicode.com/posts');
        if (!response.ok) throw new Error('API request failed');

        const postsData = await response.json();
        const transformedPosts = postsData.map(post => ({
            id: post.id,
            name: '',
            title: post.title,
            userId: post.userId,
            description: post.body,
            timestamp: new Date().toLocaleString()
        }));

        items = transformedPosts;
        setLoading(false);
        clickCount = 0;
        updateClickCount();
        renderApiItems();
        updateStats();
        
    } catch (error) {
        setApiError('Failed to refresh data');
        setLoading(false);
    }
}

// Handle button click
function handleButtonClick() {
    clickCount++;
    updateClickCount();
    updateStats();
}

// Handle form submit
function handleFormSubmit() {
    const nameInput = document.querySelector('input[name="name"]');
    const emailInput = document.querySelector('input[name="email"]');
    const commentsInput = document.querySelector('textarea[name="comments"]');

    const formData = {
        name: nameInput?.value || '',
        email: emailInput?.value || '',
        comments: commentsInput?.value || ''
    };

    console.log('Form submitted:', formData);
    alert('Form submitted successfully!');
}

// Get browser info
function getBrowserInfo() {
    if (typeof window !== 'undefined' && window.navigator) {
        const userAgent = window.navigator.userAgent;

        if (userAgent.indexOf('Chrome') > -1 && userAgent.indexOf('Edge') === -1) {
            return 'Chrome';
        } else if (userAgent.indexOf('Firefox') > -1) {
            return 'Firefox';
        } else if (userAgent.indexOf('Safari') > -1 && userAgent.indexOf('Chrome') === -1) {
            return 'Safari';
        } else if (userAgent.indexOf('Edge') > -1) {
            return 'Edge';
        } else if (userAgent.indexOf('Opera') > -1 || userAgent.indexOf('OPR') > -1) {
            return 'Opera';
        } else {
            return userAgent.split(' ')[0];
        }
    }
    return 'Server Side';
}

// Update functions
function updateClickCount() {
    clickCountSpan.textContent = clickCount;
}

function updateBrowserInfo() {
    browserInfo.textContent = getBrowserInfo();
}

function updateStats() {
    statClicks.textContent = clickCount;
    statItems.textContent = items.length;
}

function setLoading(isLoading) {
    loading = isLoading;
    
    if (loading) {
        loadingContainer.style.display = 'block';
        apiGrid.style.display = 'none';
        refreshBtn.disabled = true;
        refreshText.innerHTML = '<span class="spinner"></span> Učitava...';
        itemCounter.textContent = 'Loading...';
    } else {
        loadingContainer.style.display = 'none';
        apiGrid.style.display = 'grid';
        refreshBtn.disabled = false;
        refreshText.textContent = 'Resetiraj';
        itemCounter.textContent = `${items.length} items`;
    }
}

function setApiError(error) {
    apiError = error;
    
    if (error) {
        errorContainer.style.display = 'block';
        errorText.textContent = `API Error: ${error}`;
    } else {
        errorContainer.style.display = 'none';
    }
}

function renderApiItems() {
    apiGrid.innerHTML = '';
    
    items.forEach((item, index) => {
        const itemElement = document.createElement('div');
        itemElement.className = 'api-card';
        itemElement.style.animationDelay = `${index * 50}ms`;
        
        itemElement.innerHTML = `
            <div class="api-card-header">
                <h3 class="api-card-title">${item.title}</h3>
                <span class="api-card-badge">User ${item.userId}</span>
            </div>
            <p class="api-card-description">${item.description}</p>
            <div class="api-card-footer">
                <div class="api-card-dot"></div>
                ${item.timestamp}
            </div>
        `;
        
        apiGrid.appendChild(itemElement);
    });
}