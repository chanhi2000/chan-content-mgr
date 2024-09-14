chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.info("YTWL ~ MESSAGE arrived")
  switch (message.type) {
    case 'FETCH_WL':
      sendResponse({ status: "fetch WatchLater DONE!", videos: fetchWL() })
      break;
    case 'DELETE_WL':
      deleteWL();
      sendResponse({ status: "delete WatchLater STARTED!" })
      break;
    default:
      console.warn("message type MISMATCH");
      return;
  }
});

function fetchWL() {
  try {
    const _videos = Array.from(document.querySelector('ytd-browse[page-subtype="playlist"] #primary #contents.style-scope.ytd-playlist-video-list-renderer')
    .querySelectorAll('ytd-playlist-video-renderer'))
    .map((e) => {
      const vInfo = e.querySelector('a#video-title')
      const cInfo = e.querySelector('.ytd-channel-name.complex-string a.yt-simple-endpoint.style-scope.yt-formatted-string')
      return {
        channelId: cInfo.href.replace('https://www.youtube.com/@', ''),
        channelName: cInfo.innerHTML,
        id: vInfo.href.match(/(?<=https\:\/\/www.youtube.com\/watch\?v=)(.*)(?=\&list=)/g).join(''),    
        title: vInfo.innerHTML.match(/(?<=          )(.*)/g).join('').replace(/&amp;/g, '&')
      }
    })
    console.log(JSON.stringify(_videos[0]));
    return _videos;
  } catch (error) {
    console.error('Failed to copy JSON:', error);
  }
}

async function deleteWL() {
  // Fiddle with these if you'd like
  let batchSize = 200; // Number to delete at once before waiting
  let waitBetweenBatchesInMilliseconds = 1000 * 60 * 5; // 5 minutes
  let waitBetweenDeletionsInMilliseconds = 1000; // Half a second

  let totalWaitTime = ((5000 / batchSize) * (waitBetweenBatchesInMilliseconds / 1000 / 60)) + (5000 * (waitBetweenDeletionsInMilliseconds / 1000 / 60))
  console.log(`Deletion will take around ${totalWaitTime.toFixed(0)} minutes to run if the playlist is full.`);

  let count = 0;
  while (true) {
    await new Promise(resolve => setTimeout(resolve, waitBetweenDeletionsInMilliseconds));
    deleteVideoFromWatchLater();
    count++;

    if (count % batchSize === 0 && count !== 0) {
      console.log('Waiting for 5 minutes...');
      await new Promise(resolve => setTimeout(waitBetweenBatchesInMilliseconds));
    }
  }

  function deleteVideoFromWatchLater() {
    const video = document.getElementsByTagName('ytd-playlist-video-renderer')[0];
    video.querySelector('#primary button[aria-label="Action menu"]').click();
    var things = document.evaluate(
        '//span[contains(text(),"Remove from")]',
        document,
        null,
        XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
        null
    );
    for (var i = 0; i < things.snapshotLength; i++) {
        things.snapshotItem(i).click();
    }
  }
}

/* 
const videos = Array.from(document.querySelector('ytd-browse[page-subtype="playlist"] #primary #contents.style-scope.ytd-playlist-video-list-renderer')
  .querySelectorAll('ytd-playlist-video-renderer'))
  .map((e) => {
    const vInfo = e.querySelector('a#video-title')
    const cInfo = e.querySelector('.ytd-channel-name.complex-string a.yt-simple-endpoint.style-scope.yt-formatted-string')
    return {
      channelId: cInfo.href.replace('https://www.youtube.com/@', ''),
      channelName: cInfo.innerHTML,
      id: vInfo.href.match(/(?<=https\:\/\/www.youtube.com\/watch\?v=)(.*)(?=\&list=)/g).join(''),    
      title: vInfo.innerHTML.match(/(?<=          )(.*)/g).join('').replace(/&amp;/g, '&')
    }
  });


*/