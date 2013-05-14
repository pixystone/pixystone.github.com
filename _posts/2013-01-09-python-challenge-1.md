---
layout: post
title: "Python Challenge 1"
category: 笔记
tags: [Python, Python Challenge]
---
{% include JB/setup %}

---

## 前言

寒假前，无意中发现了[Python Challenge][]这个小玩意，着实爱不释手。这的确是一个不错的Python练习工具，每一关都有大致的一个主题，诸如压缩、编码、绘图、HTTP等等。

---

## Challenge 0

打开[Python Challenge][]，开始进入挑战！
首先，[Challenge 0][]只是用来定一个基调的，Hint说得很明显，没有必要单独说明了。

![calc](/assets/images/posts/2013-01-09-python-challenge-0-calc.jpg)

屏幕上的2<sup>38</sup>=274877906944，所以打开URL：<http://www.pythonchallenge.com/pc/def/274877906944.html>，进入[Challenge 1][]。

---

## Challenge 1

![map](/assets/images/posts/2013-01-09-python-challenge-1-map.jpg)

[Challenge 1][]的图片上：K->M;O->Q;E->G，下面有一堆乱码，但是看起来像一句话。按照图片的转换规则，显然这些乱码还是乱码。以前玩过网页的解密游戏，所以深知一个重要手段：**看源码**。可惜源码里没有注释是相关的。再次思考发现，KOE与MQG都是在字母表中后移两位，所以尝试将乱码中所有的字母都后移两位：

{% highlight python %}
def translate(text):
    result = []
    text = list(text)
    for c in text:
        if ord(c) <= ord('x') and ord(c) >= ord('a'):
            result.append(chr(ord(c)+2))
        elif ord(c) == ord('y') or ord(c) == ord('z'):
            result.append(chr(ord(c)+2-26))
        else:
            result.append(c)
    if result:
        return ''.join(result)

text = "g fmnc wms bgblr rpylqjyrc gr zw fylb. rfyrq ufyr amknsrcpq ypc dmp. bmgle gr gl zw fylb gq glcddgagclr ylb rfyr'q ufw rfgq rcvr gq qm jmle. sqgle qrpgle.kyicrpylq() gq pcamkkclbcb. lmu ynnjw ml rfc spj."

print translate(text)
{% endhighlight %}

得到转换的结果为：

> i hope you didnt translate it by hand. thats what computers are for. doing it in by hand is inefficient and that's why this text is so long. using string.maketrans() is recommended. now apply on the url.

果然是有收获的，`string.maketrans()`方法我确实从来都没有用过。

最后，把url中的map也进行转换。得到URL：<http://www.pythonchallenge.com/pc/def/ocr.html>，进入[Challenge 2][]。


---

>##### 博客中 Python Challenge 所有源码分享：[打开坚果](https://jianguoyun.com/c/sd/120e4/3c67fa5987bff9fd)

[Python Challenge]: http://www.pythonchallenge.com
[Challenge 0]: http://www.pythonchallenge.com/pc/def/0.html
[Challenge 1]: http://www.pythonchallenge.com/pc/def/map.html
[Challenge 2]: http://www.pythonchallenge.com/pc/def/ocr.html