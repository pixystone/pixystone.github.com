---
layout: post
title: "Deploy OpenStack on openSUSE Step by Step - Identity (Keystone)"
category: 笔记
tags: [OpenStack, Keystone, openSUSE, Cloud Compute]
---
{% include JB/setup %}

上一篇：[Deploy OpenStack on openSUSE Step by Step - Get Started]({% post_url 2013-06-12-deploy-openstack-on-opensuse-step-by-step---get-started %})

---

## OpenStack Identity Service - Keystone

跟随[OpenStack Installation Guide for Ubuntu 12.04][]的节奏，首先遇到了Keystone。简单地说，它是一个认证系统，主要包含两个功能：

- 用户管理：管理不同虚拟帐号可执行操作的权限
- 服务目录：记录不同服务相关的配置，比如服务API节点信息等

相关名词：

名称 | 定义
----|:----:
User | 使用OpenStack云服务的用户、系统或者服务的唯一标识，作为Keystone验证过程的发起人。
Credentials | 证书。User用于验证自己身份的凭证。可通过的验证包括：匹配的用户名与密码、匹配的用户名与API Key、唯一可代表User的特殊令牌等。
Authentication | 验证过程。验证User的请求是否可信，并将结果报告给User所请求的服务。
Token | 令牌，是一串特殊的字符。User通过验证过程将获得相应资源的令牌。令牌是唯一的，只包含一种资源的使用许可，并且令牌可以随时撤销，具有有效期。
Tenant | 租赁空间[^1]。定义这一种容器，主要用于对不同资源、标识进行分组。根据不同的情景，租赁空间可以是客户、帐号、组织或者项目。
Service | OpenStack的服务，如计算（Nova）、对象存储（Swift）、镜像（Glance）等。服务提供一个或多个节点（Endpoint）用于User接入并使用相应的资源。
Endpoint | 网络的可接入节点，通常由url描述一个服务的接入地址。
Role | 描述User的角色，例如管理员admin、服务service、普通用户user等，便于管理不同User对资源可操作的权限。

每一个服务的User策略都以JSON形式保存在`/etc/服务CodeName/policy.json`文件中，例如计算服务（Nova）的User策略保存在`/etc/nova/policy.json`。
默认的`policy.json`只包含管理员角色（admin role）相关的策略，在一个租赁空间中所有不需要管理员角色的相关操作，其执行权限将赋予所有普通用户。

具体内容可参见[参考文档][OpenStack Installation Guide for Ubuntu 12.04]。

---

## 安装Keystone

根据上一篇，可以添加最新的Master源（Grizzly Release）。然后直接安装二进制包

{% highlight sh %}
$ zypper in openstack-keystone
{% endhighlight %}

---

## 配置Keystone

不使用SQLite作为数据库，改用MySQL。

### 删除SQLite的文件[^2]

{% highlight sh %}
$ rm /var/lib/keystone/keystone.db
{% endhighlight %}

### 配置MySQL

- 新建Keystone数据库

{% highlight sh %}
$ mysql -u root -p
{% endhighlight %}

{% highlight sql %}
mysql> CREATE DATABASE keystone;
{% endhighlight %}

- 配置keystone数据库权限

设置keystone服务将以keystone用户的身份访问keystone数据库。另外，别忘了密码。

{% highlight mysql %}
mysql> GRANT ALL ON keystone.* TO 'keystone'@'%' IDENTIFIED BY '[keystone数据库的密码]';
mysql> GRANT ALL ON keystone.* TO 'keystone'@'localhost' IDENTIFIED BY '[keystone数据库的密码]';
{% endhighlight %}

> 默认情况下，MySQL不允许本地的其他用户接入数据库，因此需要第二条覆盖这一规则。（或许笔者理解的不对？）

### 修改配置文件

- 首先，修改数据库接入信息

		connection = mysql://keystone:[keystone数据库的密码]@localhost/keystone

- 设置服务目录保存在数据库中，不使用模板方式[^2]

		[catalog]
		driver = keystone.catalog.backends.sql.Catalog
		# driver = keystone.catalog.backends.templated.TemplatedCatalog
		# template_file = default_catalog.templates

- 设置管理员令牌

		admin_token = tokentoken

### 配置SSL

Keystone默认使用SSL加密，初始化并重启服务

{% highlight sh %}
$ sudo keystone-manage pki_setup
$ sudo chown -R openstack-keystone:openstack-keystone /etc/keystone/*
$ sudo service openstack-keystone restart
{% endhighlight %}

### 初始化数据库

{% highlight sh %}
$ keystone-manage db_sync
{% endhighlight %}

### 配置Service相关的Tenant、User、Role

这里，我们需要配置一些用户（比如，admin、service等），以及他们各自的角色，以便于Keystone与其他服务之间进行协作。

> 建议使用[这个脚本](https://github.com/openstack/keystone/raw/master/tools/sample_data.sh)进行快速部署，如果需要学习，可以手动进行添加配置等。详情参见[OpenStack Installation Guide for Ubuntu 12.04][]，二者略有出入。

{% highlight sh %}
$ wget https://github.com/openstack/keystone/raw/master/tools/sample_data.sh
$ chmod a+x sample_data.sh
$ ./sample_data.sh
{% endhighlight %}

成功后会输出所有的配置结果，配置模板参照[OpenStack Installation Guide for Ubuntu 12.04][]中手动配置过程。

	+-------------+---------------------------------------+
	|   Property  |                 Value                 |
	+-------------+---------------------------------------+
	|   adminurl  |  http://localhost:$(admin_port)s/v2.0 |
	|      id     |    35acf97a47724c94bc762cb22a63b121   |
	| internalurl | http://localhost:$(public_port)s/v2.0 |
	|  publicurl  | http://localhost:$(public_port)s/v2.0 |
	|    region   |               RegionOne               |
	|  service_id |    b8e45e64bef046949ff29d3d00a496be   |
	+-------------+---------------------------------------+
	+-------------+------------------------------------------------------+
	|   Property  |                        Value                         |
	+-------------+------------------------------------------------------+
	|   adminurl  | http://localhost:$(compute_port)s/v1.1/$(tenant_id)s |
	|      id     |           95b9983ebd7b4eac96eb5c3971446d88           |
	| internalurl | http://localhost:$(compute_port)s/v1.1/$(tenant_id)s |
	|  publicurl  | http://localhost:$(compute_port)s/v1.1/$(tenant_id)s |
	|    region   |                      RegionOne                       |
	|  service_id |           ac27f2a0af1c4dbe92fed482efef7a7f           |
	+-------------+------------------------------------------------------+
	+-------------+----------------------------------------+
	|   Property  |                 Value                  |
	+-------------+----------------------------------------+
	|   adminurl  | http://localhost:8776/v1/$(tenant_id)s |
	|      id     |    74e2d4c2a6c244a6800f9a4a89607a4a    |
	| internalurl | http://localhost:8776/v1/$(tenant_id)s |
	|  publicurl  | http://localhost:8776/v1/$(tenant_id)s |
	|    region   |               RegionOne                |
	|  service_id |    68e394478fd2436aaadf23e7a34ff3e4    |
	+-------------+----------------------------------------+
	+-------------+----------------------------------+
	|   Property  |              Value               |
	+-------------+----------------------------------+
	|   adminurl  |      http://localhost:9292       |
	|      id     | aad3f0d99e374d7a91125349db1f5400 |
	| internalurl |      http://localhost:9292       |
	|  publicurl  |      http://localhost:9292       |
	|    region   |            RegionOne             |
	|  service_id | ecf011207e5340939e3117528701984d |
	+-------------+----------------------------------+
	+-------------+--------------------------------------+
	|   Property  |                Value                 |
	+-------------+--------------------------------------+
	|   adminurl  | http://localhost:8773/services/Admin |
	|      id     |   fea1ea08e0db409bb5ddc95a9926728c   |
	| internalurl | http://localhost:8773/services/Cloud |
	|  publicurl  | http://localhost:8773/services/Cloud |
	|    region   |              RegionOne               |
	|  service_id |   ce45f1b85dc148bd823037f207096c9a   |
	+-------------+--------------------------------------+
	+-------------+---------------------------------------------+
	|   Property  |                    Value                    |
	+-------------+---------------------------------------------+
	|   adminurl  |           http://localhost:8888/v1          |
	|      id     |       f72641685aea41469e458192bd7bc840      |
	| internalurl | http://localhost:8888/v1/AUTH_$(tenant_id)s |
	|  publicurl  | http://localhost:8888/v1/AUTH_$(tenant_id)s |
	|    region   |                  RegionOne                  |
	|  service_id |       fc0fb855a4824a05ae09c0f241974f32      |
	+-------------+---------------------------------------------+

---

## 验证安装

{% highlight sh %}
$ keystone --os-username=admin --os-password=secrete --os-auth-url=http://localhost:35357/v2.0 token-get
{% endhighlight %}

成功时会返回token相关信息，如user_id、expires、id等，如果信息太多，可能你已经看不出来它是一个表格了。但表格形式如上文：）

	+-------------+---------------------------------------------+
	|   Property  |                    Value                    |
	+-------------+---------------------------------------------+
	|   expires   |             2013-06-18T09:29:35Z            |
	|      id     |       MIICbgYJKoZIhvcNAQcCoIICXzC...        |
	|   user_id   |       5c2d379b09d54c9588ccb8a13fe9b6bc      |
	+-------------+---------------------------------------------+

同样地，验证其它User的权限

{% highlight sh %}
$ keystone --os-username=glance --os-password=glance --os-auth-url=http://localhost:5000/v2.0 token-get
$ keystone --os-username=nova --os-password=nova --os-auth-url=http://localhost:5000/v2.0 token-get
$ keystone --os-username=ec2 --os-password=ec2 --os-auth-url=http://localhost:5000/v2.0 token-get
$ keystone --os-username=swift --os-password=swiftpass --os-auth-url=http://localhost:5000/v2.0 token-get
{% endhighlight %}


---

### 参考文档

[OpenStack Installation Guide for Ubuntu 12.04][]

---

#### 脚注

[^1]: 笔者自翻译的，或许这样好理解一些吧。

[^2]: openSUSE上安装完并没有这个文件。


[OpenStack Installation Guide for Ubuntu 12.04]: http://docs.openstack.org/grizzly/openstack-compute/install/apt/content/