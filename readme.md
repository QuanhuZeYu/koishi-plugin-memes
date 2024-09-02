# @quanhuzeyu/koishi-plugin-memes

[![npm](https://img.shields.io/npm/v/@quanhuzeyu/koishi-plugin-memes?style=flat-square)](https://www.npmjs.com/package/@quanhuzeyu/koishi-plugin-memes)
[![npm downloads](https://img.shields.io/npm/dm/@quanhuzeyu/koishi-plugin-memes)](https://www.npmjs.com/@quanhuzeyu/koishi-plugin-memes)

## 安装指南 🛠️

浏览器搜索安装`FFMPEG`并设置好环境变量即可享用

## 用法

使用 `petpet` 不带参数用法就是生成一张摸自己头的meme

使用 `petpet` + `@任意群成员` 生成一张摸该成员头像的meme

使用`petpet` + `图片` 生成摸该图片的meme

### 已经实现

v1.1.2 实现`hammer`指令，支持GIF参数传入
v1.0.13 `hug` 指令支持GIF参数传入，重构底层实现了自定义参数获取器，以便实现多种类参数的获取并合成
v1.0.12 添加指令`hug`但暂未实现GIF参数合成
v1.0.11 版本更新后已经实现GIF参数的合成，并提升了合成效率，4s->1s
v1.0.0 目前还未支持gif参数的合成，正在开发敬请期待，该库的最终目标是移植nonebot的meme插件库

这是我的第一个ts项目，如果有bug或者更好的代码结构优化请帮助我，十分感谢
