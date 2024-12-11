// md-gen.js
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
        if((nodeList[i].getAttribute("rel") == "icon")||(nodeList[i].getAttribute("rel") == "shortcut icon")) {
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

    const path= `${ogData['og:url']}`
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
      datePublished: convertDateFormat(
        document.querySelector('.post-full-meta-date')
        ?.getAttribute('datetime') ?? ''),
      baseUrl: 'https://freecodecamp.org',
      articleBasePath: 'freecodecamp.org',
      articleOriginPath: `news/${path}`,
      articlePath: path,
      logo: 'https://cdn.freecodecamp.org/universal/favicons/favicon.ico',
      bgRGBA: '10,10,35',
      coverUrl: `${ogData['og:image']}`
    }
    const frontmatter = createFrontMatter(meta)
    const endMatter = createEndMatter(meta)

    const articleContent = document.querySelector('.post-content').innerHTML
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
    let mdContent = turndownService.turndown(articleContent)
    mdContent = `${frontmatter}${mdContent.replace(/https:\/\/www.youtube.com\/watch\?v=/g, 'https://youtu.be/')
      .replace(/\[freeCodeCamp.org\]/g, '[<FontIcon icon="fa-brands fa-free-code-camp"/>freeCodeCamp.org]')
      .replace(/\(https:\/\/www\./g, '(https://')
      .replace(/(?:^|\n)##\s/g, '\n---\n\n## ') // h2 처리
      .replace(/\-   /g, '- ') // ul처리
      .replace(/    \n\-/g, '-') // ul처리
      .replace(/(?<=[0-9]\.)\s\s/g, ' ')}${endMatter}` // ol처리
      .replace(/    \n(?=[0-9]\.)/g, '') // ol처리
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
    document.querySelector('.mb-16.mt-10').remove()

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
      topic: 'cs',
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
    let mdContent = turndownService.turndown(articleContent)
    mdContent = `${frontmatter}${mdContent.replace(/\(https:\/\/www\./g, '(https://')
      .replace(/https:\/\/www.youtube.com\/watch\?v=/g, 'https://youtu.be/')
      .replace(/\]\(\/blogs\/mnw/g, `](https://milanjovanovic.tech/blogs/mnw`)
      .replace(/(?:^|\n)##\s/g, '\n---\n\n## ') // h2 처리
      .replace(/\-   /g, '- ') // ul처리
      .replace(/    \n\-/g, '-') // ul처리
      .replace(/(?<=[0-9]\.)\s\s/g, ' ')}${endMatter}` // ol처리
      .replace(/    \n(?=[0-9]\.)/g, '') // ol처리
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
      link:  `/${meta.articleBasePath}/${(meta.articlePath+'.md').replace(/[\w-]+\.md/g, '')}README.md`,
      logo: meta.logo,
      background: "174,10,10"
    }
    const frontmatter = createFrontMatter(meta, customVpCard)
    const endMatter = createEndMatter(meta)

    // document.querySelector('h1.title')
    document.querySelector('.hws-sponsor')?.remove()
    document.querySelector('p.lead')?.remove()
    const articleContent = document.querySelector('.col-lg-9').innerHTML
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
    let mdContent = turndownService.turndown(articleContent)
    mdContent = `${frontmatter}${mdContent.replace(/\(https:\/\/www\./g, '(https://')
      .replace(/https:\/\/www.youtube.com\/watch\?v=/g, 'https://youtu.be/')
      .replace(/(?:^|\n)##\s/g, '\n---\n\n## ') // h2 처리
      .replace(/\-   /g, '- ') // ul처리
      .replace(/    \n\-/g, '-') // ul처리
      .replace(/(?<=[0-9]\.)\s\s/g, ' ')}${endMatter}` // ol처리
      .replace(/    \n(?=[0-9]\.)/g, '') // ol처리
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
    let mdContent = turndownService.turndown(articleContent)
    mdContent = `${frontmatter}${mdContent.replace(/\(https:\/\/www\./g, '(https://')
      .replace(/(?:^|\n)##\s/g, '\n---\n\n## ') // h2 처리
      .replace(/\-   /g, '- ') // ul처리
      .replace(/    \n\-/g, '-') // ul처리
      .replace(/(?<=[0-9]\.)\s\s/g, ' ')}${endMatter}` // ol처리
      .replace(/    \n(?=[0-9]\.)/g, '') // ol처리
    return {
      filename: `${meta.articlePath}.md`,
      text: mdContent
    };

  } catch (error) {
    console.error('Failed to copy JSON:', error);
  }
}

function fetchFrontendmMastersBlog(path = '') {
  console.log('fetchFrontendmMastersBlog ... ')
  try {
    // Extract Open Graph metadata
    const ogData = parseOgData();

    const meta = {
      lang: 'en-US',
      title: document.querySelector('title')
          ?.textContent
          ?.trim()
          ?.replace(/ – Frontend Masters Boost/g, ''),
      description: `${document.querySelector('meta[name="description"]')?.getAttribute("content") ?? ''}`.replace(/"/g, "”"),
      topic: '',
      author: document.querySelector('.author-meta a.author-link')
        ?.textContent.trim() ?? '',
      datePublished: convertDateFormat(
        document.querySelector('time.block-time')
        ?.getAttribute('datetime') ?? ''),
      baseUrl: 'https://frontendmasters.com',
      articleBasePath: 'frontendmasters.com',
      articlePath: path.replace(/\//g, ''),
      articleOriginPath: `blog/${path}`,
      logo: 'https://frontendmasters.com/favicon.ico',
      bgRGBA: '188,75,52',
      coverUrl: `${ogData['og:image'].replace(/\https:\/\/www\./g, 'https://')}`
    }
    const frontmatter = createFrontMatter(meta)
    const endMatter = createEndMatter(meta)
    const articleContent = document.querySelector('.article-content').innerHTML
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
    let mdContent = turndownService.turndown(articleContent)
    mdContent = `${frontmatter}${mdContent.replace(/\(https:\/\/www\./g, '(https://')
      .replace(/(?:^|\n)##\s/g, '\n---\n\n## ') // h2 처리
      .replace(/\# \[\]\(\#.*\)/g, '# ')
      .replace(/\-   /g, '- ') // ul처리
      .replace(/    \n\-/g, '-') // ul처리
      .replace(/(?<=[0-9]\.)\s\s/g, ' ')}${endMatter}` // ol처리
      .replace(/    \n(?=[0-9]\.)/g, '') // ol처리
      .replace(/(\`Code language\:.*\(*\))/g, '\n\`\`\`') // ol처리
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

    const meta = {
      lang: 'ko-KR',
      title: `${ogData['og:title']}`.replace(/ — Smashing Magazine/g, ''),
      description: `${ogData['og:description']}`.replace(/"/g, "”"),
      topic: '',
      author: document.querySelector('a.author-post__author-title').textContent ?? '',
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
      coverUrl: `${ogData['og:image'].replace(/\https:\/\/www\./g, 'https://')}`
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
    let mdContent = turndownService.turndown(articleContent)
    mdContent = `${frontmatter}${mdContent.replace(/\(https:\/\/www\./g, '(https://')
      .replace(/(?:^|\n)##\s/g, '\n---\n\n## ') // h2 처리
      .replace(/\-   /g, '- ') // ul처리
      .replace(/    \n\-/g, '-') // ul처리
      .replace(/(?<=[0-9]\.)\s\s/g, ' ')}${endMatter}` // ol처리
      .replace(/    \n(?=[0-9]\.)/g, '') // ol처리
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

    const meta = {
      lang: 'en-US',
      title: document.querySelector('h1').textContent,
      description: `${ogData['og:description']}`.replace(/"/g, "”"),
      topic: '',
      author: document.querySelector('.author').textContent.replace(/By\s/g, '') ?? '',
      datePublished: convertDateFormat(
        document.querySelector('.jnatsz').textContent.replace(/Published on /g, '') ?? ''
      ),
      baseUrl: 'https://digitalocean.com',
      articleBasePath: 'digitalocean.com',
      articlePath: path.replace(/\//g, ''),
      articleOriginPath: path.replace(/(https:\/\/)|(www\.)|(digitalocean\.com\/)|(community\/)|(tutorial\/)|(articles\/)/g, ''),
      logo: 'https://digitalocean.com/_next/static/media/favicon.594d6067.ico',
      bgRGBA: '44,103,246',
      coverUrl: `${ogData['og:image']?.replace(/\https:\/\/www\./g, 'https://')}`
    }
    const frontmatter = createFrontMatter(meta)
    const endMatter = createEndMatter(meta)
    const articleContent = document.querySelector('.kfTVTG').innerHTML
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
    let mdContent = turndownService.turndown(articleContent)
    mdContent = `${frontmatter}${mdContent.replace(/\(https:\/\/www\./g, '(https://')
      .replace(/(?:^|\n)##\s/g, '\n---\n\n## ') // h2 처리
      .replace(/\-   /g, '- ') // ul처리
      .replace(/    \n\-/g, '-') // ul처리
      .replace(/(?<=[0-9]\.)\s\s/g, ' ')}${endMatter}` // ol처리
      .replace(/    \n(?=[0-9]\.)/g, '') // ol처리

    return {
      filename: `${meta.articlePath}.md`,
      text: mdContent
    };
  } catch (error) {
    console.error('Failed to copy JSON:', error);
  }
}

function fetchLearnK8sBlog() {
  console.log('fetchLearnK8sBlog ... ')
  try {
    // Extract Open Graph metadata
    const ogData = parseOgData();

    const meta = {
      lang: 'en-US',
      title: document.querySelector('h1').textContent,
      description: `${ogData['og:description']}`.replace(/"/g, "”"),
      topic: 'kubernetes',
      author: document.querySelector('.black-50.f6.db').textContent.replace(/By\s/g, '') ?? '',
      datePublished: convertDateFormat(
        document.querySelector('.f7.black-60.tc.ttu.b').textContent ?? ''
      ),
      baseUrl: 'https://learnk8s.com',
      articleBasePath: 'learnk8s.com',
      articlePath: `${ogData['og:url']}`
          .replace(/(https:\/\/)|(www\.)|(learnk8s\.com\/)/g, '')
          .replace(/\//g, ''),
      articleOriginPath: `${ogData['og:url']}`
          .replace(/(https:\/\/)|(www\.)|(learnk8s\.com\/)/g, '')
          .replace(/\//g, ''),
      logo: 'https://static.learnk8s.io/f7e5160d4744cf05c46161170b5c11c9.svg',
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
    let mdContent = turndownService.turndown(articleContent)
    mdContent = `${frontmatter}${mdContent.replace(/\(https:\/\/www\./g, '(https://')
      .replace(/(?:^|\n)##\s/g, '\n---\n\n## ') // h2 처리
      .replace(/\-   /g, '- ') // ul처리
      .replace(/    \n\-/g, '-') // ul처리
      .replace(/(?<=[0-9]\.)\s\s/g, ' ')}${endMatter}` // ol처리
      .replace(/    \n(?=[0-9]\.)/g, '') // ol처리

    return {
      filename: `${meta.articlePath}.md`,
      text: mdContent
    };
  } catch (error) { ppop
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
    let mdContent = turndownService.turndown(articleContent)
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
      .replace(/\_/g, "_")
      .replace(/\-/g, "-")
      .replace(/\=/g, "=")
      .replace(/\>/g, ">")
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

    document.querySelectorAll('.hs_cos_wrapper.hs_cos_wrapper_widget.hs_cos_wrapper_type_module')?.forEach((e) => e.remove())

    const frontmatter = createFrontMatter(meta)
    const endMatter = createEndMatter(meta)
    const articleContent = document.querySelector('#hs_cos_wrapper_post_body').innerHTML
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
    let mdContent = turndownService.turndown(articleContent)
    mdContent = `${frontmatter}${mdContent.replace(/\(https:\/\/www\./g, '(https://')
      .replace(/(?:^|\n)##\s/g, '\n---\n\n## ') // h2 처리
      .replace(/(?:^|##\s\n\n)/g, '## ') // h2 처리
      .replace(/\nxxxxxxxxxx\n/g, '```kotlin')
      .replace(/\-   /g, '- ') // ul처리
      .replace(/    \n\-/g, '-') // ul처리
      .replace(/(?<=[0-9]\.)\s\s/g, ' ')}${endMatter}` // ol처리
      .replace(/    \n(?=[0-9]\.)/g, '') // ol처리
      .replace(/\_/g, "_")
      .replace(/\-/g, "-")
      .replace(/\=/g, "=")
      .replace(/\>/g, ">")
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

    document.querySelectorAll('.prose>span')?.forEach((e) => e.remove())

    const frontmatter = createFrontMatter(meta)
    const endMatter = createEndMatter(meta)
    const articleContent = document.querySelector('.prose').innerHTML
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
    let mdContent = turndownService.turndown(articleContent)
    mdContent = `${frontmatter}${mdContent.replace(/\(https:\/\/www\./g, '(https://')
      .replace(/(?:^|\n)##\s/g, '\n---\n\n## ') // h2 처리
      .replace(/(?:^|##\s\n\n)/g, '## ') // h2 처리
      .replace(/\nxxxxxxxxxx\n/g, '```kotlin')
      .replace(/\-   /g, '- ') // ul처리
      .replace(/    \n\-/g, '-') // ul처리
      .replace(/(?<=[0-9]\.)\s\s/g, ' ')}${endMatter}` // ol처리
      .replace(/    \n(?=[0-9]\.)/g, '') // ol처리
      .replace(/\_/g, "_")
      .replace(/\-/g, "-")
      .replace(/\=/g, "=")
      .replace(/\>/g, ">")
    return {
      filename: `${meta.articlePath}.md`,
      text: mdContent
    }
  } catch (error) {
    console.error('Failed to copy JSON:', error);
  }
}

function fetchItsFossBlog() {
  console.log('fetchOutcomeSchoolBlog ... ')
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

    document.querySelectorAll('.hide-mobile')?.forEach((e) => e.remove())

    const frontmatter = createFrontMatter(meta)
    const endMatter = createEndMatter(meta)
    const articleContent = document.querySelector('article.post').innerHTML
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
    let mdContent = turndownService.turndown(articleContent)
    mdContent = `${frontmatter}${mdContent.replace(/\(https:\/\/www\./g, '(https://')
      .replace(/(?:^|\n)##\s/g, '\n---\n\n## ') // h2 처리
      .replace(/(?:^|##\s\n\n)/g, '## ') // h2 처리
      .replace(/\nxxxxxxxxxx\n/g, '```kotlin')
      .replace(/\-   /g, '- ') // ul처리
      .replace(/    \n\-/g, '-') // ul처리
      .replace(/(?<=[0-9]\.)\s\s/g, ' ')}${endMatter}` // ol처리
      .replace(/    \n(?=[0-9]\.)/g, '') // ol처리
      .replace(/\_/g, "_")
      .replace(/\-/g, "-")
      .replace(/\=/g, "=")
      .replace(/\>/g, ">")
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
    let mdContent = turndownService.turndown(articleContent)
    mdContent = `${frontmatter}${mdContent.replace(/\(https:\/\/www\./g, '(https://')
      .replace(/(?:^|\n)##\s/g, '\n---\n\n## ') // h2 처리
      .replace(/\-   /g, '- ') // ul처리
      .replace(/    \n\-/g, '-') // ul처리
      .replace(/(?<=[0-9]\.)\s\s/g, ' ')}${endMatter}` // ol처리
      .replace(/    \n(?=[0-9]\.)/g, '') // ol처리
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
      title: document.querySelector('.news-title')
          ?.textContent
          ?.trim(),
      description: `${ogData['og:description']}`.replace(/"/g, "”"),
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
    const articleContent = document.querySelector('.next-news-contents.news-highlight-box').innerHTML
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
    let mdContent = turndownService.turndown(articleContent)
    mdContent = `${frontmatter}${mdContent.replace(/\(https:\/\/www\./g, '(https://')
      .replace(/(?:^|\n)##\s/g, '\n---\n\n## ') // h2 처리
      .replace(/\-   /g, '- ') // ul처리
      .replace(/    \n\-/g, '-') // ul처리
      .replace(/(?<=[0-9]\.)\s\s/g, ' ')}${endMatter}` // ol처리
      .replace(/    \n(?=[0-9]\.)/g, '') // ol처리
    return {
      filename: `${meta.articlePath}.md`,
      text: mdContent
    };
  } catch (error) {
    console.error('Failed to copy JSON:', error);
  }
}