---
layout: post
title: "Install Devstack on openSUSE 12.3"
category: 笔记
tags: [OpenStack, Devstack, openSUSE, Cloud Compute]
---
{% include JB/setup %}

---

## Devstack

在一台Linux上快速实现单节点（包括Nova Controller、Nova Compute）的[OpenStack][]架构，可以使用[Devstack][]，迅速进入开发和学习状态[^1]。

Devstack的安装很简单

{% highlight sh %}
$ zypper in git
$ git clone git://github.com/openstack-dev/devstack.git
$ cd devstack
$ ./stack.sh
{% endhighlight %}

---

## stack.sh兼容性

Devstack的`stack.sh`与openSUSE12.3并不兼容，提示的建议为12.2。

- 根据提示，加入`FORCE=yes`参数强制执行

{% highlight sh %}
$ cd devstack
$ echo "FORCE=yes" >> localrc
{% endhighlight %}

- 在运行过程中会出现无法连接到本地的服务（如`glance-api`,`nova-api`等），一定是服务启动失败。

	通过执行`screen -x stack`查看stack用户的shell，它启动服务不成功是因为找不到`/usr/local/bin/glance-api`
	实际上`which glance-api`返回的目录是`/usr/bin/glance-api`
	通过查找目录中所有`/usr/local/bin`字符串可以找到functions中定义了`get_python_exec_prefix`方法时根据不同的操作系统，选择不同的prefix。

所以，在functions文件中

{% highlight sh %}
function get_python_exec_prefix() {
    if is_fedora; then
        echo "/usr/bin"
    else
        echo "/usr/local/bin"
    fi
}
{% endhighlight %}

改为

{% highlight sh %}
function get_python_exec_prefix() {
    if is_suse | is_fedora; then
        echo "/usr/bin"
    else
        echo "/usr/local/bin"
    fi
}
{% endhighlight %}

最后重新开始

{% highlight sh %}
$ ./restack.sh
$ ./stack.sh
{% endhighlight %}

---

#####脚注

[^1]: 主要是开发，其实这种快速一个Shell Script文件搞定的最不利于学习了。

[OpenStack]: http://openstack.org
[Devstack]: http://devstack.org

