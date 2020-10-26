#!/usr/bin/env sh

# 确保脚本抛出遇到的错误
set -e

# 生成静态文件
npm run docs:build

# 进入生成的文件夹
cd docs/.vuepress/dist

# 如果是发布到自定义域名
# echo 'www.example.com' > CNAME

# 在新生成的目录下初始化 .git，并 add 所有文件，提交到该目录下项目的本地master分支(默认)
git init
git add -A
git commit -m 'deploy'

# 如果发布到 https://<USERNAME>.github.io
# git push -f git@github.com:<USERNAME>/<USERNAME>.github.io.git master

# 如果发布到 https://<USERNAME>.github.io/<REPO>
# git push -f git@github.com:<USERNAME>/<REPO>.git master:gh-pages
# zuoxiaobai/fenote 对应的配置如下，将doscs/.vuepress/dist 目录下的 master 分支 push 到 fenote 远程远程仓库的 gh-pages 分支
git push -f git@github.com:zuoxiaobai/fenote.git master:gh-pages

cd -