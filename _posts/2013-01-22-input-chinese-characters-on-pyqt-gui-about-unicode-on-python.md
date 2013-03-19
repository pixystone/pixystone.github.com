---
layout: post
title: "PyQt界面上输入中文 - 关于Python的Unicode字符串"
category: 笔记
tags: [PyQt, Python, Unicode, ASCII, GBK, UTF8]
---

---

## 输入中文？

今日项目进行比较顺利，同时也tag上了一个稳定版本。新的探索总是建立在现状稳定的前提之上，试试在界面上输入中文？

{% highlight python %}
UnicodeEncodeError: 'ascii' codec can't encode character u'\u54c8' in position 0: ordinal not in range(128)
{% endhighlight %}

哦？错了。

---

## 解释器的编码方式

Python默认的解释器编码方式是ASCII，在sys中`getdefaultencoding()`方法可以查看。

{% highlight python %}
>>> import sys
>>> sys.getdefaultencoding()
'ascii'
{% endhighlight %}

而实际上sys模块是包含`sys.setdefaultencoding(str)`方法的，但是在解释器加载时，系统在`site.py`中调用`__delattr__`删除了这个方法。以至于不能够再次调用。

通过搜索得到的解决方案大多是直接利用`reload sys`的方式找回这个方法，然后修改解释器使用的编码方式。

{% highlight python %}
import sys
reload sys
sys.setdefaultencoding('utf8')
{% endhighlight %}

但是在参考书中提到reload只是说，reload是一种危险的方式。笔者不清楚为什么危险，仔细想想，或许再次重载sys可能会在复杂的程序中发生解释器编码方式不一致，从而产生一些不可预知的错误吧。what ever : )

---

## 关于编码

支持中文的编码方式包括人们熟知的Unicode、GBK、GB2312等。在整理这篇文章之前，笔者也弄不清UTF-8与它们之间的关系。在参考书中只是写道，UTF-8是一种变长编码，此外还有UTF-16之类。毕竟此书是Python参考，并不会赘述太多有关编码的故事。笔者只好搜索以恶补一下，找到了这篇[UNICODE,GBK,UTF-8区别][]。

小时候所熟知的：“一个汉字2字节、一个字母1字节”，如今似乎已经不再适用了。

GBK之流的，它是单字节的ASCII编码的扩展，包含两个字节，被称为ASNI。各个非英语国家起初都采用了各自的编码解决方案，让计算机显示复杂的拉丁字符或者是方形文字。不同的ASNI编码之间只能通过对照表实现互相转换。因此，小时候玩过台湾的仙剑或者轩辕剑系列的童鞋一定有面对那些乱码抓狂的经验，笔者还记得“东方快车”这个翻译软件，自带的转码功能在当时真可谓救星。真不敢想象在那个没有百度的时代，转码的解决方案是如何口口相传的。扯远了：）

后来Unicode的解决方案统一了全世界文字的编码方式，但遗憾的是，目测当下仍然处在编码过渡的时期（一定是后期了），否则就不会出现这篇文章了。Unicode将所有字符（包括原有的ASCII字符）都统一地采用两个字节的编码方式，2Bytes=65536个字符似乎足够涵盖全世界的大部分常用字符了。

那什么是UTF-8？在计算机之间通信是要讲究效率的，目前大部分计算机之间的通信都还只是ASCII字符，毕竟每个英文字母只需要一个字节，而且是世界性的语言。例如HTTP协议中是不可能用“获取”来代替"GET"命令的。

所以，在Unicode的解决方案下，前128个字符是占用两个字节的原ASCII码，这样常用的ASCII码本来只需要一个字节，现在却变成了两个字节，似乎太浪费带宽和空间了。效率为先，因此才有了UTF-8这种变长编码方案。它将所有的ASCII保留为1字节方式，再将其余的字符编码成2-4字节不等，因此它是一种在Unicode基础之上的二次编码。

---

## 如何使用安全的方式

说了这么多编码，再回到解释器。ASCII方式的解释器它是读不懂非ASCII字符的。不过在Python中，print方法似乎包含了一些简单的转码功能，只是“似乎”。

{% highlight python %}
>>> print repr('好')
'\xe5\xa5\xbd'             # 这是默认的UTF-8编码，汉字被编码为3个字节
>>> print repr(u'好')
u'\u597d'                  # 显示其原始的Unicode编码
{% endhighlight %}

接下来

{% highlight python %}
>>> print repr(unicode('好'))
Traceback (most recent call last):
  File "<stdin>", line 1, in <module>
UnicodeDecodeError: 'ascii' codec can't decode byte 0xe5 in position 0: ordinal not in range(128)
{% endhighlight %}


这里报错了，print似乎没有上面这么智能了。解释器无法识别非ASCII码了，不过细看它说的是0xe5，正是UTF-8编码的第一个字节。

这说明，‘好’这个str类型自动返回了UTF-8编码后的字节码，因此print接收到的只是字节码，我想它并不知道如何转换UTF-8，这个时候才会发生解释器读不懂这个字节的含义，因为ASCII方式的解释器只会一个接一个字节地解释。所以解释器无法将读懂的信息传递给unicode函数进而进行类型转换。

同样地

{% highlight python %}
>>> print repr('好'.encode('utf8'))
Traceback (most recent call last):
  File "<stdin>", line 1, in <module>
UnicodeDecodeError: 'ascii' codec can't decode byte 0xe5 in position 0: ordinal not in range(128)
>>> print repr('好'.encode('gbk'))
Traceback (most recent call last):
  File "<stdin>", line 1, in <module>
UnicodeDecodeError: 'ascii' codec can't decode byte 0xe5 in position 0: ordinal not in range(128)
{% endhighlight %}

都是相同的错误。但是，unicode转换函数有一个可选参数，用来告诉解释器这个unicode数据的编码方式，例如为UTF-8，它就会“聪明”地读出‘好’，然后将其转换成Unicode编码

{% highlight python %}
>>> print repr(unicode('好','utf-8'))
u'\u597d'
{% endhighlight %}

为了进一步证明‘好’默认返回的类型是UTF-8编码的字节码，尝试

{% highlight python %}
>>> print repr(unicode('好','gbk'))
Traceback (most recent call last):
  File "<stdin>", line 1, in <module>
UnicodeDecodeError: 'gbk' codec can't decode byte 0xbd in position 2: incomplete multibyte sequence
{% endhighlight %}

这里告诉解释器，‘好’的编码方式为GBK，那么解释器就按GBK方式解码，它看不懂第三个字节0xbd。显然GBK字符为两个字节，它认为第三个是"incomplete"的，要么你就给偶数个，但是读出来的一定是乱码，比如

{% highlight python %}
>>> print repr(unicode('好好','gbk'))
u'\u6fc2\u85c9\u30bd'
>>> print unicode('好好','gbk')
濂藉ソ
{% endhighlight %}

由此可见，针对汉字的字符串，str类型默认返回字节型的数据，编码方式为UTF-8。

假如要将UTF-8编码的字符串转换成GBK编码的方式，由于UTF-8是针对Unicode编码而进行的二次编码，没有直接的方法可以转换，所以只能以Unicode为桥梁进行转换：

{% highlight python %}
>>> print repr(u'好'.encode('gbk'))
'\xba\xc3'                     # 两个字节的GBK编码
>>> print repr(u'好'.encode('utf8'))
'\xe5\xa5\xbd'                 # 作为对照的三字节UTF-8汉字编码
{% endhighlight %}


---

## PyQt界面中输入的汉字呢？

在GUI中的`plainTextEdit.toPlainText()`方法返回QString类型的变量，将其直接转换为str

{% highlight python %}
data = str(self.plainTextEdit.toPlainText())
# 如果输入中文，这将返回错误
UnicodeEncodeError: 'ascii' codec can't encode character u'\u597d' in position 0: ordinal not in range(128)
{% endhighlight %}

可见，QString编码类型默认为Unicode，由于ASCII码在Unicode表中是相同的码，所以输入英文不会产生错误，但是输入中文字符超过了ASCII码的范围。

QString有方法可以直接转换Unicode为UTF-8，所以将其改为

{% highlight python %}
data = str(self.plainTextEdit.toPlainText().toUtf8())     # 输入中文程序不再报错
{% endhighlight %}

此外，如果要在另外一个控件上显示字符串内容，还需要将其转换为Unicode编码，否则仍然显示的是乱码

{% highlight python %}
self.textEdit.append(unicode(data, 'utf8'))    # 或者
self.textEdit.append(data.decode('utf8'))      # 二者是等效的
{% endhighlight %}

当然，直接使用QString带的方法操作字符串也就不需要转来转去了。当时转str只是顺手的事情，没有想到背后包含了这么多知识。赛翁失马，焉知非福？


[UNICODE,GBK,UTF-8区别]: http://www.cnblogs.com/cy163/archive/2007/05/31/766886.html