---
layout: post
title: "Undefined symbol 乱码是什么"
category: 备忘
tags: [C++]
---

程序猿在Debug的时候应该经常会遇到`undefined symbol`这样的东西，后面跟上一串乱码，比如

	node: symbol lookup error: node: undefined symbol: _ZN2v87Context3NewEPNS_22ExtensionConfigurationENS_6HandleINS_14ObjectTemplateEEENS3_INS_5ValueEEE

乱码中还有一些能看懂的单词，大概是函数名称之类的东西。以前也遇到过，并且碰巧看见了如何翻译。今日又见，却不记得所以然。记下以备忘：）

度娘懂中文却不懂搜索，骨哥也只能用英文才搜到了一个被墙的博客(blogspot)。原文：

>Undefined symbols in C++
>In C++ programming, we sometimes encounter "undefined symbols" problem during compilation or dlopen. The name of undefined symbols looks obfuscated. E.g.:
>
>Unable to dlopen(test.so): test.so: Undefined symbol "_ZN6moduleD2Ev"
>
>You may wonder why the symbol looks so ugly. Actually, this conversion of symbol is called [Name Mangling](http://en.wikipedia.org/wiki/Name_mangling). C++ supports polymorphism, this means functions can have same name but different types and numbers of parameters. Therefore, compiler cannot just use the function name as the symbol. Instead, both function name and parameter types should be included in symbol naming. Name mangling is the technique to encode a function name and parameter types into one symbol.
>
>To translate the mangled symbols to more meaningful text, we can use the c++flit utility. E.g.
>
>ahlam@oxygen:~$ c++filt _ZN6moduleD2Ev
>
>module::~module()
>
>Now, you know "_ZN6moduleD2Ev" is the destructor of class module.

于是可以得到

{% highlight sh %}
$c++flit _ZN2v87Context3NewEPNS_22ExtensionConfigurationENS_6HandleINS_14ObjectTemplateEEENS3_INS_5ValueEEE
v8::Context::New(v8::ExtensionConfiguration*, v8::Handle<v8::ObjectTemplate>, v8::Handle<v8::Value>)
{% endhighlight %}
