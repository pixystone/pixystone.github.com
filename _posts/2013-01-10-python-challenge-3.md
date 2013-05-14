---
layout: post
title: "Python Challenge 3"
category: 笔记
tags: [Python, Python Challenge]
---
{% include JB/setup %}

---

## Challenge 3

![bodyguard](/assets/images/posts/2013-01-10-python-challenge-3-bodyguard.jpg)

[Challenge 3][]网页的标题是re，好的。页面源码中仍然是一大堆乱码，都是字母，大写的小写的混着一块。

    kAewtloYgcFQaJNhHVGxXDiQ...

再看看图片下的提示：“一个小写字母的两边被**确切的**三个大写字母包围着。”图片确实是，一个小蜡烛，左右各三个大蜡烛。复习一下Python的正则后，开始动手查找：

{% highlight python %}
f = open("p3.txt")
chars = f.read()

import re
rule = r"([A-Z]{3}[a-z]{1}[A-Z]{3})"
result = re.findall(rule, chars)
result = ''.join(c[3] for c in result)
if result:
    print result
{% endhighlight %}

得到了好多好多乱七八糟的字母，这肯定不是答案。再仔细观察一下，才发现这个正则规则还包含了三个以上大写字母在两边的情况，修正一下：

{% highlight python %}
f = open("p3.txt")
chars = f.read()

import re
rule = r"[^A-Z]{1}([A-Z]{3}[a-z]{1}[A-Z]{3})[^A-Z]{1}"
result = re.findall(rule, chars)
result = ''.join(c[3] for c in result)
if result:
    print result
{% endhighlight %}

结果为`linkedlist`，放入URL：<http://www.pythonchallenge.com/pc/def/linkedlist.html>，出现一段字母`linkedlist.php`。

好吧，把URL中的html改成php，进入[Challenge 4][]。

---

>##### 博客中 Python Challenge 所有源码分享：[打开坚果](https://jianguoyun.com/c/sd/120e4/3c67fa5987bff9fd)


[Challenge 3]: http://www.pythonchallenge.com/pc/def/equality.html
[Challenge 4]: http://www.pythonchallenge.com/pc/def/linkedlist.php