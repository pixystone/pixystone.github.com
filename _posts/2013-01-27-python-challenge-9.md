---
layout: post
title: "Python Challenge 9"
category: 笔记
tags: [Python, Python Challenge]
---
{% include JB/setup %}


---

## Challenge 9

![tree](/assets/images/posts/2013-01-27-python-challenge-9-good.jpg)

[Challenge 9][]图片里有一堆黑点，与[Challenge 7]({% post_url 2013-01-13-python-challenge-7 %})类似，或许还是需要PIL。标题让我们连接所有的点，但是真的是“这些”点吗？

页面源码的注释里说：

> first+second=?

然后提供了first的一大堆数字和second的一小堆数字，其中first有442个数字，second有112个数字，显然不是成对的。存入文件`p9.txt`先。

这题一直困扰了很久，笔者始终以为first是横坐标，second是纵坐标，两者经过某些筛选最后成对地应用到图片上。可惜我错了，骨哥说`first+second`只是把它们俩连起来，你知道字符串的加法吧？仅此而已。然而横纵坐标对，只是偶数位和奇数位的配对就够了，是我想太多了么？

照骨哥说的筛选出其中的数字并连接成一个list

{% highlight python %}
f = open("p9.txt")
fr = f.read()
fr = fr.replace('\n','')
import re
xy = re.findall(r'\d+',fr)
xy = [int(x) for x in xy]
{% endhighlight %}

然后将list中的偶数位作为横坐标，奇数位作为纵坐标，重新画图（颜色随意，白色佳，似乎跟原图没有半毛钱关系啊除了大小相同以外)

{% highlight python %}
from PIL import Image
img = Image.open("good.jpg")
new_img = Image.new(img.mode, img.size)
for i in range(0, len(xy), 2):
    new_img.putpixel((xy[i],xy[i+1]),(255,255,255))  #白色看着显眼一些
new_img.save("p9.jpg")
{% endhighlight %}

输出结果

![cow](/assets/images/posts/2013-01-27-python-challenge-9-bull.jpg)

也许原图在这里起到了提示的作用，所有的黑点连起来，好的！是一棵树！囧rz

那么这幅图呢？cow！我很想说。但是不是，它是一直公牛...所以URL：<http://www.pythonchallenge.com/pc/return/bull.html>，进入[Challenge 10][]。

---

>##### 博客中 Python Challenge 所有源码分享：[打开坚果](https://jianguoyun.com/c/sd/120e4/3c67fa5987bff9fd)


[Challenge 9]: http://www.pythonchallenge.com/pc/return/good.html
[Challenge 10]: http://www.pythonchallenge.com/pc/return/bull.html