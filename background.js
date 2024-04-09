chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url.includes('facebook.com') && tab.url.includes('/marketplace/item/')) {
    chrome.action.setBadgeText({ text: 'Save', tabId: tabId });
    chrome.action.setBadgeBackgroundColor({ color: '#008000', tabId: tabId });
    chrome.action.setPopup({ popup: 'popup.html', tabId: tabId });
  } else {
    chrome.action.setBadgeText({ text: '', tabId: tabId });
  }
});

// Periodically check for changes to saved items
setInterval(() => {
  chrome.storage.local.get('savedItems', (data) => {
    const savedItems = data.savedItems || [];
    // Implement logic to check for changes to saved items
    // You can compare the current state of the items with the previously saved state
    // If there are changes, notify the user accordingly
    // For simplicity, you can just log the saved items here
    console.log('Saved Items:', savedItems);
  });
}, 60000); // Check every 1 minute (adjust as needed)
