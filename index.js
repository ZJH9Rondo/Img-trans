var express = require('express'),
    bodyParser = require('body-parser'),
    fs = require('fs'),
    Canvas = require('canvas'),
    app;

app = express();

/*
* 处理跨域操作，设置响应头
*/
app.use(function(req, res, next){
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Credentials", true);
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
  res.header("X-Powered-By",'3.2.1');
  res.header("Content-Type", "application/json;charset=utf-8");
  next();
});

app.use(bodyParser.json()); // 解析json中间件
app.use(bodyParser.urlencoded({extended: true}));
/*
* 处理请求，转换图片格式
*/
app.post('/imgtrans',function (req,res,next){
    var src,
        out,
        width,
        height,
        type;

    if(req.body){
          // POST 请求
          src = req.body.source;
          out = req.body.outUrl + req.body.name;
          width = Number(req.body.width);
          height = Number(req.body.height);
          type = req.body.type;
    }else{
          // GET 请求
          src = req.query.source;
          width = Number(req.query.width);
          height = Number(req.query.height);
          type = req.query.type;
    }

    var trans = (function (){
        // 转换方法构造函数get
        function Method(){}

        Method.prototype.png = function (){

            var result = (function (){
              return  new Promise(function (resolve,reject){
                  var canvas = new Canvas(width,height),  // 创建canvas
                      ctx = canvas.getContext('2d'),
                      img;

                  fs.readFile(src, function(err,data){
                    if (err) throw err;

                    img = new Canvas.Image();
                    img.src = data;
                    ctx.drawImage(img, 0, 0, img.width, img.height);

                    resolve(canvas);
                  });
                });
            })();

            result.then(function (canvas){
                fs.writeFile(out,canvas.toBuffer(),function (err){
                   if(err) throw err;

                   var data = {
                     src: out
                   };

                   res.status(200).json(data);
                });
              });
        };

        Method.prototype.svg = function (){
          var result = (function (){
            return  new Promise(function (resolve,reject){
                var canvas = new Canvas(width,height,'svg'),  // 创建canvas
                    ctx = canvas.getContext('2d'),
                    img;

                fs.readFile(src, function(err,data){
                  if (err) throw err;

                  img = new Canvas.Image();
                  img.src = data;
                  ctx.drawImage(img, 0, 0, img.width, img.height);

                  resolve(canvas);
                });
              });
          })();

          result.then(function (canvas){
              fs.writeFile(out,canvas.toBuffer(),function (err){
                 if(err) throw err;

                 var data = {
                   src: out
                 };

                 res.status(200).json(data);
              });
            });
        };

        Method.prototype.jpeg = function (){
          var result = (function (){
            return  new Promise(function (resolve,reject){

                var canvas = new Canvas(width,height),  // 创建canvas
                    ctx = canvas.getContext('2d'),
                    img;

                fs.readFile(src, function(err,data){
                  if (err) throw err;

                  img = new Canvas.Image();
                  img.src = data;
                  img.dataMode = Image.MODE_MIME | Image.MODE_IMAGE; // 添加数据流跟踪,加快导出速度
                  ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0,img.width,img.height);

                  resolve(canvas);
                });
              });
          })();

          result.then(function (canvas){
               // 捕获返回的 writeStream
               var stream = canvas.syncJPEGStream({bufsize:2048,quality:80}).pipe(fs.createWriteStream('./image/newImg/test.jpeg'));

              // 异步回调，执行完写入操作，返回文件路径
              stream.on('close',function (){

                var data = {
                  src: out
                };

                res.status(200).json(data);
              });
            });
        };

        Method.prototype.pdf = function (){
            var result = (function (){
                return new Promise(function (resolve,reject){
                    var canvas = new Canvas(width,height,'pdf'),
                        ctx = canvas.getContext('2d'),
                        img,
                        x,
                        y;

                    // 初始化 JPEG 的大小
                    function reset(){
                        x = 50;
                        y = 50;
                    }

                    // 标题创建函数
                    function h1(str){
                      ctx.font = '14px Helvetica';
                      ctx.fillText(str,x,y);
                    }

                    // 段落创建函数
                    function p(str){
                      ctx.font = '12px Arial';
                      y = y + 20;
                      ctx.fillText(str,x,y);
                    }

                    // 图片创建函数
                    function Img(src){
                      var img = new Canvas.Image();

                      img.src = src;
                      y = y + 20;
                      ctx.drawImage(img,x,y);
                      y = y + img.height;
                    }

                    //　创建PDF
                    reset();  // 初始化
                    h1(req.body.h1);
                    p(req.body.p);
                    Img(src);
                    ctx.addPage();  //　生成实例

                    fs.writeFile(out,canvas.toBuffer(),function (err){
                      if(err) throw err;

                      var data = {
                        src: out
                      };
                      res.status(200).json(data);
                    });
                });
            })();
        };
        return Method;
    })();

    var Trans = new trans();

    switch(type){
      case 'png': Trans.png();
                  break;

      case 'svg': Trans.svg();
                  break;

      case 'jpeg': Trans.jpeg();
                   break;

      case 'pdf': Trans.pdf();
                  break;
       default: res.end();
    }

});

app.listen(3000, function () {
    console.log('Express server listening on port 3000');
});
