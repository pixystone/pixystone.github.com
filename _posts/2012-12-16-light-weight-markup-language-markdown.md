---
layout: post
title: "轻量级标记语言 MarkDown"
category: 笔记
tags: [markdown, github page, jekyll, sublime text]
---

---

## 前言 ##

最近发现轻量级[标记语言]写笔记的巨大优势，如[MarkDown][][^1]、[reStructuredText][][^2]等等。在写这篇文章的时候，起初是要写关于MarkDown的[Sublime Text]插件，不过在写之前，我打算直接使用MarkDown编写这些文字。

有趣的是，在写的过程中我还发现了一个更加方便快捷的工具：

- [Mou][]是一个Mac平台上的免费软件，用于编写基于MarkDown的文档：

	- 界面轻便简洁，编辑界面的左边为原始内容（附带一些着色效果），右边为加上CSS后的HTML实现效果，一目了然

	- 提供了全面的语法帮助。这对初学者来说的确不错，尽管标记语言语法十分简单

	- 另外，在MarkDown语法基础上，Mou还加入了更加方便的脚注功能[^3]

	- 附上Mou的界面：

	![Mou-screenshot](/assets/images/posts/2012-12-15-Mou.png)

- 在安装合适的编辑器之前，还可以使用在线编辑方式直接显示结果，例如[Dillinger][]。这也有助于简单快捷地入门MarkDown的语法。它还支持[Dropbox][]：）

- 其它平台软件可以参考[这里](http://wowubuntu.com/markdown/)，目前还没有尝试过不做评论了


---

## MarkDown的魔力 ##

由于笔者不通HTML语言，但是又想写出美观工整的博文，怎么办？于是天上掉下来一个轻量级标记语言MarkDown

- 由于轻量级的标记语言在语法上十分简单，从原始文本就能够读懂内容，相比HTML这样的“重度”标记语言（标记太多了：）就轻量很多了

- MD之类的标记语言拥有许多工具可以直接将其转换成自定的HTML样式，因此在写一些读书笔记、心得时可以直接用MarkDown语法编写，省去了考虑文字样式的过程，以免影响思路

- 像下文一样快捷地添加代码块，并且可以实现不同的着色效果

- 原始文本与样式之间完全分开，更换前端样式更加简单快捷

- 之前已近习惯使用Evernote（印象笔记）作为强大的信息收集工具，现在，完全可以直接在Evernote中以标记语言的语法记录心得了。甚至，将转换后美观的HTML页面直接保存在笔记中

---

## Sublime Text 插件

鉴于不同的解释器所表现的HTML效果不尽相同，最好选择一个接近标准的解释器及其广泛使用的额外插件，以免格式过于小众影响不同平台上的转换效果。由于博客使用GitHub推荐的jekyll，因此使用一个编辑器+command tool的方式全自动生成html文件预览最终效果将会更加方便。

[Sublime Text]很好很强大，我最喜欢用的文本编辑器，因为它还附带了轻量级的编译功能，小段代码的测试很方便。这里不多介绍以免抢了MD风头：）SublimeText拥有MarkDown相应的插件，可以用于快速编辑，详细可见这里的[教程](http://lucifr.com/2012/07/12/markdownediting-for-sublime-text-2/)

- 首先需要安装Sublime Text的Package Control。

	在控制台( Control+` )中键入：

{% highlight python %}
	import urllib2,os;pf='Package Control.sublime-package';ipp=sublime.installed_packages_path();os.makedirs(ipp) if not os.path.exists(ipp) else None;open(os.path.join(ipp,pf),'wb').write(urllib2.urlopen('http://sublime.wbond.net/'+pf.replace(' ','%20')).read())
{% endhighlight %}

- 在Package Control中选择Install Package，查找MarkDownBuild、MarkDownPreview、MarkDownEditing进行安装

- 安装MarkDownEditing后，只要打开md或者txt等等扩展名的文件即可实现MD相关的快捷编辑功能了，Package Setting中可以找到更详细的设置，例如字体、样式、宽度、对应扩展名等等

- 安装MarkDownBuild,MarkDownPreview则能直接使用Build生成页面并使用默认浏览器打开，展示效果

---

### 脚注 ###

[^1]: 这篇[文章](http://wowubuntu.com/markdown/)中有很好的语法介绍。另外，多种标记语言之间的比较可以参考[这里](http://www.worldhello.net/gotgithub/appendix/markups.html)。返回

[^2]: 虽然reST与Python有些许渊源，不过我觉得还是MD在语法上更加易用一些。返回

[^3]: 在博客中利用[GitHub Page][]提供的[jekyll][]工具自动化地编译静态网页，Mou使用的脚注功能在jekyll中没有实现，因为MarkDown的标准语法中没有脚注，参见官方关于脚注的[说明](http://daringfireball.net/2005/07/footnotes#fn1-2005-07-20)（我没看完其实）
	
	在

		$ jekyll --help

	中可以发现，jekyll包含使用不同转换引擎的选项：

		--rdiscount                  Use rdiscount gem for Markdown
		--redcarpet                  Use redcarpet gem for Markdown
		--kramdown                   Use kramdown gem for Markdown

	默认引擎为[Maruku](http://maruku.rubyforge.org/)，在官方文档的配置说明中发现，kramdown下有一个默认参数footnote_nr: 1，那么显然kramdown是支持脚注功能的，用法参照Mou进行尝试，成功。之后找到其[主页](http://kramdown.rubyforge.org/index.html)，以及脚注的[语法](http://kramdown.rubyforge.org/syntax.html#footnotes)。这个解释器还是蛮强大的，对MarkDown语法做了许多扩展。似乎还支持html到md的反向转换？逆天了：

	![kramdown](/assets/images/posts/2012-12-16-kramdown.png)

	此外，Python实现的MarkDown解释器[py-markdown2][]中也包含对脚注实现的插件（[Extra](https://github.com/trentm/python-markdown2/wiki/footnotes))。
	甚至是基于jekyll的Python实现[Hyde](http://ringce.com/hyde)。返回

[标记语言]: http://zh.wikipedia.org/wiki/标记语言
[Sublime Text]: http://www.sublimetext.com/
[MarkDown]: http://zh.wikipedia.org/wiki/Markdown
[reStructuredText]: http://docutils.sourceforge.net/rst.html
[Mou]: http://mouapp.com
[Dillinger]: http://dillinger.io
[Dropbox]: https://www.dropbox.com
[GitHub Page]: http://pages.github.com
[jekyll]: https://github.com/mojombo/jekyll
[py-markdown2]: https://github.com/trentm/python-markdown2