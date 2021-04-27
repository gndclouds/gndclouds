---
title: Experimenting with directNavigation
description:
date: 2020-07-22
tags:
  - experiments
  - dev
layout: layouts/post.njk
---

In an early build of [are.na](http://are.na), you could click on the channel name to edit it. Although it was a little hard to discover this feature and it was ultimately removed. It always felt rather delightful to edit content without the need for clicking on an icon or opening an editor.

So I experimented a bit with how to apply this concept to my wiki and created a new way to navigate. If I want to change pages on my wiki, I just click the page title (which is actually an input field) and enter the page path.

<div class="glitch-embed-wrap" style="height: 420px; width: 100%;">
  <iframe
    src="https://glitch.com/embed/#!/embed/direct-navagation?path=README.md&previewSize=100"
    title="direct-navagation on Glitch"
    allow="geolocation; microphone; camera; midi; vr; encrypted-media"
    style="height: 100%; width: 100%; border: 0;">
  </iframe>
</div>

That's where my experiment with directNavagation currently stands but in the future, it would be fun to try:

- Adding in Search + autocomplete instead of needing to know the page paths.
- Creating better cursor hover effects similar to mouse support in iPadOS.
- Creating a way for this to be discovered organically.
- Add a hover state which also allows you to go back to the home page.

If you have ideas about how to make the code cleaner or any next steps, please let me know. I'm always looking to get better at coding best practices. In the meantime, a demo lives on [Glitch](https://glitch.com/~direct-navagation).

_I have been using my [wiki](https://gndclouds.cc) as a way to try out mini code experiments and have been documenting my process on [futureland](https://futureland.tv/gndclouds/gndclouds-cc)._
