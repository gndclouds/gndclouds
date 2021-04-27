---
title: Generative Design with Runwayml
description:
date: 2021-03-14
externalUrl:
tags:
  - machine learning
  - generative design
  - people machine collobration
layout: layouts/post.njk
---
For a few months, I have read and made a few small machine learning projects to understand the space a bit more. <!-- excerpt -->One way to keep these experiments quick has been to use [RunwayML](http://runwayml.com/) for some low-level design tasks. Like creating textures, gradients, or iconography with various levels of success. This post is a mini summary of what I have learned and what it may say about the future of generative design tools and workflows as of 2020. For each exploration, I needed to start with a dataset to feed to the computer. In this example, I will be training a StyleGAN model to make gradients.
&nbsp;

There are many datasets available (see a list of my favorite below) for things like weather data, satellite images, etc but for generative design data, it has been a little hard. There aren't a lot of repositories with pre-sorted design datasets yet. So the curation process is a little manual at the moment.
&nbsp;

First, we need some sample gradients, I started with 25 images from Unicorn Gradients. Typically using 500+ images would be better but since the gradients have such a heavy blur it worked out. Next, upload them to your assets folder on Runway ML.
&nbsp;

![](/img/generative-design-with-runwayml/runway-step-0.png)
&nbsp;

There is already a lot of templates in RunwayML! So we need to train the model but don't need to create it from scratch. Choose the Image Generator template from the model's section and then selected the files I uploaded earlier.
&nbsp;

![](/img/generative-design-with-runwayml/runway-step-1.png)
&nbsp;

The process is still slow. The model took 3 hours at 3000 steps. So I would start it before heading to bed.
&nbsp;

![](/img/generative-design-with-runwayml/runway-step-2.png)
&nbsp;

When your model is complete you will be able to have RunwayML create thousands of new images!
&nbsp;

![](/img/generative-design-with-runwayml/runwayml-gradients.jpg)
&nbsp;

Now that was a quick overview but it shows how the tooling is still being made more non-developer friendly. In 1-2 years more plugins and local first tools should make experimenting and mainstream use easier. Especially for the inspiration of synthesis of screen design. Some other but less successful experiments of mine have been:
&nbsp;

**Emoji Generator** - Training on Twitter's open-source emoji set. The thinking was if it could create something like [Emoji Mashup Bot](https://twitter.com/emojimashupbot?lang=en). The results looked more like something from Watchman.
&nbsp;

![ML Generated image of emojis](/img/generative-design-with-runwayml/runwayml-emoji.jpg)
&nbsp;

**Townscaper Generator** - A popular game called [Townscaper](https://store.steampowered.com/app/1291340/Townscaper/) used [waveform collapse functions](https://github.com/mxgmn/WaveFunctionCollapse) to perdurably generate grids. I downloaded all the images I could find on Twitter of the game, cleaned them up, and made a StyleGAN model.
&nbsp;

![ML Generated image of Townscaper game scenes](/img/generative-design-with-runwayml/runwayml-townscaper.jpg)
&nbsp;

&nbsp;

## Resources for ML:

### Reading:

- [Using Artificial Intelligence to Augment Human Intelligence](https://distill.pub/2017/aia/)
- [BEING THE MACHINE| Making Home](http://beingthemachine.com)
- [curriculum⁄Machine Listening](https://machinelistening.exposed/curriculum/?utm_source=SPACE10&utm_campaign=500764c4f9-EMAIL_CAMPAIGN_2020_04_28_01_23_COPY_01&utm_medium=email&utm_term=0_35b5972dbe-500764c4f9-364911269&mc_cid=500764c4f9&mc_eid=c02ec90a8e)
- [Terrain Generation With Deep Learning | Two Minute Papers #208​](https://www.youtube.com/watch?v=NEscK5RCtlo)

&nbsp;

### Public Datasets:

- [Data Gov](https://www.data.gov)
- [Google Dataset Search](https://datasetsearch.research.google.com)

&nbsp;

### Runway Models:

- [RunwayMl Gradients](https://app.runwayml.com/models/gndclouds/Gradients)
