---
layout: post
title: "Python Challenge 6"
category: 笔记
tags: [Python, Python Challenge]
---
{% include JB/setup %}

---

## Challenge 6

![channel](/assets/images/posts/2013-01-10-python-challenge-6-channel.jpg)

[Challenge 6][]是一件衣服，上面有拉链。页面标题说：“成对了。”图片下面还有Paypal的捐助链接，我开始还真以为这里头有线索，结果它只是一个纯粹的链接。源码里的注释很诚恳：

> The following has nothing to do with the riddle itself. I just thought it would be the right point to offer you to donate to the Python Challenge project. Any amount will be greatly appreciated.

> -thesamet

注意到，页面源码的开头`<-- zip`被注释掉了，它指向的是`html`。试着把URL改为<http://www.pythonchallenge.com/pc/def/channel.zip>，于是得到了一个压缩包。想必本关的主题就是压缩了。

压缩包内有一个`readme.txt`，内容为

> welcome to my zipped list.

> hint1: start from 90052
> hint2: answer is inside the zip
>

其余的文件名都是数字，内容为：“nothing is xxxx”，这与[Challenge 4]({% post_url 2013-01-10-python-challenge-4 %})异曲同工。于是从90052开始

{% highlight python %}
import re,zipfile,sys
zf = zipfile.ZipFile("channel.zip")
# Start from 90052
s = "90052"
num_of_files = len(zf.infolist())
print "There are %d files in this zip file." % num_of_files
rule = r'nothing is (\d+)'
for x in range(1, num_of_files+1):
    name = s + ".txt"
    content = zf.read(name)
    nothing = re.findall(rule, content)
    if len(nothing) == 1:
        s = str(nothing[0])
    else:
        print "Interupt by unknown content @ No.%d.\nFilename: %s\nContent:\n%s" % (x, name, content)
        break
zf.close()
{% endhighlight %}

输出结果：

    There are 910 files in this zip file.
    Interupt by unknown content @ No.909.
    Filename: 46145.txt
    Content:
    Collect the comments.

发现了最后一个文件是46145.txt，提示为：“Collect the comments.”笔者一直以为这个comment是指的注释掉的内容，就是上文提到的捐赠的注释。百思不得其解，最后骨哥告诉我，压缩时可以给每一个文件添加comment，就是备注吧。

于是，按照原有的顺序收集所有的备注：

{% highlight python %}
import re,zipfile,sys
zf = zipfile.ZipFile("channel.zip")
# Start from 90052
s = "90052"
num_of_files = len(zf.infolist())
print "There are %d files in this zip file." % num_of_files
rule = r'nothing is (\d+)'
comment = []
for x in range(1, num_of_files+1):
    name = s + ".txt"
    content = zf.read(name)
    nothing = re.findall(rule, content)
    if len(nothing) == 1:
        s = str(nothing[0])
        comment.append(zf.getinfo(name).comment)
    else:
        print "Interupt by unknown content @ No.%d.\nFilename: %s\nContent:\n%s" % (x, name, content)
        break
print ''.join(comment)
zf.close()
{% endhighlight %}

最后得到

<pre><code
>****************************************************************
****************************************************************
**                                                            **
**   OO    OO    XX      YYYY    GG    GG  EEEEEE NN      NN  **
**   OO    OO  XXXXXX   YYYYYY   GG   GG   EEEEEE  NN    NN   **
**   OO    OO XXX  XXX YYY   YY  GG GG     EE       NN  NN    **
**   OOOOOOOO XX    XX YY        GGG       EEEEE     NNNN     **
**   OOOOOOOO XX    XX YY        GGG       EEEEE      NN      **
**   OO    OO XXX  XXX YYY   YY  GG GG     EE         NN      **
**   OO    OO  XXXXXX   YYYYYY   GG   GG   EEEEEE     NN      **
**   OO    OO    XX      YYYY    GG    GG  EEEEEE     NN      **
**                                                            **
****************************************************************
 **************************************************************
</code></pre>


嗯，是`HOCKEY`，输入URL：<http://www.pythonchallenge.com/pc/def/hockey.html>，结果它只是说；

> it's in the air. look at the letters.

好吧，看看字母里是什么？还是字母，不过这次是组成`HOCKEY`的字母：`OXYGEN`，氧气的确是在空气中：）

输入URL：<http://www.pythonchallenge.com/pc/def/oxygen.html>，进入[Challenge 7][]

---

>##### 博客中 Python Challenge 所有源码分享：[打开坚果](https://jianguoyun.com/c/sd/120e4/3c67fa5987bff9fd)


[Challenge 6]: http://www.pythonchallenge.com/pc/def/channel.html
[Challenge 7]: http://www.pythonchallenge.com/pc/def/oxygen.html