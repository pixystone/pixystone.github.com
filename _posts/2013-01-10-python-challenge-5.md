---
layout: post
title: "Python Challenge 5"
category: 笔记
tags: [Python, Python Challenge]
---
{% include JB/setup %}


---

## Challenge 5

![peakhell](/assets/images/posts/2013-01-10-python-challenge-5-peakhell.jpg)

[Challenge 5][]有一座山，这不重要。重要的是，

> peak hell sounds familiar ?

笔者英语差得很，这连起来读像什么词？不知道。琢磨良久，最后只能求骨哥了。

原来是Python中的pickle模块，用来对一个对象进行打包并传输到其他Python程序使用。页面源码中显示，有一个`banner.p`文件，想必是打包好的文件了。

通过`pickle.load()`方法读取文件中的内容并打印出来看看是什么：

{% highlight python %}
import pickle,sys
f = open("banner.p")
obj = pickle.load(f)
print obj
{% endhighlight %}

打包起来的对象是一个序列（list），序列里包含了多个子序列，子序列里是一堆元组（tuple）：

> [[(' ', 95)], [(' ', 14), ('#', 5), (' ', 70), ('#', 5), (' ', 1)],...

仔细观察发现，每一个子序列里，所有数字的和都是95，并且字符只有空格` `和`#`两种，或许是在格式化打印什么东西吧。

由于`print`方法输出结果带`\n`，而`print text,`的方式不带换行但是会在最后添加一个空格，不符合要求。所以采用`sys.stdout.write()`方法打印字符。

{% highlight python %}
import pickle,sys
f = open("banner.p")
obj = pickle.load(f)
for content in obj:
    for c in content:
        (ch,num) = c
        s = ch*num
        sys.stdout.write(s)
    print ''   #换行
{% endhighlight %}

打印结果是一个由`#`组成的channel：

<pre><code
>              #####                                                                      #####
               ####                                                                       ####
               ####                                                                       ####
               ####                                                                       ####
               ####                                                                       ####
               ####                                                                       ####
               ####                                                                       ####
               ####                                                                       ####
      ###      ####   ###         ###       #####   ###    #####   ###          ###       ####
   ###   ##    #### #######     ##  ###      #### #######   #### #######     ###  ###     ####
  ###     ###  #####    ####   ###   ####    #####    ####  #####    ####   ###     ###   ####
 ###           ####     ####   ###    ###    ####     ####  ####     ####  ###      ####  ####
 ###           ####     ####          ###    ####     ####  ####     ####  ###       ###  ####
####           ####     ####     ##   ###    ####     ####  ####     #### ####       ###  ####
####           ####     ####   ##########    ####     ####  ####     #### ##############  ####
####           ####     ####  ###    ####    ####     ####  ####     #### ####            ####
####           ####     #### ####     ###    ####     ####  ####     #### ####            ####
 ###           ####     #### ####     ###    ####     ####  ####     ####  ###            ####
  ###      ##  ####     ####  ###    ####    ####     ####  ####     ####   ###      ##   ####
   ###    ##   ####     ####   ###########   ####     ####  ####     ####    ###    ##    ####
      ###     ######    #####    ##    #### ######    ###########    #####      ###      ######
</code></pre>

于是URL为<http://www.pythonchallenge.com/pc/def/channel.html>，进入[Challenge 6][]。

---

>##### 博客中 Python Challenge 所有源码分享：[打开坚果](https://jianguoyun.com/c/sd/120e4/3c67fa5987bff9fd)


[Challenge 5]: http://www.pythonchallenge.com/pc/def/peak.html
[Challenge 6]: http://www.pythonchallenge.com/pc/def/channel.html