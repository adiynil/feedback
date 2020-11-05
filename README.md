# 基于Node.js搭建的留言板feedback

## 下载

```
git clone https://github.com/adiynil/feedback.git
```

## 运行

安装运行需要Node.js环境 [Node.js官网](https://nodejs.org/en/)

```
cd feedback
npm install
node server.js
# 部署到服务器运行建议使用forever
npm install forever -g
foever start server.js
```

## 文件

- `data.json`记录留言信息
- `log.json`记录运行时的错误信息