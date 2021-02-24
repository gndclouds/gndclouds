---
title: 20200926
description:
date: 2020-10-20
tags:
  - ReactJs
  - Slate
layout: layouts/post.njk
---

![Slate Data View Lazy Loading Demo](https://d2w9rnfcy7mm78.cloudfront.net/9186430/original_a37b584d97478b062bdbd353b5f5cdca.gif?1603180185?bc=0)

Implemented lazy loading today for the [Slate](https://slate.host) Data View. I still spend most of my time understanding code more than writing code form scratch. By I love seeing patterns in how others write, to that I can write better code my self too.

```javascript
  state = {
    menu: null,
    loading: {},
    startIndex: 0,
    checked: {},
    view: "grid",
    viewLimit: 20,
  };
```

```javascript
  _handleScroll = (e) => {
    const windowHeight =
      "innerHeight" in window ? window.innerHeight : document.documentElement.offsetHeight;
    const body = document.body;
    const html = document.documentElement;
    const docHeight = Math.max(
      body.scrollHeight,
      body.offsetHeight,
      html.clientHeight,
      html.scrollHeight,
      html.offsetHeight
    );
    const windowBottom = windowHeight + window.pageYOffset;
    if (windowBottom >= docHeight) {
      this.setState({ viewLimit: this.state.viewLimit + 20 });
    } else {
    }
  };
```

```javascript

```

