---
layout: post
title: "gem安装jekyll连接失败"
category: 笔记
tags: [ruby, gem, jekyll]
---
{% include JB/setup %}

国内尿性网络导致`rubygems.org`偶尔无法访问，可以使用淘宝镜像：

{% highlight sh %}

$ gem sources --remove https://rubygems.org/
$ gem sources -a https://ruby.taobao.org/
$ gem sources -l
*** CURRENT SOURCES ***

https://ruby.taobao.org
# 请确保只有 ruby.taobao.org
$ gem install rails

{% endhighlight %}

> 来源：(http://ruby.taobao.org/)
