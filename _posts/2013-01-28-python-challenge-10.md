---
layout: post
title: "Python Challenge 10"
category: 笔记
tags: [Python, Python Challenge]
---
{% include JB/setup %}

---

## Challenge 10

![bull](/assets/images/posts/2013-01-28-python-challenge-10-bull.jpg)

[Challenge 10][]图片就是那头公牛，不过，这一关和它没有任何关系。图片下提示：

> len(a[30]) = ?

图片的链接指向一个`sequence.txt`文件，内容是：

> a = [1, 11, 21, 1211, 111221,

显然是要找到其中的规律了，然后根据这个规律递归得到最后的结果。

笔者不才，百思不得解而只好求助骨哥：

- 序列中的第二个数“11”表示，前一个数“1”有：1个1；
- 之后，“21”表示，前一个数“11”有：2个1；
- “1211”表示，前一个数“21”有：1个2、1个1；
- 最后，“111221”表示，前一个数“1211”有：1个1、1个2、2个1；

因此，根据这个规律，依次统计前一个数中数字连续重复出现次数（同一个数字不连续部分分别统计）；所以下一个数应为“312211”，再下一个为“13112221”。

将数字转换为字符串，通过正则规则`r"(\d)\1*"`进行统计更为方便：

{% highlight python %}
import re
a = [1, 11, 21, 1211, 111221]
for i in range(5,31):
    s = str(a[i-1])
    find = re.finditer(r'(\d)\1*', s)
    tmp = ''
    for item in find:
        tmp += str(len(item.group())) + str(item.group(1))
    a.append(int(tmp))
print len(str(a[30]))
{% endhighlight %}

最后结果为5808，URL：<http://www.pythonchallenge.com/pc/return/5808.html>，进入[Challenge 11][]。

---

>##### 博客中 Python Challenge 所有源码分享：[打开坚果](https://jianguoyun.com/c/sd/120e4/3c67fa5987bff9fd)


[Challenge 10]: http://www.pythonchallenge.com/pc/return/bull.html
[Challenge 11]: http://www.pythonchallenge.com/pc/return/5808.html