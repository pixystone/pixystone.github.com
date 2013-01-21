---
layout: post
title: "GnuRadio on OSX - Fatal Python error"
category: 笔记
tags: [osx, gnuradio, Python]
---

---

## Fatal Python error: PyThreadState_Get: no current thread (Mountain Lion)

在MacOSX中，macports原本只有源码安装的方式，现在更新了，也可以像homebrew一样使用二进制包安装，非常方便。并且，通过macports可以直接安装gnuradio了，版本还是最新的3.6.3！Good News：）

---

## 系统自带的Python与macports安装的python产生的冲突

正是这一个冲突，出现了错误：

    Fatal Python error: PyThreadState_Get: no current thread

考虑到系统原本就自带了Python，因此有可能是原有自带的Python并没有完全链接所有在macports中的dylib之类的东西。最后可以通过macports中的select命令选择默认Python为之后安装的python27：

    $ sudo port select --set python python27

另外，可以查看当前python的所有版本：

    $ port select --list python
    Available versions for python:
        none
        python25-apple
        python26-apple
        python27 (active)
        python27-apple
