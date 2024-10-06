
function convertDateFormat(dateString) {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function parseOgData() {
  const ogData = {};
  for (e of document.querySelectorAll('meta[property^="og:"]')) {
    const property = e.getAttribute('property');
    const content = e.getAttribute('content');
    ogData[property] = content;
  };
  return ogData
}

function createFrontMatter(meta, customVpCard = null) {
  console.log(`createFrontMatter ... meta: ${JSON.stringify(meta)}`)
  let _pageName = ''
  let _icon = ''
  let _category = ''
  let _tag = ''
  let _relatedPath = ''
  switch(meta.topic) {
  case 'swift':
    console.log(`${meta.topic}!!!`)
    _pageName = 'Swift'
    _icon='fa-brands fa-swift'
    _category=`${_pageName}`
    _tag='swift\n  - ios\n  - macos\n  - xcode'
    _relatedPath='/programming/swift'
    break;
  case 'react':
    console.log(`${meta.topic}!!!`)
    _pageName = 'React.js'
    _icon='fa-brands fa-react'
    _category=`Node.js\n  - ${_pageName}`
    _tag='node\n  - nodejs\n  - node-js\n  - react\n  - reactjs\n  - react-js'
    _relatedPath='/programming/js-react'
    break;
  case 'python':
    console.log(`${meta.topic}!!!`)
    _pageName = 'Python'
    _icon='fa-brands fa-python'
    _category=`${_pageName}`
    _tag='python\n  - py'
    _relatedPath='/programming/py'
    break;
  case 'cs':
    console.log(`${meta.topic}!!!`)
    _pageName = 'C#'
    _icon='iconfont icon-csharp'
    _category=`${_pageName}\n  - DotNet`
    _tag='cs\n  - c#\n  - csharp\n  - dotnet'
    _relatedPath='/programming/cs'
    break;
  default: break;
  }
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
  "title": "${_pageName} > Article(s)",
  "desc": "Article(s)",
  "link": "${_relatedPath}/articles/README.md",
  "logo": "/images/ico-wind.svg",
  "background": "rgba(10,10,10,0.2)"
}
\`\`\``
  const siteInfo = (meta.coverUrl == '') ? `\`\`\`component VPCard
{
  "title": "${meta.title}",
  "desc": "${meta.description}",
  "link": "${meta.baseUrl}/${meta.articleOriginPath ?? meta.articlePath}",
  "logo": "${meta.logo}",
  "background": "rgba(${customVpCard.background},0.2)",
}
\`\`\`` : `
<SiteInfo
  name="${meta.title}"
  desc="${meta.description}"
  url="${meta.baseUrl}/${meta.articleOriginPath ?? meta.articlePath}"
  logo="${meta.logo}"
  preview="${meta.coverUrl}"/>
`

  return `---
lang: ${meta.lang ?? 'en-US'}
title: "${meta.title}"
description: "Article(s) > ${meta.title}"
icon: ${_icon}
category:
  - ${_category}
  - Article(s)
tag:
  - blog
  - ${meta.articleBasePath}
  - ${_tag}
head:
  - - meta:
    - property: og:title
      content: "Article(s) > ${meta.title}"
    - property: og:description
      content: "${meta.title}"
    - property: og:url
      content: https://chanhi2000.github.iohttps://chanhi2000.github.io/bookshelf/${meta.articleBasePath}/${meta.articlePath}.html
prev: ${_relatedPath}/articles/README.md
date: ${meta.datePublished}
isOriginal: false
author: ${meta.author}
cover: ${meta.coverUrl}
---

# {{ $frontmatter.title }} 관련

${vpCard}

[[toc]]

---

${siteInfo}

`
}

function createEndMatter(meta) {
  console.log(`createEndMatter ... meta: ${JSON.stringify(meta)}`)
  return `

<!-- START: ARTICLE CARD -->
\`\`\`component VPCard
{
  "title": "${meta.title}",
  "desc": "${meta.description}",
  "link": "https://chanhi2000.github.io/bookshelf/${meta.articleBasePath}/${meta.articlePath}.html",
  "logo": "${meta.logo}",
  "background": "rgba(${meta.bgRGBA},0.2)"
}
\`\`\`
<!-- END: ARTICLE CARD -->`
}