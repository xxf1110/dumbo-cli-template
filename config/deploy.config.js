/*
config.js
说明： 
  development、production: 连接测试 生产环境的服务器信息
  targetDir: 需要压缩的文件目录（启用本地压缩后生效）
  targetFile: 指定上传文件名称（config.js同级目录）
  openCompress: 关闭后，将跳过本地文件压缩，直接上传同级目录下指定文件
  openBackUp: 开启后，若远端存在相同目录，则会修改原始目录名称，不会直接覆盖
  deployDir: 指定远端部署地址
  releaseDir: 指定远端部署地址下的发布目录名称 
*/
const packageJSON = require('../package.json')
const path = require('path')

module.exports = {
    development: {
        host: 'host',
        port: 22,
        username: 'root',
        password: '',
        // privateKey: 'E:/id_rsa',  
        // passphrase: '123456' // ssh私钥对应解密密码(不存在设为''即可 
    },
    production: {
        host: 'host',
        port: 22,
        username: 'root',
        password: '',
        // privateKey: 'E:/id_rsa',  
        // passphrase: '123456' // ssh私钥对应解密密码(不存在设为''即可) 
    },
    common: {
        name: packageJSON.name,
        version: packageJSON.version,
        targetDir: path.resolve(__dirname, '../dist'), // 目标压缩目录(可使用相对地址) 
        targetFile: 'dist.zip', // 目标文件
        openCompress: true, // 是否开启本地压缩
        openBackUp: true, // 是否开启远端备份
        deployDir: '/var/www/html/', // 远端目录
        releaseDir: 'blog',// 发布目录
        script: 'npm run build', // 打包命令
    }
}

