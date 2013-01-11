---
layout: post
title: "Git服务器配置笔记 - gitolite"
catagory: 笔记
tags: [git,gitolite,ssh]
---

## 前言
---

一转眼一个月就过去了，在我最初想要写博客到时候，实际上这篇文章是我最想写下来的内容。但是一直以来闲暇时间较少，短时间内不能整理完所有的想法和心得。今日终于有心静下来整理整理，可惜相隔多日，已无当时日思夜想满脑子心得的状态了，微感惋惜。

实际上这几天正在玩[Python Challenge]()，目前停留在7，不想去搜答案了，慢慢地玩。所以有心将每一题的思路记下来，那么在此之前，我必须完成这篇文章:)

关于gitolite，在[关于]({/about.html)中提到的背景下，由于项目需要在多台计算机之间管理源码，所以必须有一台支持git的服务器。[^1]

## SSH协议
---

在开始`git`与`gitolite`之前，首先应该知道什么是SSH。这不难，我知道它是`Secure Shell`，但是在此之前我并不知道它是如何运作的。[^2]

通过SSH协议，可以在远程Unix计算机上执行shell命令，甚至其它更多的扩展功能在远程实现。

而`gitolite`的工作原理，正是通过SSH协议访问远程服务器上名为`git`的用户，在远程执行shell命令操作`gitolite`程序完成管理或者读取版本库等工作。因此，在配置`gitolite`之前，必须清楚SSH如何使用。不幸的是，鄙人在这无视了[gitolite官方文档]中的[忠告]，走了不少弯路。

远程账户的`home`目录下通常会有`.ssh`文件夹，用于保存SSH相关的配置，以及能够访问本机的授权公钥集`authorized_keys`文件。需要访问该远程计算机的本地计算机可以由`ssh-keygen`生成基于RSA的密钥对——公钥和密钥，将公钥写入远程计算机的`authorized_keys`中，之后便不再需要输入密码即可直接使用SSH协议在远程执行相关的命令了。

因此，`gitolite`通过这种方式，使用SSH协议管理虚拟账户的权限[^3]，将在后文中详细说明。

## gitolite
---

### 安装 Install

1. 首先应该清楚，`gitolite`只需要一个实体用户(real user)，通常命名为`git`。因此以下的操作均在`git`用户下进行。

2. 克隆一个源码库到本地：

        $git clone git://github.com/sitaramc/gitolite

3. 在本地源码中执行安装

        $gitolite/install -to /usr/local/gitolite/bin

    这一步将会把所有的程序安装到`/usr/local/gitolite/bin`目录下。
    
### 配置 Setup

1. `gitolite`中所有配置及版本库的权限管理是通过`git`实现的，所以需要在`gitolite`管理员所使用的计算机上生成一对密钥对，并且将公钥`*.pub`拷贝到这台`gitolite`服务器上。假设碰巧管理员名字叫`pixy`，根据上节安装完成后在`git`用户下配置`gitolite`：

        $gitolite setup -pk pixy.pub

2. 成功后，管理员即可在自己的计算机上进行`gitolite`的配置和管理：

        $git clone git@host:gitolite-admin

    `gitolite-admin`这个版本库是默认生成的，用于管理`gitolite`。其中包括：
    
    - gitolite-admin/conf/gitolite.conf
        用于所有版本库的管理、虚拟用户权限设置等

    - gitolite-admin/keydir/user1.pub,user2.pub
        虚拟用户的公钥，`gitolite`会自动在每一次push后将这些公钥写入`git`用户的`~/.ssh/authorized_keys`中。
        
    接下来将简单介绍gitolite-admin实现的功能。

### 版本库管理

在`gitolite-admin/conf/gitolite.conf`文件中，已经预先包含了gitolite-admin库和testing库相关的配置内容，颇具参考价值。添加一行不存在的版本库名字，即可添加新库。

        repo foo
            RW      =       pixy

显然，有关权限`RW`等操作的等式右边为虚拟用户，现在介绍如何添加虚拟用户。

### 管理git虚拟账户

在软件项目中，每一个版本库都有不同的人员共同贡献代码，根据开发的不同职责，有必要对不同的git用户配置不同权限。

在`gitolite-admin/keydir/`目录下保存了所有虚拟用户的公钥，`gitolite`通过严格的文件命名约定识别虚拟用户的名称。

- 例如用户`pixy`的公钥即为`pixy.pub`。

- 假如用户`pixy`是高富帅(这只是假设)，他有很多台计算机或者系统，那么可以使用`pixy@computername.pub`用于区分不同的计算机或者场所等，`gitolite`会仍然会识别这是用户`pixy`。

- 这个@容易混淆对吧？因为git用户常用email地址作为用户名，但也无妨。`gitolite`同样会将`pixy@bupt.com.pub`识别为用户`pixy@bupt.com`，毕竟有两个"."的区别。

在添加完所需的虚拟用户后，将这些提交push到服务器上。服务器根据特定的钩子脚本(hooks)执行shell命令，将这些公钥添加到git用户的`~/.ssh/authorized_keys`中。

特别的是，与标准SSH用户不同，添加在`authorized_keys`中的除了公钥外，还包含了特殊的执行语句以及相应的虚拟用户名，以便于`gitolite`识别并限制该ssh访问所能执行的shell命令。因此，执行

        $ssh git@hostname

将只能得到`gitolite`返回的一些信息，然后中断连接，不能够再执行更多的shell命令。这保证了服务器的安全。


### 其它

有关`gitolite.conf`文件更多的配置可以参见gitolite官方wiki的说明：

- [权限的详细设置](http://sitaramc.github.com/gitolite/rules.html)

- [git-config设置](http://sitaramc.github.com/gitolite/git-config.html)

- 还有在[Gitweb 与 Apache2 的协奏](% post_url 2012-12-30-gitweb-works-with-apache2 %})里提到的[rc文件的相关配置](http://sitaramc.github.com/gitolite/rc.html)，rc文件($HOME/.gitolite.rc)包含了许多重要的功能。

在官方wiki中提到了SSH对.ssh文件夹及其各级子目录的权限具有严格的要求，为文章[Gitweb 与 Apache2 的协奏](% post_url 2012-12-30-gitweb-works-with-apache2 %})中所述内容的来源。

附上整理Eernote笔记时，看见的一篇参考文献。[Gitolite 构建 Git 服务器]()，这是[蒋鑫]()老师在《Git权威指南》中关于`gitolite`的相关内容。

## 后记
---

整个学习git、gitolite、gitweb的过程，使我真正开始了解和探究Linux，以前知道的很多东西都只是皮毛而已。通过近日这些有关服务器的配置过程，包括之前的svn服务、ftp服务、web服务、基于pptp的vpn服务等等，我从侧面略微观察到了Linux系统背后严格、复杂、并且完善的安全机制，顿生敬意。希望我能在这条路上走得深远，在此立愿。



---

### 脚注

[^1]: 为什么是git？因为我不甘于svn下管理源码，当我深入了解git之后我才感觉到，在我使用svn时有一个不好的习惯，习惯完成所有工作后作一次提交，这虽然很合逻辑，但是却严重阻碍了项目进展。当时间模糊了我的记忆时，我根本无法在这些大型的提交中分辨哪些修改是日志中提到的添加的某一个功能。而git赋予我更加灵活的工作方式，在本地做细小的提交而不需要将它们全都反应在服务器上。

[^2]: 使用了一年的Linux居然不了解SSH，实在惭愧至极。

[^3]: 实际上，通过SSH访问的每一个实体用户具有完全的操作权限，分配不同实体用户以不同的访问权限也能够进行版本库的读写权限的管理，但出于安全考虑（可执行的命令过于丰富），gitolite建议禁止使用实体用户机制管理权限，而使用gitolite内置的虚拟用户机制。因为虚拟用户仅能够执行与版本库操作有关的一些基本命令。



[Python Challenge]: http://www.pythonchallenge.com/
[gitolite官方文档]: http://sitaramc.github.com/gitolite/master-toc.html
[忠告]: http://sitaramc.github.com/gitolite/install.html#req
[蒋鑫]: http://www.worldhello.net/
[Gitolite 构建 Git 服务器]: http://www.ossxp.com/doc/git/gitolite.html
