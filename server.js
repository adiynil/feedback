const fs = require("./file");
const utils = require("./utils");
const path = require("path");
const http = require("http");
var querystring = require("querystring");
const template = require("art-template");

var htmlBody = "";
var config = "";
var logObj = "";
// 搭建服务器
http.createServer(async (req, res) => {
  
  var postQurey = "";
    req.on("data", (chunk) => {
      postQurey += chunk;
    });

    req.on("end", async () => {
      // 判断是否有请求，有的话就写入log.json文件
      postQurey = querystring.parse(postQurey.toString());
      if (postQurey.name && postQurey.content) {
        logObj = await fs.fsRead(path.join(__dirname, "./log.json"));
        logObj = JSON.parse(logObj ? logObj : "{}");
        logObj.total ? (logObj.total += 1) : (logObj.total = 1);
        logObj.update = utils.dateFormat();
        let item = {
          name: postQurey.name,
          content: postQurey.content,
          at: utils.dateFormat(),
          from: req.socket.remoteAddress,
        };
        logObj.items ? logObj.items.unshift(item) : (logObj.items = [item]);
        await fs.fsWrite(
          path.join(__dirname, "./log.json"),
          JSON.stringify(logObj, null, "\t")
        );
        console.log("addon 1 item");
      } else {
        console.log("doing nothing");
      }
      // 读取html文档
      htmlBody = await fs.fsRead(path.join(__dirname, "./resources/index.html"));
      // 读取配置文件
      config = await fs.fsRead(path.join(__dirname, "./config.json"));
      config = JSON.parse(config);
      res.writeHead(200, { "Content-Type": "text/html; charset=utf8" });
      htmlBody = template.render(htmlBody, config);
      res.end(htmlBody);
    });

  })
  .listen(3000, () => {
    console.log("server running on port 3000...");
  });
