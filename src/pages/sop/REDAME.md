- 1、在谷歌文档中下载 html+图片素材 
- 2、打开下载的html,整页复制->粘贴在微信编辑器中 https://bj.96weixin.com/
- 3、项目中导入图片素材，复制编辑器中的html
- 4、使用正则表达式 替换Image
    - <img\s+[^>]*src="[^"]*spacer\.gif"[^>]*data-word-image="[^"]*image([0-9]+)\.png"[^>]*>
    - <img src=${image$1} />