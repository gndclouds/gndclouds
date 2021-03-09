---
title: Creating a scene in Slate
description:
date: 2020-02-26
tags:
  - slate
  - guide
layout: layouts/post.njk
---

This week I'm working on updating the []()

There are two types of scenes visible and invisible.

```javascript
{
  id: "V1_NAVIGATION_PROFILE_EDIT",
  decorator: "EDIT_ACCOUNT",
  name: "Profile & Account Settings",
  pageTitle: "Your Profile & Account Settings",
  children: null,
},
```

```javascript
{
  id: "V1_NAVIGATION_PROFILE_EDIT",
  decorator: "EDIT_ACCOUNT",
  name: "Profile & Account Settings",
  pageTitle: "Your Profile & Account Settings",
  children: null,
  ignore: true,
},
```

In order to create a Scene you need to create/update three files.

1. Make a new Scene in `scenes/SceneName`

2. Import the decorator to `components/core/Application.js`

```javascript
import SceneEditAccountV2 from "~/scenes/SceneName";
```

and add it to the array of Scenes

```javascript
const SCENES = {
  EDIT_ACCOUNT: <SceneName />,
};
```

3. Add the decorator to the `common/navagation-data.js`
