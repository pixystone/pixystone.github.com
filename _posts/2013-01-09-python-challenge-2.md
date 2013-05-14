---
layout: post
title: "Python Challenge 2"
category: 笔记
tags: [Python, Python Challenge]
---
{% include JB/setup %}

---

## Challenge 2

![ocr](/assets/images/posts/2013-01-09-python-challenge-2-ocr.jpg)

[Challenge 2][]图片上是一本书，一堆字在上面，乍一看还真以为要使用OCR去识别上面的文字，问题是，图片太模糊了吧。

还好下面有一行提示，去看页面源码吧。果然，页面源码中有一大堆乱码，注释中提示要找到这些乱码中的字母。

好的，把它们先存成文本文件先，命名为`p2.txt`。然后开始找其中的字母，应该就用ASCII码来识别就够了，或者也可以用string中内置的方法。

{% highlight python %}
def check(text):
    result = []
    text = list(text)
    for c in text:
        if ord(c) >= ord('a') and ord(c) <= ord('z'):
            result.append(c)
        else:
            pass
    if result:
        return ''.join(result)

f = open("p2.txt")
strings = f.readlines()
f.close()
final = []
for text in strings:
    result = check(text)
    if result:
        final.append(result)
if final:
    final = ''.join(final)
    print final
{% endhighlight %}

得到一个单词：`equality`，然后你知道怎么做的。放到URL上：<http://www.pythonchallenge.com/pc/def/equality.html>，进入[Challenge 3][]。

---

>##### 博客中 Python Challenge 所有源码分享：[打开坚果](https://jianguoyun.com/c/sd/120e4/3c67fa5987bff9fd)

[Challenge 2]: http://www.pythonchallenge.com/pc/def/ocr.html
[Challenge 3]: http://www.pythonchallenge.com/pc/def/equality.html