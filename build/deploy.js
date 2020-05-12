const node_ssh = require('node-ssh')
const ssh = new node_ssh()
const fs = require('fs');
const archiver = require('archiver');
const path = require('path')
const deployConfig = require('../config/deploy.config')
const ora = require('ora');
const chalk = require('chalk');
const childProcess = require('child_process');
const util = require('util');
const exec = util.promisify(childProcess.exec);

// 连接服务
const connectServe = sshInfo => {
    console.log(chalk.blue('\n开始建立连接...'));
    return new Promise((resolve, reject) => {
        ssh.connect({ ...sshInfo }).then(() => {
            resolve(console.log(chalk.blue('\n' + sshInfo.host + ' 连接成功')))
        }).catch((err) => {
            reject(console.error(chalk.red('\n' + sshInfo.host + ' 连接失败'), err))
        })
    })

}

// 压缩本地文件
const compressFile = (targetDir, localFile) => {
    return new Promise((resolve, reject) => {
        console.log(chalk.blue('\n正在压缩文件...'));
        const output = fs.createWriteStream(localFile);
        const archive = archiver('zip', {
            zlib: { level: 9 }
        });
        output.on('close', () => {
            console.log(chalk.green('\n压缩完成, 共计 ' + (archive.pointer() / 1024 / 1024).toFixed(3) + 'MB'))
            resolve('压缩完成')
        });
        output.on('error', (err) => {
            console.log(chalk.red('压缩失败...'), err);
            reject(err)
        });
        archive.on('warning', err => {
            if (err.code === 'ENOENT') {
                console.log(err);
                return;
            }
            reject(err)
        });
        archive.on('error', reject);
        archive.pipe(output);
        archive.directory(targetDir, 'dist')
        archive.finalize()
    })
}

// 执行命令
const runCommand = (ssh, command, path) => {
    return new Promise((resolve, reject) => {
        ssh.execCommand(command, {
            cwd: path
        }).then((res) => {
            if (res.stderr) {
                reject(console.error('\n命令执行发生错误:' + res.stderr))
            } else { 
                resolve('执行完成！')
            }
        }).catch(err => {
            throw err,
            reject(err)
        })

    })
}

// 上传文件
const uploadFile = (ssh, config, localFile) => {
    return new Promise((resolve, reject) => {
        handleSourceFile(ssh, config)
        ssh.putFile(localFile, config.deployDir + config.targetFile).then(() => {
            resolve('上传成功')
        }, (error) => {
            reject('上传失败')
        })
    })
}

// 备份远端文件
const handleSourceFile = async (ssh, config) => {
    if (config.openBackUp) {
        console.log(chalk.blue('已开启远端备份!'))
        await runCommand(
            ssh,
            `
                if [ -d ${config.releaseDir} ];
                then mv ${config.releaseDir} ${config.releaseDir}_${getCurrentTime()}
                fi
            `,
            config.deployDir
        );
    } else {
        console.log('提醒：未开启远端备份!')
        await runCommand(
            ssh,
            `
                if [ -d ${config.releaseDir} ];
                then mv ${config.releaseDir} /tmp/${config.releaseDir}_${getCurrentTime()}
                fi
            `,
            config.deployDir
        );
    }
}

// 时间补位
const addZero = n => n < 10 ? '0' + n : n
// 获取当前时间
const getCurrentTime = () => {
    const date = new Date()
    const yyyy = date.getFullYear()
    const MM = addZero(date.getMonth() + 1)
    const dd = addZero(date.getDate())
    const HH = addZero(date.getHours())
    const mm = addZero(date.getMinutes())
    const ss = addZero(date.getSeconds())
    return `${yyyy}-${MM}-${dd}_${HH}:${mm}:${ss}`
}



// 主程序(可单独执行)
const main = async () => {
    const spinner = ora(chalk.yellow('building...'))
    const start = Date.now()
    spinner.color = 'yellow';
    const env = process.env.NODE_ENV
    const sshInfo = deployConfig[env]
    const commonConfig = deployConfig.common
    try {
        console.log(
            chalk.yellow(`\n即将把${commonConfig.name}项目部署到：${env === 'production' ? "生产" : '测试'}环境，发布版本：${commonConfig.version}`)
        );
        spinner.start();  
        if(env === 'production'){ // 只在生产环境记录发布日志
            await exec(`npm version patch -m '发布${env === 'production' ? "生产" : '测试'}版本，版本号${commonConfig.version}'`)
        } 
        const { error, stdout, stderr } = await exec(`${commonConfig.script}`)
        if(error){
            throw error;
        }
        console.log(stdout); // 输出打包信息
        if (commonConfig.openCompress) {
            await compressFile(commonConfig.targetDir, commonConfig.targetFile)
        }
        await connectServe(sshInfo) // 连接
        await uploadFile(ssh, commonConfig, commonConfig.targetFile) // 上传
        await runCommand(ssh, 'unzip ' + commonConfig.targetFile, commonConfig.deployDir) // 解压
        await runCommand(ssh, 'mv dist ' + commonConfig.releaseDir, commonConfig.deployDir) // 修改文件名称
        await runCommand(ssh, 'rm -f ' + commonConfig.targetFile, commonConfig.deployDir) // 删除 
        fs.unlinkSync(path.resolve(__dirname, '../dist.zip')) // 删除本地压缩文件
        let seconds = (Date.now() - start) / 1000
        spinner.succeed(chalk.green(`部署成功, 总耗时：${seconds}s`))
    } catch (err) {
        spinner.fail(chalk.red('部署失败'))
        console.log(err) 
    } finally {
        spinner.clear()
        process.exit()
    }
}

// 发布主入口
main()  