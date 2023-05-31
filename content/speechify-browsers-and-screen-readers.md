---
title: "Browser's with Screen Readers in 2019"
excerpt: "How to improve the experience of the current chrome web extension in preparation for the Speechify Web App"
publishedAt: "2019-11-30"
coverImage: "https://source.unsplash.com/user/gndclouds"
externalUrl:
type: "Blog"
tags:
---

To improve the experience of our web extension in preparation for the Speechify Web App. I go over current screen readers in browsers which have come a long way this last year (2019). I walk through both integrated browser-based solutions and plugins.
&nbsp;

## Browsers

&nbsp;

To start we need to understand what is already provided to our users for free at a system level. Some browsers are adding speech-to-text services to expand their reader views for reducing the noise from new articles. Below is an example of what mainstream browsers and os native browsers offer.
&nbsp;

### Chrome

&nbsp;

There is not a native solution available unless you install [ChromeVox], which is by google but would seem to be considered a legacy extension. But would seem to act more as a way to navigate a webpage that's being dictated and less about reading selected portions of text.
&nbsp;

### Edge

&nbsp;
![browser-edge-text-to-speech](/img/speechify/browser-edge-text-to-speech.jpeg)
&nbsp;

After years of not knowing which way is up, Edge is final has good accessibility options. A native screen reader with a slightly computerized voice will read the article and highlighted the text. It's not the same playback quality as Speechify but it's a great native option.
&nbsp;

### Safari

&nbsp;
![safari-text-to-speech](/img/speechify/browser-safari-text-to-speech.jpeg)
&nbsp;
Safari has the best free or native experience. It's optimized to work natively with the accessibility tools in macOS. They also have a lot of additional options based on how you read best. You can underline the current sentence or word spoken. Highlighting the text anywhere in macOS, including safari, and use the same shortcuts to read anything. Speechify may want to explore keeping a native app to help customers with writing papers, emails, texts, and other general writing across the OS.
&nbsp;

### Firefox

&nbsp;
![firefox-text-to-speech](/img/speechify/browser-firefox-text-to-speech.jpeg)
&nbsp;

Firefox now has a built-in screen reader which integrates directly into your pocket account. (Has Speechify ever explored this type of integration?) Firefox owns pocket, and as screen readers become standard in browsers it could be good to look into opera or others to partners. The screen reader is limited to 3x max playback speed and the voice quality is limited. But the voice quality is decent.
&nbsp;

## Extensions and Apps

&nbsp;

Many of the following extensions are pretty similar, but all have different subtleties to the type of content being saved. We should mix one of these without an existing extension to allow for saving content to the web app.
&nbsp;

### Are.na

&nbsp;
![browser-extension-arena](/img/speechify/browser-extension-arena.jpeg)
&nbsp;

### Notion

&nbsp;
![browser-extension-notion](/img/speechify/browser-extension-notion.jpeg)
&nbsp;

### Feedly

&nbsp;
![browser-extension-feedly](/img/speechify/browser-extension-feedly.jpeg)
&nbsp;

## Extensions for Viewing Content

&nbsp;
These extensions are close to what we could aim to build. Something that allows for saving content and reading it right there on the screen.
&nbsp;

### Evernote

&nbsp;
![browser-extension-evernote](/img/speechify/browser-extension-evernote.jpeg)
&nbsp;
Here is one of the consistently best examples. You can select a series of ways to save the content. And it caches the last formate type you used to keep it consistent.
&nbsp;

### Hypothesis

&nbsp;
Another good path could be optimizing for annotations with something like basic highlighting and notes.
&nbsp;
![extension-hypothesis](/img/speechify/browser-extension-hypothesis.jpeg)
&nbsp;

## Recommend Changes for Speechify

&nbsp;
Our web app and chrome extension serve two different functions at the moment, and for the most part, should continue to do so with a few exceptions. The chrome extension currently just reads the highlighted text, which is great! But we could add a button and shortcut that allows for the saving of articles to the Web App, and a few more options for the screen reader experience.
&nbsp;
Here is a small map of extension features.
&nbsp;
![interface-example-kinopio](/img/speechify/interface-example-kinopio.jpeg)
&nbsp;
↑ If the above URL has an issue loading [please view it here](https://kinopio.club/speechify-chrome-extension-OIo4Y-YOuKRafQiDKPfpQ)
&nbsp;

Here are some wireframes that could become directions we take when updating the Chrome extension. For most popular web apps the extension purely helps import content into the core web app. We should keep the ability to read content outside the as a plugin or app feature.
&nbsp;
![plugin or app feature](/img/speechify/69935E8D-4E88-4695-8588-A62D4DD1A5A4.jpeg)
&nbsp;
Additional Layouts
One of our strengths is how quickly you can highlight some text on a page and have it read back to you. But if we look at Evernote there could be a significant benefit to having a more advanced screen reader. One that allowed for annotations without leaving the webpage. There is also a wide range of options around how we signal which word, sentence, or div is spoken. Do we underline, highlight, or isolate the text?
&nbsp;
Adding content to the web app from chrome extension might look like, starting with launching a mini-player. ⤵
&nbsp;
![mini-player](/img/speechify/33378D1D-6C57-417D-B380-64B1611E46EC.jpeg)
&nbsp;
And you would have the option to click them ➕or use a shortcut to save articles directly to the library in the web app ⤵
&nbsp;
![web app](/img/speechify/C74014E1-A877-4161-A309-09119D7337E4.jpeg)
&nbsp;

A mini-player could be a nice way to show the current text⤵
&nbsp;
![mini-player](/img/speechify/394B2A4B-5FBC-453C-9290-2725A8C3F609.jpeg)
