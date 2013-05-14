---
layout: post
title: "Python Challenge 8"
category: 笔记
tags: [Python, Python Challenge]
---
{% include JB/setup %}


---

## Challenge 8

![integrity](/assets/images/posts/2013-01-14-python-challenge-8-integrity.jpg)

[Challenge 8][]一只小蜜蜂呀，图片下面很阴险地用灰黑色的字写道：

> Where is the missing link?

还是页面源码搞起，链接URL：<http://www.pythonchallenge.com/pc/return/good.html>，打开后需要用户名和密码。源码注释里的`un`和`pw`就是了。

> un: 'BZh91AY&SYA\xaf\x82\r\x00\x00\x01\x01\x80\x02\xc0\x02\x00 \x00!\x9ah3M\x07<]\xc9\x14\xe1BA\x06\xbe\x084'

> pw: 'BZh91AY&SY\x94$|\x0e\x00\x00\x00\x81\x00\x03$ \x00!\x9ah3M\x13<]\xc9\x14\xe1BBP\x91\xf08'

看它们的样子，像是编码或者加密过后的结果。笔者不才，只接触过`utf-8`的编码，可是这个明显不是。查看了Python Reference Library却没有仔细看，试过了`base64`什么无果。最后只好问骨哥了，骨哥当然知道BZ开头的这个乱码就是由`bz2`编码的。那么

{% highlight python %}
un = 'BZh91AY&SYA\xaf\x82\r\x00\x00\x01\x01\x80\x02\xc0\x02\x00 \x00!\x9ah3M\x07<]\xc9\x14\xe1BA\x06\xbe\x084'
pw = 'BZh91AY&SY\x94$|\x0e\x00\x00\x00\x81\x00\x03$ \x00!\x9ah3M\x13<]\xc9\x14\xe1BBP\x91\xf08'

print "username: %s\npassword: %s" % (un.decode('bz2'), pw.decode('bz2'))
{% endhighlight %}

得到用户名密码分别是huge;file。输入后进入[Challenge 9][]

### 另一种方法

`bz2`是一种压缩算法，因此Python中提供了bz压缩的模块`bz2`。所以

{% highlight python %}
import bz2
print "username: %s\npassword: %s" % (bz2.decompress(un), bz2.decompress(pw))
{% endhighlight %}

也能得到相同的结果。

---

>##### 博客中 Python Challenge 所有源码分享：[打开坚果](https://jianguoyun.com/c/sd/120e4/3c67fa5987bff9fd)



[Challenge 8]: http://www.pythonchallenge.com/pc/def/integrity.html
[Challenge 9]: http://www.pythonchallenge.com/pc/return/good.html