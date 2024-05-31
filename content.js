// Logic to monitor Facebook Marketplace for changes in item details
// Send a message to the background script when a change is detected
setInterval(() => {
    const itemDetails = {}; // Logic to get item details from the marketplace page
    chrome.runtime.sendMessage({ type: 'item_changed', itemDetails: itemDetails });
  }, 60000); // Check every 1 minute (adjust as needed)
  

  
// Logic to extract item details from the Facebook Marketplace page
function extractItemDetails() {
    const itemDetails = {};
  
    // Extracting item title
    const titleElement = document.querySelector('h1');
    if (titleElement) {
      itemDetails.title = titleElement.textContent.trim();
    }
  
    // Extracting item price
    const priceElement = document.querySelector('[data-testid="marketplace_pdp_price"]');
    if (priceElement) {
      itemDetails.price = priceElement.textContent.trim();
    }
  
    // Extracting item photo
    const photoElement = document.querySelector('[data-testid="marketplace_pdp_image"]');
    if (photoElement) {
      itemDetails.photoUrl = photoElement.src;
    }
  
    return itemDetails;
  }
  
  // Send the item details to the background script
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'get_item_details') {
      const itemDetails = extractItemDetails();
      chrome.runtime.sendMessage({ type: 'item_details', itemDetails: itemDetails });
    }
  });
  
  // Execute the extraction logic when the page is loaded
  document.addEventListener('DOMContentLoaded', () => {
    chrome.runtime.sendMessage({ type: 'get_item_details' });
  });