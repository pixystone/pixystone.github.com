---
layout: post
title: "安装OpenStack(openSUSE) Step by Step - Compute (Nova) (二)"
category: 笔记
tags: [OpenStack, Nova, openSUSE, Cloud Compute]
---
{% include JB/setup %}

上一篇：[安装OpenStack(openSUSE) Step by Step - Compute (Nova) (一)]({% post_url 2013-06-25-deploy-openstack-on-opensuse-step-by-step---compute-nova-1 %})

---

## 安装Nova

Grizzly版本已经将Nova-Volume分离为Cinder，因此在上一篇中安装并验证Cinder后，便可以开始安装OpenStack的核心部分——Nova。

- Controller节点安装较多组件

{% highlight sh %}
$ zypper in openstack-nova-api openstack-nova-scheduler openstack-nova-conductor openstack-nova-novncproxy openstack-nova-network openstack-nova-consoleauth openstack-nova-cert
{% endhighlight %}

- Compute节点只需要安装network和compute

{% highlight sh %}
$ zypper in openstack-nova-compute openstack-nova-network
{% endhighlight %}

### 配置Nova

配置文件`/etc/nova/nova.conf`中包含了大量的配置说明，建议将其备份，然后重新建立一个新的`nova.conf`添加所需的配置。
详细的配置可参考[The reference in the OpenStack Compute Administration Manual](http://docs.openstack.org/trunk/openstack-compute/admin/content/compute-options-reference.html)

笔者的配置文件仅供参考

> 待添加：）

一般情况下，Controller节点与Compute节点的配置信息可以相同，除了与IP相关的配置：

- my_ip
- vncserver_listen
- vncserver_proxyclient_address

注意文件`nova.conf`的权限，所有权`root:openstack-nova`，mode`0640`。

### 初始化数据库

配置完成后，停止所有的服务并初始化数据库

- Controller节点

{% highlight sh %}
$ rcopenstack-nova-api stop
$ rcopenstack-nova-network stop
$ rcopenstack-nova-scheduler stop
$ rcopenstack-nova-consoleauth stop
$ rcopenstack-nova-cert stop
$ rcopenstack-nova-conductor stop
$ rcopenstack-nova-novncproxy stop
{% endhighlight %}

- Compute节点

{% highlight sh %}
$ rcopenstack-nova-compute stop
$ rcopenstack-nova-network stop
{% endhighlight %}

- 同步数据库

{% highlight sh %}
$ nova-manage db sync
{% endhighlight %}

- 重启所有服务，Controller节点

{% highlight sh %}
$ rcopenstack-nova-api start
$ rcopenstack-nova-network start
$ rcopenstack-nova-scheduler start
$ rcopenstack-nova-consoleauth start
$ rcopenstack-nova-cert start
$ rcopenstack-nova-conductor start
$ rcopenstack-nova-novncproxy start
{% endhighlight %}

- Compute节点

{% highlight sh %}
$ rcopenstack-nova-compute start
$ rcopenstack-nova-network start
{% endhighlight %}

注：笔者在单节点上同时配置Controller和Compute时，`rcopenstack-nova-compute start`返回服务启动失败，但是直接启动`nova-compute`却可以正常运行，不知何故。或许是执行的用户不同产生的不同结果。

## 验证服务运行状态

安装配置之后，可以查看所有Nova相关的服务状态

{% highlight sh %}
$ nova-manage service list
{% endhighlight %}

---

### 参考文档

[OpenStack Installation Guide for Ubuntu 12.04][]

---

[OpenStack Installation Guide for Ubuntu 12.04]: http://docs.openstack.org/grizzly/openstack-compute/install/apt/content/
