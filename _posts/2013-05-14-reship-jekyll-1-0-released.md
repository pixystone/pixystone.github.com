---
layout: post
title: "[转载] Jekyll 1.0 Released"
category: 转载
tags: [jekyll, jekyll-bootstrap, octopress]
---


本文转自：[Mort \| Jekyll 1.0 发布](http://www.soimort.org/posts/157/)，版权归原作者所有。



Jekyll官方文档：<http://jekyllrb.com/docs/home/>



## 新的子命令：new，build，serve，import/migrate

（来自[Issue #690](https://github.com/mojombo/jekyll/pull/690)和[Issue #764](https://github.com/mojombo/jekyll/pull/764)）



### 创建站点框架：new 命令

Jekyll 1.0中增加了`jekyll new`命令，用于生成一个简单的Jekyll站点框架。

以前用户为了使用Jekyll，要么自己从零开始写基于Liquid的HTML模板，定制度高但不用户友好；要么使用现成的Jekyll博客框架例如[Jekyll-Bootstrap](http://jekyllbootstrap.com/)或[Octopress](http://octopress.org/)，易于使用但定制度不强。如今Jekyll为一般用户提供了更高的友好性。

用法示例：

    $ jekyll new myblog
    $ cd myblog
    $ jekyll serve

其后，在浏览器中访问<http://localhost:4000>查看效果。



### 构建站点：build 命令

处理当前目录，将构建的站点生成到默认位置`./_site`：

    $ jekyll build

处理当前目录，将构建的站点生成到`<destination>`指定的路径位置：

    $ jekyll build --destination <destination>

处理`<source>`目录，将构建的站点生成到`<destination>`指定的路径位置：

    $ jekyll build --source <source> --destination <destination>

处理当前目录，将构建的站点生成到默认位置`./_site`，同时自动监视文件变化，在发生变化时自动重新生成站点：

    $ jekyll build --watch

在配置文件`_config.yml`中设定：

    source:      _source
    destination: _deploy

后，可以直接使用命令

    $ jekyll build

代替

    $ jekyll build --source _source --destination _deploy



### 开发用服务器：serve 命令

开启一个用于开发测试的服务器：<http://localhost:4000/>

    $ jekyll serve

开启一个用于开发测试的服务器，同时自动监视文件变化，在发生变化时自动重新生成站点：

    $ jekyll serve --watch



## Gem [jekyll-import](http://rubygems.org/gems/jekyll-import)

（来自[Issue #793](https://github.com/mojombo/jekyll/pull/793)）

将用于从其它博客平台import/migrate到Jekyll的代码移出了主项目，成为一个单独的Gem：[jekyll-import](http://rubygems.org/gems/jekyll-import)。（[GitHub地址](https://github.com/jekyll/jekyll-import)）



## 草稿（drafts）

（来自[Issue #833](https://github.com/mojombo/jekyll/pull/833)）

允许使用命令渲染`_drafts`目录下的（无日期的）草稿内容。



## Gist Liquid标签

（来自[Issue #822](https://github.com/mojombo/jekyll/pull/822)和[Issue #861](https://github.com/mojombo/jekyll/pull/861)）

可以通过如下方式在帖子中方便地插入GitHub [Gist](https://gist.github.com/)代码段：

<code>&#123;% gist 1234567 %&#125;</code>

<code>&#123;% gist 1234567 file.rb %&#125;</code>



## post.excerpt属性

（来自[Issue #837](https://github.com/mojombo/jekyll/pull/837)）

用于显示帖子的第一段，可用作帖子的摘要。



## 其他改进

详细参见<https://github.com/mojombo/jekyll/blob/v1.0.0/History.txt>。

  * Major Enhancements
    * Add `jekyll new` subcommand: generate a jekyll scaffold (#764)
    * Refactored jekyll commands into subcommands: build, serve, and migrate. (#690)
    * Removed importers/migrators from main project, migrated to jekyll-import sub-gem (#793)
    * Added ability to render drafts in _drafts folder via command line (#833)
    * Add ordinal date permalink style (/:categories/:year/:y_day/:title.html) (#928)
  * Minor Enhancements
    * Site template HTML5-ified (#964)
    * Use post's directory path when matching for the post_url tag (#998)
    * Loosen dependency on Pygments so it's only required when it's needed (#1015)
    * Parse strings into Time objects for date-related Liquid filters (#1014)
    * Tell the user if there is no subcommand specified (#1008)
    * Freak out if the destination of `jekyll new` exists and is non-empty (#981)
    * Add `timezone` configuration option for compilation (#957)
    * Add deprecation messages for pre-1.0 CLI options (#959)
    * Refactor and colorize logging (#959)
    * Refactor Markdown parsing (#955)
    * Added application/vnd.apple.pkpass to mime.types served by WEBrick (#907)
    * Move template site to default markdown renderer (#961)
    * Expose new attribute to Liquid via `page`: `page.path` (#951)
    * Accept multiple config files from command line (#945)
    * Add page variable to liquid custom tags and blocks (#413)
    * Add paginator.previous_page_path and paginator.next_page_path (#942)
    * Backwards compatibility for 'auto' (#821, #934)
    * Added date_to_rfc822 used on RSS feeds (#892)
    * Upgrade version of pygments.rb to 0.4.2 (#927)
    * Added short month (e.g. "Sep") to permalink style options for posts (#890)
    * Expose site.baseurl to Liquid templates (#869)
    * Adds excerpt attribute to posts which contains first paragraph of content (#837)
    * Accept custom configuration file via CLI (#863)
    * Load in GitHub Pages MIME Types on `jekyll serve` (#847, #871)
    * Improve debugability of error message for a malformed highlight tag (#785)
    * Allow symlinked files in unsafe mode (#824)
    * Add 'gist' Liquid tag to core (#822, #861)
    * New format of Jekyll output (#795)
    * Reinstate --limit_posts and --future switches (#788)
    * Remove ambiguity from command descriptions (#815)
    * Fix SafeYAML Warnings (#807)
    * Relaxed Kramdown version to 0.14 (#808)
    * Aliased `jekyll server` to `jekyll serve`. (#792)
    * Updated gem versions for Kramdown, Rake, Shoulda, Cucumber, and RedCarpet. (#744)
    * Refactored jekyll subcommands into Jekyll::Commands submodule, which now contains them (#768)
    * Rescue from import errors in Wordpress.com migrator (#671)
    * Massively accelerate LSI performance (#664)
    * Truncate post slugs when importing from Tumblr (#496)
    * Add glob support to include, exclude option (#743)
    * Layout of Page or Post defaults to 'page' or 'post', respectively (#580)
      REPEALED by (#977)
    * "Keep files" feature (#685)
    * Output full path & name for files that don't parse (#745)
    * Add source and destination directory protection (#535)
    * Better YAML error message (#718)
  * Bug Fixes
    * Paginate in subdirectories properly (#1016)
    * Ensure post and page URLs have a leading slash (#992)
    * Catch all exceptions, not just StandardError descendents (#1007)
    * Bullet-proof limit_posts option (#1004)
    * Read in YAML as UTF-8 to accept non-ASCII chars (#836)
    * Fix the CLI option --plugins to actually accept dirs and files (#993)
    * Allow 'excerpt' in YAML Front-Matter to override the extracted excerpt (#946)
    * Fix cascade problem with site.baseurl, site.port and site.host. (#935)
    * Filter out directories with valid post names (#875)
    * Fix symlinked static files not being correctly built in unsafe mode (#909)
    * Fix integration with directory_watcher 1.4.x (#916)
    * Accepting strings as arguments to jekyll-import command (#910)
    * Force usage of older directory_watcher gem as 1.5 is broken (#883)
    * Ensure all Post categories are downcase (#842, #872)
    * Force encoding of the rdiscount TOC to UTF8 to avoid conversion errors (#555)
    * Patch for multibyte URI problem with jekyll serve (#723)
    * Order plugin execution by priority (#864)
    * Fixed Page#dir and Page#url for edge cases (#536)
    * Fix broken post_url with posts with a time in their YAML Front-Matter (#831)
    * Look for plugins under the source directory (#654)
    * Tumblr Migrator: finds _posts dir correctly, fixes truncation of long
      post names (#775)
    * Force Categories to be Strings (#767)
    * Safe YAML plugin to prevent vulnerability (#777)
    * Add SVG support to Jekyll/WEBrick. (#407, #406)
    * Prevent custom destination from causing continuous regen on watch (#528, #820, #862)
  * Site Enhancements
    * Responsify (#860)
    * Fix spelling, punctuation and phrasal errors (#989)
    * Update quickstart instructions with `new` command (#966)
    * Add docs for page.excerpt (#956)
    * Add docs for page.path (#951)
    * Clean up site docs to prepare for 1.0 release (#918)
    * Bring site into master branch with better preview/deploy (#709)
    * Redesigned site (#583)
  * Development Fixes
    * Exclude Cucumber 1.2.4, which causes tests to fail in 1.9.2 (#938)
    * Added "features:html" rake task for debugging purposes, cleaned up
      cucumber profiles (#832)
    * Explicitly require HTTPS rubygems source in Gemfile (#826)
    * Changed Ruby version for development to 1.9.3-p374 from p362 (#801)
    * Including a link to the GitHub Ruby style guide in CONTRIBUTING.md (#806)
    * Added script/bootstrap (#776)
    * Running Simplecov under 2 conditions: ENV(COVERAGE)=true and with Ruby version
      of greater than 1.9 (#771)
    * Switch to Simplecov for coverage report (#765)



## 参考链接

* __Jekyll 1.0 Released__ by Parker Moore:
<http://blog.parkermoore.de/2013/05/06/jekyll-1-dot-0-released/>
* __Jekyll Documentation__: <http://jekyllrb.com/docs/>
* [@jekyllrb](https://twitter.com/jekyllrb) on Twitter



<img src="http://octodex.github.com/images/kimonotocat.png" width="40%" />
