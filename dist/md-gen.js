// md-gen.js

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
      .replace(/(?<=[0-9]\.)\s\s/g, ' ')}${endMatter}` // ol처리
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
      .replace(/(?<=[0-9]\.)\s\s/g, ' ')}${endMatter}` // ol처리
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
      .replace(/(?<=[0-9]\.)\s\s/g, ' ')}${endMatter}` // ol처리
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
      lang: 'ko-KR',
      title: document.querySelector('title')
          ?.textContent
          ?.trim(),
      description: `${document.querySelectorAll('meta[name="description"]') ?? ''}`,
      topic: '',
      author: document.querySelector('.author-meta a.author-link')
        ?.textContent.trim() ?? '',
      datePublished: convertDateFormat(
        document.querySelector('time.block-time')
        ?.getAttribute('datetime') ?? ''),
      baseUrl: 'https://frontendmasters.com',
      articleBasePath: 'frontendmasters.com',
      articlePath: path.replace(/\//g, ''),
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
      .replace(/\-   /g, '- ') // ul처리
      .replace(/(?<=[0-9]\.)\s\s/g, ' ')}${endMatter}` // ol처리
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
      description: `${ogData['og:description']}`,
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
                      .replace(/(https:\/\/)|(www\.)|(smashingmagazine\.com\/)|(\d{4}\/\d{2}\/)/g, ''),
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
      .replace(/(?<=[0-9]\.)\s\s/g, ' ')}${endMatter}` // ol처리
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
      .replace(/(?<=[0-9]\.)\s\s/g, ' ')}${endMatter}` // ol처리
    return {
      filename: `${meta.articlePath}.md`,
      text: mdContent
    };
  } catch (error) {
    console.error('Failed to copy JSON:', error);
  }
}