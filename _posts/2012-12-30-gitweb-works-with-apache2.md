---
layout: post
title: "Gitweb 与 Apache2 的协奏"
category: 笔记
tags: [git, gitweb, apache, ssh, linux, gitolite]
---

---

## 前言

《Git权威指南》这本书非常系统，教科书般的详解足以解决大部分遇到的问题，是一本好书值得推荐。至于剩余的一小部分问题，交给Google吧:)

---

## 涉及的权限交叉

虽然笔者入门Linux也有两年了，但是一直都没有系统地研究过这个强大的系统。[鸟哥][]的[私房菜][]着实Nice。

在利用apache建立各种web服务时，笔者遇到了一个关于Linux中的用户权限交叉问题，包括先前较早建立的svn服务器，gitweb也同样如此。

- apache使用的用户为www-data，名字很怪。总的来说，如果需要web服务（下称apache）获取到诸如svn服务器所需要的仓库内容或者是gitweb服务所需要的git目录，一定需要将www-data用户加入svn或者git用户所在的用户组，并且对所要读取的目录添加`g+r`的基本权限（注意目录需要`g+rx`）[^1]。

- 由于git使用SSH认证，ssh对git用户的`~/.ssh/`目录及其各级父目录的权限有严格的要求，必须为`go-w`：

    即对 `/, /home, /home/git, /home/git/.ssh` 需要逐级取消`组和其它`的写入权限:`go-w`

    或许是因为误操作，最初配置ssh时同时取消了`/home/git`目录的`go+x`权限，由于该目录没有执行权限，apache的www-data就无法进入`/home/git/`的下级目录，也就无法读取其下级目录中的内容，尽管www-data在git组中具有读取权限。所以导致gitweb服务无法获取到git库的目录内容。最后，总算是补上了一课Linux的权限知识，加上git用户的home目录`g+x`权限后，问题解决。


---

## 简单配置流程

在这简单记录一下总体流程吧，在《Git权威指南》中有更详细的记录。这里就作为读书笔记吧。

- 安装gitweb apache：

{% highlight sh %}
        $ sudo apt-get install apache2,gitweb
{% endhighlight %}

- 在 `/etc/apache2/conf.d/gitweb` 文件中加入：

        Alias /git /usr/share/gitweb     #这里表示服务器url http://host/git/ 代表服务器中的 /usr/share/gitweb 目录
        <Directory /usr/share/gitweb>
        Options FollowSymLinks +ExecCGI
        AddHandler cgi-script .cgi
        DirectoryIndex index.cgi gitweb.cgi
        Order Allow,Deny
        Allow from all
        </Directory>

- 在 /etc/gitweb.conf 文件中修改git根目录等信息：

        # path to git projects (<project>.git)
        $projectroot = "/home/git/repositories/";
        # file with project list; by default, simply scan the projectroot dir.
        $projects_list = "/home/git/projects.list";

- 重启apache

{% highlight sh %}
        $ sudo apachectl restart
{% endhighlight %}

- 打开网页试试效果:) `http://localhost/git/`

---

## 后记

由于服务器使用gitolite管理git库，因此将需要使用gitweb服务的git库添加一些描述如：

- 在gitolite-admin中的配置文件conf加入：

        testing     “Owner” = “Description”

    `testing` 在这里为git库名，后面的描述与gitweb中的Owner、Description对应。那么没有添加该描述的库将不会gitweb中显示，比如 `gitolite-admin`。

- 另外，或许在修改完conf文件之后使用 `git push` 更新gitolite时会返回一些错误，比如不允许使用config命令之类的内容，这是gitolite出于安全考虑默认禁止了config命令，于是参照gitolite的wiki，配置rc文件以允许使用config操作。

    因为上文中：

        testing     “Owner” = “Description”

    实际上等效为：

        testting     config.gitweb.username     =    "Owner"
                     config.gitweb.description  =    "Description"

    所以会产生以上错误。

---

### 脚注

[^1]: 在Linux系统中，文件(夹)的权限分为三种：用户、用户组、其它，即u(user)、g(group)、o(other)，普通的权限也包含三种：读取(r)、写入(w)、执行(x)。

    因此对文件(夹)使用chmod添加(+)或删除(-)权限时，例如，添加组成员的读取权限：

        $ sudo chmod g+r [file]


[鸟哥]: http://linux.vbird.org
[私房菜]: http://vbird.dic.ksu.edu.tw