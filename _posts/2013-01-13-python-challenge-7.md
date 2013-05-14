---
layout: post
title: "Python Challenge 7"
category: 笔记
tags: [Python, Python Challenge]
---
{% include JB/setup %}

---

## Challenge 7

![oxygen](/assets/images/posts/2013-01-13-python-challenge-7-oxygen.png)

[Challenge 7][]的信息显然就在图片内的黑白条带里。搜索到，Python常用的绘图工具如[Python Imaging Library][]（PIL）。

目测，黑白条带的位置`y=50`，使用PIL读取图片中像素的信息：

{% highlight python %}
from PIL import Image

img = Image.open("oxygen.png")
pix = img.load()
(w,h) = img.size
info = []
y = 50   #请目测
for x in range(w):
    if pix[x,y][0] == pix[x,y][1] == pix[x,y][2]: #确定读取出其中的黑白颜色信息而不是彩色。
        info.append(pix[x,y][0])
print info
{% endhighlight %}

输出结果

> [115, 115, 115, 115, 115, 109, 109, 109, 109, 109, 109, 109, 97, 97, 97, 97, 97, 97, 97,...

统计其中的频度：

{% highlight python %}
dic = {}
for c in info:
    if c in dic:
        dic[c] += 1
    else:
        dic[c] = 0
print dic
{% endhighlight %}

输出结果

> {32: 118, 44: 62, 46: 6, 48: 34, 49: 104, 50: 6, 51: 6, 52: 6, 53: 13, 54: 13, 91: 6, 93: 7, 97: 13, 100: 6, 101: 34, 103: 6, 104: 6, 105: 13, 108: 13, 109: 13, 110: 6, 111: 6, 114: 6, 115: 11, 116: 27, 117: 13, 118: 6, 120: 6, 121: 13}

发现32出现得最多，要知道32是空格的ASCII码，这里一定是包含了字母信息，更何况数字的范围在32～121之间。

因为黑白格子有一定宽度，所以再筛选掉重复的ASCII码，根据规律上看，应该是7个数字为一个字母（除了第一个字母）：

{% highlight python %}
string = []
for c in info:
    string.append(chr(c))
string = ''.join(string[::7])
print string
{% endhighlight %}

输出结果

> smart guy, you made it. the next level is [105, 110, 116, 101, 103, 114, 105, 116, 121]

不必解释，翻译最后给出的list：

{% highlight python %}
import re
result = re.findall(r'\d+', string)
result = [chr(int(ch)) for ch in result]
print ''.join(result)
{% endhighlight %}

得到`integrity`，老规矩，URL：<http://www.pythonchallenge.com/pc/def/integrity.html>，顺利进入[Challenge 8][]。

---

>##### 博客中 Python Challenge 所有源码分享：[打开坚果](https://jianguoyun.com/c/sd/120e4/3c67fa5987bff9fd)


[Challenge 7]: http://www.pythonchallenge.com/pc/def/oxygen.html
[Python Imaging Library]: http://www.pythonware.com/library/pil/handbook/index.htm
[Challenge 8]: http://www.pythonchallenge.com/pc/def/integrity.html