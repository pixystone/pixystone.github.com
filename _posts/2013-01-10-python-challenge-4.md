---
layout: post
title: "Python Challenge 4"
category: 笔记
tags: [Python, Python Challenge]
---
{% include JB/setup %}

---

## Challenge 4

![chainsaw](/assets/images/posts/2013-01-10-python-challenge-4-chainsaw.jpg)

[Challenge 4][]的图片上有一个链接<http://www.pythonchallenge.com/pc/def/linkedlist.php?nothing=12345>，打开后提示，下一个nothing是44827。一定是把URL中的nothing改为`nothing=44827`。之后，这个nothing返回的下一个值是45439，显然这个过程不能够完全通过手动完成，万一它有千八百个递归呢？那么就使用Python去自动获取结果吧。

回到最初的页面，页面源码中的注释说：

> urllib may help. DON'T TRY ALL NOTHINGS, since it will never end. 400 times is more than enough.

使用urllib中的urlopen方法即可获取返回的内容了，为了防止作者故意打乱格式，对找到的nothing值要进行筛选，并且将400作为遍历上限：

{% highlight python %}
import urllib,re

def findurl(start):
    base_url = "http://www.pythonchallenge.com/pc/def/linkedlist.php?nothing="
    rule = r'\d+'
    url = base_url + start
    for x in range(400):
        f = urllib.urlopen(url)
        content = f.read()
        tail = re.findall(rule, content)
        print tail
        if len(tail) == 1:
            url = base_url + tail[0]
        elif len(tail) > 1:
            print "there are more than one nothing here.\nplease check out and go on.\n"
            return "%s\nContents:\n%s" % (url, content)
        else:
            return "%s\nContents:\n%s" % (url, content)

s1 = "12345"
print findurl(s1)
{% endhighlight %}

函数执行到<http://www.pythonchallenge.com/pc/def/linkedlist.php?nothing=16044>时停止，返回一句话：

> Yes. Divide by two and keep going.

果然有诈，继续！

{% highlight python %}
print findurl("8022")
{% endhighlight %}

执行到<http://www.pythonchallenge.com/pc/def/linkedlist.php?nothing=82682>时返回了两个值，内容为：

> There maybe misleading numbers in the text. One example is 82683. Look only for the next nothing and the next nothing is 63579

真狡猾，Keep going：

{% highlight python %}
print findurl("63579")
{% endhighlight %}

终于在<http://www.pythonchallenge.com/pc/def/linkedlist.php?nothing=66831>找到了答案：`peak.html`

打开URL：<http://www.pythonchallenge.com/pc/def/peak.html>，进入[Challenge 5][]。

---

>##### 博客中 Python Challenge 所有源码分享：[打开坚果](https://jianguoyun.com/c/sd/120e4/3c67fa5987bff9fd)


[Challenge 4]: http://www.pythonchallenge.com/pc/def/linkedlist.php
[Challenge 5]: http://www.pythonchallenge.com/pc/def/peak.html