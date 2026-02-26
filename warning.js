// Get the target URL from the query parameter
const urlParams = new URLSearchParams(window.location.search);
const targetUrl = urlParams.get('target');

document.getElementById('continueBtn').addEventListener('click', async () => {
  // Send message to background script to record the timestamp
  chrome.runtime.sendMessage({ action: 'allowYouTube' }, (response) => {
    if (response && response.success) {
      // Redirect to the original YouTube URL
      window.location.href = targetUrl || 'https://www.youtube.com';
    }
  });
});
