# Img-trans

* 基于node-canvas 和　express 的一款npm包
* PDF转换存在POST发送请求数据,需要使用body-parser处理url,在package.json中已写入

  > index.html 为我在本地的简单测试文件，初期功能简单，后续会使用测试脚本测试覆盖率 

  > 严格来说，这不算是一个根本的 npm dependices,更像是一个基于运行在后台的Canvas图片格式转换插件，既然已经有了 node-canvas ,为什么还需要 Img-tran

## Install

   >执行 npm install 前，先安装依赖，由于 node-canvas 是C++写的，并且，其中涉及到在后端Node中直接对css等进行设置，所以不仅需要当前的 OS 可以对node-canvas的项目文件进行编译，还需要工作期间操作Canvas实例的依赖，所以安装期间可能会或多或少的遇到问题，以下是操作流程(结合了node-canvas的READEME和编写代码期间遇到的问题)


*  根据当前的OS在Install前在终端执行响应命令,安装对应包或依赖,必须成功后才可执行后续操作，否则安装后项目也无法正常运行。


   OS | Command
   ----- | -----
   OS X | `brew install pkg-config cairo pango libpng jpeg giflib`
   Ubuntu | `sudo apt-get install libcairo2-dev libjpeg8-dev libpango1.0-dev libgif-dev build-essential g++`
   Fedora | `sudo yum install cairo cairo-devel cairomm-devel libjpeg-turbo-devel pango pango-devel pangomm pangomm-devel giflib-devel`
   Solaris | `pkgin install cairo pango pkg-config xproto renderproto kbproto xextproto`
   Windows | [Instructions on our wiki](https://github.com/Automattic/node-canvas/wiki/Installation---Windows)

*  执行上述操作成功之后即可安装项目

   获取源码包:

    $ git　clone  git@github.com:ZJH9Rondo/Img-trans.git

   安装Package.json对应依赖:

    $ sudo npm install

    > 提醒一点: 如果当前用户是将　npm　更新至＠５.0 版本，执行　sudo npm install 会在当前平行目录生成　Package-lock.json 文件，这个是 npm 新版本加入的特征(规范),不影响正常使用，具体规范说明有需要可以看如下来自[Stackoverflow](https://stackoverflow.com/questions/44297803/package-lock-json-role)的解释。


## How to use

  * 前端用ajax发送数据，后端接收后对对应图片进行处理，之后响应返回为一个转换后图片的url

    > 上述基本说明有一点有必要说明，当前的基础版本暂时没有加入上传文件进行转换的需求，开发构想基本使用场景是　个人网站或图片格式转换功能开发中,当前站点的对图片格式转换的简单功能需求，所以直接是通过 url 读取站点的图片文件进行转换操作，后续会加入文件上传处理。

  * Ajax的参数说明

    PNG SVG JPEG的参数说明(以　PNG　为例):

      > 由于测试是用本地自己封装的一个Ajax测试的，所以格式可能会有点差别

    ```
        var data = {
          "source": src,      // 需转换图片的
          "name": "test.png"  // 生成图片的文件名
          "width": 794,       // Canvas的width
          "height": 1123,     // Canvas的height
          "outUrl": "./image/newImg/",  // 生成转换文件的存放路径
          "type": "png"     　// 文件转换格式
        };
    ```
    　
    其中, src 建议使用相对路径,其值的获取可以自由输入,也可以通过js获取,但是在获取的时候建议使用　getAttribute() 获取,而非　img.src 。

  　PDF 的问题需要仔细说明,如下:

    ```
      var data = {
        "source": src,
        "width": 794,
        "height": 1123,
        "h1": "This is a PDF",
        "p": "It be made node-canvas,It be made node-canvas,It be made node-canvas,It be made node-canvas",
        "name": "test.pdf",
        "outUrl": "./image/newImg/",
        "type": "pdf"
      };
    ```
  * PDF参数说明  

     h1: 当前PDF的内容标题设置

      p: 当前PDF的文本内容文本,但是当前由于node-canvas的 p 函数解析对于过长的文本没有自动换行的处理，当前版本的后续更新会对此在后台通
      过js做处理。

      其余与上相同，又去当前开发的只是返回了Url,所以具体生成的文件除PDF外都能在测试时直接使用返回的URL看到效果,后续的开发功能会及时更新添加，目前使用对于图片格式转换没有问题。

  * PDF中 Ajax 请求发送必须使用　POST 发送数据,并且在启动Ajax之前需要对data做处理，使用 JSON.stringify() 做处理,并且设置 Request Headers 中的 Content-Type 为　application/json ,这样后端才能正常接收并解析请求中Url所携带的数据。

## 后续功能开发

  * PDF的text长文本裁剪转换
  * PDF返回文件支持下载
  * PDF多文本转换
  * Canvas转换后清晰度下降问题
      　
