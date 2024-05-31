// Receive notifications from content script about changes in marketplace items
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'item_changed') {
    const itemDetails = message.itemDetails;
    // Show a popup to notify the user about the changed item
    chrome.notifications.create({
      type: 'basic',
      iconUrl: 'icon.png',
      title: 'Marketplace Item Changed',
      message: `The item "${itemDetails.title}" has been changed.`,
      buttons: [{ title: 'View Item' }]
    });
  }
});

// Your existing code for monitoring Facebook Marketplace pages and checking saved items can remain unchanged
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url.includes('facebook.com') && tab.url.includes('/marketplace/item/')) {
    chrome.action.setBadgeText({ text: 'Save', tabId: tabId });
    chrome.action.setBadgeBackgroundColor({ color: '#008000', tabId: tabId });
    chrome.action.setPopup({ popup: 'popup.html', tabId: tabId });
  } else {
    chrome.action.setBadgeText({ text: '', tabId: tabId });
  }
});






chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'displayPreset') {
    // We need to check if sender.tab is defined
    if (sender.tab && sender.tab.id) {
      chrome.tabs.sendMessage(sender.tab.id, {type: 'displayPresetItem'});
    } else {
      console.log('No sender.tab available');
    }
  }
});
