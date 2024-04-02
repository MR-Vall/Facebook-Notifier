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
        // Output the access token to the console
        console.log('Access token:', accessToken);
      } else {
        console.log('Login failed: No access token.');
      }
    }
  );
}

// Event listener for the login button click
document.getElementById('login-button').addEventListener('click', function() {
  loginWithFacebook();
});
