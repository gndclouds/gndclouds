---
title: How to Rebase
description: about agile frameworks.
date: 2020-04-12
tags:
  - development
  - collobration 
  - Slate
layout: layouts/post.njk
---

Since 2020.08 I have been contributing to an social file storage system called [Slate](https://slate.host) which will launch its beta on 2020.09.14 🎉. This project has been reinforced some good practices for me in how I collobrate ans communicate work over github. One key change for me has been how to rebase, which take the work you have done and places it in the current worktree if changes. 



example of a peoject before and after rwbasing 

On the left is a project which doesn't use rebase and on the right is one which does. You can see how much clear we the work tree becomes. My workflow tends to look like this when incorporating rebaseing. 





```bash 
add . -A
```
Adds all new files any any files yhat have changed.


```bash 
git commit -m "ewww" 
```
Add a clear comment relted t


```bash 
git fetch
```

```bash 
git rebase origin/main
```

```bash 
git push origin/branch-name
```

_If you are interested in giving Slate a try you can play with the alpha now!_
