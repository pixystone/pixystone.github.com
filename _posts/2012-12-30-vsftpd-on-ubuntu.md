---
layout: post
title: "Ubuntu下FTP服务器搭建笔记 - vsftpd"
category: 笔记
tags: [ftp, ubuntu, pam, ssh, linux, vsftpd]
---

---

## 前言

参考了很多博客中的文章，很少有Ubuntu环境下的配置，CentOS居多[^1]，但多数情况下大同小异。

vsftpd不断在更新，从`apt-get`安装的版本是2.3+，所以在配置的过程中与多数教程多少有些出入，着实让人郁闷。

比如，安装好vsftpd，默认添加了ftp用户，它的home目录已经不是`/var/ftp`了，而是`/srv/ftp`，最郁闷的是什么？是安装好之后，在自带的doc说明里头也写的是`/var/ftp`，坑爹的doc中的很多expamle也只能是参考一下了。

---

## 根目录权限

vsftpd在新版本中为了避免漏洞产生安全问题，限定了`/srv/ftp`目录（ftp登录用户的根目录）的权限必须为`ugo-w`：

![vsftpd-screenshot-0](/assets/images/posts/2012-12-30-vsftpd-screenshot-0.png)

但是在其子文件夹下可以拥有任意权限：

![vsftpd-screenshot-1](/assets/images/posts/2012-12-30-vsftpd-screenshot-1.png)

由于ftp目录没有写权限，所以不论如何配置，匿名用户都无法操作该目录。因此可以再新建一个目录pub便于匿名用户所有进行操作。

---

## 虚拟用户

ftp中可以使用server上的真实用户，但这样是危险的。

而匿名用户`anonymous`最好不给予上传与目录新建删除等高级操作，必须有更加丰富的权限管理机制——需要一个虚拟用户权限管理机制。

vsftpd支持虚拟用户，很多文章中介绍的需要新建一个virtual用户或者别的什么的，但是实际上这是不需要的，因为`apt-get`安装过程自动新建了一个ftp用户。这个ftp用户是vsftpd用于匿名用户的实体，所有的虚拟用户权限将等同于这个ftp用户，也即与匿名登录ftp的用户相同。为什么要介绍这段呢？因为后面设置虚拟用户权限的文件中，将直接使用匿名用户对应的参数控制该虚拟用户的权限。[^2]

### 1. 配置vsftpd

vsftpd的配置文件在`/etc/vsftpd.conf`中，各种用法实际上都包含在`man vsftpd.conf`中，百度一下也有很多翻译，不多说。

- 本机的参数如下：

        # 监听ipv6和ipv4，作为双栈服务器，学校的ipv6就是给力。
        listen_ipv6=YES

        # 取消匿名用户登录
        anonymous_enable=NO

        # 打开本地用户（实体）登录功能，这是使用虚拟用户的**前提条件1**
        # 另外，可以在文件/etc/ftpusers中指定哪些用户无法登录，比如root。
        local_enable=YES

        # 全局关闭所有用户上传功能
        write_enable=NO

        # 本地用户上传的文件保存权限为774
        local_umask=003

        # 匿名用户上传的文件保存权限为774
        anon_umask=003

        # 不允许匿名用户上传
        anon_upload_enable=NO

        # 不允许匿名用户新建目录
        anon_mkdir_write_enable=NO

        # 目录信息
        dirmessage_enable=YES

        # 时间校准，以登录用户本地时间为准
        use_localtime=YES

        # 日志开
        xferlog_enable=YES

        # 20端口用于文件传输
        connect_from_port_20=YES

        # 用户操作超时时间100秒
        idle_session_timeout=100

        # 用户传输文件超时120秒
        data_connection_timeout=120

        # 很明显，欢迎信息
        ftpd_banner=Welcome to Pixy's FTP Server.

        # 限制本地用户只能访问自己的home文件夹，安全机制
        chroot_local_user=YES
        #chroot_list_enable=YES

        # (default follows)
        #chroot_list_file=/etc/vsftpd.chroot_list

        # 安全空目录
        secure_chroot_dir=/var/run/vsftpd/empty

        # PAM认证服务文件名，实际为/etc/pam.d/vsftpd，这是**前提条件2**
        # 另外，上面提到的/etc/ftpusers文件实际上是通过/etc/pam.d/vsftpd中定义了使用方式：deny，即拒绝列表
        # 在配置好虚拟用户登录方式后，可以在拒绝列表中补上本机操作管理员账户，即UID=1000的那位。
        pam_service_name=vsftpd

        # ssl认证证书位置
        rsa_cert_file=/etc/ssl/private/vsftpd.pem

        # 允许虚拟用户登录方式，显然这是**前提条件3**
        guest_enable=YES

        # 虚拟用户以一个实体用户为载体，这里ftp已经存在，不必新建，**前提条件4**
        guest_username=ftp

        # 虚拟用户配置文件所在目录，如果虚拟用户名字叫user1，那么在这个目录下就应该有一个user1文件，**前提条件5**
        user_config_dir=/etc/ftpconf/user/

### 2. 生成利用PAM管理虚拟用户的用户名密码数据库

- 为了方便，使用root操作。

{% highlight sh %}
    $ cd /etc
{% endhighlight %}

- 首先新建一个文件tmp.txt

{% highlight sh %}
    $ touch tmp.txt
{% endhighlight %}

- 在文件中加入用户名和密码，奇数行用户名，偶数行密码，例如

{% highlight sh %}
    $ vi tmp.txt
{% endhighlight %}

内容如下：

        user1
        password1
        user2
        password2

保存关闭。

- 然后以这个文件为模板新建一个用户名密码数据库即可[^3]：

{% highlight sh %}
    $ db_load -T -t hash -f tmp.txt /etc/ftpconf/vsftpd_login.db
{% endhighlight %}

db_load命令包含在db-util中，

{% highlight sh %}
    $ apt-get install db-util
{% endhighlight %}


### 3. 配置vsftpd使用PAM认证虚拟用户

- 上文中提到：

        # PAM认证服务文件名，实际为/etc/pam.d/vsftpd
        pam_service_name=vsftpd

- 现在我们就需要编辑这个文件：

{% highlight sh %}
    $ vi /etc/pam.d/vsftpd
{% endhighlight %}

- 文件中原本就带有一些内容，例如：

        # Standard behaviour for ftpd(8).
        auth     required     pam_listfile.so item=user sense=deny file=/etc/ftpusers onerr=succeed
        # Note: vsftpd handles anonymous logins on its own. Do not enable pam_ftp.so.
        # Standard pam includes
        @include common-account
        @include common-session
        @include common-auth
        auth     required     pam_shells.so

- 在文件前面加入两行：

        auth     sufficient     pam_userdb.so     db=/etc/ftpconf/vsftpd_login
        account  sufficient     pam_userdb.so     db=/etc/ftpconf/vsftpd_login

- 实际上，之前我是直接在最前面加入：

        auth     required     pam_userdb.so     db=/etc/ftpconf/vsftpd_loginaccount  required     pam_userdb.so     db=/etc/ftpconf/vsftpd_login

    注意区别，sufficient表示充分条件，required表示必要条件。

    充分条件无法满足时会继续下一步的操作，即后面那些原本就有的代码；而必要条件无法满足将终止。

    我不知道为什么最初使用required会出现认证失败（`/var/log/auth.log`中所描述的），或许是这个sufficient使然。

    但是无论是充分条件还是必要条件，认证失败都意味着不能使用虚拟用户登录。也许是因为后来在这个博客中看见关于sufficient的配置方式，我就重新开始一遍流程，包括生成了一遍`vsftpd_login.db`，所以这也和重新生成也脱不开关系。我也懒得再重新做一个单一变量的实验了。

言归正传:)

### 4. 配置不同虚拟用户

- 前文中提到了：

        # 虚拟用户配置文件所在目录，如果虚拟用户名字叫user1，那么在这个目录下就应该有一个user1文件，**前提条件5**
        user_config_dir=/etc/ftpconf/user/

- 那么在/user_config_dir/user1文件中的内容用于控制虚拟用户user1的行为：

        # 该虚拟用户登录后的根目录
        anon_root=/srv/ftp/

        # 由于全局变量配置了不允许上传，该可以用户单独配置上传
        write_enable=YES

        # 注意这里的前缀anon_，前文提到了，虚拟用户实际上权限等同于匿名用户anonymous，所以这里如果打开了匿名用户的上传权限
        # 那么，虚拟用户的上传权限就打开了
        # vsftpd中的各种约定实在难找，很多东西还是得仔细研读man的。
        anon_upload_enable=YES

        # 同上，打开虚拟用户新建目录权限
        anon_mkdir_write_enable=YES

        # 如果这个虚拟用户是管理员，那么可以打开其它的高级写入权限，比如删除、更名等等。
        anon_other_write_enable=YES

        # 上传后的文件权限为774
        anon_umask=003

    需要注意的是，上传后的文件权限设置中，必须具备`o+r`的权限，这样所有匿名（包括虚拟）用户才能够读取文件和文件夹内容。

- 很显然，这些参数将覆盖全局参数。更多参数详见：`man vsftpd.conf`。又是这句话:)

### 5. 测试一下成果吧:)

{% highlight sh %}
    $ restart vsftpd
    $ ftp localhost
{% endhighlight %}

以下是本机测试结果：

![vsftpd-test](/assets/images/posts/2012-12-30-vsftpd-test.png)

---

## 后记

为了便于直接在服务器上管理某些文件夹中的内容，比如Documents，可以直接使用`mount --bind`命令将日常使用的用户文件夹挂载到`/srv/ftp/pub/`中。

注意`mount`之后的文件内的权限，将组设置为ftp，所有者可以不变。那么就需要`g+rwx`权限了。

---

### 脚注

[^1]: 或许Ubuntu太初级了？或者只有企业用户才会去配置一个ftp服务器？我太闲了？

[^2]: 当然，如果再自己新建一个实体用户virtual，那么所有的虚拟用户权限仍然将等同于匿名用户`anonymous`，如果想要权限与virtual相同，可以参见`man vsftpd.conf`，对应参数为：

        virtual_use_local_privs=YES

[^3]:
    选项`-T`允许应用程序能够将文本文件转译载入进数据库，由于之后是将虚拟用户的信息以文件方式存储在文件里的，为了让vsftpd能够通过文本来载入用户数据必须要使用这个选项。

    选项`-t`是用来指定转译载入的数据库类型：包括Btree、Hash、Queue、Recon，这里使用hash。

    选项`-f`表示从文件中载入数据，这里是`tmp.txt`
