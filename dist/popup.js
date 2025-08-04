const URL_TO_MATCH = /playlist\?list=WL/g;
const MSG_SENT_SUCCSS = "Message sent successfully"

const CLASS_ACTIVATED = "activated"

const pVersion = document.getElementById('version');

const detailsGH = document.getElementById('details-gh');
const summaryGH = document.getElementById('summary-gh');
const btnFetchGhRepoInfo = document.getElementById('fetch-gh-repo-info');

const detailsYT = document.getElementById('details-yt');
const summaryYT = document.getElementById('summary-yt');
const btnFetchYTChannelInfo = document.getElementById('fetch-yt-channel-info');
const btnFetchYTWL = document.getElementById('fetch-yt-wl');
const btnDeleteYTWL = document.getElementById('delete-yt-wl');

const detailsBlog = document.getElementById('details-blog');
const summaryBlog = document.getElementById('summary-blog');
const btnSiteInfo = document.getElementById('fetch-site-info');
function enableSiteInfo() {
  btnSiteInfo.disabled = false
  btnSiteInfo.style.display = 'block'
}
const btnFetchFreeCodeCampNews = document.getElementById('fetch-free-code-camp-news');
const btnMilanJovanovicBlog = document.getElementById('fetch-milan-jovanovic-blog');
const btnCodeMazeBlog = document.getElementById('fetch-code-maze-blog');
const btnCSharpcornerBlog = document.getElementById('fetch-c-sharpcorner-blog');
const btnHackingWithSwiftBlog = document.getElementById('fetch-hackingwithswift-blog');
const btnDroidconBlog = document.getElementById('fetch-droidcon-blog');
const btnFrontendMastersBlog = document.getElementById('fetch-frontendmasters-blog');
const btnCssTricksBlog = document.getElementById('fetch-css-tricks-blog');
const btnSmashinMagazineBlog = document.getElementById('fetch-smashingmagazine-blog');
const btnDigitalOceanBlog = document.getElementById('fetch-digitalocean-blog');
const btnKtAcademyBlog = document.getElementById('fetch-kt-academy-blog');
const btnKotzillaBlog = document.getElementById('fetch-kotzilla-blog');
const btnOutcomeSchoolBlog = document.getElementById('fetch-outcome-school-blog');
const btnLearnK8sBlog = document.getElementById('fetch-learn-k8s-blog');
const btnItsFossBlog = document.getElementById('fetch-its-foss-blog');
const btnTecmintBlog = document.getElementById('fetch-tecmint-blog');
const btnLogrocketBlog = document.getElementById('fetch-logrocket-blog');
const btnRealPythonBlog = document.getElementById('fetch-realpython-blog');
const btnDockerBlog = document.getElementById('fetch-docker-blog');
const btnEventDrivenBlog = document.getElementById('fetch-event-driven-blog');
const btnGosolveBlog = document.getElementById('fetch-gosolve-blog');
const btnTechKakaoBlog = document.getElementById('fetch-tech-kakao-blog');
const btnTechKakaoPayBlog = document.getElementById('fetch-tech-kakao-pay-blog');
const btnYozmArticle = document.getElementById('fetch-yozm-article');
const btnD2NaverArticle = document.getElementById('fetch-d2-article');

const labelArticlePath = document.getElementById('label-article-path');

const labelStatus = document.getElementById('status-lbl');
const CLASS_SUCCESS = "success"
const CLASS_FAIL = "fail"
function resetLabel() {
  labelStatus.classList.remove(CLASS_FAIL);
  labelStatus.classList.remove(CLASS_SUCCESS);
}
function printSuccessLabel(msg) {
  console.info(msg);
  labelStatus.classList.add(CLASS_SUCCESS);
  labelStatus.innerHTML = msg;
}
function printFailLabel(msg) {
  console.error(msg);
  labelStatus.classList.add(CLASS_FAIL);
  labelStatus.innerHTML = msg;
}

const btnCopyMessage = document.getElementById('copy-message'); 
function enableCopyMessage() {
  btnCopyMessage.disabled = false
  btnCopyMessage.style.display = 'block'
}

async function getCurrentTab() {
  let queryOptions = { active: true, currentWindow: true };
  let [tab] = await chrome.tabs.query(queryOptions);
  return tab;
}

function makeIcon(faviconUrl) {
  return `<img class="icon" src="${faviconUrl}">`
}

document.addEventListener('DOMContentLoaded', () => {
  // Retrieve the manifest
  const manifest = chrome.runtime.getManifest();
  const version = manifest.version;
  pVersion.textContent = `Version: ${version}`;
  [
    btnFetchFreeCodeCampNews, btnMilanJovanovicBlog, btnCodeMazeBlog, btnCSharpcornerBlog, btnHackingWithSwiftBlog, btnDroidconBlog, btnFrontendMastersBlog
    , btnCssTricksBlog, btnSmashinMagazineBlog, btnDigitalOceanBlog, btnLearnK8sBlog, btnKtAcademyBlog, btnKotzillaBlog
    , btnLogrocketBlog, btnRealPythonBlog, btnDockerBlog, btnEventDrivenBlog, btnGosolveBlog, btnItsFossBlog, btnTecmintBlog
    , btnOutcomeSchoolBlog, labelArticlePath, btnTechKakaoBlog, btnTechKakaoPayBlog, btnYozmArticle, btnD2NaverArticle, btnCopyMessage 
  ].forEach((e) => {
    e.style.display = 'none';
  });
  summaryGH.classList.remove('activated')
  summaryYT.classList.remove('activated')
  summaryBlog.classList.remove('activated')
  
  getCurrentTab().then((tab) => {
    console.log("Current URL:", tab.url);
    enableSiteInfo()

    if (/github\.com/g.test(tab.url)) {
      detailsGH.disabled = false;
      detailsGH.open = true;
      summaryGH.classList.add('activated')
      summaryGH.innerHTML = `${makeIcon("https://github.githubassets.com/favicons/favicon-dark.svg")}<span>github.com</span>`
      btnFetchGhRepoInfo.disabled = false
    }

    if (/youtube\.com/g.test(tab.url)) {
      detailsYT.disabled = false;
      detailsYT.open = true;
      detailsYT.style.background = 'rgba(234,51,35,0.2)'
      summaryYT.classList.add('activated')
      summaryYT.innerHTML = `${makeIcon("https://youtube.com/s/desktop/e6683cb8/img/favicon.ico")}<span>youtube.com</span>`
      if (URL_TO_MATCH.test(tab.url)) {
        btnFetchYTWL.disabled = false
        btnDeleteYTWL.disabled = false
      } else {
        btnFetchYTChannelInfo.disabled = false
      }
    }
    
    if (/freecodecamp\.org\/news/g.test(tab.url)) {
      detailsBlog.disabled = false;
      detailsBlog.open = true;
      detailsBlog.style.background = 'rgba(10,10,35,0.2)'
      summaryBlog.classList.add('activated')
      summaryBlog.innerHTML = `${makeIcon("https://cdn.freecodecamp.org/universal/favicons/favicon.ico")}<span>freeCodeCamp.org</span>`;
      btnFetchFreeCodeCampNews.disabled = false
      btnFetchFreeCodeCampNews.style.display = 'block';
    } else if (/milanjovanovic\.tech\/blog/g.test(tab.url)) {
      detailsBlog.disabled = false;
      detailsBlog.open = true;
      detailsBlog.style.background = 'rgba(79,70,229,0.2)'
      summaryBlog.classList.add('activated')
      summaryBlog.innerHTML = `${makeIcon("https://milanjovanovic.tech/profile_favicon.png")}<span>milanjovanovic.tech</span>`;
      btnMilanJovanovicBlog.disabled = false
      btnMilanJovanovicBlog.style.display = 'block';
    } else if (/code-maze\.com\//g.test(tab.url)) {
      detailsBlog.disabled = false;
      detailsBlog.open = true;
      detailsBlog.style.background = 'rgba(22,22,22,0.2)'
      summaryBlog.classList.add('activated')
      summaryBlog.innerHTML = `${makeIcon("https://chanhi2000.github.io/bookshelf/assets/image/code-maze.com/favicon.png")}<span>code-maze.com</span>`;
      btnCodeMazeBlog.disabled = false
      btnCodeMazeBlog.style.display = 'block';
    } else if (/c-sharpcorner\.com\//g.test(tab.url)) {
      detailsBlog.disabled = false;
      detailsBlog.open = true;
      detailsBlog.style.background = 'rgba(0,121,199,0.2)'
      summaryBlog.classList.add('activated')
      summaryBlog.innerHTML = `${makeIcon("https://c-sharpcorner.com/images/layout/favicon-icon-dark.svg")}<span>c-sharpcorner.com</span>`;
      btnCSharpcornerBlog.disabled = false
      btnCSharpcornerBlog.style.display = 'block';
    } else if (/hackingwithswift\.com\//g.test(tab.url)) {
      detailsBlog.disabled = false;
      detailsBlog.open = true;
      detailsBlog.style.background = 'rgba(174,10,10,0.2)'
      summaryBlog.classList.add('activated')
      summaryBlog.innerHTML = `${makeIcon("https://hackingwithswift.com/favicon.svg")}<span>hackingwithswift.com</span>`;
      btnHackingWithSwiftBlog.disabled = false
      btnHackingWithSwiftBlog.style.display = 'block';
      labelArticlePath.value = tab.url.replace(/(https:\/\/)|(www\.)|(hackingwithswift\.com\/)/g, '')
    } else if (/droidcon\.com/g.test(tab.url)) {
      detailsBlog.disabled = false;
      detailsBlog.open = true;
      detailsBlog.style.background = 'rgba(4,20,221,0.2)'
      summaryBlog.classList.add('activated')
      summaryBlog.innerHTML = `${makeIcon("https://droidcon.com/wp-content/uploads/2021/07/favicon-300x300.png")}<span>droidcon.com</span>`;
      btnDroidconBlog.disabled = false
      btnDroidconBlog.style.display = 'block';
      labelArticlePath.value = tab.url.replace(/(https:\/\/)|(www\.)|(droidcon\.com\/)/g, '')
    } else if (/frontendmasters\.com\//g.test(tab.url)) {
      detailsBlog.disabled = false;
      detailsBlog.open = true;
      detailsBlog.style.background = 'rgba(188,75,52,0.2)'
      summaryBlog.classList.add('activated')
      summaryBlog.innerHTML = `${makeIcon("https://frontendmasters.com/favicon.ico")}<span>frontendmasters.com</span>`;
      btnFrontendMastersBlog.disabled = false
      btnFrontendMastersBlog.style.display = 'block';
      labelArticlePath.value = tab.url
        .replace(/(https:\/\/)|(www\.)|(frontendmasters\.com\/)(blog\/)/g, '')
    } else if (/css-tricks\.com\//g.test(tab.url)) {
      detailsBlog.disabled = false;
      detailsBlog.open = true;
      detailsBlog.style.background = 'rgba(17,17.17,0.2)'
      summaryBlog.classList.add('activated')
      summaryBlog.innerHTML = `${makeIcon("https://css-tricks.com/favicon.svg")}<span>css-tricks.com</span>`;
      btnCssTricksBlog.disabled = false
      btnCssTricksBlog.style.display = 'block';
      labelArticlePath.value = tab.url
        .replace(/(https:\/\/)|(www\.)|(css-tricks\.com\/)|(\d{4}\/\d{2}\/)/g, '')
    } else if (/smashingmagazine\.com\//g.test(tab.url)) {
      detailsBlog.disabled = false;
      detailsBlog.open = true;
      detailsBlog.style.background = 'rgba(211,58,44,0.2)'
      summaryBlog.classList.add('activated')
      summaryBlog.innerHTML = `${makeIcon("https://smashingmagazine.com/images/favicon/favicon.svg")}<span>smashingmagazine.com</span>`;
      btnSmashinMagazineBlog.disabled = false
      btnSmashinMagazineBlog.style.display = 'block';
      labelArticlePath.value = tab.url
        .replace(/(https:\/\/)|(www\.)|(smashingmagazine\.com\/)|(\d{4}\/\d{2}\/)/g, '')
    } else if (/digitalocean\.com/g.test(tab.url)) {
      detailsBlog.disabled = false;
      detailsBlog.open = true;
      detailsBlog.style.background = 'rgba(44,103,246,0.2)'
      summaryBlog.classList.add('activated')
      summaryBlog.innerHTML = `${makeIcon("https://digitalocean.com/_next/static/media/favicon.594d6067.ico")}<span>digitalocean.com</span>`;
      btnDigitalOceanBlog.disabled = false
      btnDigitalOceanBlog.style.display = 'block';
      labelArticlePath.value = tab.url
        .replace(/(https:\/\/)|(www\.)|(digitalocean\.com\/community\/tutorials\/)/g, '')
    } else if (/kt\.academy/g.test(tab.url)) {
      detailsBlog.disabled = false;
      detailsBlog.open = true;
      detailsBlog.style.background = 'rgba(243,139,49,0.2)'
      summaryBlog.classList.add('activated')
      summaryBlog.innerHTML = `${makeIcon("https://kt.academy/logo.png")}<span>kt.academy</span>`;
      btnKtAcademyBlog.disabled = false
      btnKtAcademyBlog.style.display = 'block';
      labelArticlePath.value = tab.url
        .replace(/(https:\/\/)|(www\.)|(kt\.academy\/article\/)/g, '')
    } else if (/blog\.kotzilla\.io/g.test(tab.url)) {
      detailsBlog.disabled = false;
      detailsBlog.open = true;
      detailsBlog.style.background = 'rgba(238,181,80,0.2)'
      summaryBlog.classList.add('activated')
      summaryBlog.innerHTML = `${makeIcon("https://blog.kotzilla.io/hubfs/favicon.png")}<span>blog.kotzilla.io</span>`;
      btnKotzillaBlog.disabled = false
      btnKotzillaBlog.style.display = 'block';
      labelArticlePath.value = tab.url
        .replace(/(https:\/\/)|(www\.)|(blog\.kotzilla\.io\/)/g, '')
    } else if (/outcomeschool\.com/g.test(tab.url)) {
      detailsBlog.disabled = false;
      detailsBlog.open = true;
      detailsBlog.style.background = 'rgba(78,70,220,0.2)'
      summaryBlog.classList.add('activated')
      summaryBlog.innerHTML = `${makeIcon("https://outcomeschool.com/static/favicons/apple-touch-icon.png")}<span>outcomeschool.com</span>`;
      btnOutcomeSchoolBlog.disabled = false
      btnOutcomeSchoolBlog.style.display = 'block';
      labelArticlePath.value = tab.url
        .replace(/(https:\/\/)|(www\.)|(outcomeschool\.com\/)/g, '')
    } else if (/learnk8s\.io/g.test(tab.url)) {
      detailsBlog.disabled = false;
      detailsBlog.open = true;
      detailsBlog.style.background = 'rgba(102,152,204,0.2)'
      summaryBlog.classList.add('activated')
      summaryBlog.innerHTML = `${makeIcon("https://static.learnk8s.io/f7e5160d4744cf05c46161170b5c11c9.svg")}<span>learnk8s.io</span>`;
      btnLearnK8sBlog.disabled = false
      btnLearnK8sBlog.style.display = 'block';
      labelArticlePath.value = tab.url
        .replace(/(https:\/\/)|(www\.)|/g, '')
    } else if (/blog\.logrocket\.com/g.test(tab.url)) {
      detailsBlog.disabled = false;
      detailsBlog.open = true;
      detailsBlog.style.background = 'rgba(112,76,182,0.2)'
      summaryBlog.classList.add('activated')
      summaryBlog.innerHTML = `${makeIcon("https://blog.logrocket.com/wp-content/uploads/2019/06/cropped-cropped-favicon-196x196.png")}<span>blog.logrocket.com</span>`;
      btnLogrocketBlog.disabled = false
      btnLogrocketBlog.style.display = 'block';
      labelArticlePath.value = tab.url
        .replace(/(https:\/\/)|(www\.)|(blog\.logrocket\.com\/)/g, '')
    } else if (/realpython\.com/g.test(tab.url)) {
      detailsBlog.disabled = false;
      detailsBlog.open = true;
      detailsBlog.style.background = 'rgba(31,52,74,0.2)'
      summaryBlog.classList.add('activated')
      summaryBlog.innerHTML = `${makeIcon("https://realpython.com/static/favicon.68cbf4197b0c.png")}<span>realpython.com</span>`;
      btnRealPythonBlog.disabled = false
      btnRealPythonBlog.style.display = 'block';
      labelArticlePath.value = tab.url
        .replace(/(https:\/\/)|(www\.)|(realpython\.com\/)/g, '')
    } else if (/docker\.com\/blog/g.test(tab.url)) {
      detailsBlog.disabled = false;
      detailsBlog.open = true;
      detailsBlog.style.background = 'rgba(29,99,237,0.2)'
      summaryBlog.classList.add('activated')
      summaryBlog.innerHTML = `${makeIcon("https://docker.com/app/uploads/2024/02/cropped-docker-logo-favicon-192x192.png")}<span>docker.com/blog</span>`;
      btnDockerBlog.disabled = false
      btnDockerBlog.style.display = 'block';
      labelArticlePath.value = tab.url
    }else if (/event-driven\.io/g.test(tab.url)) {
      detailsBlog.disabled = false;
      detailsBlog.open = true;
      detailsBlog.style.background = 'rgba(255,255,0,0.2)'
      summaryBlog.classList.add('activated')
      summaryBlog.innerHTML = `${makeIcon("https://chanhi2000.github.io/bookshelf/assets/image/event-driven.io/favicon.jfif")}<span>event-driven.io</span>`;
      btnEventDrivenBlog.disabled = false
      btnEventDrivenBlog.style.display = 'block';
      labelArticlePath.value = tab.url
        .replace(/(https:\/\/)|(www\.)|(event-driven\.io\/)|(en\/)/g, '')
    } else if (/gosolve\.io/g.test(tab.url)) {
      detailsBlog.disabled = false;
      detailsBlog.open = true;
      detailsBlog.style.background = 'rgba(56,119,242,0.2)'
      summaryBlog.classList.add('activated')
      summaryBlog.innerHTML = `${makeIcon("https://gosolve.io/wp-content/uploads/2022/03/cropped-ikona1-192x192.png")}<span>gosolve.io</span>`;
      btnGosolveBlog.disabled = false
      btnGosolveBlog.style.display = 'block';
      labelArticlePath.value = tab.url
        .replace(/(https:\/\/)|(www\.)|(gosolve\.io\/)|/g, '')
    } else if (/itsfoss\.com/g.test(tab.url)) {
      detailsBlog.disabled = false;
      detailsBlog.open = true;
      detailsBlog.style.background = 'rgba(53,121,127,0.2)'
      summaryBlog.classList.add('activated')
      summaryBlog.innerHTML = `${makeIcon("https://itsfoss.com/content/images/size/w256h256/2022/12/android-chrome-192x192.png")}<span>itsfoss.com</span>`;
      btnItsFossBlog.disabled = false
      btnItsFossBlog.style.display = 'block';
      labelArticlePath.value = tab.url
        .replace(/(https:\/\/)|(www\.)|/g, '')
    } else if (/tecmint\.com/g.test(tab.url)) {
      detailsBlog.disabled = false;
      detailsBlog.open = true;
      detailsBlog.style.background = 'rgba(5,86,243,0.2)'
      summaryBlog.classList.add('activated')
      summaryBlog.innerHTML = `${makeIcon("https://tecmint.com/wp-content/uploads/2020/07/favicon.ico")}<span>tecmint.com</span>`;
      btnTecmintBlog.disabled = false
      btnTecmintBlog.style.display = 'block';
      labelArticlePath.value = tab.url
        .replace(/(https:\/\/)|(www\.)|/g, '')
    } else if (/yozm\.wishket\.com\//g.test(tab.url)) {
      detailsBlog.disabled = false;
      detailsBlog.open = true;
      detailsBlog.style.background = 'rgba(84,7,224,0.2)'
      summaryBlog.classList.add('activated')
      summaryBlog.innerHTML = `${makeIcon("https://yozm.wishket.com/favicon.ico")}<span>yozm.wishket.com</span>`;
      btnYozmArticle.disabled = false
      btnYozmArticle.style.display = 'block';
      labelArticlePath.value = tab.url;
    } else if (/d2\.naver\.com\//g.test(tab.url)) {
      detailsBlog.disabled = false;
      detailsBlog.open = true;
      detailsBlog.style.background = 'rgba(103,262,163,0.2)'
      summaryBlog.classList.add('activated')
      summaryBlog.innerHTML = `${makeIcon("https://d2.naver.com/favicon.ico")}<span>d2.naver.com</span>`;
      btnD2NaverArticle.disabled = false
      btnD2NaverArticle.style.display = 'block';
      labelArticlePath.value = tab.url
        .replace(/(https:\/\/)|(www\.)|(d2\.naver\.com\/)|(helloworld\/)/g, '');
    } else if (/tech\.kakaopay\.com/g.test(tab.url)) {
      detailsBlog.disabled = false;
      detailsBlog.open = true;
      detailsBlog.style.background = 'rgba(255,84,15,0.2)'
      summaryBlog.classList.add('activated')
      summaryBlog.innerHTML = `${makeIcon("https://tech.kakaopay.com/favicon.ico")}<span>tech.kakaopay.com</span>`;
      btnTechKakaoPayBlog.disabled = false
      btnTechKakaoPayBlog.style.display = 'block';
      labelArticlePath.value = tab.url.replace(/(https:\/\/)|(www\.)|(tech\.kakaopay\.com\/)|(helloworld\/)/g, '');
    } else if (/tech\.kakao\.com/g.test(tab.url)) {
      detailsBlog.disabled = false;
      detailsBlog.open = true;
      detailsBlog.style.background = 'rgba(78,70,210,0.2)'
      summaryBlog.classList.add('activated')
      summaryBlog.innerHTML = `${makeIcon("https://kakaocorp.com/page/favicon.ico")}<span>tech.kakao.com</span>`;
      btnTechKakaoBlog.disabled = false
      btnTechKakaoBlog.style.display = 'block';
      labelArticlePath.value = tab.url.replace(/(https:\/\/)|(www\.)|(tech\.kakao\.com\/)|(posts\/)/g, '');
    } else {
      summaryBlog.innerHTML = 'NOTHING TO DO ...';
    }
  });
});

btnSiteInfo.addEventListener('click', async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })
  const url = tab.url.replace(/www\./g, '')
  const res = await chrome.tabs.sendMessage(tab.id, { type: 'FETCH_SITE_INFO', url: url, })
  resetLabel();
  if (chrome.runtime.lastError) {
    printFailLabel(chrome.runtime.lastError)
    return
  }
  console.log(MSG_SENT_SUCCSS, res.o);
  printSuccessLabel(`SiteInfo Copied ... ${url}`);

  copyToClipboard(res.o)
})


btnFetchGhRepoInfo.addEventListener('click', async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })
  const res = await chrome.tabs.sendMessage(tab.id, { type: 'FETCH_GH_REPO_INFO', repoPath: '' })
  resetLabel();
  if (chrome.runtime.lastError) {
    printFailLabel(chrome.runtime.lastError)
    return
  }
  console.log(MSG_SENT_SUCCSS, res.o);
  printSuccessLabel(res.o.repo);
  const langType = res.o.langType
  let comment = ''
  switch(langType) {
    case 'Java': comment += '// lang-java';break;
    case 'Kotlin': comment += '// lang-kotlin';break;
    case 'C#': comment += '// lang-csharp';break;
    case 'JavaScript': comment += '// lang-js';break;
    case 'TypeScript': comment += '// lang-ts';break;
    case 'Python': comment += '// lang-py';break;
    case 'Jupyter Notebook': comment += '// lang-jupyter-notebook';break;
    case 'Rust': comment += '// lang-rust';break;
    case '': comment += '// tutorial-basic';break;
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
});


btnFetchYTChannelInfo.addEventListener('click', async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })
  const res = await chrome.tabs.sendMessage(tab.id, { type: 'FETCH_YT_CHANNEL_INFO' })
  resetLabel();
  if (chrome.runtime.lastError) {
    printFailLabel(chrome.runtime.lastError.message);
    return
  }
  console.log(MSG_SENT_SUCCSS, res.o);
  printSuccessLabel(`@${res.o.channel.id}`)
  enableCopyMessage()
  const str = `${JSON.stringify(res.o, null, 2).replace(/\[\]/g, '[\n\n  ]')}`
  copyToClipboard(str)
});


btnFetchYTWL.addEventListener('click', async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })
  const res = await chrome.tabs.sendMessage(tab.id, { type: 'FETCH_WL' })
  resetLabel();
  if (chrome.runtime.lastError) {
    printFailLabel(chrome.runtime.lastError.message);
    return
  }
  console.log(MSG_SENT_SUCCSS, res);
  printSuccessLabel(`${res.videos.length} videos fetched ...`)
  enableCopyMessage()
  copyToClipboard(JSON.stringify(res.videos))
});


btnDeleteYTWL.addEventListener('click', async () => {
  await document.requestStorageAccessFor(window.location.origin)
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })
  const res = await chrome.tabs.sendMessage(tab.id, { type: 'DELETE_WL' })

  resetLabel();
  if (chrome.runtime.lastError) {
    printFailLabel(chrome.runtime.lastError.message)
    return
  }
  console.log(MSG_SENT_SUCCSS, res);
  printSuccessLabel(`Begain to delete videos ...`)
  enableCopyMessage()
});


btnFetchFreeCodeCampNews.addEventListener('click', async () => await onClickWebScraping('FETCH_FREE_CODE_CAMP_NEWS'));
btnMilanJovanovicBlog.addEventListener('click', async () =>    await onClickWebScraping('FETCH_MILAN_JOVANOVIC_BLOG'));
btnCodeMazeBlog.addEventListener('click', async () =>          await onClickWebScraping('FETCH_CODE_MAZE_BLOG'));
btnCSharpcornerBlog.addEventListener('click', async () =>      await onClickWebScraping('FETCH_C_SHARPCORNER_BLOG'));
btnHackingWithSwiftBlog.addEventListener('click', async () =>  await onClickWebScraping('FETCH_HACKING_WITH_SWIFT_BLOG'));
btnDroidconBlog.addEventListener('click', async () =>          await onClickWebScraping('FETCH_DROIDCON_BLOG'))
btnFrontendMastersBlog.addEventListener('click', async () =>   await onClickWebScraping('FETCH_FRONTEND_MASTERS_BLOG'));
btnCssTricksBlog.addEventListener('click', async () =>         await onClickWebScraping('FETCH_CSS_TRICKS_BLOG'));
btnSmashinMagazineBlog.addEventListener('click', async () =>   await onClickWebScraping('FETCH_SMASHING_MAGAZINE_BLOG'));
btnDigitalOceanBlog.addEventListener('click', async () =>      await onClickWebScraping('FETCH_DIGITAL_OCEAN_BLOG'));
btnLearnK8sBlog.addEventListener('click', async () =>          await onClickWebScraping('FETCH_LEARN_K8S_BLOG'));
btnKtAcademyBlog.addEventListener('click', async () =>         await onClickWebScraping('FETCH_KT_ACADEMY_BLOG'));
btnKotzillaBlog.addEventListener('click', async () =>          await onClickWebScraping('FETCH_KOTZILLA_BLOG'));
btnOutcomeSchoolBlog.addEventListener('click', async () =>     await onClickWebScraping('FETCH_OUTCOME_SCHOOL_BLOG'));
btnLogrocketBlog.addEventListener('click', async () =>         await onClickWebScraping('FETCH_LOGROCKET_BLOG'));
btnRealPythonBlog.addEventListener('click', async () =>        await onClickWebScraping('FETCH_REALPYTHON_BLOG'));
btnDockerBlog.addEventListener('click', async () =>            await onClickWebScraping('FETCH_DOCKER_BLOG'));
btnEventDrivenBlog.addEventListener('click', async () =>       await onClickWebScraping('FETCH_EVENT_DRIVEN_BLOG'));
btnGosolveBlog.addEventListener('click', async () =>           await onClickWebScraping('FETCH_GOSOLVE_BLOG'));
btnItsFossBlog.addEventListener('click', async() =>            await onClickWebScraping('FETCH_ITS_FOSS_BLOG'));
btnTecmintBlog.addEventListener('click', async() =>            await onClickWebScraping('FETCH_TECMINT_BLOG'));
btnTechKakaoBlog.addEventListener('click', async () =>         await onClickWebScraping('FETCH_TECH_KAKAO'));
btnTechKakaoPayBlog.addEventListener('click', async () =>      await onClickWebScraping('FETCH_TECH_KAKAO_PAY'));
btnYozmArticle.addEventListener('click', async () =>           await onClickWebScraping('FETCH_YOZM_ARTICLE'));
btnD2NaverArticle.addEventListener('click', async () =>        await onClickWebScraping('FETCH_D2_ARTICLE'));

const onClickWebScraping = async (_type = '') => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })
    
  const res = await chrome.tabs.sendMessage(tab.id, { 
    type: _type,
    path: labelArticlePath.value ?? ''
  })
  resetLabel();
  if (chrome.runtime.lastError) {
    printFailLabel(chrome.runtime.lastError.message);
    return
  }
  console.log(MSG_SENT_SUCCSS, res.o);
  printSuccessLabel(res.o.filename)
  enableCopyMessage()
  copyToClipboard(res.o.text)
}

btnCopyMessage.addEventListener('click', async () => {
  copyToClipboard(labelStatus.textContent)
})

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