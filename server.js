const fs = require("fs")
const utils = require("./utils");
const path = require("path");
const http = require("http");
const querystring = require("querystring"); // post请求解析
const urlTool = require("url")
const template = require("art-template");

var htmlBody = "";
var config = "";
var dataObj = "";
// 搭建服务器
http.createServer(async (req, res) => {
  var url = req.url
  var urlObj = urlTool.parse(url)
  url = urlObj.pathname
  // 开放资源文件请求
  if (url.indexOf("/resources/") == 0) {
    // let data = await fs.fsRead(path.join(__dirname, url))
    fs.readFile(path.join(__dirname, url), (err, data) => {
      if (err) res.end("404 Not Found")
      res.end(data)
    })
    return
  }
  // 监听post请求
  var postQurey = "";
  req.on("data", (chunk) => {
    postQurey += chunk;
  });

  req.on("end", async () => {
    // 判断是否有请求，有的话就写入log.json文件
    if(postQurey) utils.log(`received post request ${postQurey.toString()} from ${url}`)
    postQurey = querystring.parse(postQurey.toString());
    if (url == "/" && postQurey.name && postQurey.content) {
      fs.readFile(path.join(__dirname, "./data.json"), {flsg: "a+"}, (err, data) => {
        if (err) return utils.log("read data.json error")
        dataObj = data
        dataObj = JSON.parse(dataObj ? dataObj : "{}");
        dataObj.total ? (dataObj.total += 1) : (dataObj.total = 1);
        dataObj.update = utils.dateFormat();
        let item = {
          name: postQurey.name,
          content: postQurey.content,
          at: utils.dateFormat(),
          from: req.socket.remoteAddress,
        }
        dataObj.items ? dataObj.items.unshift(item) : (dataObj.items = [item])
        fs.writeFile(path.join(__dirname, "./data.json"), JSON.stringify(dataObj, null, "\t"), err => {
          if (!err) return utils.log("addon 1 item")
          utils.log("write data error")
        })
      })
    }
    
    // 读取配置文件
    fs.readFile(path.join(__dirname, "./config.json"), (err, data) => {
      if (err) return utils.log("read config error")
      config = data
      config = JSON.parse(config)
      // 读取html文档
      fs.readFile(path.join(__dirname, "./resources/index.html"), (err, data) => {
        if (err) return utils.log("read html error")
        htmlBody = data
        htmlBody = template.render(htmlBody.toString(), config)
        res.end(htmlBody)
      })
    })
  });
}).listen(3000, () => {
  console.log("server running on port 3000...")
  utils.log("server running on port 3000...")
});