// Load saved items on popup load
document.addEventListener('DOMContentLoaded', () => {
  showMainMenu();
});

// Show main menu
function showMainMenu() {
  document.getElementById('mainMenu').style.display = 'block';
  document.getElementById('favoritesMenu').style.display = 'none';
}

// Show favorites menu
function showFavoritesMenu() {
  document.getElementById('mainMenu').style.display = 'none';
  document.getElementById('favoritesMenu').style.display = 'block';
  loadSavedItems();
}

// Save item button click handler
document.getElementById('saveButton').addEventListener('click', () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const currentTab = tabs[0];
    const itemId = extractItemId(currentTab.url);
    if (itemId) {
      saveItem(itemId);
      subscribeToWebhook(itemId); // Subscribe to webhook when saving item
      alert('Item saved successfully!');
    }
  });
});

// Favorites button click handler
document.getElementById('favoritesButton').addEventListener('click', () => {
  showFavoritesMenu();
});

// Back button click handler
document.getElementById('backButton').addEventListener('click', () => {
  showMainMenu();
});

// Function to subscribe to Facebook webhook for the specified item ID
async function subscribeToWebhook(itemId) {
  try {
    const accessToken = await getAccessToken(); // Obtain the user's access token
    const callbackUrl = generateCallbackUrl(); // Generate a unique callback URL for the user
    const verifyToken = generateVerifyToken(); // Generate a unique verify token for the user
    // Replace 'YOUR_ACCESS_TOKEN' with your actual Facebook Graph API access token

    const response = await fetch(`https://graph.facebook.com/v13.0/${itemId}/subscriptions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}` // Use the user's access token
      },
      body: JSON.stringify({
        object: 'marketplace_listing',
        fields: ['id', 'title', 'price', 'availability'],
        callback_url: callbackUrl, // Replace with your callback URL
        verify_token: verifyToken
      })
    });

    if (response.ok) {
      console.log('Successfully subscribed to webhook for item:', itemId);
    } else {
      console.error('Failed to subscribe to webhook for item:', itemId, response.statusText);
    }
  } catch (error) {
    console.error('Error subscribing to webhook for item:', itemId, error);
  }
}

// Function to obtain the user's access token
async function getAccessToken() {
  // Implement logic to obtain the user's access token (e.g., through authentication)
  // Return the user's access token
}

// Function to generate a unique callback URL for the user
function generateCallbackUrl() {
  // Implement logic to generate a unique callback URL for the user
  // Return the generated callback URL
}

// Function to generate a unique verify token for the user
function generateVerifyToken() {
  // Implement logic to generate a unique verify token for the user
  // Return the generated verify token
}

// Extract item ID from URL
function extractItemId(url) {
  const match = url.match(/\/marketplace\/item\/(\d+)/);
  return match ? match[1] : null;
}

// Save item to local storage
function saveItem(itemId) {
  chrome.storage.local.get('savedItems', (data) => {
    const savedItems = data.savedItems || [];
    if (!savedItems.includes(itemId)) {
      savedItems.push(itemId);
      chrome.storage.local.set({ 'savedItems': savedItems });
    }
  });
}

// Load saved items from local storage
function loadSavedItems() {
  chrome.storage.local.get('savedItems', (data) => {
    const savedItems = data.savedItems || [];
    const savedItemsList = document.getElementById('savedItemsList');
    savedItemsList.innerHTML = ''; // Clear previous items
    savedItems.forEach(itemId => {
      const listItem = document.createElement('li');
      listItem.textContent = itemId;
      savedItemsList.appendChild(listItem);
    });
  });
}
