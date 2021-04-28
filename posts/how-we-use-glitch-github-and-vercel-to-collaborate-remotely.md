---
title: How we use Glitch, GitHub, & Vercel to collaborate remotely
description: Possible Intro for twitter or a note

date: 2020-08-01
tags:
  - vercel
  - github
  - glitch
layout: layouts/post.njk
---

Over the past few months our team has been working interdependently and remotely on some web project which we are going to share soon but in the mean time I wanted to share a bit about our current pipeline.<!-- excerpt -->

**Glitch** for development → **GitHub** for version control → **Vercel** for hosting or **Render** for hosting

---

## Updating and publishing projects:

Here is an overview on how we publish content remotely with each other through using [Glitch](https://glitch.com) for development, [Github](https://glitch.com) for version control, and [Vercel](https://zeit.co/) for hosting.

1. Head to [Glitch](https://glitch.com/@tinyfactories) and make any edits to the project.

   ![Glitch Website](/img/glitch-github-vercel/ggv-0.png)

2. Once edits are complete click `tools` button and then select `Git, Import and Export`.

![Export Tool bar](/img/glitch-github-vercel/ggv-1.png)

3. If you see `Connect to Github` button then click it if not select `Export to GitHub`.

![Connect to Github Selector](/img/glitch-github-vercel/ggv-2.png)

4. Next enter the GitHub-account/repo-name you would like to push to in the popup and click `ok`.

![Github path](/img/glitch-github-vercel/ggv-3.png)

5. Enter a detailed description of what you are pushing. for example "Updated SEO with new branding" and click `ok`.

![Adding comment to github](/img/glitch-github-vercel/ggv-4.png)

6. Now head on over to your [GitHub](https://github.com/tiny-factories) repo and click Compare & pull request. If you do not see this try pushing again from Glitch.

![Compare & pull request](/img/glitch-github-vercel/ggv-5.png)

7. Add additional comments and click `Create pull request`.

![Create pull request](/img/glitch-github-vercel/ggv-6png)

8. Next [now.sh](http://now.sh) will check the code and if everything looks ✅ then you can click `Merge pull request` to push the changes to now.sh and the production or live build.

![Merge pull request](/img/glitch-github-vercel/ggv-7.png)

9. You will be asked to confirm the merge.

![confirm the merge](/img/glitch-github-vercel/ggv-8.png)

10. Thats it! 🎉 Now just wait for your update to go live. If you what to check the progress head on over to your [Vercel Dashboard](https://zeit.co/tiny-factories/tinyfactories) and click on the project to see the status of the lates build.

![Vercel Dashboard](/img/glitch-github-vercel/ggv-9.png)

This workflow has been great for small projects with just a few people. But in the future, we are looking at switching from Glitch to GitPod for better react-js support.

We would love to learn more about the workflows you use for your team. Please feel free to share what works best for you and your team with us in the comments or DM us on Twitter.

Tiny Factories is a tribe of indie makers helping each other to ship products. We are working toward a future where folks can be creatively independent by becoming — what we call — an indiepreneur.

Every two weeks (or so), we send out an update about our project progress. If you’d like to receive this in your inbox, you can subscribe here.
