// md-gen.js
const TURNDOWN_SERVICE_DEFAULT_OPTIONS = {
  headingStyle: 'atx',
  bulletListMarker: '-',
  codeBlockStyle: 'fenced',
  hr: '---',
  emDelimiter: '*',
  preformattedCode: 'true',
}

function fetchSiteInfo(url) {
  console.log('fetchSiteInfo ... ')
  try {
    // Extract Open Graph metadata
    const ogData = parseOgData();

    let _title = ogData['og:title'] ?? ''
    if (_title === undefined || _title === "undefined" || _title === "")
      _title = document.querySelector('title')?.textContent?.trim() ?? ''

    let _description = `${ogData['og:description']}`?.replace(/"/g, "”") ?? ''
    if (_description === undefined || _description === "undefined" || _description === "")
      _description = document.querySelector('meta[name="description"]')?.getAttribute("content") ?? ''

    let _url = ogData['og:url']?.replace(/www\./, '') ?? url

    const meta = {
      title: _title,
      description: _description,
      baseUrl: _url,
      articlePath: '',
      logo: findFavicon().replace(/www\./, ''),
      background: '244,245,255',
      coverUrl: ogData['og:image']?.replace(/www\./, '') ?? ''
    }
    return createSiteInfo(meta)
  } catch (error) {
    console.error('Failed to copy JSON:', error);
  }

  function findFavicon() {
    var favicon = '';
    var nodeList = document.getElementsByTagName("link");
    for (var i = 0; i < nodeList.length; i++) {
      if ((nodeList[i].getAttribute("rel") == "icon") || (nodeList[i].getAttribute("rel") == "shortcut icon")) {
        favicon = nodeList[i].getAttribute("href");
      }
    }
    return favicon;
  }
}


function fetchFreeCodeCampNews() {
  console.log('fetchFreeCodeCampNews ... ')
  try {
    // Extract Open Graph metadata
    const ogData = parseOgData();

    const path = `${ogData['og:url']}`
      .replace(/https:\/\/www\.freecodecamp\.org\/news\//g, '')
      .replace(/\//g, '')

    const meta = {
      title: document.querySelector('h1.post-full-title')
        ?.textContent
        ?.trim(),
      description: `${ogData['og:description']}`.replace(/"/g, "”"),
      topic: document.querySelector('.post-full-meta>a')
        ?.textContent
        ?.trim()
        ?.toLowerCase()
        ?.replace(/\#/g, '') ?? '',
      author: document.querySelector('.author-card-name>a')
        ?.textContent
        ?.trim()
        ?.split("\n")[0] ?? '',
      authorUrl: `https://freecodecamp.org${document.querySelector('.author-card-name>a')?.getAttribute('href') ?? ''}`,
      datePublished: convertDateFormat(
        document.querySelector('.post-full-meta-date')
          ?.getAttribute('datetime') ?? ''),
      baseUrl: 'https://freecodecamp.org',
      articleBasePath: 'freecodecamp.org',
      articleOriginPath: `news/${path}`,
      articlePath: path,
      logo: 'https://cdn.freecodecamp.org/universal/favicons/favicon.ico',
      bgRGBA: '10,10,35',
      coverUrl: `${ogData['og:image']}`.replace(/(www\.)/g, "")
    }

    const ytWrapper = [...document.querySelectorAll('.embed-wrapper > iframe')]
    const ytTags2Replace = ytWrapper.map((e) => {
      const idFound = e.getAttribute("src")
        ?.replace(/(https:\/\/)|(www\.)|(youtube\.com\/embed\/)|(\?si=.*)/g, "")
      return `<VidStack src="youtube/${idFound}" />`
    })
    for (let e of ytWrapper) {
      let currentHtml = e.innerHTML;
      console.log(currentHtml)
      const pEl = document.createElement('p');
      pEl.textContent = `Youtube Embed Fallback`;
      e.replaceWith(pEl)
    }

    const frontmatter = createFrontMatter(meta)
    const endMatter = createEndMatter(meta)
    const articleContent = document.querySelector('.post-content').innerHTML
    let mdContent = getTurndownResult(articleContent);
    mdContent = combineFrontAndEnd(mdContent, frontmatter, endMatter);
    mdContent = churnSpecialChars(mdContent);
    mdContent = simplifyCodeblockLang(mdContent);
    mdContent = transformLinks(mdContent);
    mdContent = mdContent.replace(/\[([^\]]+)\]\(https:\/\/freecodecamp\.org\/news\/([^/#)]+)\/(#?[^)]*)\)/gm, `[**$1**](/freecodecamp.org/$2.md#$3)`)
    mdContent = mdContent.replace(/\[freeCodeCamp\.org\]/g, '[<FontIcon icon="fa-brands fa-free-code-camp"/>freeCodeCamp.org]')

    let i = 0; // Initialize counter
    mdContent = mdContent.replace(/Youtube\sEmbed\sFallback/g, (match) => {
      const currentReplacement = ytTags2Replace[i];
      i++; // Increment for next time
      return currentReplacement;
    });

    return {
      filename: `${meta.articlePath}.md`,
      text: mdContent
    };
  } catch (error) {
    console.error('Failed to copy JSON:', error);
  }
}


function fetchMilanJovanovicBlog() {
  console.log('fetchMilanJovanovicBlog ... ')
  try {
    document.querySelector('.mb-16.mt-10, .mb-12.pt-4')?.remove()

    // Extract Open Graph metadata
    const ogData = parseOgData();

    const path = `${ogData['og:url']}`
      .replace(/https:\/\/www\.milanjovanovic\.tech\/blog\//g, '')
      .replace(/\//g, '')
    const meta = {
      title: document.querySelector('h1')
        ?.textContent
        ?.trim(),
      description: `${ogData['og:description']}`.replace(/"/g, "”"),
      topic: 'csharp',
      author: 'Milan Jovanović',
      datePublished: convertDateFormat(
        document.querySelector('time.uppercase')
          ?.getAttribute('datetime') ?? ''),
      baseUrl: 'https://milanjovanovic.tech',
      articleBasePath: 'milanjovanovic.tech',
      articleOriginPath: `blog/${path}`,
      articlePath: path,
      logo: 'https://milanjovanovic.tech/profile_favicon.png',
      bgRGBA: '79,70,229',
      coverUrl: `${ogData['og:image'].replace(/\https:\/\/www\./g, 'https://')}`
    }
    const frontmatter = createFrontMatter(meta)
    const endMatter = createEndMatter(meta)
    const articleContent = document.querySelector('article.prose').innerHTML
    let mdContent = getTurndownResult(articleContent);
    mdContent = combineFrontAndEnd(mdContent, frontmatter, endMatter);
    mdContent = churnSpecialChars(mdContent);
    mdContent = simplifyCodeblockLang(mdContent);
    mdContent = transformLinks(mdContent);
    mdContent = mdContent.replace(/\]\(\/blogs\/mnw/g, `](https://milanjovanovic.tech/blogs/mnw`)
    return {
      filename: `${meta.articlePath}.md`,
      text: mdContent
    };
  } catch (error) {
    console.error('Failed to copy JSON:', error);
  }
}

function fetchCodeMazeBlog() {
  console.log('fetchCodeMazeBlog ... ')
  try {
    const elements2Remove = [
      // '.code-block.code-block-1',
      // '.code-block.code-block-2',
      '.advads-after-content',
      '.advads-after-content-2',
    ]
    elements2Remove.forEach((e) => document.querySelector(e)?.remove());
    ElRemoveAll('.enlighter-default, .banner-wrapper, .cb_p6_patreon_button, .code-block')

    // Extract Open Graph metadata
    const ogData = parseOgData();

    const path = `${ogData['og:url']}`
      .replace(/(https:\/\/)|(www\.)|(code-maze\.com\/)/g, '')
      .replace(/\//g, '')
    const meta = {
      title: document.querySelector('.post-header .entry-title')
        ?.textContent
        ?.trim(),
      description: `${ogData['og:description']}`.replace(/"/g, "”"),
      topic: 'csharp',
      author: document.querySelector('.post-meta.vcard .url.fn')?.textContent.trim() ?? '',
      authorUrl: document.querySelector('.post-meta.vcard .url.fn')?.getAttribute('href') ?? '',
      datePublished: convertDateFormat(
        document.querySelector('meta[property^="article:published_time"]')?.getAttribute("content") ?? ''
      ),
      baseUrl: 'https://code-maze.com',
      articleBasePath: 'code-maze.com',
      articleOriginPath: `${path}`,
      articlePath: path,
      logo: '/assets/image/code-maze.com/favicon.png',
      bgRGBA: '22,22,22',
      coverUrl: `${ogData['og:image'].replace(/\https:\/\/www\./g, 'https://')}`
    }

    const pres = [...document.querySelectorAll('pre')]
    pres.forEach((e) => {
      console.log(e.innerHTML)
      let currentHtml = e.innerHTML;
      let lang = e.getAttribute("data-enlighter-language")
      let language = "csharp";
      if (lang.includes('typescript') || lang.includes('ts')) language = 'typescript';
      else if (lang.includes('sql')) language = 'sql';
      else if (lang.includes('shell')) language = 'shell';
      else if (lang.includes('javascript') || lang.includes('js')) language = 'javascript';
      else if (lang.includes('csharp')) language = 'csharp';
      else if (lang.includes('raw')) language = 'plaintext';
      else language = 'plaintext';
      let className = (language === '') ? language : `language-${language}`;
      e.innerHTML = `<code class="${className}">${currentHtml}</code>`
    })
    const frontmatter = createFrontMatter(meta)
    const endMatter = createEndMatter(meta)
    const articleContent = document.querySelector('.post-content.entry-content').innerHTML
    let mdContent = getTurndownResult(articleContent);
    mdContent = combineFrontAndEnd(mdContent, frontmatter, endMatter);
    mdContent = churnSpecialChars(mdContent);
    mdContent = simplifyCodeblockLang(mdContent);
    mdContent = transformLinks(mdContent);
    mdContent = mdContent.replace(/\]\(\/blogs\/mnw/g, `](https://milanjovanovic.tech/blogs/mnw`)
    return {
      filename: `${meta.articlePath}.md`,
      text: mdContent
    };
  } catch (error) {
    console.error('Failed to copy JSON:', error);
  }
}

function fetchCSharpcornerBlog() {
  console.log('fetchCSharpcornerBlog ... ')
  try {

    // Extract Open Graph metadata
    const ogData = parseOgData();

    const path = `${ogData['og:url']}`
      .replace(/(https:\/\/)|(www\.)|(c-sharpcorner\.com\/)/g, '')
      .replace(/article\//g, '')
      .replace(/\//g, '')
    const meta = {
      title: document.querySelector('.post-title')?.textContent
        ?.trim(),
      description: `${ogData['og:description']}`.replace(/"/g, "”"),
      topic: document.querySelector('.post-data-listing-wrap .media .media-left #CategoryLink')
        ?.getAttribute('href')
        ?.trim()
        ?.replace(/(https:\/\/)|(www\.)|(c-sharpcorner\.com\/)|(technologies\/)/g, '')
        ?.toLowerCase() || 'csharp',
      author: document.querySelector('.user-details .publish-info .profile-control a.user-name')
        ?.textContent
        ?.trim() || '',
      authorUrl: document.querySelector('.user-details .publish-info .profile-control a.user-name')
        ?.getAttribute('href')
        ?.replace(/(www\.)/, "")
        ?? '',
      datePublished: convertDateFormat(
        JSON.parse(document.querySelector('script[type="application/ld+json"]')?.textContent)?.datePublished
      ),
      baseUrl: 'https://c-sharpcorner.com',
      articleBasePath: 'c-sharpcorner.com',
      articleOriginPath: `article/${path}`,
      articlePath: path,
      logo: 'https://c-sharpcorner.com/images/layout/favicon-icon-dark.svg',
      bgRGBA: '0,121,199',
      coverUrl: `${ogData['og:image'].replace(/\https:\/\/www\./g, 'https://')}`
    }

    /*
    const pres = [...document.querySelectorAll('pre')]
    pres.forEach((e) => {
      console.log(e.innerHTML)
      let currentHtml = e.innerHTML;
      let lang = e.getAttribute("data-enlighter-language")
      let language = "csharp";
      if (lang.includes('typescript') || lang.includes('ts')) language = 'typescript';
      else if (lang.includes('sql')) language = 'sql';
      else if (lang.includes('shell')) language = 'shell';
      else if (lang.includes('javascript') || lang.includes('js')) language = 'javascript';
      else if (lang.includes('csharp')) language = 'csharp';
      else if (lang.includes('raw')) language = 'plaintext';
      else language = 'plaintext';
      let className = (language === '') ? language : `language-${language}`;
      e.innerHTML = `<code class="${className}">${currentHtml}</code>`
    })
    */
    const frontmatter = createFrontMatter(meta)
    const endMatter = createEndMatter(meta)
    const articleContent = document.querySelector('.user-content #div2').innerHTML
    let mdContent = getTurndownResult(articleContent);
    mdContent = combineFrontAndEnd(mdContent, frontmatter, endMatter);
    mdContent = churnSpecialChars(mdContent);
    mdContent = simplifyCodeblockLang(mdContent);
    mdContent = transformLinks(mdContent);
    mdContent = mdContent.replace(/\]\(\/blogs\/mnw/g, `](https://milanjovanovic.tech/blogs/mnw`)
    return {
      filename: `${meta.articlePath}.md`,
      text: mdContent
    };
  } catch (error) {
    console.error('Failed to copy JSON:', error);
  }
}


function fetchHackingWithSwiftBlog(path = '') {
  console.log('fetchHackingWithSwiftBlog ... ')
  try {
    // Extract Open Graph metadata
    const ogData = parseOgData();

    const meta = {
      title: document.querySelector('h1.title')
        ?.textContent
        ?.trim(),
      description: document.querySelector('h1.title')
        ?.textContent
        ?.trim().replace(/"/g, "”"),
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
      link: `/${meta.articleBasePath}/${(meta.articlePath + '.md').replace(/[\w-]+\.md/g, '')}README.md`,
      logo: meta.logo,
      background: "174,10,10"
    }
    const frontmatter = createFrontMatter(meta, customVpCard)
    const endMatter = createEndMatter(meta)

    // document.querySelector('h1.title')
    document.querySelector('.hws-sponsor')?.remove()
    document.querySelector('p.lead')?.remove()
    const articleContent = document.querySelector('.col-lg-9').innerHTML
    let mdContent = getTurndownResult(articleContent);
    mdContent = combineFrontAndEnd(mdContent, frontmatter, endMatter);
    mdContent = churnSpecialChars(mdContent);
    mdContent = simplifyCodeblockLang(mdContent);
    mdContent = transformLinks(mdContent);
    return {
      filename: `${meta.articlePath}.md`,
      text: mdContent
    };
  } catch (error) {
    console.error('Failed to copy JSON:', error);
  }
}

function fetchDroidconBlog(path = '') {
  console.log('fetchDroidconBlog ... ')
  try {
    // Extract Open Graph metadata
    const ogData = parseOgData();

    const meta = {
      lang: 'en-US',
      title: ogData['og:title']?.trim()
        ?.replace(/ – droidcon/g, ''),
      description: ogData['og:description'].replace(/"/g, "”"),
      topic: 'android',
      author: document.querySelector('.post-author-name.fn')?.textContent.trim() ?? '',
      datePublished: convertDateFormat(
        document.querySelector('time.post_date.published')
          ?.getAttribute('datetime') ?? ''),
      baseUrl: 'https://droidcon.com',
      articleBasePath: 'droidcon.com',
      articlePath: path.replace(/(https:\/\/)|(www\.)|(droidcon\.com\/)|(\d{4}\/\d{2}\/\d{2}\/)/g, '')
        .replace(/\//g, ''),
      logo: 'https://droidcon.com/wp-content/uploads/2021/07/favicon-300x300.png',
      bgRGBA: '4,20,221',
      coverUrl: `${ogData['og:image'].replace(/\https:\/\/www\./g, 'https://')}`
    }

    const elements2Remove = [
      '.w-image.meta_simple',
      '.vc_col-sm-2.wpb_column.vc_column_container'
    ]
    elements2Remove.forEach((e) => document.querySelector(e)?.remove());

    var ca = Array.prototype.slice.call(
      document.querySelectorAll(".classA")
    ).concat(Array.prototype.slice.call(
      document.querySelectorAll(".classB")
    ));


    const frontmatter = createFrontMatter(meta)
    const endMatter = createEndMatter(meta)
    const articleContent = [...document.querySelectorAll('.droidcon_post_wrapper section.us_custom_ff837323 .vc_col-sm-8>.vc_column-inner>.wpb_wrapper>*')].map((e) => e.innerHTML).join('')
    let mdContent = getTurndownResult(articleContent);
    mdContent = combineFrontAndEnd(mdContent, frontmatter, endMatter);
    mdContent = churnSpecialChars(mdContent);
    mdContent = simplifyCodeblockLang(mdContent);
    mdContent = transformLinks(mdContent);
    return {
      filename: `${meta.articlePath}.md`,
      text: mdContent
    };

  } catch (error) {
    console.error('Failed to copy JSON:', error);
  }
}

function fetchFrontendMastersBlog(path = '') {
  console.log('fetchFrontendMastersBlog ... ')
  try {
    // Extract Open Graph metadata
    const ogData = parseOgData();

    const meta = {
      lang: 'en-US',
      title: document.querySelector('title')
        ?.textContent
        ?.trim()
        ?.replace(/ – Frontend Masters Boost/g, '')
        ?.replace(/ – Frontend Masters Blog/g, ''),
      description: `${document.querySelector('meta[name="description"]')?.getAttribute("content") ?? ''}`.replace(/"/g, "”"),
      topic: 'css',
      author: document.querySelector('.author-and-time a.author-link')
        ?.textContent.trim() ?? '',
      authorUrl: document.querySelector('.author-and-time a.author-link')?.getAttribute('href') ?? '',
      datePublished: convertDateFormat(
        document.querySelector('.author-and-time time')
          ?.getAttribute('datetime') ?? ''),
      baseUrl: 'https://frontendmasters.com',
      articleBasePath: 'frontendmasters.com',
      articlePath: path.replace(/\//g, ''),
      articleOriginPath: `blog/${path}`,
      logo: 'https://frontendmasters.com/favicon.ico',
      bgRGBA: '188,75,52',
      coverUrl: `${ogData['og:image'].replace(/\https:\/\/www\./g, 'https://')}`
    }

    const codepenWrapper = [...document.querySelectorAll('.cp_embed_wrapper > iframe')]
    const tags2Replace = codepenWrapper.map((e) => {
      const [usernameFound, idFound] = e.getAttribute('src')?.replace(/\/\/codepen\.io\//g, "")
        ?.replace(/\?.*/g, "").split("/embed/")
      // const titleFound = e?.contentWindow?.document?.querySelector('head>title') || "N/A"
      const titleFound = "N/A" // SecurityError: Failed to read a named property 'document' from 'Window': Blocked a frame with 
      return `<CodePen
  user="${usernameFound}"
  slug-hash="${idFound}"
  title="${titleFound}"
  :default-tab="['css','result']"
  :theme="$isDarkmode ? 'dark': 'light'"/>`
    })

    const frontmatter = createFrontMatter(meta)
    const endMatter = createEndMatter(meta)
    const articleContent = document.querySelector('.article-content').innerHTML
    let mdContent = getTurndownResult(articleContent);
    mdContent = combineFrontAndEnd(mdContent, frontmatter, endMatter);
    mdContent = churnSpecialChars(mdContent);
    mdContent = simplifyCodeblockLang(mdContent);
    mdContent = transformLinks(mdContent);
    mdContent = mdContent.replace(/(\`Code language\:.*\(*\))/g, '\n\`\`\`')
      .replace(/\[\]\(\#.*\)/g, "") // remove empty tag
      .replace(/\s\[\#\]\(\#.*\)/g, "") // remove empty tag

    let i = 0; // Initialize counter
    mdContent = mdContent.replace(/CodePen\sEmbed\sFallback/g, (match) => {
      const currentReplacement = tags2Replace[i];
      i++; // Increment for next time
      return currentReplacement;
    });

    return {
      filename: `${meta.articlePath}.md`,
      text: mdContent
    };
  } catch (error) {
    console.error('Failed to copy JSON:', error);
  }
}

function fetchCssTricks(path = '') {
  console.log('fetchCssTricks ... ')
  try {
    // Extract Open Graph metadata
    const ogData = parseOgData();

    const meta = {
      lang: 'en-US',
      title: ogData['og:title']
        ?.replace(/ \| CSS-Tricks/g, ''),
      description: `${document.querySelector('meta[name="description"]')?.getAttribute("content") ?? ''}`
        .replace(/"/g, "”"),
      topic: 'css',
      author: document.querySelector('header.mega-header .author-row a.author-name')
        ?.textContent.trim() ?? '',
      authorUrl: document.querySelector('header.mega-header .author-row a.author-name')
        ?.getAttribute('href') ?? '',
      datePublished: convertDateFormat(
        document.querySelector('header.mega-header .author-row time')
          ?.getAttribute('datetime') ||
        document.querySelector('header.mega-header .author-row time')
          ?.textContent?.trim() || ''
      ),
      baseUrl: 'https://css-tricks.com',
      articleBasePath: 'css-tricks.com',
      articlePath: path.replace(/\//g, ''),
      // articleOriginPath: `blog/${path}`,
      logo: 'https://css-tricks/favicon.svg',
      bgRGBA: '17,17,17',
      coverUrl: `${ogData['og:image']?.replace(/\https:\/\/www\./g, 'https://')?.replace(/^\/\//g, 'https://i0.wp.com/')}`
    }

    const codepenWrapper = [...document.querySelectorAll('.cp_embed_wrapper > iframe')]
    const tags2Replace = codepenWrapper.map((e) => {
      const [usernameFound, idFound] = e.getAttribute('src')?.replace(/\/\/codepen\.io\//g, "")
        ?.replace(/\?.*/g, "").split("/embed/")
      // const titleFound = e?.contentWindow?.document?.querySelector('head>title') || "N/A"
      const titleFound = "N/A" // SecurityError: Failed to read a named property 'document' from 'Window': Blocked a frame with 
      return `<CodePen
  user="${usernameFound}"
  slug-hash="${idFound}"
  title="${titleFound}"
  :default-tab="['css','result']"
  :theme="$isDarkmode ? 'dark': 'light'"/>`
    })

    const frontmatter = createFrontMatter(meta)
    const endMatter = createEndMatter(meta)
    const articleContent = document.querySelector('article .article-content, .article-content-wrap .article-content').innerHTML
    let mdContent = getTurndownResult(articleContent);
    mdContent = combineFrontAndEnd(mdContent, frontmatter, endMatter);
    mdContent = churnSpecialChars(mdContent);
    mdContent = simplifyCodeblockLang(mdContent);
    mdContent = transformLinks(mdContent);
    mdContent = mdContent.replace(/\[([^\]]+)\]\(https:\/\/css-tricks\.com\/([^/#)]+)\/(#?[^)]*)\)/gm, `[**$1**](/css-tricks.com/$2.md#$3)`)
    mdContent = mdContent.replace(/\[\]\(#.*\)/g, '')

    let i = 0; // Initialize counter
    mdContent = mdContent.replace(/CodePen\sEmbed\sFallback/g, (match) => {
      const currentReplacement = tags2Replace[i];
      i++; // Increment for next time
      return currentReplacement;
    });

    return {
      filename: `${meta.articlePath}.md`,
      text: mdContent
    };
  } catch (error) {
    console.error('Failed to copy JSON:', error);
  }
}

function fetchPiccalilLiBlog(path = "") {
  console.log(`fetchPiccalilLiBlog ... path: ${path}`)
  try {
    // Extract Open Graph metadata
    const ogData = parseOgData();

    const [author, topic] = [...document.querySelectorAll('.hero__meta.cluster a')].map((e) => {
      return {
        content: e?.textContent,
        link: `https://piccalil.li${e?.getAttribute('href')}`
      }
    })

    const meta = {
      title: ogData['og:title']?.trim(),
      description: ogData['og:description']?.replace(/"/g, "”"),
      topic: topic?.content?.toLowerCase(),
      author: author?.content,
      authorUrl: author?.link,
      datePublished: convertDateFormat(
        document.querySelector('.hero__meta.cluster time')
          ?.getAttribute('datetime') ?? ''),
      baseUrl: 'https://piccalil.li',
      articleBasePath: 'piccalil.li',
      articleOriginPath: `blog/${path}`,
      articlePath: path,
      logo: 'https://piccalil.li/favicons/favicon.ico',
      bgRGBA: '253,208,0',
      coverUrl: `${ogData['og:image']}`
    }

    const codeBlockWrapper = [...document.querySelectorAll('.code-block-wrapper')]
    codeBlockWrapper.forEach((e) => {
      let currentHtml = e.innerHTML;
      console.log(currentHtml)
      // pre안 내용정리
      let pre = e.querySelector('pre')
      let astroWrapper = pre.querySelector('astro-slot')
      pre.innerHTML = astroWrapper.innerHTML
      console.log(pre)
      // pre를 밖으로
      e.parentNode.insertBefore(pre, e)
      e.remove()
      // e.innerHTML = pre.outerHTML
    })
    const codepenWrapper = [...document.querySelectorAll('.cp_embed_wrapper > iframe')]
    const tags2Replace = codepenWrapper.map((e) => {
      const [usernameFound, idFound] = e.getAttribute('src')?.replace(/\/\/codepen\.io\//g, "")
        ?.replace(/\?.*/g, "")
        ?.replace(/https:/g, "")
        ?.split("/embed/")
      // const titleFound = e?.contentWindow?.document?.querySelector('head>title') || "N/A"
      const titleFound = "N/A" // SecurityError: Failed to read a named property 'document' from 'Window': Blocked a frame with 
      return `<CodePen
  user="${usernameFound}"
  slug-hash="${idFound}"
  title="${titleFound}"
  :default-tab="['css','result']"
  :theme="$isDarkmode ? 'dark': 'light'"/>`
    })

    for (let e of codepenWrapper) {
      let currentHtml = e.innerHTML;
      console.log(currentHtml)
      const pEl = document.createElement('p');
      pEl.textContent = `CodePen Embed Fallback`;
      e.replaceWith(pEl)
    }

    /* const pres = [...document.querySelectorAll('pre')]
    pres.forEach((e) => {
      let currentHtml = e.innerHTML;
      console.log(e.innerHTML)
      let parentHtml = e.parentElement
      let gparentHtml = parentHtml.parentElement
      let ggparentHtml = gparentHtml.parentElement
      let gggparentHtml = ggparentHtml.parentElement
      parentHtml.remove()
      gparentHtml.remove()
      ggparentHtml.remove()
      // gggparentHtml.remove()
    }) */


    const frontmatter = createFrontMatter(meta)
    const endMatter = createEndMatter(meta)
    let articleContent = document.querySelector('.article').innerHTML
    let mdContent = getTurndownResult(articleContent);
    mdContent = combineFrontAndEnd(mdContent, frontmatter, endMatter);
    mdContent = churnSpecialChars(mdContent);
    mdContent = simplifyCodeblockLang(mdContent);
    mdContent = transformLinks(mdContent);
    mdContent = mdContent.replace(/\[permalink\]\(#.*\)/g, '')
      .replace(/\[Advert\!\[.*\)/g, '')
      .replace(/\t/g, "  ") // tab -> 2-space indentation
      .replace()

    let i = 0; // Initialize counter
    mdContent = mdContent.replace(/CodePen\sEmbed\sFallback/g, (match) => {
      const currentReplacement = tags2Replace[i];
      i++; // Increment for next time
      return currentReplacement;
    });

    return {
      filename: `${meta.articlePath}.md`,
      text: mdContent
    };
  } catch (error) {
    console.error('Failed to copy JSON:', error);
  }
}

function fetchSmashingMagazineBlog() {
  console.log('fetchSmashingMagazineBlog ... ')
  try {
    // Extract Open Graph metadata
    const ogData = parseOgData();
    let _ogImage = `${ogData['og:image'].replace(/\https:\/\/www\./g, 'https://')}`
    if (_ogImage == null || _ogImage == undefined || _ogImage.toLowerCase() === 'https:') {
      _ogImage = `https://smashingmagazine.com/images/smashing-homepage.png`
    }

    const meta = {
      lang: 'en-US',
      title: `${ogData['og:title']}`.replace(/ — Smashing Magazine/g, ''),
      description: `${ogData['og:description']}`.replace(/"/g, "”"),
      topic: '',
      author: document.querySelector('a.author-post__author-title').textContent ?? '',
      authorUrl: `https://smashingmagazine.com${document.querySelector('a.bio-image-link').getAttribute('href') ?? ''}`,
      datePublished: convertDateFormat(
        document.querySelector('time.article-header--date')
          ?.getAttribute('datetime') ?? ''),
      baseUrl: 'https://smashingmagazine.com',
      articleBasePath: 'smashingmagazine.com',
      articlePath: `${ogData['og:url']}`
        .replace(/(https:\/\/)|(www\.)|(smashingmagazine\.com\/)|(\d{4}\/\d{2}\/)/g, '')
        .replace(/\//g, ''),
      articleOriginPath: `${ogData['og:url']}`
        .replace(/(https:\/\/)|(www\.)|(smashingmagazine\.com\/)/g, ''),
      logo: 'https://smashingmagazine.com/images/favicon/favicon.svg',
      bgRGBA: '211,58,44',
      coverUrl: _ogImage
    }

    const elements2Remove = [
      '.c-garfield-header',
      '.meta-box.meta-box--article',
      '.c-garfield-aside--meta',
      '.c-garfield-native-panel__right',
      '.c-garfield-native-panel',
      '.c-garfield-native-panel.c-garfield-native-panel__below',
      '.c-garfield-native-panel.c-garfield-native-panel__end',
      '.c-friskies-box.partners.partners__lead.partners__lead-place.partners__external',
      '.feature-panel-container',
      '.signature',
      '.category__related--alt'
    ]
    elements2Remove.forEach((e) => document.querySelector(e)?.remove());

    const frontmatter = createFrontMatter(meta)
    const endMatter = createEndMatter(meta)
    const articleContent = document.querySelector('.c-garfield-the-cat').innerHTML
    let mdContent = getTurndownResult(articleContent);
    mdContent = combineFrontAndEnd(mdContent, frontmatter, endMatter);
    mdContent = churnSpecialChars(mdContent);
    mdContent = simplifyCodeblockLang(mdContent);
    mdContent = transformLinks(mdContent);
    mdContent = mdContent?.replace(/\[\]\(\#.*\)/g, "") // remove empty tag
      ?.replace(/\s\[\#\]\(\#.*\)/g, "") // remove empty tag
      ?.replace(/```\n\n(Copy)\n/g, "```\n")
      ?.replace(/\[([^\]]+)\]\(\/(\d{4}\/\d{2}\/([^/)]+))\)/g, '[**$1**](https://smashingmagazine.com/$2.html)<!-- TODO: /smashingmagazine.com/$3.md -->');

    return {
      filename: `${meta.articlePath}.md`,
      text: mdContent
    };
  } catch (error) {
    console.error('Failed to copy JSON:', error);
  }
}

function fetchOddBirdBlog(path = "") {
  console.log(`fetchOddBirdBlog ... path: ${path}`)

  const topics = [...document.querySelectorAll('ul[inline-list="pill-set"]>li.pill-item>a.pill')].map((e) => {
    return e?.textContent?.toLowerCase() || ""
  }).filter((e) => e !== 'article' || e !== 'csswg')

  try {
    // Extract Open Graph metadata
    const ogData = parseOgData();

    const meta = {
      lang: 'en-US',
      title: `${ogData['og:title']}`?.replace(/(\s\|\sOddBird)/g, ''),
      description: `${ogData['og:description']}`?.replace(/"/g, "”"),
      topic: topics.find((e) => ['css', 'javascript'].includes(e)),
      author: document.querySelector('a.p-author').textContent ?? '',
      authorUrl: `https://oddbird.net${document.querySelector('a.p-author').getAttribute('href') ?? ''}`,
      datePublished: convertDateFormat(
        document.querySelector('#meta>.byline>time')
          ?.getAttribute('datetime') ?? ''),
      baseUrl: 'https://oddbird.net',
      articleBasePath: 'oddbird.net',
      articlePath: `${ogData['og:url']}`
        .replace(/(https:\/\/)|(www\.)|(oddbird\.net\/)|(\d{4}\/\d{2}\/\d{2}\/)/g, '')
        .replace(/\//g, ''),
      articleOriginPath: `${ogData['og:url']}`
        .replace(/(https:\/\/)|(www\.)|(oddbird\.net\/)/g, ''),
      logo: 'https://oddbird.net/safari-pinned-tab.svg',
      bgRGBA: '145,208,222',
      coverUrl: `${ogData['og:image'].replace(/\https:\/\/www\./g, 'https://')}`
    }

    const codepenWrapper = [...document.querySelectorAll('.cp_embed_wrapper > iframe')]
    const tags2Replace = codepenWrapper.map((e) => {
      const [usernameFound, idFound] = e.getAttribute('src')?.replace(/\/\/codepen\.io\//g, "")
        ?.replace(/\?.*/g, "").split("/embed/")
      // const titleFound = e?.contentWindow?.document?.querySelector('head>title') || "N/A"
      const titleFound = "N/A" // SecurityError: Failed to read a named property 'document' from 'Window': Blocked a frame with 
      return `<CodePen
  user="${usernameFound}"
  slug-hash="${idFound}"
  title="${titleFound}"
  :default-tab="['css','result']"
  :theme="$isDarkmode ? 'dark': 'light'"/>`
    })

    for (let e of codepenWrapper) {
      let currentHtml = e.innerHTML;
      console.log(currentHtml)
      const pEl = document.createElement('p');
      pEl.textContent = `CodePen Embed Fallback`;
      e.replaceWith(pEl)
    }

    /* const blockWrapper = [...document.querySelectorAll('[data-callout]')]
    for (let e of blockWrapper) {
      const type = e.getAttribute('data-callout')
      const content = e.innerText.trim();
      e.replaceWith(`::: ${type}\n\n${content}\n\n:::\n`)
    } */

    // TODO: .summary.p-summary 를 .e-content 안으로 이동

    const frontmatter = createFrontMatter(meta)
    const endMatter = createEndMatter(meta)
    const articleContent = document.querySelector('.e-content').innerHTML
    let mdContent = getTurndownResult(articleContent);
    mdContent = combineFrontAndEnd(mdContent, frontmatter, endMatter);
    mdContent = churnSpecialChars(mdContent);
    mdContent = simplifyCodeblockLang(mdContent);
    mdContent = transformLinks(mdContent);
    mdContent = mdContent?.replace(/\[\]\(\#.*\)/g, "") // remove empty tag
      ?.replace(/```\n\n(Copy)\n/g, "```\n")
      ?.replace(/\[Copy\spermalink\sto\s.*\]\(\#.*\)\n\n/g, "")
      ?.replace(/\]\(\/(?=[^)]+\.(?:jpe?g|png|webp|gif)\))/g, "](https://oddbird.net") // 이미지 URL 완성

    let i = 0; // Initialize counter
    mdContent = mdContent.replace(/CodePen\sEmbed\sFallback/g, (match) => {
      const currentReplacement = tags2Replace[i];
      i++; // Increment for next time
      return currentReplacement;
    });

    return {
      filename: `${meta.articlePath}.md`,
      text: mdContent
    };
  } catch (error) {
    console.error('Failed to copy JSON:', error);
  }
}

function fetchDigitalOceanBlog(path = '') {
  console.log('fetchDigitalOceanBlog ... ')
  try {
    // Extract Open Graph metadata
    const ogData = parseOgData();

    const siteMeta = JSON.parse(document.querySelector('script[type="application/ld+json"]')?.textContent) || {}

    document.querySelector('#footer')?.remove()

    const meta = {
      lang: 'en-US',
      title: document.querySelector('h1').textContent,
      description: `${ogData['og:description']}`.replace(/"/g, "”"),
      topic: siteMeta?.keywords?.toLowerCase() || '',
      author: siteMeta?.author[0]?.name || "",
      authorUrl: `https://digitalocean.com${document.querySelector('a.kExApF')?.getAttribute('href')}`,
      datePublished: convertDateFormat(
        siteMeta?.datePublished
      ),
      baseUrl: 'https://digitalocean.com',
      articleBasePath: 'digitalocean.com',
      articlePath: path.replace(/\//g, ''),
      articleOriginPath: `community/tutorials/${path.replace(/(https:\/\/)|(www\.)|(digitalocean\.com\/)|(community\/)|(tutorial\/)|(articles\/)/g, '')}`,
      logo: 'https://digitalocean.com/_next/static/media/favicon.594d6067.ico',
      bgRGBA: '44,103,246',
      coverUrl: `${ogData['og:image']?.replace(/\https:\/\/www\./g, 'https://')}`
    }

    const codeBlockWrapper = [...document.querySelectorAll('.code-toolbar')]
    codeBlockWrapper.forEach((e) => {
      let currentHtml = e.innerHTML;
      console.log(currentHtml)
      // pre안 내용정리
      let pre = e.querySelector('pre')
      let code = pre.querySelector('code')
      code.className = pre.className;
      console.log(pre)
      // pre를 밖으로
      e.parentNode.insertBefore(pre, e)
      e.remove()
      // e.innerHTML = pre.outerHTML
    })

    const elArticle = document.querySelectorAll('details')[0]?.parentNode

    const frontmatter = createFrontMatter(meta)
    const endMatter = createEndMatter(meta)
    const articleContent = (elArticle ?? document.querySelector('.bQhQdd'))?.innerHTML
    let mdContent = getTurndownResult(articleContent);
    mdContent = combineFrontAndEnd(mdContent, frontmatter, endMatter);
    mdContent = churnSpecialChars(mdContent);
    mdContent = simplifyCodeblockLang(mdContent);
    mdContent = transformLinks(mdContent);
    mdContent = mdContent?.replace(/```\n\n(Copy)\n/g, "```\n")
      ?.replace(/\[\]\(#.*\)/g, '')
      ?.replace(/\[([^\]]+)\]\(\/community\/tutorial(?:-collections|s)\/([^/)]+)\)/g, `[**$1**](/digitalocean.com/$2.md)`)
      ?.replace(/\[([^\]]+)\]\(\/community\/tutorial_collections\/([^/)]+)\)/g, `[**$1**](/digitalocean.com/collections/$2.md)`)
      ?.replace(/\[([^\]]+)\]\(\/products\/([^)]+)\)/g, '[<VPIcon icon="fa-brands fa-digital-ocean" />$1](https://digitalocean.com/products/$2)')

    return {
      filename: `${meta.articlePath}.md`,
      text: mdContent
    };
  } catch (error) {
    console.error('Failed to copy JSON:', error);
  }
}

function fetchTypeScriptTvBlog(path = '') {
  console.log(`fetchTypeScriptTvBlog ... path: ${path}`)
  try {
    // Extract Open Graph metadata
    const ogData = parseOgData();

    const meta = {
      lang: 'en-US',
      title: document.querySelector('h1')?.textContent?.trim(),
      description: `${ogData['og:description']}`.replace(/"/g, "”"),
      topic: 'typescript',
      author: "Benny Neugebauer",
      authorUrl: `https://stackoverflow.com/users/451634/benny-neugebauer`,
      datePublished: convertDateFormat(
        document?.querySelector('header  time')?.getAttribute('datetime')
      ),
      baseUrl: 'https://typescript.tv',
      articleBasePath: 'typescript.tv',
      articlePath: `${ogData['og:url']}`
        .replace(/(https:\/\/)|(www\.)|(typescript\.tv\/)|(testing\/)|(hands-on\/)|(best-practices\/)|(new-features\/)|(react\/)/g, '')
        .replace(/\//g, ''),
      articleOriginPath: `${ogData['og:url']}`
        .replace(/(https:\/\/)|(www\.)|(typescript\.tv\/)/g, '') ?? `${path.replace(/(https:\/\/)|(www\.)|(typescript\.tv\/)/g, '')}`,
      logo: 'https://typescript.tv/_astro/android-chrome-192x192.BhQ8hcWh.png',
      bgRGBA: '18,32,63',
      coverUrl: `${ogData['og:image']?.replace(/\https:\/\/www\./g, 'https://')}`
    }

    const codeBlockWrapper = [...document.querySelectorAll('[data-rehype-pretty-code-figure]')]
    codeBlockWrapper.forEach((e) => {
      let currentHtml = e.innerHTML;
      console.log(currentHtml)
      const filename = e.querySelector('figcaption')?.textContent || ""
      // pre안 내용정리
      let pre = e.querySelector('pre')
      const langauge = pre.getAttribute('data-language') ?? 'typescript'
      pre.className = `language-${langauge}`
      let code = pre.querySelector('code')
      code.className = pre.className;
      console.log(pre)
      let elements2Remove = [...code.querySelectorAll('button,style')]
      for (inner of elements2Remove) { inner?.remove() }

      const pEl = document.createElement('p');
      pEl.textContent = filename;
      pEl.className = `code-title`
      // pre를 밖으로
      e.parentNode.insertBefore(pEl, e)
      e.parentNode.insertBefore(pre, e)
      e.remove()
      // e.innerHTML = pre.outerHTML
    })

    const ytWrapper = [...document.querySelectorAll('.video-container > iframe')]
    const ytTags2Replace = ytWrapper.map((e) => {
      const idFound = e.getAttribute("src")
        ?.replace(/(https:\/\/)|(www\.)|(youtube\.com)|(youtube-nocookie\.com)|(\/embed\/)|(\?si=.*)/g, "")
      return `<VidStack src="youtube/${idFound}" />`
    })
    for (let e of ytWrapper) {
      let currentHtml = e.innerHTML;
      console.log(currentHtml)
      const pEl = document.createElement('p');
      pEl.textContent = `Youtube Embed Fallback`;
      e.replaceWith(pEl)
    }

    /* const elArticle = document.querySelectorAll('details')[0]?.parentNode */

    const elements2Remove = [
      'article > header > :first-child',
      'article > header > h1',
    ]
    elements2Remove.forEach((e) => document.querySelector(e)?.remove());
    const frontmatter = createFrontMatter(meta)
    const endMatter = createEndMatter(meta)
    const articleContent = (document.querySelector('main article'))?.innerHTML
    let mdContent = getTurndownResult(articleContent);
    mdContent = combineFrontAndEnd(mdContent, frontmatter, endMatter);
    mdContent = churnSpecialChars(mdContent);
    mdContent = simplifyCodeblockLang(mdContent);
    mdContent = transformLinks(mdContent);
    mdContent = mdContent?.replace(/```\n\n(Copy)\n/g, "```\n")
      ?.replace(/\[\]\(#.*\)/g, '')
      ?.replace(/^([a-zA-Z0-9./_-]+)\s+`{3}([a-z]+)/gim, '```$2 title="$1"');
    
    let i = 0; // Initialize counter
    mdContent = mdContent.replace(/Youtube\sEmbed\sFallback/g, (match) => {
      const currentReplacement = ytTags2Replace[i];
      i++; // Increment for next time
      return currentReplacement;
    });

    return {
      filename: `${meta.articlePath}.md`,
      text: mdContent
    };
  } catch (error) {
    console.error('Failed to copy JSON:', error);
  }
}

function fetchLearnkubeBlog() {
  console.log('fetchLearnkubeBlog ... ')
  try {
    // Extract Open Graph metadata
    const ogData = parseOgData();

    const meta = {
      lang: 'en-US',
      title: document.querySelector('h1').textContent,
      description: `${ogData['og:description']}`.replace(/"/g, "”"),
      topic: 'kubernetes',
      author: document.querySelector('.black-50.f6.db').textContent.replace(/By\s/g, '') ?? '',
      authorUrl: document.querySelector(`.tc.mb4.db.mw4.mt4.mt5-ns a.link`).getAttribute('href') ?? '',
      datePublished: convertDateFormat(
        document.querySelector('.f7.black-60.tc.ttu.b').textContent ?? ''
      ),
      baseUrl: 'https://learnkube.com',
      articleBasePath: 'learnkube.com',
      articlePath: `${ogData['og:url']}`
        .replace(/(https:\/\/)|(www\.)|(learnkube\.com)/g, '')
        .replace(/\//g, ''),
      articleOriginPath: `${ogData['og:url']}`
        .replace(/(https:\/\/)|(www\.)|(learnkube\.com)/g, '')
        .replace(/\//g, ''),
      logo: 'https://static.learnkube.com/f7e5160d4744cf05c46161170b5c11c9.svg',
      bgRGBA: '102,152,204',
      coverUrl: `${ogData['og:image']?.replace(/\https:\/\/www\./g, 'https://')}`
    }

    const elements2Remove = [
      'h1',
      'p.f7.black-60.tc.ttu.b',
      'hr.pv2.bn',
      '.aspect-ratio.aspect-ratio--6x4',
      'hr.w3.center.b--navy.mv4.mb5-ns',
    ]
    elements2Remove.forEach((e) => document.querySelector(e)?.remove());

    const frontmatter = createFrontMatter(meta)
    const endMatter = createEndMatter(meta)
    const articleContent = document.querySelector('article.lazy-article').innerHTML
    let mdContent = getTurndownResult(articleContent);
    mdContent = combineFrontAndEnd(mdContent, frontmatter, endMatter);
    mdContent = churnSpecialChars(mdContent);
    mdContent = simplifyCodeblockLang(mdContent);
    mdContent = transformLinks(mdContent);
    return {
      filename: `${meta.articlePath}.md`,
      text: mdContent
    };
  } catch (error) {
    console.error('Failed to copy JSON:', error);
  }
}

function fetchKtAcademyBlog() {
  console.log('fetchKtAcademyBlog ... ')
  try {
    // Extract Open Graph metadata
    const ogData = parseOgData();

    const meta = {
      lang: 'en-US',
      title: (document.querySelector('h1>span')?.textContent) ?? ogData['og:title'],
      description: `${ogData['og:description']}`.replace(/"/g, "”"),
      topic: 'kotlin',
      author: document.querySelector('.author-info>.details .article-name>a').textContent ?? '',
      datePublished: '',
      baseUrl: 'https://kt.academy',
      articleBasePath: 'kt.academy',
      articlePath: `${ogData['og:url']}`
        .replace(/https:\/\/kt\.academy\/article\//g, '')
        .replace(/\//g, ''),
      articleOriginPath: `${ogData['og:url']}`
        .replace(/https:\/\/kt\.academy\/article\//g, ''),
      logo: 'https://kt.academy/logo.png',
      bgRGBA: '243,139,49',
      coverUrl: `${ogData['og:image'].replace(/\https:\/\/www\./g, 'https://')}`
    }

    document.querySelectorAll('.article-body > *')[0].remove()
    const elements2Remove = [
      'h1',
      '.Articleimage_imgWrapper__qYfww'
    ]
    elements2Remove.forEach((e) => document.querySelector(e)?.remove());

    const frontmatter = createFrontMatter(meta)
    const endMatter = createEndMatter(meta)
    const articleContent = document.querySelector('.article-body').innerHTML
    let mdContent = getTurndownResult(articleContent);
    mdContent = `${frontmatter}${mdContent.replace(/\(https:\/\/www\./g, '(https://')
      .replace(/(?:^|\n)##\s/g, '\n---\n\n## ') // h2 처리
      .replace(/(?:^|##\s\n\n)/g, '## ') // h2 처리
      .replace(/\nxxxxxxxxxx\n/g, '```kotlin')
      .replace(/\[Open\sin\sPlayground →.*\n/g, '')
      .replace(/\nTarget: JVMRunning on v.*/g, '```\n\n:::')
      .replace(/\-   /g, '- ') // ul처리
      .replace(/    \n\-/g, '-') // ul처리
      .replace(/(?<=[0-9]\.)\s\s/g, ' ')}${endMatter}` // ol처리
      .replace(/    \n(?=[0-9]\.)/g, '') // ol처리
    mdContent = churnSpecialChars(mdContent);
    mdContent = simplifyCodeblockLang(mdContent);
    mdContent = transformLinks(mdContent);

    return {
      filename: `${meta.articlePath}.md`,
      text: mdContent
    }
  } catch (error) {
    console.error('Failed to copy JSON:', error);
  }
}

function fetchKotzillaBlog() {
  console.log('fetchKotzillaBlog ... ')
  try {
    // Extract Open Graph metadata
    const ogData = parseOgData();

    const meta = {
      lang: 'en-US',
      title: (document.querySelector('h1>span')?.textContent) ?? ogData['og:title'],
      description: `${ogData['og:description']}`.replace(/"/g, "”"),
      topic: 'kotlin',
      author: document.querySelector('.blog-post__author>a')?.textContent ?? '',
      datePublished: convertDateFormat(
        document.querySelector('time.blog-post__timestamp')?.getAttribute('datetime') ?? ''
      ),
      baseUrl: 'https://blog.kotzilla.io',
      articleBasePath: 'blog.kotzilla.io',
      articlePath: `${ogData['og:url']}`
        .replace(/https:\/\/blog\.kotzilla\.io\//g, '')
        .replace(/\//g, ''),
      articleOriginPath: `${ogData['og:url']}`
        .replace(/https:\/\/blog\.kotzilla\.io\//g, ''),
      logo: 'https://blog.kotzilla.io/hubfs/favicon.png',
      bgRGBA: '238,181,80',
      coverUrl: `${ogData['og:image'].replace(/\https:\/\/www\./g, 'https://')}`
    }

    ElRemoveAll('.hs_cos_wrapper.hs_cos_wrapper_widget.hs_cos_wrapper_type_module')

    const frontmatter = createFrontMatter(meta)
    const endMatter = createEndMatter(meta)
    const articleContent = document.querySelector('#hs_cos_wrapper_post_body').innerHTML
    let mdContent = getTurndownResult(articleContent);
    mdContent = `${frontmatter}${mdContent.replace(/\(https:\/\/www\./g, '(https://')
      .replace(/(?:^|\n)##\s/g, '\n---\n\n## ') // h2 처리
      .replace(/(?:^|##\s\n\n)/g, '## ') // h2 처리
      .replace(/\nxxxxxxxxxx\n/g, '```kotlin')
      .replace(/\-   /g, '- ') // ul처리
      .replace(/    \n\-/g, '-') // ul처리
      .replace(/(?<=[0-9]\.)\s\s/g, ' ')}${endMatter}` // ol처리
      .replace(/    \n(?=[0-9]\.)/g, '') // ol처리
    mdContent = churnSpecialChars(mdContent);
    mdContent = simplifyCodeblockLang(mdContent);
    mdContent = transformLinks(mdContent);

    return {
      filename: `${meta.articlePath}.md`,
      text: mdContent
    }
  } catch (error) {
    console.error('Failed to copy JSON:', error);
  }
}

function fetchOutcomeSchoolBlog() {
  console.log('fetchOutcomeSchoolBlog ... ')
  try {
    // Extract Open Graph metadata
    const ogData = parseOgData();

    const meta = {
      lang: 'en-US',
      title: (document.querySelector('h1')?.textContent) ?? ogData['og:title'],
      description: `${ogData['og:description']}`.replace(/"/g, "”"),
      topic: '',
      author: document.querySelector('dd.text-gray-900')?.textContent ?? '',
      datePublished: convertDateFormat(
        document.querySelector('dd > time')?.getAttribute('datetime') ?? ''
      ),
      baseUrl: 'https://outcomeschool.com',
      articleBasePath: 'outcomeschool.com',
      articlePath: `${ogData['og:url']}`
        .replace(/(https:\/\/)|(www\.)|(outcomeschool\.com\/)|(blog\/)|/g, '')
        .replace(/\//g, ''),
      // articleOriginPath: `${ogData['og:url']}`
      //                 .replace(/(https:\/\/)|(www\.)|(outcomeschool\.com\/)|(blog\/)|/g, '')
      //                 .replace(/https:\/\/outcomeschool\.com\//g, ''),
      logo: 'https://outcomeschool.com/static/favicons/apple-touch-icon.png',
      bgRGBA: '78,70,220',
      coverUrl: `${ogData['og:image'].replace(/\https:\/\/www\./g, 'https://')}`
    }

    ElRemoveAll('.prose>span')

    const frontmatter = createFrontMatter(meta)
    const endMatter = createEndMatter(meta)
    const articleContent = document.querySelector('.prose').innerHTML
    let mdContent = getTurndownResult(articleContent);
    mdContent = `${frontmatter}${mdContent.replace(/\(https:\/\/www\./g, '(https://')
      .replace(/(?:^|\n)##\s/g, '\n---\n\n## ') // h2 처리
      .replace(/(?:^|##\s\n\n)/g, '## ') // h2 처리
      .replace(/\nxxxxxxxxxx\n/g, '```kotlin')
      .replace(/\-   /g, '- ') // ul처리
      .replace(/    \n\-/g, '-') // ul처리
      .replace(/(?<=[0-9]\.)\s\s/g, ' ')}${endMatter}` // ol처리
      .replace(/    \n(?=[0-9]\.)/g, '') // ol처리
    mdContent = churnSpecialChars(mdContent);
    mdContent = simplifyCodeblockLang(mdContent);
    mdContent = transformLinks(mdContent);

    return {
      filename: `${meta.articlePath}.md`,
      text: mdContent
    }
  } catch (error) {
    console.error('Failed to copy JSON:', error);
  }
}

function fetchLogRocketBlog(path = '') {
  console.log(`fetchLogRocketBlog ... path: ${path}`)
  try {
    // Extract Open Graph metadata
    const ogData = parseOgData();

    const topics = [...document.querySelectorAll('#post-tags>li>a')]?.map((e) => e?.textContent?.replace(/\#/g, ''))

    const meta = {
      lang: 'en-US',
      title: (`${ogData['og:title']}`?.replace(/ - LogRocket Blog/g, '')) ?? (document.querySelector('title')?.textContent)?.trim().replace(/"/g, "”"),
      description: `${ogData['og:description']}`.replace(/"/g, "”"),
      topic: topics[0] ?? '',
      author: document.querySelector('#post-author-name')?.textContent ?? '',
      authorUrl: `${document.querySelector('#post-author-name')?.getAttribute('href') ?? ''}`,
      datePublished: convertDateFormat(
        document.querySelector('#post-date')?.textContent.split(' ⋅ ')[0]
      ),
      baseUrl: 'https://blog.logrocket.com',
      articleBasePath: 'blog.logrocket.com',
      articlePath: path.replace(/https:\/\/blog\.logrocket\.com\//g, '')
        .replace(/\//g, ''),
      logo: '/assets/image/blog.logrocket.com/favicon.png',
      bgRGBA: '112,76,182',
      coverUrl: `${ogData['og:image'].replace(/\https:\/\/www\./g, 'https://')}`
    }

    ElRemoveAll('.article-post, .code-block, .blog-plug.inline-plug.react-plug, #replay-signup');
    [...document.querySelectorAll('pre')].forEach((e) => {
      console.log(e.innerHTML)
      let currentHtml = e.innerHTML;
      let language;
      if (e.classList.contains('language-typescript') || e.classList.contains('typescript')) language = 'typescript';
      else if (e.classList.contains('sql')) language = 'sql';
      else if (e.classList.contains('shell')) language = 'shell';
      else language = 'javascript';
      let className = (language === '') ? language : `language-${language}`;
      e.innerHTML = `<code class="${className}">${currentHtml}</code>`
    })

    const codepenWrapper = [...document.querySelectorAll('p > iframe, .cp_embed_wrapper > iframe')]
    const cpTags2Replace = codepenWrapper.map((e) => {
      const [usernameFound, idFound] = e.getAttribute('src')
        ?.replace(/(https:\/\/)|(codepen\.io\/)/g, "")
        ?.replace(/\?.*/g, "").split("/embed/")
      // const titleFound = e?.contentWindow?.document?.querySelector('head>title') || "N/A"
      const titleFound = e.getAttribute("title") || "N/A" // SecurityError: Failed to read a named property 'document' from 'Window': Blocked a frame with 
      return `<CodePen
  user="${usernameFound}"
  slug-hash="${idFound}"
  title="${titleFound}"
  :default-tab="['css','result']"
  :theme="$isDarkmode ? 'dark': 'light'"/>`
    })

    for (let e of codepenWrapper) {
      let currentHtml = e.innerHTML;
      console.log(currentHtml)
      const pEl = document.createElement('p');
      pEl.textContent = `CodePen Embed Fallback`;
      e.replaceWith(pEl)
    }

    const frontmatter = createFrontMatter(meta)
    const endMatter = createEndMatter(meta)
    const articleContent = document.querySelector('.lr-content').innerHTML
    let mdContent = getTurndownResult(articleContent);
    mdContent = combineFrontAndEnd(mdContent, frontmatter, endMatter)
    mdContent = churnSpecialChars(mdContent);
    mdContent = simplifyCodeblockLang(mdContent);
    mdContent = transformLinks(mdContent);

    let i = 0;
    mdContent = mdContent.replace(/CodePen\sEmbed\sFallback/g, (match) => {
      const currentReplacement = cpTags2Replace[i];
      i++; // Increment for next time
      return currentReplacement;
    });

    return {
      filename: `${meta.articlePath}.md`,
      text: mdContent
    };
  } catch (error) {
    console.error('Failed to copy JSON:', error);
  }
}


function fetchRealPythonBlog(path = '') {
  console.log(`fetchRealPythonBlog ... path: ${path}`)
  try {
    // Extract Open Graph metadata
    const ogData = parseOgData();

    const topics = [...document.querySelectorAll('.d-inline.d-md-block a.badge')]?.map((e) => e?.textContent?.replace(/\#/g, ''))

    const meta = {
      lang: 'en-US',
      title: (`${ogData['og:title']}`?.replace(/ – Real Python/g, '') ?? (document.querySelector('h1')?.textContent)?.trim()).replace(/"/g, "”"),
      description: `${ogData['og:description']}`.replace(/"/g, "”"),
      topic: 'python', // topics[0] ?? '',
      author: document.querySelector('.mb-0 a[href="#author"]')?.textContent ?? '',
      authorUrl: `https://realpython.com${document.querySelector('.card-link')?.getAttribute('href') ?? ''}`,
      datePublished: convertDateFormat(
        JSON.parse(document.querySelector('script[type="application/ld+json"]')?.textContent)?.datePublished
      ),
      baseUrl: 'https://realpython.com',
      articleBasePath: 'realpython.com',
      articlePath: path.replace(/https:\/\/realpython\.com/g, '')
        .replace(/\//g, ''),
      logo: 'https://realpython.com/static/favicon.68cbf4197b0c.png',
      bgRGBA: '31,52,74',
      coverUrl: `${ogData['og:image'].replace(/\https:\/\/www\./g, 'https://')}`
    }

    ElRemoveAll('#toc, .sidebar-module-inset.p-0, .rounded.border.border-light');

    const frontmatter = createFrontMatter(meta)
    const endMatter = createEndMatter(meta)
    const articleContent = document.querySelector('.article-body').innerHTML
    let mdContent = getTurndownResult(articleContent);
    mdContent = combineFrontAndEnd(mdContent, frontmatter, endMatter)
    mdContent = mdContent.replace(/\n\[Remove ads\]\(\/account\/join\/\)\n/g, '') // 광고 링크 처리
      .replace(/Python\n\n\`/g, '```py\n')
      .replace(/Shell\n\n\`/g, '```sh\n')
      .replace(/\` \n\n/g, '\n```\n\n')
      .replace(/\[\]\(#.*"Permanent link"\)/g, '')
    mdContent = churnSpecialChars(mdContent);
    mdContent = simplifyCodeblockLang(mdContent);
    mdContent = transformLinks(mdContent);

    const folderSlugs = [
      'defining-your-own-python-function'
      , 'factory-method-python'
      , 'iterate-through-dictionary-python', 'introduction-to-python-generators'
      , 'java-vs-python'
      , 'oop-in-python-vs-java'
      , 'primer-on-python-decorators'
      , 'python-assignment-operator'
      , 'python-boolean', 'python-built-in-functions', 'python-built-in-exceptions'
      , 'python-class-constructor', 'python-click'
      , 'python-data-classes', 'python-data-types', 'python-datetime', 'python-descriptors', 'python-exceptions'
      , 'python-dict-attribute', 'python-dicts', 'python-double-underscore', 
      , 'python-enum'
      , 'python-for-loop', 'python-function-names', 'python-functional-programming'
      , 'python-getter-setter'
      , 'python-import', 'python-iterators-iterables'
      , 'python-lambda', 'python-list'
      , 'python-magic-methods', 'python-math-module', 'python-modules-packages', 'python-mutable-vs-immutable-types'
      , 'python-multiple-constructors', 'python-namedtuple'
      , 'python-variables'
      , 'python-pass', 'python-property', 'python-print'
      , 'python-repl', 'python-return-statement' 
      , 'python-sets', 'python-strings'
      , 'python-testing', 'python-tuple'
      , 'python-unittest'
      , 'python-vs-cpp'
      , 'python-with-statement',
      , 'python310-new-features'
      , 'pypi-publish-python-package'
      , 'syntactic-sugar-python'
      , 'what-does-isinstance-do-in-python', 'what-is-pip'
      , 'working-with-files-in-python',
    ]
    mdContent = mdContent.replace(/\[([^\]]+)\]\(https:\/\/realpython\.com\/([^/#)]+)\/(#?[^)]*)\)/gm, (match, title, slug, id) => {
  
      // 1. Determine the suffix (.md or /README.md)
      const suffix = folderSlugs.includes(slug) ? '/README.md' : '.md';
      
      // 2. Determine the domain (Line 2 in your example kept https://, others became relative /)
      // We'll use relative / for all unless it's the specific "thinking-recursively" case from your example
      const domain = (slug === 'bonus') ? 'https://realpython.com/' : '/realpython.com/';

      // 3. Return the transformed string
      return `[**${title}**](${domain}${slug}${suffix}${!!id ? `#${id}` : ""})`;
    });

    return {
      filename: `${meta.articlePath}.md`,
      text: mdContent
    };
  } catch (error) {
    console.error('Failed to copy JSON:', error);
  }
}


function fetchDockerBlog(path = '') {
  console.log(`fetchDockerBlog ... path: ${path}`)
  try {
    // Extract Open Graph metadata
    const ogData = parseOgData();

    const topics = [...document.querySelectorAll('.d-inline.d-md-block a.badge')]?.map((e) => e?.textContent?.replace(/\#/g, ''))

    const meta = {
      lang: 'en-US',
      title: (`${ogData['og:title']}`?.replace(/(\s\|\sDocker.*)/g, '') ??
        (document.querySelector('h1')?.textContent)?.trim()).replace(/"/g, "”"),
      description: `${ogData['og:description']}`.replace(/"/g, "”"),
      topic: 'docker', // topics[0] ?? '',
      author: document.querySelector('.contributor-names>a.contributor, .wp-block-ponyo-blog-author .author .info a')?.textContent?.trim() ?? '',
      authorUrl: (document.querySelector('.contributor-names>a.contributor, .wp-block-ponyo-blog-author .author .info a')?.getAttribute('href') ?? '')
        ?.replace(/\https:\/\/www\./g, 'https://'),
      datePublished: convertDateFormat(
        document.querySelector('meta[property^="article:published_time"]')?.getAttribute("content") ?? ''
      ),
      baseUrl: 'https://docker.com/blog',
      articleBasePath: 'docker.com',
      articlePath: path.replace(/(https:\/\/)|(www\.)|(docker\.com)/g, '')
        .replace(/\/blog/g, '')
        .replace(/\//g, ''),
      logo: 'https://docker.com/app/uploads/2024/02/cropped-docker-logo-favicon-192x192.png',
      bgRGBA: '29,99,237',
      coverUrl: `${ogData['og:image'].replace(/\https:\/\/www\./g, 'https://')}`
    }

    const pretags = [...document.querySelectorAll('pre')]
    pretags?.forEach((e) => {
      console.log(e.innerHTML)
      let currentHtml = e.innerHTML;
      e.innerHTML = `<code class="language-shell">${currentHtml}</code>`
    })

    // ElRemoveAll('#toc, .sidebar-module-inset.p-0, .rounded.border.border-light');

    const frontmatter = createFrontMatter(meta)
    const endMatter = createEndMatter(meta)
    const articleContent = document.querySelector('.entry-content.wp-block-post-content').innerHTML
    let mdContent = getTurndownResult(articleContent);
    mdContent = combineFrontAndEnd(mdContent, frontmatter, endMatter)
    mdContent = mdContent.replace(/\n\[Remove ads\]\(\/account\/join\/\)\n/g, '') // 광고 링크 처리
      .replace(/\` \n\n/g, '\n```\n\n')
      .replace(/\[\]\(#.*"Permanent link"\)/g, '')
    mdContent = churnSpecialChars(mdContent);
    mdContent = simplifyCodeblockLang(mdContent);
    mdContent = transformLinks(mdContent);

    return {
      filename: `${meta.articlePath}.md`,
      text: mdContent
    };
  } catch (error) {
    console.error('Failed to copy JSON:', error);
  }
}


function fetchEventDrivenBlog(path = '') {
  console.log(`fetchEventDrivenBlog ... path: ${path}`)
  try {
    // Extract Open Graph metadata
    const ogData = parseOgData();

    const topics = [...document.querySelectorAll('.d-inline.d-md-block a.badge')]?.map((e) => e?.textContent?.replace(/\#/g, ''))

    const meta = {
      lang: 'en-US',
      title: (`${ogData['og:title']}`?.replace(/ - Event-Driven.io/g, '') ?? (document.querySelector('h1')?.textContent)?.trim()).replace(/"/g, "”"),
      description: `${ogData['og:description']}`.replace(/"/g, "”"),
      topic: '', // topics[0] ?? '',
      author: `Oskar Dudycz`,
      authorUrl: `https://event-driven.io/en/about/`,
      datePublished: convertDateFormat(
        [...document.querySelectorAll('main>article>header>p>span')][0]?.textContent
      ),
      baseUrl: 'https://event-driven.io/en',
      articleBasePath: 'event-driven.io',
      articlePath: path.replace(/(https:\/\/)|(event-driven\.io)|(en\/)/g, '')
        .replace(/\//g, ''),
      logo: '/assets/image/event-driven.io/favicon.jfif',
      bgRGBA: '255,255,0',
      coverUrl: `${ogData['og:image'].replace(/\https:\/\/www\./g, 'https://')}`
    }

    ElRemoveAll('#toc, .sidebar-module-inset.p-0, .rounded.border.border-light');

    const frontmatter = createFrontMatter(meta)
    const endMatter = createEndMatter(meta)
    const articleContent = document.querySelector('.bodytext').innerHTML
    let mdContent = getTurndownResult(articleContent);
    mdContent = combineFrontAndEnd(mdContent, frontmatter, endMatter)
    mdContent = mdContent.replace(/\n\[Remove ads\]\(\/account\/join\/\)\n/g, '') // 광고 링크 처리
      .replace(/\` \n\n/g, '\n```\n\n')
      .replace(/\[\]\(#.*\)/g, '')
    mdContent = churnSpecialChars(mdContent);
    mdContent = simplifyCodeblockLang(mdContent);
    mdContent = transformLinks(mdContent);

    return {
      filename: `${meta.articlePath}.md`,
      text: mdContent
    };
  } catch (error) {
    console.error('Failed to copy JSON:', error);
  }
}

function fetchGosolveBlog(path = "") {
  console.log(`fetchGosolveBlog ... path: ${path}`)
  try {
    // Extract Open Graph metadata
    const ogData = parseOgData();

    const meta = {
      lang: 'en-US',
      title: (`${ogData['og:title']}`?.replace(/ - GoSolve/g, '') ?? (document.querySelector('h1')?.textContent)?.trim()).replace(/"/g, "”"),
      description: `${ogData['og:description']}`.replace(/"/g, "”"),
      topic: 'go', // topics[0] ?? '',
      author: document.querySelector('meta[name^="author"]')?.getAttribute("content") ?? '',
      authorUrl: document.querySelector('meta[property^="article:author"]')?.getAttribute("content") ?? '',
      datePublished: convertDateFormat(
        document.querySelector('meta[property^="article:published_time"]')?.getAttribute("content") ?? ''
      ),
      baseUrl: 'https://gosolve.io',
      articleBasePath: 'gosolve.io',
      articlePath: path.replace(/(https:\/\/)|(gosolve\.io)/g, '')
        .replace(/\//g, ''),
      logo: 'https://gosolve.io/wp-content/uploads/2022/03/cropped-ikona1-192x192.png',
      bgRGBA: '56,119,242',
      coverUrl: `${ogData['og:image'].replace(/\https:\/\/www\./g, 'https://')}`
    }


    const pres = [...document.querySelectorAll('pre')]
    pres.forEach((e) => {
      console.log(e.innerHTML)
      let currentHtml = e.innerHTML;
      let language = 'go';
      // if (e.classList.contains('language-typescript') || e.classList.contains('typescript')) language = 'typescript';
      // else if (e.classList.contains('sql')) language = 'sql';
      // else if (e.classList.contains('shell')) language = 'shell';
      // else language = 'javascript';
      let className = (language === '') ? language : `language-${language}`;
      e.innerHTML = `<code class="${className}">${currentHtml}</code>`
    })
    const frontmatter = createFrontMatter(meta)
    const endMatter = createEndMatter(meta)
    const articleContent = document.querySelector('section.single-blog__content > .container > .row > .col-xl-8.mx-auto').innerHTML
    let mdContent = getTurndownResult(articleContent);
    mdContent = combineFrontAndEnd(mdContent, frontmatter, endMatter)
    mdContent = mdContent.replace(/\` \n\n/g, '\n```\n\n')
      .replace(/\[\]\(#.*\)/g, '')
    mdContent = churnSpecialChars(mdContent);
    mdContent = simplifyCodeblockLang(mdContent);
    mdContent = transformLinks(mdContent);

    return {
      filename: `${meta.articlePath}.md`,
      text: mdContent
    };
  } catch (error) {
    console.error('Failed to copy JSON:', error);
  }
}

function fetchCssIrlBlog(path="") {
  console.log(`fetchCssIrlBlog ... path: ${path}`)
  const description = document.querySelectorAll('.o-richtext>p')[0]?.textContent
  try {
    // Extract Open Graph metadata
    const ogData = parseOgData();

    const meta = {
      lang: 'en-GB',
      title: (`${ogData['og:title']}` ?? (document.querySelector('h1')?.textContent)?.trim())?.replace(/CSS\s{\sIn\sReal\sLife\s}\s\|\s/g, '')?.replace(/"/g, "”"),
      description: `${ogData['og:description']}`.replace(/"/g, "”") ?? description,
      topic: [...document.querySelectorAll('ul.c-tag-links>li>a')][0]?.textContent ?? 'css', // topics[0] ?? '',
      author: 'Michelle Barker',
      authorUrl: 'https://css-irl.info/about/',
      datePublished: convertDateFormat(
        document.querySelector('time')?.getAttribute("datetime") ?? '' 
      ),
      baseUrl: 'https://css-irl.info',
      articleBasePath: 'css-irl.info',
      articlePath: path.replace(/(https:\/\/)|(css-irl\.info)/g, '')
        .replace(/\//g, ''),
      logo: 'https://css-irl.info/favicon/apple-touch-icon.png',
      bgRGBA: '255,20,147',
      coverUrl: `${ogData['og:image'].replace(/\https:\/\/www\./g, 'https://')}`
    }

    const codepenWrapper = [...document.querySelectorAll('.cp_embed_wrapper > iframe')]
    const tags2Replace = codepenWrapper.map((e) => {
      const [usernameFound, idFound] = e.getAttribute('src')?.replace(/\/\/codepen\.io\//g, "")
        ?.replace(/\?.*/g, "")
        ?.replace(/https:/g, "")
        ?.split("/embed/")
      // const titleFound = e?.contentWindow?.document?.querySelector('head>title') || "N/A"
      const titleFound = "N/A" // SecurityError: Failed to read a named property 'document' from 'Window': Blocked a frame with 
      return `<CodePen
  user="${usernameFound}"
  slug-hash="${idFound}"
  title="${titleFound}"
  :default-tab="['css','result']"
  :theme="$isDarkmode ? 'dark': 'light'"/>`
    })

    for (let e of codepenWrapper) {
      let currentHtml = e.innerHTML;
      console.log(currentHtml)
      const pEl = document.createElement('p');
      pEl.textContent = `CodePen Embed Fallback`;
      e.replaceWith(pEl)
    }

    const frontmatter = createFrontMatter(meta)
    const endMatter = createEndMatter(meta)
    const articleContent = document.querySelector('.o-richtext').innerHTML
    let mdContent = getTurndownResult(articleContent);
    mdContent = combineFrontAndEnd(mdContent, frontmatter, endMatter)
    mdContent = mdContent.replace(/\` \n\n/g, '\n```\n\n')
      .replace(/\[\]\(#.*\)/g, '')
      .replace(/\]\(\/(?=[^)]+\))/g, '](https://css-irl.info/') // 이미지 경로
    mdContent = churnSpecialChars(mdContent);
    mdContent = simplifyCodeblockLang(mdContent);
    mdContent = transformLinks(mdContent);

    let i = 0; // Initialize counter
    mdContent = mdContent.replace(/CodePen\sEmbed\sFallback/g, (match) => {
      const currentReplacement = tags2Replace[i];
      i++; // Increment for next time
      return currentReplacement;
    });

    return {
      filename: `${meta.articlePath}.md`,
      text: mdContent
    };
  } catch (error) {
    console.error('Failed to copy JSON:', error);
  }
}

function fetchWebDevRedFoxBlog(path = "") {
  console.log(`fetchWebDevRedFoxBlog ... path: ${path}`)
  try {
    // Extract Open Graph metadata
    const ogData = parseOgData();

    const meta = {
      lang: 'en-US',
      title: (`${ogData['og:title']}` ?? (document.querySelector('h1.article-title')?.textContent)?.trim())?.replace(/"/g, "”"),
      description: `${ogData['og:description']}`.replace(/"/g, "”") || "",
      topic: [...document.querySelectorAll('ul.tags>li.tag')][0]?.textContent?.toLowerCase() ?? 'css', // topics[0] ?? '',
      author: 'Gustavo Marquez Lainez',
      authorUrl: 'https://gustavom.codeberg.page/#about',
      datePublished: convertDateFormat(
        document.querySelector('.article-card-content > time')?.getAttribute("datetime") ?? '' 
      ),
      baseUrl: 'https://webdevredfox.org',
      articleBasePath: 'webdevredfox.org',
      articlePath: path.replace(/(https:\/\/)|(webdevredfox\.org)/g, '')
        .replace(/\/post/g, '')
        .replace(/\//g, ''),
      articleOriginPath: `${ogData['og:url']}`
        .replace(/(https:\/\/)|(www\.)|(webdevredfox\.org\/)/g, ''),
      logo: 'https://svelte.dev/favicon.png',
      bgRGBA: '2255,127,80',
      coverUrl: `${ogData['og:image'].replace(/\https:\/\/www\./g, 'https://')}`
    }

    const frontmatter = createFrontMatter(meta)
    const endMatter = createEndMatter(meta)
    const articleContent = document.querySelector('.article').innerHTML
    let mdContent = getTurndownResult(articleContent);
    mdContent = combineFrontAndEnd(mdContent, frontmatter, endMatter)
    mdContent = mdContent.replace(/\` \n\n/g, '\n```\n\n')
      .replace(/\[\]\(#.*\)/g, '')
      .replace(/\]\(\/(?=[^)]+\))/g, '](https://webdevredfox.org/') // 이미지 경로
    mdContent = churnSpecialChars(mdContent);
    mdContent = simplifyCodeblockLang(mdContent);
    mdContent = transformLinks(mdContent);

    /* let i = 0; // Initialize counter
    mdContent = mdContent.replace(/CodePen\sEmbed\sFallback/g, (match) => {
      const currentReplacement = tags2Replace[i];
      i++; // Increment for next time
      return currentReplacement;
    }); */

    return {
      filename: `${meta.articlePath}.md`,
      text: mdContent
    };


  } catch (error) {
    console.error('Failed to copy JSON:', error);
  }
}

function fetchZeroHeightBlog(path = "") {
  console.log(`fetchZeroHeightBlog ... path: ${path}`)
  try {
    // Extract Open Graph metadata
    const ogData = parseOgData();
    const nextMeta = JSON.parse(document.querySelector('script[type="application/json"]#__NEXT_DATA__')?.textContent)

    const meta = {
      lang: 'en-GB',
      title: (`${ogData['og:title']}`?.replace(/\s-\szeroheight/g, '') ?? (document.querySelector('h1')?.textContent)?.trim()).replace(/"/g, "”"),
      description: `${ogData['og:description']}`.replace(/"/g, "”"),
      topic: 'css', // topics[0] ?? '',
      author: document.querySelector('.font-inter.text-18px.font-medium')?.textContent ?? '',
      // authorUrl: document.querySelector('meta[property^="article:author"]')?.getAttribute("content") ?? '',
      datePublished: convertDateFormat(
        nextMeta?.props?.pageProps?.page?.post_date ?? ''
      ),
      baseUrl: 'https://zeroheight.com',
      articleBasePath: 'zeroheight.com',
      articlePath: path.replace(/(https:\/\/)|(zeroheight\.com)/g, '')
        .replace(/\/blog/g, '')
        .replace(/\//g, ''),
      logo: 'https://zeroheight.com/favicon.ico',
      bgRGBA: '255,72,82',
      coverUrl: `${ogData['og:image'].replace(/\https:\/\/www\./g, 'https://')}`
    }

    const pres = [...document.querySelectorAll('pre')]
    pres.forEach((e) => {
      console.log(e.innerHTML)
      let currentHtml = e.innerHTML;
      let language = 'go';
      // if (e.classList.contains('language-typescript') || e.classList.contains('typescript')) language = 'typescript';
      // else if (e.classList.contains('sql')) language = 'sql';
      // else if (e.classList.contains('shell')) language = 'shell';
      // else language = 'javascript';
      let className = (language === '') ? language : `language-${language}`;
      e.innerHTML = `<code class="${className}">${currentHtml}</code>`
    })
    const frontmatter = createFrontMatter(meta)
    const endMatter = createEndMatter(meta)
    const articleContent = document.querySelectorAll('section')[1]?.querySelector('.container .blocks-container').innerHTML
    let mdContent = getTurndownResult(articleContent);
    mdContent = combineFrontAndEnd(mdContent, frontmatter, endMatter)
    mdContent = mdContent.replace(/\` \n\n/g, '\n```\n\n')
      .replace(/\[\]\(#.*\)/g, '')
    mdContent = churnSpecialChars(mdContent);
    mdContent = simplifyCodeblockLang(mdContent);
    mdContent = transformLinks(mdContent);

    return {
      filename: `${meta.articlePath}.md`,
      text: mdContent
    };
  } catch (error) {
    console.error('Failed to copy JSON:', error);
  }
}

function fetchBramusBlog(path = "") {
  console.log(`fetchBramusBlog ... path: ${path}`)
  const topics = [...document.querySelectorAll('.tags-links > a')]?.map((e) => e?.textContent?.toLowerCase())

  try {
    // Extract Open Graph metadata
    const ogData = parseOgData();

    const meta = {
      lang: 'en-US',
      title: (`${ogData['og:title']}` ?? (document.querySelector('h1')?.textContent)?.trim()).replace(/"/g, "”"),
      description: `${ogData['og:description']}`.replace(/"/g, "”"),
      topic: topics[0] || 'css',
      author: document.querySelector('.author.vcard > a')?.textContent || '',
      authorUrl: document.querySelector('.author.vcard > a')?.getAttribute("href")?.replace(/https\:\/\/www\./g, "https://") ?? '',
      datePublished: convertDateFormat(
        document.querySelector('time.entry-date.published')?.getAttribute("datetime") ?? ''
      ),
      baseUrl: 'https://bram.us',
      articleBasePath: 'bram.us',
      articlePath: `${ogData['og:url']}`
        .replace(/(https:\/\/)|(www\.)|(bram\.us\/)|(\d{4}\/\d{2}\/\d{2}\/)/g, '')
        .replace(/\//g, ''),
      articleOriginPath: `${ogData['og:url']}`
        .replace(/(https:\/\/)|(www\.)|(bram\.us\/)/g, ''),
      logo: 'https://bramu.us/favicon.ico',
      bgRGBA: '17,17,17',
      coverUrl: `${ogData['og:image'].replace(/https:\/\/www\./g, 'https://')}`
    }

    const ytWrapper = [...document.querySelectorAll('figure > iframe')]
    const ytTags2Replace = ytWrapper.map((e) => {
      const idFound = e.getAttribute("src")
        ?.replace(/(https:\/\/)|(www\.)|(youtube\.com\/embed\/)|(\?si=.*)/g, "")
      return `<VidStack src="youtube/${idFound}" />`
    })
    for (let e of ytWrapper) {
      let currentHtml = e.innerHTML;
      console.log(currentHtml)
      const pEl = document.createElement('p');
      pEl.textContent = `Youtube Embed Fallback`;
      e.replaceWith(pEl)
    }

    const codepenWrapper = [...document.querySelectorAll('p > iframe, .cp_embed_wrapper > iframe')]
    const cpTags2Replace = codepenWrapper.map((e) => {
      const [usernameFound, idFound] = e.getAttribute('src')
        ?.replace(/(https:\/\/)|(codepen\.io\/)/g, "")
        ?.replace(/\?.*/g, "").split("/embed/")
      // const titleFound = e?.contentWindow?.document?.querySelector('head>title') || "N/A"
      const titleFound = e.getAttribute("title") || "N/A" // SecurityError: Failed to read a named property 'document' from 'Window': Blocked a frame with 
      return `<CodePen
  user="${usernameFound}"
  slug-hash="${idFound}"
  title="${titleFound}"
  :default-tab="['css','result']"
  :theme="$isDarkmode ? 'dark': 'light'"/>`
    })

    for (let e of codepenWrapper) {
      let currentHtml = e.innerHTML;
      console.log(currentHtml)
      const pEl = document.createElement('p');
      pEl.textContent = `CodePen Embed Fallback`;
      e.replaceWith(pEl)
    }

    const frontmatter = createFrontMatter(meta)
    const endMatter = createEndMatter(meta)
    const articleContent = document.querySelector('.entry-content').innerHTML
    let mdContent = getTurndownResult(articleContent);
    mdContent = combineFrontAndEnd(mdContent, frontmatter, endMatter)
    mdContent = mdContent.replace(/\` \n\n/g, '\n```\n\n')
      .replace(/\[\]\(#.*\)/g, '')
    mdContent = churnSpecialChars(mdContent);
    mdContent = simplifyCodeblockLang(mdContent);
    mdContent = transformLinks(mdContent);

    let i = 0; // Initialize counter
    mdContent = mdContent.replace(/Youtube\sEmbed\sFallback/g, (match) => {
      const currentReplacement = ytTags2Replace[i];
      i++; // Increment for next time
      return currentReplacement;
    });
    i = 0;
    mdContent = mdContent.replace(/CodePen\sEmbed\sFallback/g, (match) => {
      const currentReplacement = cpTags2Replace[i];
      i++; // Increment for next time
      return currentReplacement;
    });

    return {
      filename: `${meta.articlePath}.md`,
      text: mdContent
    };
  } catch (error) {
    console.error('Failed to copy JSON:', error);
  }
}

function fetchUnaBlog(path = "") {
  console.log(`fetchUnaBlog ... path: ${path}`)
  const topics = [...document.querySelectorAll('.tags-links > a')]?.map((e) => e?.textContent?.toLowerCase())

  try {
    // Extract Open Graph metadata
    const ogData = parseOgData();

    const meta = {
      lang: 'en-US',
      title: (`${ogData['og:title'].replace(/una\.im\s\|\s/g, "")}` ?? (document.querySelector('h1')?.textContent)?.trim()).replace(/"/g, "”"),
      description: `${ogData['og:description']}`.replace(/"/g, "”"),
      topic: topics[0] || 'css',
      author: "Una Kravets",
      authorUrl: "https://una.im/about",
      datePublished: convertDateFormat(
        document.querySelector('.date time')?.getAttribute("datetime") ?? ''
      ),
      baseUrl: 'https://una.im',
      articleBasePath: 'una.im',
      articlePath: `${ogData['og:url']}`
        .replace(/(https:\/\/)|(www\.)|(una\.im\/)/g, '')
        .replace(/\//g, ''),
      articleOriginPath: `${ogData['og:url']}`
        .replace(/(https:\/\/)|(www\.)|(una\.im\/)/g, ''),
      logo: 'https://una.im/favicon.svg',
      bgRGBA: '156,90,242',
      coverUrl: `${ogData['og:image'].replace(/https:\/\/www\./g, 'https://')}`
    }

    const ytWrapper = [...document.querySelectorAll('figure > iframe')]
    const ytTags2Replace = ytWrapper.map((e) => {
      const idFound = e.getAttribute("src")
        ?.replace(/(https:\/\/)|(www\.)|(youtube\.com\/embed\/)|(\?si=.*)/g, "")
      return `<VidStack src="youtube/${idFound}" />`
    })
    for (let e of ytWrapper) {
      let currentHtml = e.innerHTML;
      console.log(currentHtml)
      const pEl = document.createElement('p');
      pEl.textContent = `Youtube Embed Fallback`;
      e.replaceWith(pEl)
    }

    const codepenWrapper = [...document.querySelectorAll('p > iframe, .cp_embed_wrapper > iframe')]
    const cpTags2Replace = codepenWrapper.map((e) => {
      const [usernameFound, idFound] = e.getAttribute('src')
        ?.replace(/(https:\/\/)|(codepen\.io\/)/g, "")
        ?.replace(/\?.*/g, "").split("/embed/")
      // const titleFound = e?.contentWindow?.document?.querySelector('head>title') || "N/A"
      const titleFound = e.getAttribute("title") || "N/A" // SecurityError: Failed to read a named property 'document' from 'Window': Blocked a frame with 
      return `<CodePen
  user="${usernameFound}"
  slug-hash="${idFound}"
  title="${titleFound}"
  :default-tab="['css','result']"
  :theme="$isDarkmode ? 'dark': 'light'"/>`
    })

    for (let e of codepenWrapper) {
      let currentHtml = e.innerHTML;
      console.log(currentHtml)
      const pEl = document.createElement('p');
      pEl.textContent = `CodePen Embed Fallback`;
      e.replaceWith(pEl)
    }

    const frontmatter = createFrontMatter(meta)
    const endMatter = createEndMatter(meta)
    const articleContent = document.querySelector('main > article').innerHTML
    let mdContent = getTurndownResult(articleContent);
    mdContent = combineFrontAndEnd(mdContent, frontmatter, endMatter)
    mdContent = mdContent.replace(/\` \n\n/g, '\n```\n\n')
      .replace(/\[\]\(#.*\)/g, '')
    mdContent = churnSpecialChars(mdContent);
    mdContent = simplifyCodeblockLang(mdContent);
    mdContent = transformLinks(mdContent);

    let i = 0; // Initialize counter
    mdContent = mdContent.replace(/Youtube\sEmbed\sFallback/g, (match) => {
      const currentReplacement = ytTags2Replace[i];
      i++; // Increment for next time
      return currentReplacement;
    });
    i = 0;
    mdContent = mdContent.replace(/CodePen\sEmbed\sFallback/g, (match) => {
      const currentReplacement = cpTags2Replace[i];
      i++; // Increment for next time
      return currentReplacement;
    });

    return {
      filename: `${meta.articlePath}.md`,
      text: mdContent
    };
  } catch (error) {
    console.error('Failed to copy JSON:', error);
  }
}

function fetchJoshWComeauBlog(path = "") {
  console.log(`fetchJoshWComeauBlog ... path: ${path}`)
  const topics = [...document.querySelectorAll('.tags-links > a')]?.map((e) => e?.textContent?.toLowerCase())

  try {
    // Extract Open Graph metadata
    const ogData = parseOgData();

    const meta = {
      lang: 'en-US',
      title: (`${ogData['og:title'].replace(/\s•\sJosh\sW\.\sComeau/g, "")}` ?? (document.querySelector('h1')?.textContent)?.trim()).replace(/"/g, "”"),
      description: `${ogData['og:description']}`.replace(/"/g, "”"),
      topic: topics[0] || 'css',
      author: "Josh W. Comeau",
      authorUrl: "https://joshwcomeau.com/about-josh",
      datePublished: convertDateFormat(
        document.querySelector('.date time')?.getAttribute("datetime") ?? ''
      ),
      baseUrl: 'https://joshcomeau.com',
      articleBasePath: 'joshcomeau.com',
      articlePath: `${ogData['og:url']}`
        .replace(/(https:\/\/)|(www\.)|(joshcomeau\.com\/)/g, '')
        .replace(/\//g, ''),
      articleOriginPath: `${ogData['og:url']}`
        .replace(/(https:\/\/)|(www\.)|(joshcomeau\.com\/)/g, ''),
      logo: 'https://joshcomeau.com/favicon.png',
      bgRGBA: '128,159,255',
      coverUrl: `${ogData['og:image'].replace(/https:\/\/www\./g, 'https://')}`
    }

    const ytWrapper = [...document.querySelectorAll('figure > iframe')]
    const ytTags2Replace = ytWrapper.map((e) => {
      const idFound = e.getAttribute("src")
        ?.replace(/(https:\/\/)|(www\.)|(youtube\.com\/embed\/)|(\?si=.*)/g, "")
      return `<VidStack src="youtube/${idFound}" />`
    })
    for (let e of ytWrapper) {
      let currentHtml = e.innerHTML;
      console.log(currentHtml)
      const pEl = document.createElement('p');
      pEl.textContent = `Youtube Embed Fallback`;
      e.replaceWith(pEl)
    }

    const codepenWrapper = [...document.querySelectorAll('p > iframe, .cp_embed_wrapper > iframe')]
    const cpTags2Replace = codepenWrapper.map((e) => {
      const [usernameFound, idFound] = e.getAttribute('src')
        ?.replace(/(https:\/\/)|(codepen\.io\/)/g, "")
        ?.replace(/\?.*/g, "").split("/embed/")
      // const titleFound = e?.contentWindow?.document?.querySelector('head>title') || "N/A"
      const titleFound = e.getAttribute("title") || "N/A" // SecurityError: Failed to read a named property 'document' from 'Window': Blocked a frame with 
      return `<CodePen
  user="${usernameFound}"
  slug-hash="${idFound}"
  title="${titleFound}"
  :default-tab="['css','result']"
  :theme="$isDarkmode ? 'dark': 'light'"/>`
    })

    for (let e of codepenWrapper) {
      let currentHtml = e.innerHTML;
      console.log(currentHtml)
      const pEl = document.createElement('p');
      pEl.textContent = `CodePen Embed Fallback`;
      e.replaceWith(pEl)
    }

    const frontmatter = createFrontMatter(meta)
    const endMatter = createEndMatter(meta)
    const articleContent = document.querySelector('main > article').innerHTML
    let mdContent = getTurndownResult(articleContent);
    mdContent = combineFrontAndEnd(mdContent, frontmatter, endMatter)
    mdContent = mdContent.replace(/\` \n\n/g, '\n```\n\n')
      .replace(/\[\]\(#.*\)/g, '')
    mdContent = churnSpecialChars(mdContent);
    mdContent = simplifyCodeblockLang(mdContent);
    mdContent = transformLinks(mdContent);

    let i = 0; // Initialize counter
    mdContent = mdContent.replace(/Youtube\sEmbed\sFallback/g, (match) => {
      const currentReplacement = ytTags2Replace[i];
      i++; // Increment for next time
      return currentReplacement;
    });
    i = 0;
    mdContent = mdContent.replace(/CodePen\sEmbed\sFallback/g, (match) => {
      const currentReplacement = cpTags2Replace[i];
      i++; // Increment for next time
      return currentReplacement;
    });

    return {
      filename: `${meta.articlePath}.md`,
      text: mdContent
    };
  } catch (error) {
    console.error('Failed to copy JSON:', error);
  }
}

function fetchIShadeedBlog(path="") {
  console.log(`fetchIShadeedBlog ... path: ${path}`)

  try {
    // Extract Open Graph metadata
    const ogData = parseOgData();

    const meta = {
      lang: 'en-US',
      title: (`${ogData['og:title']}` ?? (document.querySelector('h1.post-header__title')?.textContent)?.trim()).replace(/"/g, "”"),
      description: `${ogData['og:description']}`.replace(/"/g, "”"),
      topic: 'css',
      author: "Ahmed Shadeed",
      authorUrl: "https://ishadeed.com/about/",
      datePublished: convertDateFormat(
        document.querySelector('.post-header__date')?.textContent ?? ''
      ),
      baseUrl: 'https://ishadeed.com',
      articleBasePath: 'ishadeed.com',
      articlePath: `${ogData['og:url']}`
        .replace(/(https:\/\/)|(www\.)|(ishadeed\.com\/)/g, '')
        .replace(/article\//g, '')
        .replace(/\//g, ''),
      articleOriginPath: `${ogData['og:url']}`
        .replace(/(https:\/\/)|(www\.)|(ishadeed\.com\/)/g, ''),
      logo: 'https://ishadeed.com/assets/favicon-32x32.png',
      bgRGBA: '129,38,197',
      coverUrl: `${ogData['og:image'].replace(/https:\/\/www\./g, 'https://')}`
    }

    /*
    const ytWrapper = [...document.querySelectorAll('figure > iframe')]
    const ytTags2Replace = ytWrapper.map((e) => {
      const idFound = e.getAttribute("src")
        ?.replace(/(https:\/\/)|(www\.)|(youtube\.com\/embed\/)|(\?si=.*)/g, "")
      return `<VidStack src="youtube/${idFound}" />`
    })
    for (let e of ytWrapper) {
      let currentHtml = e.innerHTML;
      console.log(currentHtml)
      const pEl = document.createElement('p');
      pEl.textContent = `Youtube Embed Fallback`;
      e.replaceWith(pEl)
    }
    */

  //   const codepenWrapper = [...document.querySelectorAll('p > iframe, .cp_embed_wrapper > iframe')]
  //   const cpTags2Replace = codepenWrapper.map((e) => {
  //     const [usernameFound, idFound] = e.getAttribute('src')
  //       ?.replace(/(https:\/\/)|(codepen\.io\/)/g, "")
  //       ?.replace(/\?.*/g, "").split("/embed/")
  //     // const titleFound = e?.contentWindow?.document?.querySelector('head>title') || "N/A"
  //     const titleFound = e.getAttribute("title") || "N/A" // SecurityError: Failed to read a named property 'document' from 'Window': Blocked a frame with 
  //     return `<CodePen
  // user="${usernameFound}"
  // slug-hash="${idFound}"
  // title="${titleFound}"
  // :default-tab="['css','result']"
  // :theme="$isDarkmode ? 'dark': 'light'"/>`
  //   })

    /*
    for (let e of codepenWrapper) {
      let currentHtml = e.innerHTML;
      console.log(currentHtml)
      const pEl = document.createElement('p');
      pEl.textContent = `CodePen Embed Fallback`;
      e.replaceWith(pEl)
    }
    */

    const frontmatter = createFrontMatter(meta)
    const endMatter = createEndMatter(meta)
    const articleContent = document.querySelector('.post-content.prose').innerHTML
    let mdContent = getTurndownResult(articleContent);
    mdContent = combineFrontAndEnd(mdContent, frontmatter, endMatter)
    mdContent = mdContent.replace(/\` \n\n/g, '\n```\n\n')
      .replace(/\[\]\(#.*\)/g, '')
      .replace(/\]\(\/assets\//g, '](https://ishadeed.com/assets/')
    mdContent = churnSpecialChars(mdContent);
    mdContent = simplifyCodeblockLang(mdContent);
    mdContent = transformLinks(mdContent);

    /* let i = 0; // Initialize counter
    mdContent = mdContent.replace(/Youtube\sEmbed\sFallback/g, (match) => {
      const currentReplacement = ytTags2Replace[i];
      i++; // Increment for next time
      return currentReplacement;
    });
    i = 0;
    mdContent = mdContent.replace(/CodePen\sEmbed\sFallback/g, (match) => {
      const currentReplacement = cpTags2Replace[i];
      i++; // Increment for next time
      return currentReplacement;
    });
 */
    return {
      filename: `${meta.articlePath}.md`,
      text: mdContent
    };
  } catch (error) {
    console.error('Failed to copy JSON:', error);
  }
}

function fetchAdrianRoselliBlog(path="") {
  console.log(`fetchAdrianRoselliBlog ... path: ${path}`)

  try {
    const ogData = parseOgData();

    const meta = {
      lang: 'en-US',
      title: (`${ogData['og:title']}` ?? (document.querySelector('.post > main > h1')?.textContent)?.trim()).replace(/"/g, "”"),
      description: `${ogData['og:description']}`.replace(/"/g, "”"),
      topic: 'css',
      author: 'https://adrianroselli.com',
      authorUrl: "https://adrianroselli.com/contact",
      datePublished: convertDateFormat(
        document.querySelector('meta[property^="article:published_time"]')?.getAttribute("content") ?? document.querySelectorAll('time')[0]?.getAttribute("datetime") ?? ''
      ),
      baseUrl: 'https://adrianroselli.com',
      articleBasePath: 'adrianroselli.com',
      articlePath: `${ogData['og:url']}`
        .replace(/(https:\/\/)|(www\.)|(adrianroselli\.com\/)|(\d{4}\/\d{2}\/)/g, '')
        .replace(/(\/)|(\.html)/g, ''),
      articleOriginPath: `${ogData['og:url']}`
        .replace(/(https:\/\/)|(www\.)|(adrianroselli\.com\/)/g, ''),
      logo: 'https://adrianroselli.com/wp-content/themes/AAR/favicon.png',
      bgRGBA: '0,0,0',
      coverUrl: `${ogData['og:image'].replace(/https:\/\/www\./g, 'https://')}`
    }

    const codepenWrapper = [...document.querySelectorAll('.cp_embed_wrapper > iframe')]
    const cpTags2Replace = codepenWrapper.map((e) => {
      const [usernameFound, idFound] = e.getAttribute('src')
        ?.replace(/(https:\/\/)|(codepen\.io\/)/g, "")
        ?.replace(/\?.*/g, "").split("/embed/")
      // const titleFound = e?.contentWindow?.document?.querySelector('head>title') || "N/A"
      const titleFound = e.getAttribute("title") || "N/A" // SecurityError: Failed to read a named property 'document' from 'Window': Blocked a frame with 
      return `<CodePen
  user="${usernameFound}"
  slug-hash="${idFound}"
  title="${titleFound}"
  :default-tab="['css','result']"
  :theme="$isDarkmode ? 'dark': 'light'"/>`
    })

    for (let e of codepenWrapper) {
      let currentHtml = e.innerHTML;
      console.log(currentHtml)
      const pEl = document.createElement('p');
      pEl.textContent = `CodePen Embed Fallback`;
      e.replaceWith(pEl)
    }

    ElRemoveAll("main>article#Comments")
    
    const frontmatter = createFrontMatter(meta)
    const endMatter = createEndMatter(meta)
    const articleContent = document.querySelector('main').innerHTML
    let mdContent = getTurndownResult(articleContent);
    mdContent = combineFrontAndEnd(mdContent, frontmatter, endMatter)
    mdContent = mdContent.replace(/\` \n\n/g, '\n```\n\n')
      .replace(/\[\]\(#.*\)/g, '')
      .replace(/\s\[\#anchor\]\(#.*\)/g, '')
      .replace(/\]\(\/(?=wp-content\/)/g, "](https://adrianroselli.com/")
      // .replace(/\]\(\/([^/)]+)\/\)/g, '](/adrianroselli.com/$1.md)')
      // .replace(/\]\(\/(?=img\/)/g, "](https://adrianroselli.com/")
      
    mdContent = churnSpecialChars(mdContent);
    mdContent = simplifyCodeblockLang(mdContent);
    mdContent = transformLinks(mdContent);

    const exceptions = [
      "2012-advent-calendars-for-web-devs",
      "a-responsive-accessible-table",
      "accessibility-gaps-in-mvps",
      "accessible-emoji-tweaked",
      "ada-web-site-compliance-still-not-a-thing",
      "aria-label-does-not-translate",
      "at-is-more-than-screen-readers",
      "avoid-emoji-as-class-names",
      "barriers-from-links-with-aria",
      "brief-note-on-aria-readonly-support-html",
      "brief-note-on-buttons-enter-and-space",
      "css-logical-properties",
      "details-summary-are-not-insert-control-here",
      "dont-use-aria-menu-roles-for-site-nav",
      "hey-its-still-ok-to-use-tables",
      "honoring-mobile-os-text-size",
      "its-ok-to-use-tables",
      "jaws-nvda-and-voiceover-braille-viewers",
      "keyboard-and-overflow",
      "link-disclosure-widget-navigation",
      "live-region-support",
      "my-priority-of-methods-for-labeling-a-control",
      "my-request-to-google-on-accessibility",
      "not-all-screen-reader-users-are-blind",
      "periodic-table-of-the-elements",
      "responsive-type-and-zoom",
      "slides-from-a11ytoconf",
      "tables-css-display-properties-and-aria",
      "the-ultimate-ideal-bestest-base-font-size-that-everyone-is-keeping-a-secret-especially-chet",
      "two-advent-calendars-for-web-developers",
      "uncanny-a11y",
      "uniquely-labeling-fields-in-a-table",
      "web-development-advent-calendars-for-2013",
      "web-development-advent-calendars-for-2014",
      "web-development-advent-calendars-for-2015",
      "web-development-advent-calendars-for-2016",
      "web-development-advent-calendars-for-2017",
      "web-development-advent-calendars-for-2018",
      "web-development-advent-calendars-for-2019",
      "whcm-and-system-colors",
      "you-know-what-just-dont-split-words-into-letters",
      "your-accessibility-claims-are-wrong-unless",
    ];
    mdContent = mdContent.replace(/\[([^\]]+)\]\(\/(\d{4}\/\d{2}\/([^/)]+))\.html\)/g, (match, title, fullPath, slug) => {
      // Bold the title for both cases
      const boldTitle = `**${title}**`;

      if (exceptions.includes(slug)) {
        // CASE: Exception - convert to relative path with .md and no TODO
        return `[${boldTitle}](/adrianroselli.com/${slug}.md)`;
      } else {
        // CASE: Normal - convert to absolute URL and add TODO comment
        return `[${boldTitle}](https://adrianroselli.com/${fullPath}.html)\n<!-- TODO: /adrianroselli.com/${slug}.md -->`;
      }
    })

    /* let i = 0; // Initialize counter
    mdContent = mdContent.replace(/Youtube\sEmbed\sFallback/g, (match) => {
        const currentReplacement = ytTags2Replace[i];
        i++; // Increment for next time
        return currentReplacement;
    }); */
    let i = 0;
    mdContent = mdContent.replace(/CodePen\sEmbed\sFallback/g, (match) => {
      const currentReplacement = cpTags2Replace[i];
      i++; // Increment for next time
      return currentReplacement;
    });
    return {
      filename: `${meta.articlePath}.md`,
      text: mdContent
    };
  } catch (error) {
    console.error('Failed to copy JSON:', error);
  }
}

function fetchCssTipBlog(path = "") {
  console.log(`fetchCssTipBlog ... path: ${path}`)

  try {
    // Extract Open Graph metadata
    const ogData = parseOgData();

    const meta = {
      lang: 'en-US',
      title: (`${ogData['og:title']}` ?? (document.querySelector('main > h1')?.textContent)?.trim()).replace(/"/g, "”"),
      description: `${ogData['og:description']}`.replace(/"/g, "”"),
      topic: 'css',
      author: document.querySelector('meta[name="author"]')?.content,
      authorUrl: "https://css-tip.com/about",
      datePublished: convertDateFormat(
        document.querySelectorAll('main > time')[0]?.getAttribute("datetime") ?? ''
      ),
      baseUrl: 'https://css-tip.com',
      articleBasePath: 'css-tip.com',
      articlePath: `${ogData['og:url']}`
        .replace(/(https:\/\/)|(www\.)|(css-tip\.com\/)/g, '')
        .replace(/\//g, ''),
      articleOriginPath: `${ogData['og:url']}`
        .replace(/(https:\/\/)|(www\.)|(css-tip\.com\/)/g, ''),
      logo: 'https://css-tip.com/img/fav.png',
      bgRGBA: '111,162,204',
      coverUrl: `https://css-tip.com${ogData['og:image'].replace(/https:\/\/www\./g, 'https://')}`
    }

    const pretags = [...document.querySelectorAll('pre')]
    pretags?.forEach((e) => {
      console.log(e.innerHTML)
      let currentHtml = e.innerHTML;
    })

    const codepenWrapper = [...document.querySelectorAll('.cp_embed_wrapper > iframe')]
    const cpTags2Replace = codepenWrapper.map((e) => {
      const [usernameFound, idFound] = e.getAttribute('src')
        ?.replace(/(https:\/\/)|(codepen\.io\/)/g, "")
        ?.replace(/\?.*/g, "").split("/embed/")
      // const titleFound = e?.contentWindow?.document?.querySelector('head>title') || "N/A"
      const titleFound = e.getAttribute("title") || "N/A" // SecurityError: Failed to read a named property 'document' from 'Window': Blocked a frame with 
      return `<CodePen
  user="${usernameFound}"
  slug-hash="${idFound}"
  title="${titleFound}"
  :default-tab="['css','result']"
  :theme="$isDarkmode ? 'dark': 'light'"/>`
    })

    for (let e of codepenWrapper) {
      let currentHtml = e.innerHTML;
      console.log(currentHtml)
      const pEl = document.createElement('p');
      pEl.textContent = `CodePen Embed Fallback`;
      e.replaceWith(pEl)
    }

    ElRemoveAll("main>ul.links-nextprev, main>h1, main>time")

    const frontmatter = createFrontMatter(meta)
    const endMatter = createEndMatter(meta)
    const articleContent = document.querySelector('main').innerHTML
    let mdContent = getTurndownResult(articleContent);
    mdContent = combineFrontAndEnd(mdContent, frontmatter, endMatter)
    mdContent = mdContent.replace(/\` \n\n/g, '\n```\n\n')
      .replace(/\[\]\(#.*\)/g, '')
      .replace(/\]\(\/([^/)]+)\/\)/g, '](/css-tip.com/$1.md)')
      .replace(/\]\(\/(?=img\/)/g, "](https://css-tip.com/")
      
    mdContent = churnSpecialChars(mdContent);
    mdContent = simplifyCodeblockLang(mdContent);
    mdContent = transformLinks(mdContent);

    /* let i = 0; // Initialize counter
    mdContent = mdContent.replace(/Youtube\sEmbed\sFallback/g, (match) => {
        const currentReplacement = ytTags2Replace[i];
        i++; // Increment for next time
        return currentReplacement;
    }); */
    let i = 0;
    mdContent = mdContent.replace(/CodePen\sEmbed\sFallback/g, (match) => {
      const currentReplacement = cpTags2Replace[i];
      i++; // Increment for next time
      return currentReplacement;
    });

    return {
      filename: `${meta.articlePath}.md`,
      text: mdContent
    };
  } catch (error) {
    console.error('Failed to copy JSON:', error);
  }
}

function fetch9ElementsBlog(path="") {
  console.log(`fetch9ElementsBlog ... path: ${path}`)
  
  try {
    const ogData = parseOgData();

    const meta = {
      lang: 'en-US',
      title: (ogData['og:title']?.replace(/\s-\s9elements/, "") ?? (document.querySelector('h1.chapter-intro__headline')?.textContent)?.trim())?.replace(/"/g, "”")?.replace(/\s·\s.*/g, ''),
      description: `${ogData['og:description']}`.replace(/"/g, "”"),
      topic: 'css',
      author: document?.querySelector('article footer.blog-meta>p.author>a')?.textContent,
      authorUrl: `https://9elements.com${document?.querySelector('article footer.blog-meta>p.author>a')?.getAttribute('href')}`,
      datePublished: convertDateFormat(
        document?.querySelector('article footer.blog-meta>time').getAttribute('datetime')
      ),
      baseUrl: 'https://9elements.com',
      articleBasePath: '9elements.com',
      articlePath: `${ogData['og:url']}`
        ?.replace(/(https:\/\/)|(www\.)|(9elements\.com\/)/g, "")
        ?.replace(/(blog\/)/g, "")
        ?.replace(/\//g, ''),
      articleOriginPath: `${ogData['og:url']}`
        ?.replace(/(https:\/\/)|(www\.)|(9elements\.com\/)/g, ""),
      logo: 'https://9elements.com/assets/images/meta/favicon.svg',
      bgRGBA: '0,5,4',
      coverUrl: `${ogData['og:image'].replace(/https:\/\/www\./g, 'https://')}`
    }

    /* const codeBlockWrapper = [...document.querySelectorAll('.highlighter-rouge')]?.filter((e) => !!e.querySelector('pre'))
    for (let e of codeBlockWrapper) {
      let currentHtml = e.innerHTML;
      console.log(currentHtml)
      // pre안 내용정리
      const pre = e.querySelector('pre')
      if (!pre) continue;
      const language = [...e.classList].find((e) => 
        !!e.includes("language")
      )
      pre.className += ` ${language}`
      const code = e.querySelector('code')
      code.className += ` ${language}`
      // pre를 밖으로
      e.parentNode.insertBefore(pre, e)
      e.remove()
      // e.innerHTML = pre.outerHTML
    } */

    const codepenWrapper = [...document.querySelectorAll('.cp_embed_wrapper > iframe')]
    const tags2Replace = codepenWrapper.map((e) => {
      const [usernameFound, idFound] = e.getAttribute('src')?.replace(/\/\/codepen\.io\//g, "")
        ?.replace(/\?.*/g, "")
        ?.replace(/https:/g, "")
        ?.split("/embed/")
      // const titleFound = e?.contentWindow?.document?.querySelector('head>title') || "N/A"
      const titleFound = "N/A" // SecurityError: Failed to read a named property 'document' from 'Window': Blocked a frame with 
      return `<CodePen
  user="${usernameFound}"
  slug-hash="${idFound}"
  title="${titleFound}"
  :default-tab="['css','result']"
  :theme="$isDarkmode ? 'dark': 'light'"/>`
    })

    for (let e of codepenWrapper) {
      let currentHtml = e.innerHTML;
      console.log(currentHtml)
      const pEl = document.createElement('p');
      pEl.textContent = `CodePen Embed Fallback`;
      e.replaceWith(pEl)
    }

    const codeBlockWrapper = [...document.querySelectorAll('pre')]
    for (let e of codeBlockWrapper) {
      let currentHtml = e.innerHTML;
      console.log(currentHtml)
      const span = e.querySelector('span.code-language')
      span.remove()
      // e.innerHTML = pre.outerHTML
    }
    
    // ElRemoveAll('article>.')

    const frontmatter = createFrontMatter(meta)
    const endMatter = createEndMatter(meta)
    const articleContent = document.querySelector('article>.blog-content__text').innerHTML
    let mdContent = getTurndownResult(articleContent);
    mdContent = combineFrontAndEnd(mdContent, frontmatter, endMatter);
    mdContent = churnSpecialChars(mdContent);
    mdContent = simplifyCodeblockLang(mdContent);
    mdContent = transformLinks(mdContent);
    mdContent = mdContent.replace(/(\`Code language\:.*\(*\))/g, '\n\`\`\`')
      .replace(/\` \n\n/g, '\n```\n\n')
      .replace(/\[\]\(\#.*\)/g, "") // remove empty tag
      .replace(/\s\[\#\]\(\#.*\)/g, "") // remove empty tag
      .replace(/\]\(\/(?=[^)]+\))/g, '](https://9elements.com/') // 이미지 경로

    let i = 0; // Initialize counter
    mdContent = mdContent.replace(/CodePen\sEmbed\sFallback/g, (match) => {
      const currentReplacement = tags2Replace[i];
      i++; // Increment for next time
      return currentReplacement;
    });
    
    return {
      filename: `${meta.articlePath}.md`,
      text: mdContent
    };
  } catch (error) {
    console.error('Failed to copy JSON:', error);
  }
}

function fetchAdamArgyleBlog(path = "") {
  console.log(`fetchAdamArgyleBlog ... path: ${path}`)

  const topics = [...document.querySelectorAll('section.BlogMeta.block-stack .Tags.inline-wrap span')]?.map((e) => e?.textContent?.replace(/\#/g, ''))

  try {
    const ogData = parseOgData();

    const meta = {
      lang: 'en-US',
      title: (ogData['og:title'] ?? (document.querySelector('section.BlogMeta.block-stack h1')?.textContent)?.trim())?.replace(/"/g, "”")?.replace(/\s·\s.*/g, ''),
      description: `${ogData['og:description']}`.replace(/"/g, "”"),
      topic: topics,
      author: 'Adam Argyle',
      authorUrl: "https://front-end.social/@argyleink",
      datePublished: convertDateFormat(
        document.querySelectorAll('section.BlogMeta.block-stack .date-time time')[0]?.getAttribute("datetime") ?? ''
      ),
      baseUrl: 'https://nerdy.dev',
      articleBasePath: 'nerdy.dev',
      articlePath: path.replace(/\//g, ''),
      articleOriginPath: path.replace(/\//g, ''),
      logo: 'https://nerdy.dev/favicon.svg',
      bgRGBA: '137,41,255',
      coverUrl: `${ogData['og:image'].replace(/https:\/\/www\./g, 'https://')}`
    }

    const codepenWrapper = [...document.querySelectorAll('iframe.codepen-embed')]
    const tags2Replace = codepenWrapper.map((e) => {
      const [usernameFound, idFound] = e.getAttribute('src')?.replace(/\/\/codepen\.io\//g, "")
        ?.replace(/\?.*/g, "").split("/embed/")
      // const titleFound = e?.contentWindow?.document?.querySelector('head>title') || "N/A"
      const titleFound = "N/A" // SecurityError: Failed to read a named property 'document' from 'Window': Blocked a frame with 
      return `<CodePen
  user="${usernameFound}"
  slug-hash="${idFound}"
  title="${titleFound}"
  :default-tab="['css','result']"
  :theme="$isDarkmode ? 'dark': 'light'"/>`
    })

    const frontmatter = createFrontMatter(meta)
    const endMatter = createEndMatter(meta)
    const articleContent = document.querySelector('cq-document-vi article.block-stack').innerHTML
    let mdContent = getTurndownResult(articleContent);
    mdContent = combineFrontAndEnd(mdContent, frontmatter, endMatter);
    mdContent = churnSpecialChars(mdContent);
    mdContent = simplifyCodeblockLang(mdContent);
    mdContent = transformLinks(mdContent);
    mdContent = mdContent.replace(/(\`Code language\:.*\(*\))/g, '\n\`\`\`')
      .replace(/\[\]\(\#.*\)/g, "") // remove empty tag
      .replace(/\s\[\#\]\(\#.*\)/g, "") // remove empty tag

    let i = 0; // Initialize counter
    mdContent = mdContent.replace(/CodePen\sEmbed\sFallback/g, (match) => {
      const currentReplacement = tags2Replace[i];
      i++; // Increment for next time
      return currentReplacement;
    });

    return {
      filename: `${meta.articlePath}.md`,
      text: mdContent
    };
  } catch (error) {
    console.error('Failed to copy JSON:', error);
  }
}

function fetchTobiasAhlinBlog(path="") {
  console.log(`fetchTobiasAhlinBlog ... path: ${path}`)
  
  try {
    const ogData = parseOgData();
    const [day, month, year] = document.querySelector('.post-categories-date').textContent.split('/')

    const meta = {
      lang: 'en-US',
      title: (ogData['og:title'] ?? (document.querySelector('h1.post-headder')?.textContent)?.trim())?.replace(/"/g, "”")?.replace(/\s·\s.*/g, ''),
      description: `${ogData['og:description']}`.replace(/"/g, "”"),
      topic: document?.querySelectorAll('.post-categories-link')[0]?.textContent?.toLowerCase() ?? 'css',
      author: "Tobias Ahlin",
      authorUrl: "https://x.com/tobiasahlin",
      datePublished: convertDateFormat(
        `${year}/${month}/${day}`
      ),
      baseUrl: 'https://tobiasahlin.com',
      articleBasePath: 'tobiasahlin.com',
      articlePath: `${ogData['og:url']}`
        ?.replace(/(https:\/\/)|(www\.)|(tobiasahlin\.com\/)/g, "")
        ?.replace(/(blog\/)/g, "")
        ?.replace(/\//g, ''),
      articleOriginPath: `${ogData['og:url']}`
        ?.replace(/(https:\/\/)|(www\.)|(tobiasahlin\.com\/)/g, ""),
      logo: 'https://tobiasahlin.com/images/touch-icon-ipad-retina.png',
      bgRGBA: '43,47,60',
      coverUrl: `${ogData['og:image'].replace(/https:\/\/www\./g, 'https://')}`
    }

    const codeBlockWrapper = [...document.querySelectorAll('.highlighter-rouge')]?.filter((e) => !!e.querySelector('pre'))
    for (let e of codeBlockWrapper) {
      let currentHtml = e.innerHTML;
      console.log(currentHtml)
      // pre안 내용정리
      const pre = e.querySelector('pre')
      if (!pre) continue;
      const language = [...e.classList].find((e) => 
        !!e.includes("language")
      )
      pre.className += ` ${language}`
      const code = e.querySelector('code')
      code.className += ` ${language}`
      // pre를 밖으로
      e.parentNode.insertBefore(pre, e)
      e.remove()
      // e.innerHTML = pre.outerHTML
    }
    
    ElRemoveAll('.article.article-single > style, .article.article-single > h2 > a')

    const frontmatter = createFrontMatter(meta)
    const endMatter = createEndMatter(meta)
    const articleContent = document.querySelector('.article.article-single').innerHTML
    let mdContent = getTurndownResult(articleContent);
    mdContent = combineFrontAndEnd(mdContent, frontmatter, endMatter);
    mdContent = churnSpecialChars(mdContent);
    mdContent = simplifyCodeblockLang(mdContent);
    mdContent = transformLinks(mdContent);
    mdContent = mdContent.replace(/(\`Code language\:.*\(*\))/g, '\n\`\`\`')
      .replace(/\` \n\n/g, '\n```\n\n')
      .replace(/\[\]\(\#.*\)/g, "") // remove empty tag
      .replace(/\s\[\#\]\(\#.*\)/g, "") // remove empty tag
      .replace(/\]\(\/(?=[^)]+\))/g, '](https://tobiasahlin.com/') // 이미지 경로


    return {
      filename: `${meta.articlePath}.md`,
      text: mdContent
    };
  } catch (error) {
    console.error('Failed to copy JSON:', error);
  }
}

function fetchHuggingFaceBlog(path="") {
  console.log(`fetchHuggingFaceBlog ... path: ${path}`)
  try {
    const ogData = parseOgData();
    const metaInfo = JSON.parse(document?.querySelector('.SVELTE_HYDRATER.contents')?.getAttribute('data-props'))

    const meta = {
      lang: 'en-US',
      title: (ogData['og:title'] ?? (document.querySelector('h1 > span')?.textContent)?.trim())?.replace(/"/g, "”")?.replace(/\s·\s.*/g, ''),
      description: `${ogData['og:description']}`.replace(/"/g, "”"),
      topic: 'llm',
      author: ""/* metaInfo?.authors[0]?.author?.fullname */,
      authorUrl: ""/* `https://huggingface.co/${metaInfo?.authors[0]?.author?.name}` */,
      datePublished: convertDateFormat(
        document.querySelector('.text-base > span.text-sm')?.textContent?.replace(/Published\s/g, "")?.trim() || ''
      ),
      baseUrl: 'https://huggingface.co',
      articleBasePath: 'huggingface.co',
      articlePath: `${ogData['og:url']}`
        ?.replace(/(https:\/\/)|(www\.)|(huggingface\.co\/)/g, "")
        ?.replace(/(blog\/)/g, "")
        ?.replace(/(microsoft\/)/g, ""),
      articleOriginPath: `${ogData['og:url']}`
        ?.replace(/(https:\/\/)|(www\.)|(huggingface\.co\/)/g, ""),
      logo: 'https://huggingface.co/favicon.ico',
      bgRGBA: '11,15,25',
      coverUrl: `${ogData['og:image'].replace(/https:\/\/www\./g, 'https://')}`
    }

    const frontmatter = createFrontMatter(meta)
    const endMatter = createEndMatter(meta)
    const articleContent = document.querySelector('.blog-content').innerHTML
    let mdContent = getTurndownResult(articleContent);
    mdContent = combineFrontAndEnd(mdContent, frontmatter, endMatter);
    mdContent = churnSpecialChars(mdContent);
    mdContent = simplifyCodeblockLang(mdContent);
    mdContent = transformLinks(mdContent);
    mdContent = mdContent.replace(/(\`Code language\:.*\(*\))/g, '\n\`\`\`')
      .replace(/\[\]\(\#.*\)/g, "") // remove empty tag
      .replace(/\s\[\#\]\(\#.*\)/g, "") // remove empty tag

    return {
      filename: `${meta.articlePath}.md`,
      text: mdContent
    };
  } catch (error) {
    console.error('Failed to copy JSON:', error);
  }
}

function fetchItsFossBlog() {
  console.log('fetchItsFossBlog ... ')
  try {
    // Extract Open Graph metadata
    const ogData = parseOgData();

    const meta = {
      lang: 'en-US',
      title: (document.querySelector('h1.post-hero__title')?.textContent) ?? ogData['og:title'],
      description: `${ogData['og:description']}`.replace(/"/g, "”"),
      topic: '',
      author: document.querySelector('.author-card__name>a')?.textContent ?? '',
      datePublished: convertDateFormat(
        document.querySelector('.post-info__dr>time')?.getAttribute('datetime') ?? ''
      ),
      baseUrl: 'https://itsfoss.com',
      articleBasePath: 'itsfoss.com',
      articlePath: `${ogData['og:url']}`
        .replace(/(https:\/\/)|(www\.)|(itsfoss\.com\/)/g, '')
        .replace(/\//g, ''),
      logo: 'https://itsfoss.com/content/images/size/w256h256/2022/12/android-chrome-192x192.png',
      bgRGBA: '53,121,127',
      coverUrl: `${ogData['og:image'].replace(/\https:\/\/www\./g, 'https://')}`
    }

    ElRemoveAll('.hide-mobile')

    const frontmatter = createFrontMatter(meta)
    const endMatter = createEndMatter(meta)
    const articleContent = document.querySelector('article.post').innerHTML
    let mdContent = getTurndownResult(articleContent);
    mdContent = `${frontmatter}${mdContent.replace(/\(https:\/\/www\./g, '(https://')
      .replace(/(?:^|\n)##\s/g, '\n---\n\n## ') // h2 처리
      .replace(/(?:^|##\s\n\n)/g, '## ') // h2 처리
      .replace(/\nxxxxxxxxxx\n/g, '```kotlin')
      .replace(/\-   /g, '- ') // ul처리
      .replace(/    \n\-/g, '-') // ul처리
      .replace(/(?<=[0-9]\.)\s\s/g, ' ')}${endMatter}` // ol처리
      .replace(/    \n(?=[0-9]\.)/g, '') // ol처리
    mdContent = churnSpecialChars(mdContent);
    mdContent = simplifyCodeblockLang(mdContent);
    mdContent = transformLinks(mdContent);

    return {
      filename: `${meta.articlePath}.md`,
      text: mdContent
    }
  } catch (error) {
    console.error('Failed to copy JSON:', error);
  }
}


function fetchTecmintBlog() {
  console.log('fetchTecmintBlog ... ')
  try {
    // Extract Open Graph metadata
    const ogData = parseOgData();

    const meta = {
      lang: 'en-US',
      title: (document.querySelector('h1.entry-title')?.textContent) ?? ogData['og:title'],
      description: `${ogData['og:description']}`.replace(/"/g, "”"),
      topic: 'linux-fedora',
      author: document.querySelector('span.author span.author-name')?.textContent ?? '',
      authorUrl: document.querySelector('span.author > a')?.getAttribute("href")
        .replace(/(www\.)/g, '') ?? '',
      datePublished: convertDateFormat(
        document.querySelector('time.entry-date.updated-date')?.getAttribute('datetime') ?? ''
      ),
      baseUrl: 'https://tecmint.com',
      articleBasePath: 'tecmint.com',
      articlePath: `${ogData['og:url']}`
        .replace(/(https:\/\/)|(www\.)|(tecmint\.com\/)/g, '')
        .replace(/\//g, ''),
      logo: 'https://tecmint.com/wp-content/uploads/2020/07/favicon.ico',
      bgRGBA: '5,86,243',
      coverUrl: `${ogData['og:image'].replace(/\https:\/\/www\./g, 'https://')}`
    }

    ElRemoveAll()
    const pretags = [...document.querySelectorAll('pre')]
    pretags?.forEach((e) => {
      console.log(e.innerHTML)
      let currentHtml = e.innerHTML;
      e.innerHTML = `<code class="language-shell">${currentHtml}</code>`
    })


    const frontmatter = createFrontMatter(meta)
    const endMatter = createEndMatter(meta)
    const articleContent = document.querySelector('.entry-content').innerHTML
    let mdContent = getTurndownResult(articleContent);
    mdContent = `${frontmatter}${mdContent.replace(/\(https:\/\/www\./g, '(https://')
      .replace(/(?:^|\n)##\s/g, '\n---\n\n## ') // h2 처리
      .replace(/(?:^|##\s\n\n)/g, '## ') // h2 처리
      .replace(/\nxxxxxxxxxx\n/g, '```kotlin')
      .replace(/\-   /g, '- ') // ul처리
      .replace(/    \n\-/g, '-') // ul처리
      .replace(/(?<=[0-9]\.)\s\s/g, ' ')}${endMatter}` // ol처리
      .replace(/    \n(?=[0-9]\.)/g, '') // ol처리
    mdContent = churnSpecialChars(mdContent);
    mdContent = simplifyCodeblockLang(mdContent);
    mdContent = transformLinks(mdContent);

    return {
      filename: `${meta.articlePath}.md`,
      text: mdContent
    }
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
      title: document.querySelector('h1')
        ?.textContent
        ?.trim(),
      description: `${ogData['og:description']}`.replace(/"/g, "”"),
      topic: '',
      author: document.querySelector('span[data-testid="contents-author-name"]').textContent ?? '',
      authorUrl: `https://yozm.wishket.com${document.querySelector('a[data-testid="contents-author-root"]')?.getAttribute('href') ?? ''}`,
      datePublished: convertDateFormat(
        document.querySelector('meta[name="date"]')?.content
      ),
      baseUrl: 'https://yozm.wishket.com',
      articleBasePath: 'yozm.wishket.com',
      articlePath: `${ogData['og:url']}`
        .replace(/https:\/\/yozm\.wishket\.com\/magazine\/detail\//g, '')
        .replace(/\//g, ''),
      articleOriginPath: `${ogData['og:url']}`
        .replace(/https:\/\/yozm\.wishket\.com\//g, ''),
      logo: 'https://yozm.wishket.com/favicon.ico',
      bgRGBA: '84,7,224',
      coverUrl: `${ogData['og:image'].replace(/\https:\/\/www\./g, 'https://')}`
    }

    const frontmatter = createFrontMatter(meta)
    const endMatter = createEndMatter(meta)
    const articleContent = document.querySelector('#article-detail-wrapper').innerHTML
    let mdContent = getTurndownResult(articleContent);
    mdContent = combineFrontAndEnd(mdContent, frontmatter, endMatter);
    mdContent = churnSpecialChars(mdContent);
    mdContent = simplifyCodeblockLang(mdContent);
    mdContent = transformLinks(mdContent);
    mdContent = mdContent.replace(/\[([^\]]+)\]\(https:\/\/yozm\.weishket\.com\/magazin\/detail\/([^/#)]+)\/(#?[^)]*)\)/gm, `[**$1**](/yozm.wishket.com/$2.md#$3)`)

    return {
      filename: `${meta.articlePath}.md`,
      text: mdContent
    };
  } catch (error) {
    console.error('Failed to copy JSON:', error);
  }
}

function fetchD2Article(path = '') {
  console.log(`fetchD2Article ... path: ${path}`)
  try {
    // Extract Open Graph metadata
    const ogData = parseOgData();

    const meta = {
      lang: 'ko-KR',
      title: (document.querySelector('title')
        ?.textContent ?? document.querySelector('meta[name="description"]')
          ?.getAttribute("content")
      )?.trim().replace(/"/g, "”"),
      description: (document.querySelector('title')
        ?.textContent ?? document.querySelector('meta[name="description"]')
          ?.getAttribute("content")
      )?.trim().replace(/"/g, "”"),
      topic: '',
      author: [...document.querySelectorAll('.writer_info>.people_info>dl .name')].map((e) => e.textContent).join(', ') ?? '',
      datePublished: convertDateFormat(
        document.querySelectorAll('.post_info>dd')[0].textContent
      ),
      baseUrl: 'https://d2.naver.com',
      articleBasePath: 'd2.naver.com',
      articlePath: path.replace(/https:\/\/d2\.naver\.com\/helloworld\//g, '')
        .replace(/\//g, ''),
      articleOriginPath: path
        .replace(/https:\/\/d2\.naver\.com\//g, ''),
      logo: 'https://d2.naver.com/favicon.ico',
      bgRGBA: '103,262,163',
      coverUrl: '' // `${ogData['og:image'].replace(/\https:\/\/www\./g, 'https://')}`
    }

    const frontmatter = createFrontMatter(meta)
    const endMatter = createEndMatter(meta)
    const articleContent = document.querySelector('.con_view').innerHTML
    let mdContent = getTurndownResult(articleContent);
    mdContent = combineFrontAndEnd(mdContent, frontmatter, endMatter);
    mdContent = churnSpecialChars(mdContent);
    mdContent = simplifyCodeblockLang(mdContent);
    mdContent = transformLinks(mdContent);
    mdContent = mdContent.replace(/!\[\]\(\/content\//g, '![](https://d2.naver.com/content/') // ol처리

    return {
      filename: `${meta.articlePath}.md`,
      text: mdContent
    };
  } catch (error) {
    console.error('Failed to copy JSON:', error);
  }
}


function fetchTechKakao() {
  console.log('fetchTechKakao ... ')
  try {
    // Extract Open Graph metadata
    const ogData = parseOgData();

    const meta = {
      lang: 'ko-KR',
      title: (document.querySelector('title')
        ?.textContent ?? document.querySelector('meta[name="description"]')
          ?.getAttribute("content")
      )?.replace(/ - tech.kakao.com/g, '')?.trim(),
      description: `${ogData['og:description']}`.replace(/"/g, "”"),
      topic: '',
      author: document.querySelector('.tit_author').textContent ?? '',
      authorUrl: `https://tech.kakao.com${document.querySelector('.info_author > a').getAttribute('href')}`,
      datePublished: convertDateFormat(document.querySelector('.daum-wm-datetime').textContent),
      baseUrl: 'https://tech.kakao.com',
      articleBasePath: 'tech.kakao.com',
      articlePath: `${ogData['og:url']}`
        .replace(/(https:\/\/)|(www\.)|(tech\.kakao\.com\/)|(posts\/)/g, '')
        .replace(/\//g, ''),
      articleOriginPath: `${ogData['og:url']}`
        .replace(/https:\/\/tech\.kakao\.com\//g, ''),
      logo: 'https://kakaocorp.com/page/favicon.ico',
      bgRGBA: '78,70,210',
      coverUrl: `${ogData['og:image'].replace(/\https:\/\/www\./g, 'https://')}`
    }

    const frontmatter = createFrontMatter(meta)
    const endMatter = createEndMatter(meta)
    const articleContent = document.querySelector('.daum-wm-content.preview').innerHTML
    let mdContent = getTurndownResult(articleContent);
    mdContent = combineFrontAndEnd(mdContent, frontmatter, endMatter);
    mdContent = churnSpecialChars(mdContent);
    mdContent = simplifyCodeblockLang(mdContent);
    mdContent = transformLinks(mdContent);

    return {
      filename: `${meta.articlePath}.md`,
      text: mdContent
    }
  } catch (error) {
    console.error('Failed to copy JSON:', error);
  }
}


function fetchTechKakaoPay() {
  console.log('fetchTechKakaoPay ... ')
  try {
    // Extract Open Graph metadata
    const ogData = parseOgData();

    const meta = {
      lang: 'ko-KR',
      title: (document.querySelector('title')
        ?.textContent ?? document.querySelector('meta[name="description"]')
          ?.getAttribute("content")
      )?.replace(/ \| 카카오페이 기술 블로그/g, '')?.trim(),
      description: `${ogData['og:description']}`.replace(/"/g, "”"),
      topic: '',
      author: document.querySelector('.author-content>strong').textContent ?? '',
      datePublished: convertDateFormat(document.querySelector('time').textContent),
      baseUrl: 'https://tech.kakaopay.com',
      articleBasePath: 'tech.kakaopay.com',
      articlePath: `${ogData['og:url']}`
        .replace(/https:\/\/tech\.kakaopay\.com\/post\//g, '')
        .replace(/\//g, ''),
      articleOriginPath: `${ogData['og:url']}`
        .replace(/https:\/\/tech\.kakaopay\.com\//g, ''),
      logo: 'https://tech.kakaopay.com/favicon.ico',
      bgRGBA: '255,84,15',
      coverUrl: `${ogData['og:image'].replace(/\https:\/\/www\./g, 'https://')}`
    }

    const frontmatter = createFrontMatter(meta)
    const endMatter = createEndMatter(meta)
    const articleContent = document.querySelector('article.markdown').innerHTML
    let mdContent = getTurndownResult(articleContent);
    mdContent = combineFrontAndEnd(mdContent, frontmatter, endMatter);
    mdContent = churnSpecialChars(mdContent);
    mdContent = simplifyCodeblockLang(mdContent);
    mdContent = transformLinks(mdContent);

    return {
      filename: `${meta.articlePath}.md`,
      text: mdContent
    }
  } catch (error) {
    console.error('Failed to copy JSON:', error);
  }
}

function ElRemoveAll(selector = '') {
  console.log(`removeAll ... selector: ${selector}`)
  if (selector == '') {
    console.log('EXIT: no selector found ...')
    return;
  }
  document.querySelectorAll(selector)?.forEach((e) => e.remove())
}

function combineFrontAndEnd(md = '', frontmatter = '', endmatter = '') {
  console.log(`churnFirsthand ...`)
  if (md == '') {
    console.log('EXIT: no content found ...')
    return;
  }
  return `${frontmatter}${md.replace(/\(https:\/\/www\./g, '(https://')
    .replace(/https:\/\/www.youtube.com\/watch\?v=/g, 'https://youtu.be/')
    .replace(/(?:^|\n)##\s/g, '\n---\n\n## ') // h2 처리
    .replace(/\-   /g, '- ') // ul처리
    .replace(/    \n\-/g, '-') // ul처리
    .replace(/(?<=[0-9]\.)\s\s/g, ' ')}${endmatter}` // ol처리
    .replace(/    \n(?=[0-9]\.)/g, '') // ol처리
}

function churnSpecialChars(md = '') {
  console.log(`churnSpecialChars ...`)
  if (md == '') {
    console.log('EXIT: no content found ...')
    return;
  }
  return md.replace(/\\\./g, '.')
    .replace(/\\`/g, '`')
    .replace(/(\\-)|(\\–)/g, '-')
    .replace(/\\_/g, '_')
    .replace(/ /g, ' ')
    .replace(/\\=/g, '=')
    .replace(/\\\[/g, '[')
    .replace(/\\\]/g, ']')
    .replace(/\\>/g, '>')
}

function simplifyCodeblockLang(md = '') {
  console.log(`simplifyCodeblockLang ...`)
  if (md == '') {
    console.log('EXIT: no content found ...')
    return;
  }
  return md.replace(/```markdown/g, '```md')
    .replace(/```(markup|svg)/g, '```xml')
    .replace(/```javascript/g, '```js')
    .replace(/```typescript/g, '```ts')
    .replace(/```python/g, '```py')
    .replace(/```(shell|bash)/g, '```sh')
    .replace(/```csharp/g, '```cs')

}

function transformLinks(md = '') {
  console.log('md-gen > transformLinks ...')
  if (md == '') {
    console.log('EXIT: no content found ...')
    return;
  }
  return md.replace(/\[(?=[^\]]*\]\(https:\/\/.*mozilla\.org\/[^)]*\))/g, '[<VPIcon icon="fa-brands fa-firefox"/>') // Firefox
    .replace(/\[(?=[^\]]*\]\(https:\/\/.*google\.com\/[^)]*\))/g, '[<VPIcon icon="fa-brands fa-google"/>') // Google
    .replace(/\[(?=[^\]]*\]\(https:\/\/.*chrome\.com\/[^)]*\))/g, '[<VPIcon icon="fa-brands fa-chrome"/>') // Google Chrome
    .replace(/\[(?=[^\]]*\]\(https:\/\/antigravity\.google\/[^)]*\))/g, '[<VPIcon icon="iconfont icon-antigravity"/>') // Antigravity
    .replace(/\[(?=[^\]]*\]\(https:\/\/(.*youtube\.com|youtu\.be)\/[^)]*\))/g, '[<VPIcon icon="fa-brands fa-youtube"/>') // Youtube
    .replace(/\[(?=[^\]]*\]\(https:\/\/(.*vimeo\.com)\/[^)]*\))/g, '[<VPIcon icon="fa-brands fa-vimeo"/>') // Vimeo
    .replace(/\[(?=[^\]]*\]\(https:\/\/.*\.wikipedia\.org\/[^)]*\))/g, '[<VPIcon icon="fa-brands fa-wikipedia-w"/>') // Wikipedia
    .replace(/\[(?=[^\]]*\]\(https:\/\/.*stackoverflow\.(co|com)\/[^)]*\))/g, '[<VPIcon icon="fa-brands fa-stack-overflow"/>') // Stackoverflow
    .replace(/\[(?=[^\]]*\]\(https:\/\/.*(reactjs\.org|react\.dev)\/[^)]*\))/g, '[<VPIcon icon="fa-brands fa-react"/>') // React.js
    .replace(/\[(?=[^\]]*\]\(https:\/\/.*(nextjs\.org)\/[^)]*\))/g, '[<VPIcon icon="iconfont icon-nextjs"/>') // Next.js
    .replace(/\[(?=[^\]]*\]\(https:\/\/.*(expo\.dev)\/[^)]*\))/g, '[<VPIcon icon="iconfont icon-expo"/>') // Expo
    .replace(/\[(?=[^\]]*\]\(https:\/\/.*redux\.js\.org\/[^)]*\))/g, '[<VPIcon icon="iconfont icon-redux"/>') // Redux
    .replace(/\[(?=[^\]]*\]\(https:\/\/.*angular\.io\/[^)]*\))/g, '[<VPIcon icon="fa-brands fa-angular"/>') // Angular
    .replace(/\[(?=[^\]]*\]\(https:\/\/.*expressjs\.com\/[^)]*\))/g, '[<VPIcon icon="iconfont icon-expressjs"/>') // Express.js
    .replace(/\[(?=[^\]]*\]\(https:\/\/.*axios-http\.com\/[^)]*\))/g, '[<VPIcon icon="iconfont icon-axios"/>') // Axios
    .replace(/\[(?=[^\]]*\]\(https:\/\/.*nestjs\.com\/[^)]*\))/g, '[<VPIcon icon="iconfont icon-nestjs"/>') // Nest.js
    .replace(/\[(?=[^\]]*\]\(https:\/\/.*lit\.dev\/[^)]*\))/g, '[<VPIcon icon="iconfont icon-lit"/>') // Lit
    .replace(/\[(?=[^\]]*\]\(https:\/\/.*storybook\.js\.org\/[^)]*\))/g, '[<VPIcon icon="iconfont icon-storybook"/>') // Storybook.js
    .replace(/\[(?=[^\]]*\]\(https:\/\/.*gruntjs\.com\/[^)]*\))/g, '[<VPIcon icon="iconfont icon-grunt"/>') // Grunt
    .replace(/\[(?=[^\]]*\]\(https:\/\/.*prismjs\.com\/[^)]*\))/g, '[<VPIcon icon="iconfont icon-prismjs"/>') // Prism.js
    .replace(/\[(?=[^\]]*\]\(https:\/\/.*babeljs\.io\/[^)]*\))/g, '[<VPIcon icon="iconfont icon-babel"/>') // Babel
    .replace(/\[(?=[^\]]*\]\(https:\/\/.*webpack\.js\.org\/[^)]*\))/g, '[<VPIcon icon="iconfont icon-webpack"/>') // Webpack
    .replace(/\[(?=[^\]]*\]\(https:\/\/.*playwright\.dev\/[^)]*\))/g, '[<VPIcon icon="iconfont icon-playwright"/>') // Playwright
    .replace(/\[(?=[^\]]*\]\(https:\/\/.*yeoman\.io\/[^)]*\))/g, '[<VPIcon icon="iconfont icon-yeoman"/>') // Yeoman
    .replace(/\[(?=[^\]]*\]\(https:\/\/.*typescriptlang\.org\/[^)]*\))/g, '[<VPIcon icon="iconfont icon-typescript"/>') // TypeScript
    .replace(/\[(?=[^\]]*\]\(https:\/\/.*zod\.dev\/[^)]*\))/g, '[<VPIcon icon="iconfont icon-zod"/>') // Zod
    .replace(/\[(?=[^\]]*\]\(https:\/\/.*hono\.dev\/[^)]*\))/g, '[<VPIcon icon="iconfont icon-hono"/>') // Hono
    .replace(/\[(?=[^\]]*\]\(https:\/\/.*electronjs\.org\/[^)]*\))/g, '[<VPIcon icon="iconfont icon-electron"/>') // Electron
    .replace(/\[(?=[^\]]*\]\(https:\/\/.*nodejs\.org\/[^)]*\))/g, '[<VPIcon icon="fa-brands fa-node"/>') // Node.js
    .replace(/\[(?=[^\]]*\]\(https:\/\/.*deno\.com\/[^)]*\))/g, '[<VPIcon icon="iconfont icon-deno"/>') // Deno
    .replace(/\[(?=[^\]]*\]\(https:\/\/.*vite\.dev\/[^)]*\))/g, '[<VPIcon icon="iconfont icon-vite"/>') // Vite
    .replace(/\[(?=[^\]]*\]\(https:\/\/.*graphql\.org\/[^)]*\))/g, '[<VPIcon icon="iconfont icon-graphql"/>') // GraphQL
    .replace(/\[(?=[^\]]*\]\(https:\/\/.*v0\.app\/[^)]*\))/g, '[<VPIcon icon="iconfont icon-v0"/>') // v0
    .replace(/\[(?=[^\]]*\]\(https:\/\/.*tailwindcss\.com\/[^)]*\))/g, '[<VPIcon icon="iconfont icon-tailwindcss"/>') // Tailwind CSS
    .replace(/\[(?=[^\]]*\]\(https:\/\/.*sass-lang\.com\/[^)]*\))/g, '[<VPIcon icon="fa-brands fa-sass"/>') // Sass
    .replace(/\[(?=[^\]]*\]\(https:\/\/.*python\.org\/[^)]*\))/g, '[<VPIcon icon="fa-brands fa-python"/>') // Python
    .replace(/\[(?=[^\]]*\]\(https:\/\/.*mongodb\.com\/[^)]*\))/g, '[<VPIcon icon="iconfont icon-mongodb"/>') // MongoDB
    .replace(/\[(?=[^\]]*\]\(https:\/\/.*djangoproject\.com\/[^)]*\))/g, '[<VPIcon icon="iconfont icon-django"/>') // Django
    .replace(/\[(?=[^\]]*\]\(https:\/\/.*fastap\.tiangolo\.com\/[^)]*\))/g, '[<VPIcon icon="iconfont icon-fastapi"/>') // FastAPI
    .replace(/\[(?=[^\]]*\]\(https:\/\/.*pandas\.pydata\.org\/[^)]*\))/g, '[<VPIcon icon="iconfont icon-pandas"/>') // Pandas
    .replace(/\[(?=[^\]]*\]\(https:\/\/.*jupyter\.org\/[^)]*\))/g, '[<VPIcon icon="iconfont icon-jupyter"/>') // Jupyter Notebook
    .replace(/\[(?=[^\]]*\]\(https:\/\/.*pub\.dev\/[^)]*\))/g, '[<VPIcon icon="fa-brands fa-dart-lang"/>') // Dart
    .replace(/\[(?=[^\]]*\]\(https:\/\/.*flutter\.dev\/[^)]*\))/g, '[<VPIcon icon="iconfont icon-flutter"/>') // Flutter
    .replace(/\[(?=[^\]]*\]\(https:\/\/.*go\.dev\/[^)]*\))/g, '[<VPIcon icon="fa-brands fa-golang"/>') // Go
    .replace(/\[(?=[^\]]*\]\(https:\/\/.*openai\.com\/[^)]*\))/g, '[<VPIcon icon="iconfont icon-openai"/>') // OpenAI
    .replace(/\[(?=[^\]]*\]\(https:\/\/.*docker\.com\/[^)]*\))/g, '[<VPIcon icon="fa-brands fa-docker"/>') // Docker
    .replace(/\[(?=[^\]]*\]\(https:\/\/.*podman\.io\/[^)]*\))/g, '[<VPIcon icon="iconfont icon-podman"/>') // Podman
    .replace(/\[(?=[^\]]*\]\(https:\/\/.*kaggle\.com\/[^)]*\))/g, '[<VPIcon icon="iconfont icon-kaggle"/>') // Kaggle
    .replace(/\[(?=[^\]]*\]\(https:\/\/.*aws\.amazon\.com\/[^)]*\))/g, '[<VPIcon icon="fa-brands fa-aws"/>') // AWS
    .replace(/\[(?=[^\]]*\]\(https:\/\/.*amazon\.com\/[^)]*\))/g, '[<VPIcon icon="fa-brands fa-amazon"/>') // Amazon
    .replace(/\[(?=[^\]]*\]\(https:\/\/.*cloudflare\.com\/[^)]*\))/g, '[<VPIcno icon="fa-brands fa-cloudflare"/>') // Cloudflare
    .replace(/\[(?=[^\]]*\]\(https:\/\/.*digitalocean\.com\/[^)]*\))/g, '[<VPIcno icon="fa-brands fa-digital-ocean"/>') // DigitalOcean
    .replace(/\[(?=[^\]]*\]\(https:\/\/.*kubernetes\.io\/[^)]*\))/g, '[<VPIcon icon="iconfont icon-k8s"/>') // Kubernetes
    .replace(/\[(?=[^\]]*\]\(https:\/\/.*golang\.org\/[^)]*\))/g, '[<VPIcon icon="fa-brands fa-golang"/>') // Go
    .replace(/\[(?=[^\]]*\]\(https:\/\/.*php\.net\/[^)]*\))/g, '[<VPIcon icon="fa-brands fa-php"/>') // PHP
    .replace(/\[(?=[^\]]*\]\(https:\/\/.*git-scm\.com\/[^)]*\))/g, '[<VPIcon icon="iconfont icon-git"/>') // Git
    .replace(/\[(?=[^\]]*\]\(https:\/\/.*prettier\.io\/[^)]*\))/g, '[<VPIcon icon="iconfont icon-prettier"/>') // Prettier
    .replace(/\[(?=[^\]]*\]\(https:\/\/.*stylelint\.io\/[^)]*\))/g, '[<VPIcon icon="iconfont icon-stylelint"/>') // Stylelint
    .replace(/\[(?=[^\]]*\]\(https:\/\/.*-eslint\.io\/[^)]*\))/g, '[<VPIcon icon="iconfont icon-eslint"/>') // ESLint
    .replace(/\[(?=[^\]]*\]\(https:\/\/.*sevalla\.com\/[^)]*\))/g, '[<VPIcon icon="iconfont icon-sevalla"/>') // Sevalla
    .replace(/\[(?=[^\]]*\]\(https:\/\/.*heroku\.com\/[^)]*\))/g, '[<VPIcon icon="iconfont icon-heroku"/>') // Heroku
    .replace(/\[(?=[^\]]*\]\(https:\/\/.*postgresql\.org\/[^)]*\))/g, '[<VPIcon icon="iconfont icon-postgresql"/>') // PostgreSQL
    .replace(/\[(?=[^\]]*\]\(https:\/\/.*mysql\.com\/[^)]*\))/g, '[<VPIcon icon="iconfont icon-mysql"/>') // MySQL
    .replace(/\[(?=[^\]]*\]\(https:\/\/.*sqlite\.org\/[^)]*\))/g, '[<VPIcon icon="iconfont icon-sqlite"/>') // SQLite
    .replace(/\[(?=[^\]]*\]\(https:\/\/.*dbeaver\.io\/[^)]*\))/g, '[<VPIcon icon="iconfont icon-dbeaver"/>') // DBeaver
    .replace(/\[(?=[^\]]*\]\(https:\/\/.*cockroachlabs\.cloud\/[^)]*\))/g, '[<VPIcon icon="iconfont icon-cockroach"/>') // CockroachDB
    .replace(/\[(?=[^\]]*\]\(https:\/\/.*ubuntu\.com\/[^)]*\))/g, '[<VPIcon icon="fa-brands fa-ubuntu"/>') // Ubuntu
    .replace(/\[(?=[^\]]*\]\(https:\/\/.*brew\.sh\/[^)]*\))/g, '[<VPIcon icon="iconfont icon-homebrew"/>') // Homebrew
    .replace(/\[(?=[^\]]*\]\(https:\/\/.*grafana\.com\/[^)]*\))/g, '[<VPIcon icon="iconfont icon-grafana"/>') // Grafana
    .replace(/\[(?=[^\]]*\]\(https:\/\/.*spring\.io\/[^)]*\))/g, '[<VPIcon icon="iconfont icon-spring"/>') // Spring
    .replace(/\[(?=[^\]]*\]\(https:\/\/.*laravel\.com\/[^)]*\))/g, '[<VPIcon icon="fa-brands fa-laravel"/>') // Laravel
    .replace(/\[(?=[^\]]*\]\(https:\/\/.*codesandbox\.io\/[^)]*\))/g, '[<VPIcon icon="iconfont icon-codesandbox"/>') // CodeSandbox
    .replace(/\[(?=[^\]]*\]\(https:\/\/.*figma\.com\/[^)]*\))/g, '[<VPIcon icon="fa-brands fa-figma"/>') // Figam
    .replace(/\[(?=[^\]]*\]\(https:\/\/.*flickr\.com\/[^)]*\))/g, '[<VPIcon icon="fa-brands fa-flickr"/>') // Flickr
    .replace(/\[(?=[^\]]*\]\(https:\/\/.*twilio\.com\/[^)]*\))/g, '[<VPIcon icon="iconfont twilio"/>') // Twilio
    .replace(/\[(?=[^\]]*\]\(https:\/\/.*(w3|drafts\.csswg)\.org\/[^)]*\))/g, '[<VPIcon icon="iconfont icon-w3c"/>') // W3
    .replace(/\[(?=[^\]]*\]\(https:\/\/.*penpot\.app\/[^)]*\))/g, '[<VPIcon icon="iconfont icon-penpot"/>') // Penpot
    .replace(/\[(?=[^\]]*\]\(https:\/\/.*ibm\.com\/[^)]*\))/g, '[<VPIcon icon="iconfont icon-ibm"/>') // IBM
    .replace(/\[(?=[^\]]*\]\(https:\/\/.*naver\.com\/[^)]*\))/g, '[<VPIcon icon="iconfont icon-naver"/>') // Naver
    .replace(/\[(?=[^\]]*\]\(https:\/\/.*ollama\.com\/[^)]*\))/g, '[<VPIcon icon="iconfont icon-ollama"/>') // Ollama
    .replace(/\[(?=[^\]]*\]\(https:\/\/.*apple\.com\/[^)]*\))/g, '[<VPIcon icon="fa-brands fa-apple"/>') // Apple
    .replace(/\[(?=[^\]]*\]\(https:\/\/.*android\.com\/[^)]*\))/g, '[<VPIcon icon="fa-brands fa-anddroid"/>') // Android
    .replace(/\[(?=[^\]]*\]\(https:\/\/.*apache\.org\/[^)]*\))/g, '[<VPIcon icon="iconfont icon-Apache"/>') // Apache
    .replace(/\[(?=[^\]]*\]\(https:\/\/.*scalar\.com\/[^)]*\))/g, '[<VPIcon icon="iconfont icon-scalar"/>') // Scalar
    .replace(/\[(?=[^\]]*\]\(https:\/\/.*swagger\.io\/[^)]*\))/g, '[<VPIcon icon="iconfont icon-swagger"/>') // Swagger
    .replace(/\[(?=[^\]]*\]\(https:\/\/.*postman\.com\/[^)]*\))/g, '[<VPIcon icon="iconfont icon-postman"/>') // Postman
    .replace(/\[(?=[^\]]*\]\(https:\/\/.*huggingface\.co\/[^)]*\))/g, '[<VPIcon icon="iconfont icon-huggingface"/>') // Hugging Face
    .replace(/\[(?=[^\]]*\]\(https:\/\/.*arxiv\.org\/[^)]*\))/g, '[<VPIcon icon="iconfont icon-arxiv"/>') // arXiv
    .replace(/\[(?=[^\]]*\]\(https:\/\/.*slideshare\.net\/[^)]*\))/g, '[<VPIcon icon="iconfont icon-slideshare"/>') // Slideshare
    .replace(/\[(?=[^\]]*\]\(https:\/\/.*dribbble\.com\/[^)]*\))/g, '[<VPIcon icon="fa-brands fa-dribbble"/>') // Dribbble
    .replace(/\[(?=[^\]]*\]\(https:\/\/.*modelcontextprotocol\.io\/[^)]*\))/g, '[<VPIcon icon="iconfont icon-mcp"/>') // mcp
    .replace(/\[(?=[^\]]*\]\(https:\/\/.*nvidia\.com\/[^)]*\))/g, '[<VPIcon icon="iconfont icon-nvidia"/>') // NVidia
    .replace(/\](?=\(https?:\/\/(?:www\.)?github\.com\/([^/)]+\/[^/)]+))/g, ' (<VPIcon icon="iconfont icon-github" />`$1`)]') // Github
    .replace(/\](?=\(https?:\/\/(?:www\.)?linkedin\.com\/in\/([^/?)]+))/g, ' (<VPIcon icon="fa-brands fa-linkedin" />`$1`)]') // Linkedin
    .replace(/\](?=\(https?:\/\/(?:www\.)?reddit\.com\/r\/([^/)]+))/g, ' (<VPIcon icon="fa-brands fa-reddit" />`$1`)]') // Reddit
    .replace(/\](?=\(https?:\/\/(?:www\.)?codepen\.io\/([^/]+)\/pen\/)/g, ' (<VPIcon icon="fa-brands fa-codepen" />`$1`)]') // Codepen
    .replace(/\](?=\(https?:\/\/(?:www\.)?cdpn\.io\/([^/]+)\/debug\/)/g, ' (<VPIcon icon="fa-brands fa-codepen" />`$1`)]') // Codepen
    .replace(/\](?=\(https?:\/\/(?:www\.)?medium\.com\/([^/]+))/g, ' (<VPIcon icon="fa-brands fa-medium" />`$1`)]') // Medium
    .replace(/\](?=\(https:\/\/(?:x|twitter)\.com\/([^/)]+)\))/g, ' (<VPIcon icon="fa-brands fa-x-twitter" />`$1`)]') // X (Formally Twitter)
    .replace(/\](?=\(https:\/\/dev\.to\/([^/]+))/g, ' (<VPIcon icon="fa-brands fa-dev" />`$1`)]') // Dev
    .replace(/\](?=\(https?:\/\/(?:www\.)?buymeacoffee\.com\/([^/?)]+))/g, ' (<VPIcon icon="iconfont icon-buymeacoffee" />`$1`)]') // Buymeacoffee
}

function getTurndownResult(articleContent = '') {
  console.log('md-gen > createMdContent ...')
  const turndownService = new TurndownService({
    headingStyle: 'atx',
    bulletListMarker: '-',
    codeBlockStyle: 'fenced',
    hr: '---',
    emDelimiter: '*',
    preformattedCode: 'true',
  });
  turndownService.use([
    turndownPluginGfm.gfm,
    turndownPluginGfm.tables,
    turndownPluginGfm.strikethrough
  ])
  return turndownService.turndown(articleContent)
}