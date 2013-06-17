---
layout: post
title: "Deploy OpenStack on openSUSE Step by Step - Get Started"
category: 笔记
tags: [OpenStack, openSUSE, Cloud Compute]
---
{% include JB/setup %}

---

## OpenStack

云——一种未来的资源，用[OpenStack][]创造云。

快速创建单节点的OpenStack开发环境可以使用[Devstack][]，参见[Install Devstack on openSUSE 12.3]({% post_url 2013-06-10-install-devstack-on-opensuse-12-3 %})。

---

## 服务架构

OpenStack是多个服务的集合，包括Identity Service（Keystone）、Image Service（Glance）、Compute Service（Nova）、Object Storage Service（Swift）、Volume Service（Cinder）、Networking Service（Quantum）等。此外，还有基于Django的Web控制台Dashboard（Horizon）。

Service Name | Code Name
-----------|:-----------:
Identity | Keystone
Compute | Nova
Image | Glance
Dashboard | Horizon
Object Storage | Swift
Volumes | Cinder
Networking | Quantum


---

## 安装准备

### CPU要求

CPU必须具备虚拟化技术，查看方式：

{% highlight sh %}
$ grep -E "(vmx|svm)" /proc/cpuinfo
{% endhighlight %}

### 安装NTP（Network Time Protocol）

保证Controller节点与Compute节点之间时间同步。

{% highlight sh %}
$ zypper in ntp
{% endhighlight %}

- 在Controller节点将/etc/ntp.conf中`server 127.127.1.0`与`fudge 127.127.1.0 stratum 10`取消注释，没有就加上即可。这一步添加本地的时钟同步。

- 在各个Compute节点添加任务计划进行定时与Controller同步时间。在`/etc/cron.daily/ntpdate`加入

		ntpdate <Controller节点的IP地址>
		hwclock -w

### 安装MySQL

{% highlight sh %}
$ zypper in mysql-community-server python-mysql
{% endhighlight %}

- 安装完成后，设置MySQL的root密码，然后启动服务

{% highlight sh %}
$ mysqladmin password <new password>
$ service mysql start
{% endhighlight %}

### 安装Messaging Queue Server

OpenStack各个模块进程之间通过消息队列服务分配任务。默认为RabbitMQ，另外也可以选择Qpid或者ZeroMQ。

{% highlight sh %}
$ zypper in rabbigmq-server
{% endhighlight %}

### 添加OpenStack源

默认的源已经包含相应的二进制包，但不是最新的。可以添加[OpenSUSE Build Service][]中的源：

{% highlight sh %}
$ zypper ar http://download.opensuse.org/repositories/Cloud:/OpenStack:/Master/openSUSE_12.3/Cloud:OpenStack:Master.repo
$ zypp-refresh
{% endhighlight %}

或者其它源,参见<http://download.opensuse.org/repositories/Cloud:/OpenStack:/>

...

---

### 参考文档

[OpenStack Installation Guide for Ubuntu 12.04][]



[OpenStack]: http://openstack.org
[Devstack]: http://devstack.org
[OpenSUSE Build Service]: https://build.opensuse.org/project/show?project=Cloud%3AOpenStack
[OpenStack Installation Guide for Ubuntu 12.04]: http://docs.openstack.org/grizzly/openstack-compute/install/apt/content/
