---
layout: post
title: "Deploy OpenStack on openSUSE Step by Step - Image (Glance)"
category: 笔记
tags: [OpenStack, Glance, openSUSE, Cloud Compute]
---
{% include JB/setup %}

上一篇：[Deploy OpenStack on openSUSE Step by Step - Identity (Keystone)]({% post_url 2013-06-13-deploy-openstack-on-opensuse-step-by-step---identity-keystone %})

---

## OpenStack Image Service - Glance

跟随[OpenStack Installation Guide for Ubuntu 12.04][]的节奏，我们遇到了Glance。简单地说，它提供磁盘镜像服务。

---

## 安装Glance

配置好OpenStack的源后，可以直接安装

{% highlight sh %}
$ zypper in openstack-glance python-glanceclient
{% endhighlight %}

---

## 配置Glance

### 配置MySQL

与Keystone相似，我们需要初始化一个数据库用于Glance服务。

{% highlight sh %}
$ mysql -u root -p
{% endhighlight %}

{% highlight mysql %}
mysql> CREATE DATABASE glance;
mysql> GRANT ALL ON glance.* TO 'glance'@'%' IDENTIFIED BY '[glance的数据库密码]';
mysql> GRANT ALL ON glance.* TO 'glance'@'localhost' IDENTIFIED BY '[glance的数据库密码]';
mysql> quit
{% endhighlight %}

### 修改glance-api配置

设置glance-api，配置文件为`/etc/glance/glance-api.conf`

打开两个版本的API

	enable_v1_api=true
	enable_v2_api=true

使用Keystone作为验证工具。

	flavor=keystone

根据Keystone中有关Terent、User、Role的设置（参见上一篇：[Deploy OpenStack on openSUSE Step by Step - Identity (Keystone)]({% post_url 2013-06-13-deploy-openstack-on-opensuse-step-by-step---identity-keystone %})）
配置其它参数

	[keystone_authtoken]
	auth_host = 127.0.0.1
	auth_port = 35357
	auth_protocol = http
	admin_tenant_name = service
	admin_user = glance
	admin_password = glance
	[paste_deploy]
	config_file = /etc/glance/glance-api-paste.ini

配置数据库地址，并注释SQLite相关的内容

	sql_connection = mysql://glance:[glance的数据库密码]@localhost/glance
	# [sql]
	# connection = sqlite:////var/lib/glance/glance.db


然后，重启glance-api

{% highlight sh %}
$ service openstack-glance-api restart
{% endhighlight %}

### 修改glance-registry配置

与glance-api类似，在`/etc/glance/glance-registry.conf`中设置

	[keystone_authtoken]
	auth_host = 127.0.0.1
	auth_port = 35357
	auth_protocol = http
	admin_tenant_name = service
	admin_user = glance
	admin_password = glance
	[paste_deploy]
	config_file = /etc/glance/glance-registry-paste.ini
	flavor=keystone

数据库设置

	sql_connection = mysql://glance:[glance的数据库密码]@localhost/glance
	# [sql]
	# connection = sqlite:////var/lib/glance/glance.db

再修改`/etc/glance/glance-registry-paste.ini`，打开Keystone验证模块[^1]

	# Use this pipeline for keystone auth
	[pipeline:glance-registry-keystone]
	pipeline = authtoken context registryapp

重启glance-registry

{% highlight sh %}
$ service openstack-glance-registry restart
{% endhighlight %}


### 初始化数据库

数据库初始化，再次重启所有的服务

{% highlight sh %}
$ glance-manage version_control 0
$ glance-manage db_sync
$ service openstack-glance-api restart
$ service openstack-glance-registry restart
{% endhighlight %}

注意，如果`glance-manage version_control 0`命令没有在`glance-manage db_sync`前执行的话，验证时执行任何`glance`命令都会返回500错误。在`api.log`中只是说`glance-registry`返回了`500 Internal Server Error`，而`registry.log`中根本看不出错误在哪。[^2]

这种错误的症状是数据库glance中只有一个table：`migrate_version`

{% highlight mysql %}
mysql> use glance;
Database changed
mysql> show tables;
+------------------+
| Tables_in_glance |
+------------------+
| migrate_version  |
+------------------+
{% endhighlight %}

解决方法：重建数据库

{% highlight sh %}
$ mysql -u root -p
{% endhighlight %}

{% highlight mysql %}
mysql> DROP DATABASE glance;
mysql> CREATE DATABASE glance;
mysql> GRANT ALL ON glance.* TO 'glance'@'%' IDENTIFIED BY '[glance的数据库密码]';
mysql> GRANT ALL ON glance.* TO 'glance'@'localhost' IDENTIFIED BY '[glance的数据库密码]';
mysql> quit
{% endhighlight %}

{% highlight sh %}
$ glance-manage version_control 0
$ glance-manage db_sync
{% endhighlight %}

最后查看数据库glance：

{% highlight mysql %}
mysql> use glance;
Database changed
mysql> show tables;
+------------------+
| Tables_in_glance |
+------------------+
| image_locations  |
| image_members    |
| image_properties |
| image_tags       |
| images           |
| migrate_version  |
+------------------+
{% endhighlight %}


---

## 验证安装

首先下载一个测试用的镜像，参考文档中的cirros镜像

	http://download.cirros-cloud.net/0.3.1/cirros-0.3.1-x86_64-disk.img

或者Ubuntu的[Cloud Image][]

wget太慢，可以用浏览器下。

### 环境变量

管理账户的home目录下可以新建一个`openrc`文件，保存admin相关的环境变量

	export OS_USERANME=admin
	export OS_TENANT_NAME=demo
	export OS_PASSWORD=[admin的密码]
	export 0S_AUTH_URL=http://localhost:5000/v2.0/
	export OS_REGION_NAME=RegionOne

### 新建镜像

{% highlight sh %}
$ . openrc
$ glance image-create --name="Cirros 0.3.1" --disk-format=qcow2 \
--container-format bare < cirros-0.3.1-x86_64-disk.img
{% endhighlight %}






---

### 参考文档

[OpenStack Installation Guide for Ubuntu 12.04][]

---

#### 脚注

[^1]: 实际上原本就有，不需要修改。

[^2]: `registry.log`中最后一句为数据库回滚ROLLBACK，没有任何错误，但就是因为数据库没有正确初始化造成的。笔者在这里卡了两天两夜，最后在<https://bugs.launchpad.net/glance/+bug/1157347>找到原因。

[Cloud Image]: http://cloud-images.ubuntu.com/
[OpenStack Installation Guide for Ubuntu 12.04]: http://docs.openstack.org/grizzly/openstack-compute/install/apt/content/
