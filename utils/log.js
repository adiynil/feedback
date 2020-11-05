const fs = require("fs")
const path = require("path")
const dateFormat = require('./dateFormat')


const log = (msg)=>{
    msg = `${dateFormat()} ${msg}\n`
    fs.writeFile(path.join(__dirname, "../log"), msg, {flag: "a"}, (err)=>{
        if(err) return
    })
}
module.exports = log