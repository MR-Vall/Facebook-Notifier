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
  chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
    const currentTab = tabs[0];
    // Check if the current tab's URL is a Facebook page
    if (currentTab.url.includes('facebook.com')) {
      const itemId = extractItemId(currentTab.url);
      if (itemId) {
        saveItem(itemId);
        subscribeToWebhook(itemId);
        alert('Item saved successfully!');
      } else {
        alert('No item ID found on the page.');
      }
    } else {
      // If not on Facebook, prompt the user to go to Facebook
      if (confirm('You are not on Facebook. Would you like to go to Facebook now?')) {
        chrome.tabs.create({url: 'https://www.facebook.com'});
      }
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

function simulateWebhookNotification(itemId) {
  chrome.runtime.sendMessage({ type: 'webhook_notification', itemId: itemId });
}

// Function to obtain the user's access token
async function getAccessToken() {
  return 'EAAf0yF0cXpABO06BBxQjQa4TTvNkbUl3h8NTtNCdE2VfqSXALjefkb7SqFtgOaha8rnQ3Yv0oFdxu7yVfW4dMaLkwLLeZAAlHMMldLf4vDanbqFC8uGz2CAm9aPUjeZACmqEOrzL7UZAO2o1VeXkItVUe7iVbAZB2tUtLTAizXkoeLvM3rwOwqmzMw5KnZAacifE8FRtW015UAdZCIkvABzuO0cU5F2cicRbxQAAZDZD'
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

      subscribeToWebhook(itemId); // Subscribe to webhook when saving item
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








document.addEventListener('DOMContentLoaded', () => {
  showMainMenu();
  setupKeyListeners();
  setupRemoveButton();
});

function setupRemoveButton() {
  document.getElementById('removeButton').addEventListener('click', () => {
    const presetItem = document.getElementById('presetItem');
    presetItem.style.display = 'none'; // Hide the preset item section
    alert('Successfully deleted'); // Show prompt
    removeItem("2063511047346315"); // Call to remove the item from favorites
    showMainMenu(); // Optional: show the main menu again after deleting
  });
}


function removeItem(itemId) {
  chrome.storage.local.get('savedItems', function(data) {
    let savedItems = data.savedItems || [];
    const index = savedItems.indexOf(itemId);
    if (index > -1) {
      savedItems.splice(index, 1); // Remove item by index
      chrome.storage.local.set({'savedItems': savedItems}, function() {
        console.log('Item removed from savedItems');
      });
    }
  });
}



function setupKeyListeners() {
  document.addEventListener('keydown', (event) => {
    if (event.key === 'å' || event.key === 'Å') {
      togglePresetItemDisplay({
        reason: "Change In Status",
        name: "Porsche 911",
        image: "https://scontent-cph2-1.xx.fbcdn.net/v/t45.5328-4/437258190_797312115310600_8970313305223466482_n.jpg?stp=dst-jpg_s960x960&_nc_cat=106&ccb=1-7&_nc_sid=247b10&_nc_ohc=aO1WE9jq02sQ7kNvgFZLJv6&_nc_ht=scontent-cph2-1.xx&oh=00_AYBhlFEbpgVVQ8CBnaFdx4pudzy1rJrskiHV6rE_9X_7IQ&oe=6653CD21",
        price: "385.000 kr",
        sold: "Sold"
      });
    }
  });
}

function togglePresetItemDisplay(item) {
  const presetItem = document.getElementById('presetItem');
  if (presetItem.style.display === 'block') {
    presetItem.style.display = 'none';
    showMainMenu(); // Optional: show the main menu again if the preset is hidden
  } else {
    document.getElementById('itemReason').textContent = item.reason;
    document.getElementById('itemName').textContent = item.name;
    document.getElementById('itemImage').src = item.image;
    document.getElementById('itemPrice').textContent = item.price;
    document.getElementById('itemSold').textContent = item.sold;
    document.getElementById('mainMenu').style.display = 'none'; // Hide main menu
    document.getElementById('favoritesMenu').style.display = 'none'; // Hide favorites menu if necessary
    presetItem.style.display = 'block'; // Show the preset item
  }
}
