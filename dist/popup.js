const URL_TO_MATCH = /playlist\?list=WL/g;

const pVersion = document.getElementById('version');
const btnFetchGhRepoInfo = document.getElementById('fetch-gh-repo-info');
const btnFetchYTChannelInfo = document.getElementById('fetch-yt-channel-info');
const btnFetch = document.getElementById('fetch');
const btnDelete = document.getElementById('delete');
const labeStatus = document.getElementById('status-lbl');

document.addEventListener('DOMContentLoaded', () => {
  // Retrieve the manifest
  const manifest = chrome.runtime.getManifest();
  const version = manifest.version;
  pVersion.textContent = `Version: ${version}`;

  btnFetchGhRepoInfo.disabled = false
  btnFetchYTChannelInfo.disabled = false
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

btnFetchGhRepoInfo.addEventListener('click', async () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { type: 'FETCH_GH_REPO_INFO', repoPath: '', }, (res) => {
      labeStatus.classList.remove('fail')
      labeStatus.classList.remove('success')
      if (chrome.runtime.lastError) {
        console.error(chrome.runtime.lastError.message);
        labeStatus.classList.add('fail')
        labeStatus.innerHTML = chrome.runtime.lastError.message;
        return
      }
      console.log('Message sent successfully', res.o);
      labeStatus.classList.add('success')
      labeStatus.innerHTML = res.o.repo
      const langType = res.o.langType
      let comment = '// lang-'
      switch(langType) {
        case 'Java': comment += 'java';break;
        case 'JavaScript': comment += 'js';break;
        case 'TypeScript': comment += 'ts';break;
        case 'Python': comment += 'py';break;
        default:break;
      }
      delete res.o.langType;
      const str = `${JSON.stringify(res.o)}\n${comment}`.replace(/\}/g, '\n}')
                    .replace(/\"repo\":/g, '\n  \"repo\": ')
                    .replace(/\"desc\":/g, '\n  \"desc\": ')
                    .replace(/\"officialSite\":/g, '\n  \"officialSite\": ')
                    .replace(/\"topics\":/g, '\n  \"topics\": ')
                    .replace(/\"avatar\":/g, '\n  \"avatar\": ')
                    .replace(/\"banner\":/g, '\n  \"banner\": ')
                    .replace(/\",\"/g, '\", \"')
      copyToClipboard(str)
    })
  });
})

btnFetchYTChannelInfo.addEventListener('click', async () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { type: 'FETCH_YT_CHANNEL_INFO' }, (res) => {
      labeStatus.classList.remove('fail')
      labeStatus.classList.remove('success')
      if (chrome.runtime.lastError) {
        console.error(chrome.runtime.lastError.message);
        labeStatus.classList.add('fail')
        labeStatus.innerHTML = chrome.runtime.lastError.message;
        return
      }
      console.log('Message sent successfully', res.o);
      labeStatus.classList.add('success')
      labeStatus.innerHTML = res.o.channelId
      copyToClipboard(JSON.stringify(res.o))
    });
  });
});

btnFetch.addEventListener('click', async () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { type: 'FETCH_WL' }, (res) => {
      labeStatus.classList.remove('fail')
      labeStatus.classList.remove('success')
      if (chrome.runtime.lastError) {
        console.error(chrome.runtime.lastError.message);
        labeStatus.classList.add('fail')
        labeStatus.innerHTML = chrome.runtime.lastError.message;
        return
      }
      labeStatus.classList.add('success')
      labeStatus.innerHTML = `Message sent successfully ... ${res.length}`
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

btnDelete.addEventListener('click', async () => {
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
