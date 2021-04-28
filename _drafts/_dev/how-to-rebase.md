---
title: How to Rebase on GitHub
description:
date: 2020-09-08
updated: Last Modified
tags:
  - collobration
  - Slate
layout: layouts/post.njk
---

Since 2020.08 I have been contributing to a social file storage system called [Slate](https://slate.host) which will launch its [beta](https://www.producthunt.com/posts/slate-f195dcdd-18e2-4dc2-8c70-45208ccbb862) on 2020.09.14 🎉. This project has been reinforced some good practices for me in how I collaborate and communicate work over GitHub. One key change for me has been how to rebase, which take the work you have done and places it in the current work tree if changes.

![A verity of GitHub worktree modifications](https://res.cloudinary.com/practicaldev/image/fetch/s--BTsRd9V4--/c_limit%2Cf_auto%2Cfl_progressive%2Cq_auto%2Cw_880/https://jason.pureconcepts.net/images/tree-progressing-git-rebase.webp)

📷 [source Jason McCreary](https://dev.to/gonedark)

As of now my current workflow when collobrating on git has become:

```bash
add . -A
```

Adds all new files and any files that have changed.

```bash
git commit -m "I made a change"
```

Add a clear comment

```bash
git fetch
```

Check for other changes

```bash
git rebase origin/main
```

Get changes from the main branch and fix any merge conflicts

```bash
git push origin/branch-name
```

Push your changes! Occasionally you may need to add the `--force` flag here.

_If you are interested in giving [Slate](https://slate.host) a try you can play with the alpha now!_
