---
layout: post
title: "Deploy OpenStack on openSUSE Step by Step - Compute (Nova)"
category: 笔记
tags: [OpenStack, Nova, Cinder, openSUSE, Cloud Compute]
---
{% include JB/setup %}

上一篇：[Deploy OpenStack on openSUSE Step by Step - Image (Glance)]({% post_url 2013-06-17-deploy-openstack-on-opensuse-step-by-step---image-glance %})

---

## OpenStack Compute Service - Nova

跟随[OpenStack Installation Guide for Ubuntu 12.04][]的节奏，我们遇到了Nova。它是OpenStack的核心，简而言之，它掌控着控制节点或计算节点的行为。

---

## 准备条件

### 安装KVM

- 检查CPU条件

{% highlight sh %}
$ grep -E '(vmx|svm)' /proc/cpuinfo
{% endhighlight %}

- 通过YAST工具，直接安装KVM，这里不详细介绍。安装后重启。

### 配置网桥

使用YAST工具添加一个网桥br100。[^1]（前提：使用ifup配置网络）

- YAST - 网络设备 - 网络设置- 概览 - 添加 - 设备类型（网桥） - 配置名称（100）- 下一步 - 静态IP（192.168.100.1） - 下一步 - 完成

### 配置MySQL

与Keystone相似，我们需要初始化一个数据库用于Nova服务。

{% highlight sh %}
$ mysql -u root -p
{% endhighlight %}

{% highlight mysql %}
mysql> CREATE DATABASE nova;
mysql> GRANT ALL ON nova.* TO 'nova'@'%' IDENTIFIED BY '[nova的数据库密码]';
mysql> GRANT ALL ON nova.* TO 'nova'@'localhost' IDENTIFIED BY '[nova的数据库密码]';
mysql> quit
{% endhighlight %}

### 安装配置Block Storage Service - Cinder

- 安装

{% highlight sh %}
zypper in openstack-cinder-api openstack-cinder-scheduler openstack-cinder-volume python-cinderclient tgt open-iscsi
{% endhighlight %}

- 编辑`/etc/cinder/api-paste.ini`

{% highlight text%}
[filter:authtoken]
paste.filter_factory = keystoneclient.middleware.auth_token:filter_factory
service_protocol = http
service_host = 127.0.0.1
service_port = 5000
auth_host = 127.0.0.1
auth_port = 35357
auth_protocol = http
admin_tenant_name = service
admin_user = cinder
admin_password = cinder
{% endhighlight %}

- 在Keystone配置中并没有cinder用户，需要根据其它用户的模板添加cinder

{% highlight sh %}
$ keystone user-create --tenant-id [xxx] --name cinder --pass cinder
$ keystone user-role-add --tenant-id [xxx] --user-id [xxx] --role-id [xxx]
{% endhighlight %}

- 在MySQL中添加cinder相关配置

{% highlight mysql %}
mysql> CREATE DATABASE cinder;
mysql> GRANT ALL ON cinder.* TO 'cinder'@'localhost' IDENTIFIED BY '[cinder的数据库密码]';
mysql> quit
{% endhighlight %}

- 配置`/etc/cinder/cinder.conf`，需要事先建立一个LVM卷组`cinder-volumes`，所以至少需要一块空闲分区。（LVM的管理自行Google）

{% highlight text%}
[DEFAULT]
verbose = True 
log_dir = /var/log/cinder
auth_strategy = keystone
rootwrap_config = /etc/cinder/rootwrap.conf
state_path = /var/lib/cinder
sql_connection = mysql://cinder:cinder@localhost/cinder
volume_name_template = volume-%s
volume_group = cinder-volumes
api_paste_config=/etc/cinder/api-paste.ini
iscsi_helper = tgtadm
{% endhighlight %}

（本人暂时没有空闲分区，To be continued :）

---

## 安装Nova

---

### 参考文档

[OpenStack Installation Guide for Ubuntu 12.04][]

---

#### 脚注

[^1]: 可能已经存在了一个网桥。

[OpenStack Installation Guide for Ubuntu 12.04]: http://docs.openstack.org/grizzly/openstack-compute/install/apt/content/
