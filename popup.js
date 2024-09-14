const URL_TO_MATCH = /playlist\?list=WL/g;

const pVersion = document.getElementById('version');
const btnFetch = document.getElementById('fetch');
const btnDelete = document.getElementById('delete');

document.addEventListener('DOMContentLoaded', () => {
  // Retrieve the manifest
  const manifest = chrome.runtime.getManifest();
  const version = manifest.version;
  pVersion.textContent = `Version: ${version}`;
  btnFetch.disabled = false
  btnDelete.disabled = false

  // Retrieve the URL from storage (set by the background script)
  /*
  console.log(`YTWL ~ finding isOnTargetUrl ... `)
  chrome.storage.local.get('isOnTargetUrl', (res) => {
    console.log(`YTWL ~ FOUND isOnTargetUrl ... ${res.isOnTargetUrl}`)
    const isValidUrl = res.isOnTargetUrl;
    

    if (isValidUrl) { // enable all buttons
      console.log(`YTWL ~ isOnTargetUrl: ${isValidUrl}`)
      btnFetch.disabled = false
      btnDelete.disabled = false
    } else {
      const urlElement = document.createElement('p');
      urlElement.textContent = 'No matching URL detected.';
      document.body.appendChild(urlElement);
      btnFetch.disabled = true
      btnDelete.disabled = true
    }
  });
  */
});

document.getElementById('fetch').addEventListener('click', async () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { type: 'FETCH_WL' }, (res) => {
      if (chrome.runtime.lastError) {
        console.error(chrome.runtime.lastError.message);
        return
      }
      console.log('Message sent successfully', res);
      copyToClipboard(JSON.stringify(res.videos))
    });
  });
});

/**
 * @name copyToClipboard
 * @description Function to copy text to clipboard
 * 
 * @param {string} text 
 */
function copyToClipboard(text) {
  navigator.clipboard.writeText(text).then(() => {
    console.log('Text copied to clipboard:', text);
  }).catch(err => {
    console.error('Failed to copy text:', err);
  });
}

document.getElementById('delete').addEventListener('click', async () => {
  document.requestStorageAccessFor(window.location.origin).then(() => {
    console.log('Access granted');
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, { type: 'DELETE_WL' }, (res) => {
        if (chrome.runtime.lastError) {
          console.error(chrome.runtime.lastError.message);
          return
        }
        console.log('Message sent successfully', res);
      });
    });
  }).catch(err => {
    console.error('Access request failed:', err);
  });
});
