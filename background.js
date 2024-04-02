chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === "login") {
      var redirectUri = chrome.identity.getRedirectURL();
      var authUrl = `https://www.facebook.com/dialog/oauth?client_id=${2239466229751440}&response_type=token&redirect_uri=${encodeURIComponent(redirectUri)}&scope=user_posts,user_likes`;
  
      chrome.identity.launchWebAuthFlow({
        url: authUrl,
        interactive: true
      }, function(redirectUrl) {
        if (chrome.runtime.lastError || !redirectUrl) {
          sendResponse({error: chrome.runtime.lastError});
          return;
        }
        var accessToken = new URLSearchParams(new URL(redirectUrl).hash.substring(1)).get('access_token');
        sendResponse({token: accessToken});
      });
      return true; // Indicates that the response is asynchronous
    }
  });
  