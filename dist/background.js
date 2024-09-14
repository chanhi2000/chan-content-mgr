const URL_TO_MATCH = /playlist\?list=WL/g;

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  // Check if the tab is fully loaded and the URL is of interest
  if (changeInfo.status === 'complete' && tab.active) {
    checkUrl(tabId)    
  }
});

chrome.tabs.onActivated.addListener((activeInfo) => {
  checkUrl(activeInfo.tabId)
});

function checkUrl(tabId) {
  chrome.tabs.get(tabId, (tab) => {
    const isValid = URL_TO_MATCH.test(tab.url)
    console.log(`YTWL ~ tabId: ${tabId}, tab.url: ${tab.url}, isValid: ${isValid}`)
    chrome.storage.local.set({ 'isOnTargetUrl': isValid })
  });
}

