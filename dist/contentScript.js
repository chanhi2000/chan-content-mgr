chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.info("YTWL ~ MESSAGE arrived")
  switch (message.type) {
    case 'FETCH_YT_CHANNEL_INFO':
      sendResponse({ status: "fetch Youtube Channel Info DONE!", o: fetchYTChannelInfo() });
      break;
    case 'FETCH_GH_REPO_INFO':
      sendResponse({ status: "fetch Github Repository Info DONE!", o: fetchGhRepoInfo() });
      break;
    case 'FETCH_WL':
      sendResponse({ status: "fetch WatchLater DONE!", videos: fetchWL() })
      break;
    case 'DELETE_WL':
      deleteWL();
      sendResponse({ status: "delete WatchLater STARTED!" })
      break;
    case 'FETCH_FREE_CODE_CAMP_NEWS':
      sendResponse({ status: "fetch freeCodeCamp News DONE!", o: fetchFreeCodeCampNews() });
      break;
    case 'FETCH_MILAN_JOVANOVIC_BLOG': 
      sendResponse({ status: "fetch milanJovanovic Blog DONE!", o: fetcMilanJovanovicBlog() });
      break;
    case 'FETCH_HACKING_WITH_SWIFT_BLOG': 
      sendResponse({ status: "fetch hackingWithSwift Blog DONE!", o: fetcHackingWithSwiftBlog(message.path) });
      break;
    case 'FETCH_YOZM_ARTICLE': 
      sendResponse({ status: "fetch yozm Article DONE!", o: fetchYozmArticle() });
      break;
    default:
      console.warn("message type MISMATCH");
      return;
  }
});

function fetchGhRepoInfo() {
  console.log('fetchGhRepoInfo ... ')
  try {
    const langType = [...document.querySelectorAll(".about-margin .BorderGrid-row .list-style-none>li>a>span.color-fg-default")][0]?.innerHTML ?? ''
    const repo = document.querySelector("meta[property='og:url']")
                    ?.getAttribute('content')
                    ?.replace(/https:\/\/github.com\//g, '') ?? ''
    const desc = document.querySelector("meta[property='og:description']")
                    ?.getAttribute('content')
                    ?.replace(/https:\/\/github.com\//g, '')
                    ?.replace(` - ${repo}`, '') ?? ''
    const officialSite = document.querySelector("#responsive-meta-container span>a")
                    ?.getAttribute('href') ?? ''
    const topics = [...document.querySelectorAll(".topic-tag.topic-tag-link")].map((e) => {
      return `${e.innerHTML}`.trim().replace(/g\\n/g, '');
    })
    const avatar = document.querySelector('img.avatar')
                    ?.getAttribute('src') ?? ''
    const banner = document.querySelector("meta[property='og:image']")
                    ?.getAttribute('content') ?? ''
    const o = {
      "langType": langType,
      "repo": repo,
      "desc": desc,
      "officialSite": officialSite,
      "topics": topics,
      "avatar": avatar,
      "banner": banner
    }
    console.log(JSON.stringify(o));
    return o;
  } catch (error) {
    console.error('Failed to copy JSON:', error);
  }
}

function fetchYTChannelInfo() {
  console.log('fetchYTChannelInfo ... ')
  try {
    const channelId = (
      (document.querySelector('.yt-content-metadata-view-model-wiz__metadata-row > span')) ??
      (document.querySelector('#channel-handle > span')) ??
      (document.querySelector('yt-formatted-string#channel-handle'))
    )?.innerHTML?.replace('@', '');
    
    const channelNameTag = (
      (document.querySelector('h1.dynamic-text-view-model-wiz__h1 > span')) ?? 
      (document.querySelector('yt-formatted-string.ytd-channel-name#text')) ??
      (document.querySelector('.ytd-channel-name > span'))
    )?.innerHTML;
    
    const channelName = (channelNameTag.match(/^(.*?)<span/g) == null) ? channelNameTag : channelNameTag.match(/^(.*?)<span/g)[0].replace('<span', '');
    
    const profileImg = (
      (document.querySelector('.yt-spec-avatar-shape__image')) ??
      (document.querySelector('#avatar img.yt-img-shadow'))
    )?.src;
    
    const bannerImgTag = (
      (document.querySelector('yt-image-banner-view-model > img')) ??
      (document.querySelector('.page-header-banner-image.ytd-c4-tabbed-header-renderer'))
    );
    
    const bannerImg = (
      (bannerImgTag == null || bannerImgTag == undefined) 
      ? '' 
      : (bannerImgTag?.src) ?? window.getComputedStyle(bannerImgTag)
        .getPropertyValue('--yt-channel-banner')
        .replace('url(', '')
        .replace(')', '')
    );
    
    const o = {
      channel: {
        id: channelId,
        name: channelName,
        profile: profileImg,
        banner: bannerImg
      },
      videos: [
    
      ],
      playlists: [
    
      ],
    };
    
    console.log(JSON.stringify(o));
    return o;
  } catch (error) {
    console.error('Failed to copy JSON:', error);
  }
}


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

function fetchFreeCodeCampNews() {
  console.log('fetchFreeCodeCampNews ... ')
  try {
    // Extract Open Graph metadata
    const ogData = parseOgData();

    const meta = {
      title: document.querySelector('h1.post-full-title')
          ?.textContent
          ?.trim(),
      description: `${ogData['og:description']}`,
      topic: document.querySelector('.post-full-meta>a')
          ?.textContent
          ?.trim()
          ?.toLowerCase()
          ?.replace(/\#/g, '') ?? '',
      author: document.querySelector('.author-card-name>a')
          ?.textContent
          ?.trim()
          ?.split("\n")[0] ?? '',
      datePublished: convertDateFormat(
        document.querySelector('.post-full-meta-date')
        ?.getAttribute('datetime') ?? ''),
      baseUrl: 'https://freecodecamp.org',
      articleBasePath: 'freecodecamp.org',
      articlePath: `${ogData['og:url']}`
                      .replace(/https:\/\/www\.freecodecamp\.org\/news\//g, '')
                      .replace(/\//g, ''),
      logo: 'https://cdn.freecodecamp.org/universal/favicons/favicon.ico',
      bgRGBA: '10,10,35',
      coverUrl: `${ogData['og:image']}`
    }
    const frontmatter = createFrontMatter(meta)
    const endMatter = createEndMatter(meta)

    const articleContent = document.querySelector('.post-content').innerHTML
    const turndownService = new TurndownService()
    let mdContent = turndownService.turndown(articleContent)
    mdContent = `${frontmatter}${mdContent.replace(/https:\/\/www.youtube.com\/watch\?v=/g, 'https://youtu.be/')
      .replace(/\[freeCodeCamp.org\]/g, '[<FontIcon icon="fa-brands fa-free-code-camp"/>freeCodeCamp.org]')
      .replace(/\(https:\/\/www\./g, '(https://')
      .replace(/\*   /g, '- ')}${endMatter}`
    return {
      filename: `${meta.articlePath}.md`,
      text: mdContent
    };
  } catch (error) {
    console.error('Failed to copy JSON:', error);
  }
}

function fetcMilanJovanovicBlog() {
  console.log('fetcMilanJovanovicBlog ... ')
  try {
    document.querySelector('.mb-16.mt-10').remove()

    // Extract Open Graph metadata
    const ogData = parseOgData();

    const meta = {
      title: document.querySelector('h1')
          ?.textContent
          ?.trim(),
      description: `${ogData['og:description']}`,
      topic: 'cs',
      author: 'Milan Jovanović',
      datePublished: convertDateFormat(
        document.querySelector('time.uppercase')
        ?.getAttribute('datetime') ?? ''),
      baseUrl: 'https://milanjovanovic.tech',
      articleBasePath: 'milanjovanovic.tech',
      articlePath: `${ogData['og:url']}`
                      .replace(/https:\/\/www\.milanjovanovic\.tech\/blog\//g, '')
                      .replace(/\//g, ''),
      logo: 'https://milanjovanovic.tech/profile_favicon.png',
      bgRGBA: '79,70,229',
      coverUrl: `${ogData['og:image'].replace(/\https:\/\/www\./g, 'https://')}`
    }
    const frontmatter = createFrontMatter(meta)
    const endMatter = createEndMatter(meta)

    const articleContent = document.querySelector('article.prose').innerHTML
    const turndownService = new TurndownService()
    let mdContent = turndownService.turndown(articleContent)
    mdContent = `${frontmatter}${mdContent.replace(/\(https:\/\/www\./g, 'https://')
      .replace(/https:\/\/www.youtube.com\/watch\?v=/g, 'https://youtu.be/')
      .replace(/\*   /g, '- ')
      .replace(/\]\(\/blogs\/mnw/g, `](https://milanjovanovic.tech/blogs/mnw`)}${endMatter}`
    return {
      filename: `${meta.articlePath}.md`,
      text: mdContent
    };
  } catch (error) {
    console.error('Failed to copy JSON:', error);
  }
}

function fetcHackingWithSwiftBlog(path = '') {
  console.log('fetcHackingWithSwiftBlog ... ')
  try {
    document.querySelector('p.lead')?.remove()

    // Extract Open Graph metadata
    const ogData = parseOgData();

    const meta = {
      title: document.querySelector('h1.title')
          ?.textContent
          ?.trim(),
      description: document.querySelector('h1.title')
          ?.textContent
          ?.trim(),
      topic: 'swift',
      author: 'Paul Hudson',
      datePublished: convertDateFormat(
          document.querySelector('time')
          ?.getAttribute('datetime') ?? ''),
      baseUrl: 'https://hackingwithswift.com',
      articleBasePath: 'hackingwithswift.com',
      articlePath: path,
      logo: 'https://hackingwithswift.com/favicon.svg',
      bgRGBA: '54,94,226',
      coverUrl: 'https://hackingwithswift.com/files/logo-large.png',
    }

    console.log(`path: ${path.replace(/[\w-]+\.md/g, '')}`)
    const customVpCard = {
      title: '',
      desc: 'Learn Swift coding for iOS with these free tutorials – learn Swift, iOS, and Xcode',
      link:  `/${meta.articleBasePath}/${(meta.articlePath+'.md').replace(/[\w-]+\.md/g, '')}README.md`,
      logo: meta.logo,
      background: "174,10,10"
    }
    const frontmatter = createFrontMatter(meta, customVpCard)
    const endMatter = createEndMatter(meta)

    // document.querySelector('h1.title')
    document.querySelector('.hws-sponsor')?.remove()
    const articleContent = document.querySelector('.col-lg-9').innerHTML
    const turndownService = new TurndownService()
    let mdContent = turndownService.turndown(articleContent)
    mdContent = `${frontmatter}${mdContent.replace(/\(https:\/\/www\./g, 'https://')
      .replace(/https:\/\/www.youtube.com\/watch\?v=/g, 'https://youtu.be/')
      .replace(/\*   /g, '- ')}${endMatter}`
    return {
      filename: `${meta.articlePath}.md`,
      text: mdContent
    };
  } catch (error) {
    console.error('Failed to copy JSON:', error);
  }
}

function fetchYozmArticle() {
  console.log('fetchYozmArticle ... ')
  try {
    document.querySelector('p.lead')?.remove()

    // Extract Open Graph metadata
    const ogData = parseOgData();

    const meta = {
      lang: 'ko-KR',
      title: document.querySelector('.news-title')
          ?.textContent
          ?.trim(),
      description: `${ogData['og:description']}`,
      topic: '',
      author: document.querySelector('.content-meta-elem>a').textContent ?? '',
      datePublished: '', // TODO: 날짜 찾기
      baseUrl: 'https://yozm.wishket.com',
      articleBasePath: 'yozm.wishket.com',
      articlePath: `${ogData['og:url']}`
                      .replace(/https:\/\/yozm\.wishket\.com\/magazine\/detail\//g, '')
                      .replace(/\//g, ''),
      articleOriginPath: `${ogData['og:url']}`
                      .replace(/https:\/\/yozm\.wishket\.com\//g, ''),
      logo: 'https://yozm.wishket.com/static/renewal/img/global/gnb_yozmit.svg',
      bgRGBA: '84,7,224',
      coverUrl: `${ogData['og:image'].replace(/\https:\/\/www\./g, 'https://')}`
    }

    const frontmatter = createFrontMatter(meta)
    const endMatter = createEndMatter(meta)
    // document.querySelector('h1.title')
    const articleContent = document.querySelector('.next-news-contents.news-highlight-box').innerHTML
    const turndownService = new TurndownService()
    let mdContent = turndownService.turndown(articleContent)
    mdContent = `${frontmatter}${mdContent.replace(/\(https:\/\/www\./g, 'https://')
      .replace(/\*   /g, '- ')}${endMatter}`
    return {
      filename: `${meta.articlePath}.md`,
      text: mdContent
    };
  } catch (error) {
    console.error('Failed to copy JSON:', error);
  }
}