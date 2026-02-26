// Check if we should show the warning
async function shouldShowWarning() {
  const result = await chrome.storage.local.get(['lastAllowed']);
  
  if (!result.lastAllowed) {
    return true;
  }
  
  const now = Date.now();
  const thirtyMinutes = 30 * 60 * 1000; // 30 minutes in milliseconds
  
  // If more than 30 minutes have passed, show warning again
  return (now - result.lastAllowed) > thirtyMinutes;
}

// Listen for navigation to YouTube
chrome.webNavigation.onBeforeNavigate.addListener(
  async (details) => {
    // Only handle main frame navigation (not iframes)
    if (details.frameId !== 0) {
      return;
    }
    
    const shouldShow = await shouldShowWarning();
    
    if (shouldShow) {
      // Redirect to warning page with original URL
      const warningUrl = chrome.runtime.getURL('warning.html') + 
        '?target=' + encodeURIComponent(details.url);
      
      chrome.tabs.update(details.tabId, {
        url: warningUrl
      });
    }
  },
  {
    url: [
      { hostSuffix: 'youtube.com' }
    ]
  }
);

// Listen for messages from the warning page
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'allowYouTube') {
    // Store the current timestamp
    chrome.storage.local.set({
      lastAllowed: Date.now()
    });
    sendResponse({ success: true });
  }
});
