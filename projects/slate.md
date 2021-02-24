---
title: Slate
description: A new file-sharing network that makes it possible for people to collect, organize, and link files together.
hero: https://media.giphy.com/media/gw3IWyGkC0rsazTi/giphy.gif
externalUrl: https://slate.host
date: 2020-09-01
state: Active
tags:
  - development
layout: layouts/project.njk
---

[Slate](https://slate.host) is an experimental file storage system built on the [Filecoin]() cryptographic protocol. I worked on Slate over thier V1 launch in 2020. Much of my work was around inproving the initial interface. 

<h2>Related Notes:</h2>
<div class="w-100">
  {% set postslist = collections.hardware | head(-3) %}
  {% set postslistCounter = collections.hardware | length %}
  {% include "posts-preview.njk" %}
</div>
</section>