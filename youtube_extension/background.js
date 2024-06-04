// Listen for tab focus changes
chrome.tabs.onActivated.addListener(async (activeInfo) => {
  const tab = await chrome.tabs.get(activeInfo.tabId);
  if (tab.url.includes("youtube.com/watch")) {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: focusChanged,
      args: [true]
    });
  }
});

// Listen for tab updates (e.g., URL change)
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url.includes("youtube.com/watch")) {
    chrome.scripting.executeScript({
      target: { tabId: tabId },
      function: focusChanged,
      args: [true]
    });
  }
});

// Function to pause/resume video based on tab focus state
function focusChanged(isFocused) {
  document.addEventListener('visibilitychange', () => {
    const video = document.querySelector('video');
    if (document.hidden) {
      if (video && !video.paused) {
        video.pause();
      }
    } else {
      if (video && video.paused) {
        video.play();
      }
    }
  });

  const video = document.querySelector('video');
  if (isFocused) {
    if (video && video.paused) {
      video.play();
    }
  } else {
    if (video && !video.paused) {
      video.pause();
    }
  }
}

// Listen for window focus changes
chrome.windows.onFocusChanged.addListener(async (windowId) => {
  if (windowId === chrome.windows.WINDOW_ID_NONE) return;
  const [tab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
  if (tab.url.includes("youtube.com/watch")) {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: focusChanged,
      args: [true]
    });
  }
});
