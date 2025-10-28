
function convertDateFormat(dateString) {
  if (dateString == null || dateString == '') {
    console.warn('util > convertDateFormat ... dataString EMPTY')
    return;
  }
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function parseOgData() {
  const ogData = {};
  let nodelist = document.querySelectorAll('meta[property^="og:"], meta[name^="og:"]')

  for (e of nodelist) {
    const property = e?.getAttribute('property') ?? e?.getAttribute('name');
    const content = e?.getAttribute('content');
    ogData[property] = content;
  };

  return ogData
}

function createFrontMatter(meta, customVpCard = null) {
  console.log(`util > createFrontMatter ... meta: ${JSON.stringify(meta)}`)
  const submeta = createSubMetaInfo(meta.topic)

  const vpCard = (customVpCard) ? `\`\`\`component VPCard
{
  "title": "${customVpCard.title}",
  "desc": "${customVpCard.desc}",
  "link": "${customVpCard.link}",
  "logo": "${customVpCard.logo}",
  "background": "rgba(${customVpCard.background},0.2)",
}
\`\`\`` : `\`\`\`component VPCard
{
  "title": "${submeta.pageName} > Article(s)",
  "desc": "Article(s)",
  "link": "${submeta.relatedPath}/articles/README.md",
  "logo": "/images/ico-wind.svg",
  "background": "rgba(10,10,10,0.2)"
}
\`\`\``
  const siteInfo = createSiteInfo(meta, customVpCard)
  const authorInfo = (meta.authorUrl == null || meta.authorUrl == '') 
    ? `author: ${meta.author}`
    : `author:
  - name: ${meta.author}
    url : ${meta.authorUrl}`
  return `---
lang: ${meta.lang ?? 'en-US'}
title: "${meta.title}"
description: "Article(s) > ${meta.title}"
icon: ${submeta.icon}
category:
  - ${submeta.category}
  - Article(s)
tag:
  - blog
  - ${meta.articleBasePath}
  - ${submeta.tag}
head:
  - - meta:
    - property: og:title
      content: "Article(s) > ${meta.title}"
    - property: og:description
      content: "${meta.title}"
    - property: og:url
      content: https://chanhi2000.github.io/bookshelf/${meta.articleBasePath}/${meta.articlePath}.html
prev: ${submeta.relatedPath}/articles/README.md
date: ${meta.datePublished}
isOriginal: false
${authorInfo}
cover: ${meta.coverUrl}
---

# {{ $frontmatter.title }} 관련

${vpCard}

[[toc]]

---

${siteInfo}
`
}

function createSubMetaInfo(topic) {
  console.log('createSubMetaInfo ...')
  let _pageName = ''
  let _icon = ''
  let _category = ''
  let _tag = ''
  let _relatedPath = ''
  if (/swift/g.test(topic)) {
    console.log(`${topic}!!!`)
    _pageName = 'Swift'
    _icon='fa-brands fa-swift'
    _category=`${_pageName}`
    _tag='swift\n  - ios\n  - macos\n  - xcode'
    _relatedPath='/programming/swift'
  } else if (/kotlin/.test(topic)) {
    console.log(`${topic}!!!`)
    _pageName = 'Kotlin'
    _icon='iconfont icon-kotlin'
    _category=`Java\n  - ${_pageName}`
    _tag='java\n  - kotlin'
    _relatedPath='/programming/java'
  } else if (/spring/.test(topic)) {
    console.log(`${topic}!!!`)
    _pageName = 'Spring'
    _icon='iconfont icon-spring'
    _category=`Java\n  - ${_pageName}`
    _tag='java\n  - kotlin'
    _relatedPath='/programming/java-spring'
  } else if (/android/.test(topic)) {
    console.log(`${topic}!!!`)
    _pageName = 'Android'
    _icon='fa-brands fa-android'
    _category=`Java\n  - Kotlin\n  - ${_pageName}`
    _tag='java\n  - kotlin\n  - android'
    _relatedPath='/programming/java-android'
  } else if (/(js|javascript)/.test(topic)) {
    console.log(`${topic}!!!`)
    _pageName = 'JavaScript'
    _icon='fa-brands fa-js'
    _category=`JavaScript`
    _tag='js\n  - javascript'
    _relatedPath='/programming/js'
  } else if (/(ts|typescript)/.test(topic)) {
    console.log(`${topic}!!!`)
    _pageName = 'TypeScript'
    _icon='iconfont icon-typescript'
    _category=`TypeScript`
    _tag='ts\n  - typesccript'
    _relatedPath='/programming/ts'
  } else if (/react/.test(topic)) {
    console.log(`${topic}!!!`)
    _pageName = 'React.js'
    _icon='fa-brands fa-react'
    _category=`Node.js\n  - ${_pageName}`
    _tag='node\n  - nodejs\n  - node-js\n  - react\n  - reactjs\n  - react-js'
    _relatedPath='/programming/js-react'
  } else if (/(next)/.test(topic)) {
    console.log(`${topic}!!!`)
    _pageName = 'Next.js'
    _icon='iconfont icon-nextjs'
    _category=`Node.js\n  - ${_pageName}`
    _tag='node\n  - nodejs\n  - node-js\n  - next\n  - nextjs\n  - next-js'
    _relatedPath='/programming/js-next'
  } else if (/(python)|(py)/g.test(topic)) {
    console.log(`${topic}!!!`)
    _pageName = 'Python'
    _icon='fa-brands fa-python'
    _category=`${_pageName}`
    _tag='py\n  - python'
    _relatedPath='/programming/py'
  } else if (/(django)/g.test(topic)) {
    console.log(`${topic}!!!`)
    _pageName = 'Django'
    _icon='iconfont icon-django'
    _category=`Python\n  - ${_pageName}`
    _tag='py\n  - python\n  - django\n  - py-django'
    _relatedPath='/programming/py-django'
  } else if (/(css)/g.test(topic)) {
    console.log(`${topic}!!!`)
    _pageName = 'CSS'
    _icon='fa-brands fa-css3-alt'
    _category=`${_pageName}`
    _tag='css'
    _relatedPath='/programming/css'
  } else if (/(csharp)|(c#)/g.test(topic)) {
    console.log(`${topic}!!!`)
    _pageName = 'C#'
    _icon='iconfont icon-csharp'
    _category=`${_pageName}\n  - DotNet`
    _tag='cs\n  - c#\n  - csharp\n  - dotnet'
    _relatedPath='/programming/cs'
  } else if (/(rust)/g.test(topic)) {
    console.log(`${topic}!!!`)
    _pageName = 'Rust'
    _icon='fa-brands fa-rust'
    _category=`${_pageName}`
    _tag='rs\n  - rust'
    _relatedPath='/programming/rust'
  } else if (/(go)/g.test(topic)) {
    console.log(`${topic}!!!`)
    _pageName = 'Go'
    _icon='fa-brands fa-golang'
    _category=`${_pageName}`
    _tag='go\n  - golang'
    _relatedPath='/programming/go'
  } else if (/(dart)|(flutter)/g.test(topic)) {
    console.log(`${topic}!!!`)
    _pageName = 'Dart'
    _icon='fa-brands fa-dart-lang'
    _category=`${_pageName}\n  - Flutter`
    _tag='dart\n  - flutter'
    _relatedPath='/programming/dart'
  } else if (/(git)/g.test(topic)) {
    console.log(`${topic}!!!`)
    _pageName = 'Git'
    _icon='iconfont icon-git'
    _category=`${_pageName}`
    _tag='git'
    _relatedPath='/programming/git'
  } else if (/(docker)/g.test(topic)) {
    console.log(`${topic}!!!`)
    _pageName = 'Docker'
    _icon='fa-brands fa-docker'
    _category=`DevOps\n  - ${_pageName}`
    _tag='devops\n  - docker'
    _relatedPath='/devops/docker'
  } else if (/(kubernetes)|(k8s)/g.test(topic)) {
    console.log(`${topic}!!!`)
    _pageName = 'Kubernetes'
    _icon='iconfont icon-k8s'
    _category=`DevOps\n  - ${_pageName}`
    _tag='devops\n  - kubernetes\n  - k8s'
    _relatedPath='/devops/k8s'
  } else if (/(ubutnu)|(debian)/g.test(topic)) {
    console.log(`${topic}!!!`)
    _pageName = 'Linux - Debian'
    _icon='fa-brands fa-debian'
    _category=`DevOps\n  - Linux\n  - Debian`
    _tag='devops\n  - linux\n  - debian\n  - ubuntu\n  - raspberry-pi\n  - kali\n  - kalilinux\n  - kali-linux'
    _relatedPath='/devops/linux-fedora'
  } else if (/(cent)|(centos)|(fedora)/g.test(topic)) {
    console.log(`${topic}!!!`)
    _pageName = 'Linux - Fedora'
    _icon='fa-brands fa-fedora'
    _category=`DevOps\n  - Linux\n  - Fedora`
    _tag='devops\n  - linux\n  - fedora\n  - redhat\n  - centos'
    _relatedPath='/devops/linux-fedora'
  }  else if (/(win)|(windows)/g.test(topic)) {
    console.log(`${topic}!!!`)
    _pageName = 'Windows'
    _icon='fa-brands fa-windows'
    _category=`DevOps\n  - ${_pageName}`
    _tag='devops\n  - win\n  - windows'
    _relatedPath='/devops/win'
  } else if (/(llm)/g.test(topic)) {
    console.log(`${topic}!!!`)
    _pageName = 'LLM'
    _icon='fas fa-language'
    _category=`AI\n  - ${_pageName}`
    _tag='ai\n  - artificial-intelligence\n  - llm\n  - large-language-model'
    _relatedPath='/ai/llm'
  } else if (/(mcp)/g.test(topic)) {
    console.log(`${topic}!!!`)
    _pageName = 'MCP'
    _icon='iconfont icon-mcp'
    _category=`AI\n  - LLM\n  - ${_pageName}`
    _tag='ai\n  - artificial-intelligence\n  - llm\n  - large-language-model\n  - mcp\n  - model-context-protocol'
    _relatedPath='/ai/mcp'
  }

  return {
    pageName: _pageName,
    icon: _icon,
    category: _category,
    tag: _tag,
    relatedPath: _relatedPath,
  }
}

function createSiteInfo(meta, customVpCard = null) {
  return (meta.coverUrl == '') ? `\`\`\`component VPCard
{
  "title": "${meta.title}",
  "desc": "${meta.description}",
  "link": "${meta.baseUrl}/${meta.articleOriginPath ?? meta.articlePath}",
  "logo": "${meta.logo}",
  "background": "rgba(${customVpCard?.background ?? meta.background},0.2)"
}
\`\`\`` : `<SiteInfo
  name="${meta.title}"
  desc="${meta.description}"
  url="${meta.baseUrl}/${meta.articleOriginPath ?? meta.articlePath}"
  logo="${meta.logo}"
  preview="${meta.coverUrl}"/>` + '\n'
}

function createEndMatter(meta) {
  console.log(`createEndMatter ... meta: ${JSON.stringify(meta)}`)
  return `

<!-- TODO: add ARTICLE CARD -->
\`\`\`component VPCard
{
  "title": "${meta.title}",
  "desc": "${meta.description}",
  "link": "https://chanhi2000.github.io/bookshelf/${meta.articleBasePath}/${meta.articlePath}.html",
  "logo": "${meta.logo}",
  "background": "rgba(${meta.bgRGBA},0.2)"
}
\`\`\`
`
}