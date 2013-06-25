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

- 使用YAST工具，直接安装KVM，这里不详细介绍。安装后重启。

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
$ zypper in openstack-cinder-api openstack-cinder-scheduler openstack-cinder-volume python-cinderclient tgt open-iscsi
{% endhighlight %}

- 编辑`/etc/cinder/api-paste.ini`

{% highlight text %}
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

- 配置`/etc/cinder/cinder.conf`，需要事先建立一个LVM卷组`cinder-volumes`，所以至少需要一块空闲分区。（LVM的管理自行Google）

{% highlight text %}
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

- 在MySQL中添加cinder相关配置

{% highlight mysql %}
mysql> CREATE DATABASE cinder;
mysql> GRANT ALL ON cinder.* TO 'cinder'@'localhost' IDENTIFIED BY '[cinder的数据库密码]';
mysql> quit
{% endhighlight %}

- 配置target framework (tgt)

{% highlight sh %}
$ echo "include /etc/tgt/conf.d/*.conf" >> /etc/tgt/targets.conf
$ mkdir /etc/tgt/conf.d
$ echo "include /var/lib/cinder/volumes/*" >> /etc/tgt/conf.d/cinder.conf
$ rctgtd restart
{% endhighlight %}

- 初始化数据库，重启相关服务。`cinder-volume`启动错误详见[^2]

{% highlight sh %}
$ cinder-manage db sync
$ rcopenstack-cinder-volume restart
$ rcopenstack-cinder-api restart
$ rcopenstack-cinder-scheduler restart
{% endhighlight %}

### 验证cinder安装

{% highlight sh %}
$ cinder create --display_name test 1
$ cinder list
{% endhighlight %}

返回结果：

{% highlight text %}
+--------------------------------------+-----------+--------------+------+-------------+----------+-------------+
|                  ID                  |   Status  | Display Name | Size | Volume Type | Bootable | Attached to |
+--------------------------------------+-----------+--------------+------+-------------+----------+-------------+
| a33780a2-52b2-40b1-95eb-529283baa7e6 | available |     test     |  1   |     None    |          |             |
+--------------------------------------+-----------+--------------+------+-------------+----------+-------------+
{% endhighlight %}

此外，volume的状态不是`avaliable`和`error`时，比如`deleting`，是无法用`cinder delete`删除的。

{% highlight text %}
+--------------------------------------+----------------+--------------+------+-------------+----------+-------------+
|                  ID                  |     Status     | Display Name | Size | Volume Type | Bootable | Attached to |
+--------------------------------------+----------------+--------------+------+-------------+----------+-------------+
| 992103a2-d40b-4346-8afc-75efdbc643f1 | error_deleting |     test     |  1   |     None    |          |             |
| a33780a2-52b2-40b1-95eb-529283baa7e6 |   available    |     test     |  1   |     None    |          |             |
+--------------------------------------+----------------+--------------+------+-------------+----------+-------------+
{% endhighlight %}

{% highlight sh %}
$ cinder delete 992103a2-d40b-4346-8afc-75efdbc643f1
ERROR: Invalid volume: Volume status must be available or error (HTTP 400) (Request-ID: req-35f0b5fe-e435-4595-a31c-ce4e0d571f8e)
{% endhighlight %}

只能在数据库中将其状态修改为`error`。

{% highlight mysql %}
mysql>use cinder;
mysql>select status,id from volumes;
+----------------+--------------------------------------+
| status         | id                                   |
+----------------+--------------------------------------+
| error_deleting | 992103a2-d40b-4346-8afc-75efdbc643f1 |
| available      | a33780a2-52b2-40b1-95eb-529283baa7e6 |
+----------------+--------------------------------------+
mysql>update volumes set status="error" where id="992103a2-d40b-4346-8afc-75efdbc643f1";
mysql>select status,id from volumes;
+-----------+--------------------------------------+
| status    | id                                   |
+-----------+--------------------------------------+
| error     | 992103a2-d40b-4346-8afc-75efdbc643f1 |
| available | a33780a2-52b2-40b1-95eb-529283baa7e6 |
+-----------+--------------------------------------+
{% endhighlight %}

然后，查看target中的节点信息

$ tgtadm --lld iscsi --mode target --op show

{% highlight text %}
Target 1: iqn.2010-10.org.openstack:volume-992103a2-d40b-4346-8afc-75efdbc643f1
	System information:
		Driver: iscsi
		State: ready
	I_T nexus information:
	LUN information:
		LUN: 0
			Type: controller
			SCSI ID: IET     00010000
			SCSI SN: beaf10
			Size: 0 MB, Block size: 1
			Online: Yes
			Removable media: No
			Prevent removal: No
			Readonly: No
			Thin-provisioning: No
			Backing store type: null
			Backing store path: None
			Backing store flags:
		LUN: 1
			Type: disk
			SCSI ID: IET     00010001
			SCSI SN: beaf11
			Size: 1074 MB, Block size: 512
			Online: Yes
			Removable media: No
			Prevent removal: No
			Readonly: No
			Thin-provisioning: No
			Backing store type: rdwr
			Backing store path: /dev/cinder-volumes/volume-992103a2-d40b-4346-8afc-75efdbc643f1
			Backing store flags:
	Account information:
	ACL information:
		ALL
{% endhighlight %}

删除这个错误的节点

{% highlight sh %}
$ tgtadm --lld iscsi --mode target --op delete --tid 1
{% endhighlight %}

最后再使用`cinder delete`将其删除

{% highlight sh %}
$ cinder delete 992103a2-d40b-4346-8afc-75efdbc643f1
{% endhighlight %}

---

## 安装Nova

待续... :)

---

### 参考文档

[OpenStack Installation Guide for Ubuntu 12.04][]

---

#### 脚注

[^1]: 可能已经存在了一个网桥。

[^2]: `cinder-volume`服务启动失败，在`volume.log`中看到有关`sudo`的错误：`sudo: no tty present and no askpass program specified`，这是由于`openstack-cinder`用户在执行`sudo cinder-rootwrap`时，并没有无密码执行的sudo权限。

	因此需要在`/etc/sudoers.d/cinder_sudoers`添加

		Defaults: openstack-cinder !requiretty
		openstack-cinder ALL = (root) NOPASSWD: /usr/bin/cinder-rootwrap

	类似的问题也会发生在Nova、Quantum服务，参考自：<https://lists.launchpad.net/openstack/msg22121.html>


[OpenStack Installation Guide for Ubuntu 12.04]: http://docs.openstack.org/grizzly/openstack-compute/install/apt/content/
