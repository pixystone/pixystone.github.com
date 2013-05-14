---
layout: post
title: "在Github上维护博客"
category: 笔记
tags: [git, github page, jekyll, jekyll-bootstrap]
---

---

## 缘起

最初与《[Git权威指南][]》结缘，在[蒋鑫][]老师的博客中发现这样一篇文章：[用 Git 维护博客？酷！][]，新颖的博客维护方式着实让我着迷。

---

## Github Page

接触git的人没有不知道github的，在github上，每个人都可以拥有自己的git版本库，只要是开源的即是免费的。github还提供了免费的个人博客或者项目主页服务：[Github Page][]。

### 着手建立一个博客

在github上，只要新建一个名称为`username.github.com`的git版本库，github就会将其视为你的个人主页。参照Github Page上的简单说明“Create Project Pages In 3 Steps”，在仓库设置中，通过简单的wizard就可以从几个预置的模板中初始化建立一个博客。[^1]

博客建立完成后，github将会通过邮件告知成功建立Github Page。接下来要做的，就是跳出模板的个性化设置了。

### 克隆版本库到本地

这个新博客现在只有一段话在主页上，它没有任何实质性的内容。它是通过git来管理的，因此，可以直接`git clone`到本地进行修改，通过`git push`更新服务器上的Github Page，每一次`git push`后服务器都将发送一封邮件通知是否成功。

### Jekyll

在Github Page上，服务器通过[jekyll][]工具自动生成静态页面html文件。Jekyll支持将多种轻量级的标记语言[^2]转换成结构复杂的静态站点，所有html文件自动保存在_site文件夹中。

参照jekyll的wiki，实际上并不容易上手。了解在wiki中提到的大部分链接都是理解其原理的必要条件。

- 安装jekyll

        $ gem install jekyll

    或许在MacOSX上，系统自带的rubygems版本比较低了，需要先进行更新

        $ sudo gem update --system

- 在jekyll中预置的MarkDown解释器有三种：maruku、rdiscount、kramdown。为了额外支持脚注的功能，笔者选择了kramdown，其对MarkDown语言做了许多实用的扩展。

        $ gem install kramdown

    在目录下的`_config.yml`文件中添加设置

        markdown: kramdown


### Pygments与Liquid

在参数中可以看到，Jekyll支持[pygments][]工具用于代码片段的语法高亮，原理是通过在文章中嵌入[Liquid][]语句标识代码段的类型与位置。

    {% raw %}
    {% highlight python %}
    def hi():
        print "Hello World"
    {% endhighlight %}
    {% endraw %}

即可实现高亮

{% highlight python %}
def hi():
    print "Hello World"
{% endhighlight %}

{% raw %}
以`{% something %}`或者`{{ something }}`为格式的Liquid在模板化生成静态博客起到了巨大的作用。

例如`{{ page.title }}`可以直接转换成页面的标题，而博客主页上部分显示博文内容则使用`{{ post.content | truncatewords }}`转换。
更多用法可参见[Liquid Extensions][]。
{% endraw %}

### YAML Front Matter

Jekyll使用[YAML Front Matter][]字段保存每一个页面的信息，例如本文的字段为

    ---
    layout: post
    title: "在Github上维护博客"
    category: 笔记
    tags: [git, github page, jekyll, jekyll-bootstrap]
    ---

很显然，表示这篇文章是博客的post，另外还有标题、类别、标签等。甚至可以在页面中定义一个参数，例如在本博客的`index.html`中

    ---
    layout: page
    title: Welcome to Pixy's Blog
    post_limit: 3
    ---

设定的首页只显示三篇最新的文章。

### 文件结构

以wiki中提供的结构为例：

    .
    |-- _config.yml
    |-- _includes
    |-- _layouts
    |   |-- default.html
    |   `-- post.html
    |-- _posts
    |   |-- 2007-10-29-why-every-programmer-should-play-nethack.textile
    |   `-- 2009-04-26-barcamp-boston-4-roundup.textile
    |-- _site
    `-- index.html

#### _config.yml

在文件`_config.yml`中包含了jekyll所有的设置参数，基本的设置参数默认值[参考](https://github.com/mojombo/jekyll/wiki/Configuration)如下：

    safe:        false
    auto:        false
    server:      false
    server_port: 4000
    baseurl:    /jekyll_demo
    url: http://localhost:4000
    
    source:      .
    destination: ./_site
    plugins:     ./_plugins
    
    future:      true
    lsi:         false
    pygments:    false
    markdown:    maruku
    permalink:   date
    
    maruku:
      use_tex:    false
      use_divs:   false
      png_engine: blahtex
      png_dir:    images/latex
      png_url:    /images/latex
    
    rdiscount:
      extensions: []
    
    redcarpet:
      extensions: []
    
    kramdown:
      auto_ids: true,
      footnote_nr: 1
      entity_output: as_char
      toc_levels: 1..6
      use_coderay: false
      
      coderay:
        coderay_wrap: div
        coderay_line_numbers: inline
        coderay_line_numbers_start: 1
        coderay_tab_width: 4
        coderay_bold_every: 10
        coderay_css: style

#### _includes

这个文件夹包含了一切可供[Liquid][]特殊语句使用的文件，包括image、html、或者纯文本的代码、说明等等。例如可以使用`{% include beauty.png %}`插入一张图片。

#### _layouts

该文件夹保存了一些基本的模板，例如在默认页面`default.html`中，可以使用`{{ post.title }}`或`{{ post.content }}`直接插入layout为post的标题或者内容，可见上文关于[YAML Front Matter][]的描述。

#### _posts

这就是保存博客文章的文件夹，内含md、textile甚至txt文件。在这个文件夹中的页面，Liquid标记用{{ post }}表示，上文已有所涉及在此不再赘述。

#### _site

这里保存的是由jekyll生成的静态页面文件，这些html文件可以直接放到个人Server上的Apache下，构建一个静态博客站点。

这个文件夹在github服务器上将自动生成，所以不应该被包含在git仓库中，它只适用于本地使用`jekyll --server`命令查看效果时生成。应该在`.gitignore`文件中包含它

    $ echo "_site" >> .gitignore

顺便说一下`jekyll --server`，执行后可以在浏览器中查看页面生成的效果。默认为`http://localhost:4000`。

#### index.html

明显，这是主页。不过它的格式不仅限于.html，可以是.md、.markdown、.textile、.html。

---

## Jekyll-Bootstrap

[Twitter-Bootstrap][]可谓前端利器，家喻户晓。而[Jekyll-Bootstrap][]也起到了类似的模板作用，它为jekyll生成静态博客提供了十分完善的模板，包括主题切换、评论系统、RSS源、SEO等。笔者在后来也采用了这套解决方案，它甚至加深了我对Liquid使用的理解。

作者提供的rake命令可以快速完成一些操作。

### 新建博文

   $ rake post title="Hello World"

这将会自动创建一个名称为当前日期+title形式的post文件。

### 新建页面

    $ rake page name="about.md"

### 安装主题

可以在其[主题库](http://themes.jekyllbootstrap.com/preview/the-program/)中挑选喜欢的主题，并且快速安装，例如

    $ rake theme:install git="https://github.com/jekyllbootstrap/theme-the-program.git"

如果有自己设计或者“拿来”的主题，可以直接

- 在`./_includes/themes/THEME-NAME`目录中加入不同的`_layouts`文件夹中类似的文件，以及一个`setup.yml`标识主题名称

- 在`./assets/themes/THEME-NAME`目录中加入必要的css、highlight、image、javascript等等主题相关的文件。并且jekyll-bootstrap通过`{{ ASSET_PATH }}`表示该目录。

### 切换主题

    $ rake theme:switch name="THEME-NAME"

可谓方便快捷，易如反掌。



---

### 脚注

[^1]: 实际上，本博客的模板就是基于其中的一个模板再加以修改的。笔者不才，对CSS等前段架构毫无建树。

[^2]: 包括：MarkDown、Textile、Liquid等等，可参见[轻量级标记语言 MarkDown]({% post_url 2012-12-16-light-weight-markup-language-markdown %})。

[Git权威指南]: http://www.worldhello.net/gotgit/
[蒋鑫]: http://www.worldhello.net/
[用 Git 维护博客？酷！]: http://www.worldhello.net/2011/11/29/jekyll-based-blog-setup.html
[Github Page]: http://pages.github.com
[jekyll]: http://jekyllrb.com/
[pygments]: http://pygments.org/
[Liquid]: http://liquidmarkup.org
[Liquid Extensions]: https://github.com/mojombo/jekyll/wiki/liquid-extensions
[YAML Front Matter]: https://github.com/mojombo/jekyll/wiki/yaml-front-matter
[Twitter-Bootstrap]: http://twitter.github.com/bootstrap/
[Jekyll-Bootstrap]: http://jekyllbootstrap.com
