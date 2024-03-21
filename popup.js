// Function to initiate Facebook login process using chrome.identity.launchWebAuthFlow
function loginWithFacebook() {
  const clientId = '2239466229751440'; // Replace with your Facebook App ID
  const redirectUri = chrome.identity.getRedirectURL(); // Chrome provides this URI for OAuth2
  const authUrl = `https://www.facebook.com/dialog/oauth?client_id=${clientId}&response_type=token&redirect_uri=${encodeURIComponent(redirectUri)}&scope=user_posts,user_likes`;

  chrome.identity.launchWebAuthFlow(
    { url: authUrl, interactive: true },
    function(redirectUrl) {
      if (chrome.runtime.lastError || !redirectUrl) {
        console.log('Login failed.');
        return;
      }
      // Extract the access token from redirectUrl
      const accessToken = new URLSearchParams(new URL(redirectUrl).hash.substring(1)).get('access_token');
      if (accessToken) {
        console.log('Access token:', accessToken);
        document.getElementById('login-button').style.display = 'none';
        chrome.storage.sync.set({accessToken: accessToken}, function() {
          console.log('Access token stored:', accessToken);
        });
        getFavorites(accessToken);
      } else {
        console.log('Login failed: No access token.');
      }
    }
  );
}

// Function to check if access token is already stored
function checkAccessToken() {
  chrome.storage.sync.get('accessToken', function(data) {
    const accessToken = data.accessToken;
    if (accessToken) {
      document.getElementById('login-button').style.display = 'none';
      getFavorites(accessToken);
    } else {
      document.getElementById('login-button').style.display = 'block';
    }
  });
}

// Function to retrieve favorites/saved items from Facebook
function getFavorites(accessToken) {
  // Make a GET request to retrieve favorites using the access token
  fetch(`https://graph.facebook.com/v19.0/me/favorites?access_token=${accessToken}`)
    .then(response => response.json())
    .then(data => {
      // Process and display the favorites
      displayFavorites(data.data);
    })
    .catch(error => {
      console.error('Error fetching favorites:', error);
    });
}

// Function to display favorites/saved items in the popup
function displayFavorites(favorites) {
  const list = document.getElementById('favorites-list');
  list.innerHTML = ''; // Clear existing items
  favorites.forEach(item => {
    const listItem = document.createElement('li');
    listItem.textContent = item.name; // Example: item name
    list.appendChild(listItem);
  });
}

// Event listener for the DOM content loaded event to check access token
document.addEventListener('DOMContentLoaded', function() {
  checkAccessToken();
});

// Event listener for the login button click
document.getElementById('login-button').addEventListener('click', loginWithFacebook);
