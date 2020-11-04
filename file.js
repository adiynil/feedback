const fs = require('fs')

// 异步 *****
const fsRead = (path) => {
    return new Promise((resolve, reject) => {
        fs.readFile(path, { flag: 'r', encoding: 'utf-8' }, (err, data) => {
            if (err)
                reject(err)
            else
                resolve(data.toString())
        })
    })
}



const fsWrite = (path, data) => {
    return new Promise((resolve, reject) => {
        fs.writeFile(path, data, { flag: 'w+', encoding: 'utf8' }, (err) => {
            if (err)
                reject(err)
            else
                resolve(err)
        });
    })
}


module.exports = {
    fsRead,fsWrite
}