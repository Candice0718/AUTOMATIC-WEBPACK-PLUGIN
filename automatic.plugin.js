/**
 * 自动生成文件的webpack plugin
 */
const path = require('path');
const fs = require('fs');
const chokidar = require('chokidar');
const AutoFile = require('./src/AutoFile.js');
const { beautify } = require('./utils/index.js');
class AutomaticPlugin {
    constructor(options) {
        // 观察者
        this.watcher = [];
        const usePolling = options.some(d => d.maxlevel > 1);
        // 启动
        options.forEach(
            d => {
                // 创建异步闭包
                (async d => {
                    // 验证必要参数
                    if(!d.inPath) {console.error('缺少inPath参数');return;}
                    if(!d.templateEach) {console.error('缺少templateEach参数');return;}
                    // 文件夹等级(创建默认参数)
                    const level = Number(d.maxlevel) ? Number(d.maxlevel) : 1;
                    // 输出文本(创建默认参数)
                    if(!d.out) d.out = (template => template);
                    // 输出文件(创建默认参数)
                    if(!d.outPath) {
                        let p = path.resolve(d.inPath).split(path.sep);
                        p[p.length] = 'index.js';
                        d.outPath = p.join('/');
                    };
                    // 实例化
                    const autoFile = new AutoFile(d);
                    // 监听层级
                    const watchLevel = d.maxlevel ? d.maxlevel : 1;
                    // 观察者配置
                    let op = {
                        // 层级
                        depth: watchLevel,
                        usePolling
                    };
                    // 创建观察者
                    const watcher = chokidar.watch(d.inPath, op);
                    this.watcher.push(watcher);
                    // 先写文件
                    autoFile.write(d);
                    // 增加
                    const addFile = (dirName, kind) => {
                        // 判断是否在最大监听文件目录等级内
                        const lev = autoFile.getLevel(d.inPath, dirName);
                        if(lev <= level && lev > 0) {
                            // 判断环境
                            let product = (process.env.NODE_ENV === 'production');
                            // 可配置生产 || 测试环境 AutoCodePlugin.NODE_ENV = 'pro';
                            if(this.NODE_ENV) product = (process.env.NODE_ENV === this.NODE_ENV);
                            // 是不是空文件夹
                            const isEmptyDir = (kind === 'dir' && fs.readdirSync(path.resolve(dirName)).length === 0);
                            // 判断是不是开发环境 && 是不是文件夹 && 是不是空文件夹 && 存在入口文件config
                            if(!product && kind === 'dir' && isEmptyDir && d.addIndex) {
                                // 创建自定义模板
                                d.addIndex.forEach(autoTempalte => {
                                    ((autoTempalte, dirName) => {
                                        if(autoTempalte.state === 'file') {
                                            // 默认创建文件
                                            let name = '';
                                            if(!autoTempalte.name) name = 'index.js';
                                            if(!autoTempalte.template) autoTempalte.template = () => '';
                                            // 增加命名函数逻辑
                                            if(Array.prototype.toString.call(autoTempalte.name) === "[object Function]") {
                                                name = autoTempalte.name(path.resolve(dirName).split(path.sep).pop(), autoFile.getPath(dirName));
                                            } else {
                                                name = autoTempalte.name;
                                            }
                                            const template = beautify(name, autoTempalte.template(path.resolve(dirName).split(path.sep).pop(), autoFile.getPath(dirName)), 
                                                d.beauty ? d.beauty : { indent_size: 4 }
                                            );
                                            fs.writeFileSync(path.join(path.resolve(dirName), name), template);
                                        } else {
                                            // 默认创建文件
                                            let name = '';
                                            if(!autoTempalte.name) return;
                                            // 增加命名函数逻辑
                                            if(Array.prototype.toString.call(autoTempalte.name) === "[object Function]") {
                                                name = autoTempalte.name(path.resolve(dirName).split(path.sep).pop(), autoFile.getPath(dirName));
                                            } else {
                                                name = autoTempalte.name;
                                            }
                                            // 创建文件夹
                                            fs.mkdirSync(path.join(path.resolve(dirName), name));
                                        }
                                    })(autoTempalte, dirName);
                                });
                            }
                            // 创建文件数据
                            autoFile.setFileData({
                                // 文件名称
                                key: autoFile.getPath(dirName),
                                // 数据内容 
                                value: d.templateEach ? d.templateEach(path.resolve(dirName).split(path.sep).pop(), autoFile.getPath(dirName), kind) : ''
                            });
                            autoFile.write(d);
                        }
                    }
                    // 删除
                    const deleteFile = (dirName) => {
                        autoFile.delete(autoFile.getPath(dirName));
                        autoFile.write(d);
                    }
                    // 监听创建文件夹
                    watcher.on('addDir', dirName => addFile(dirName, 'dir'));
                    // 监听移除文件夹
                    watcher.on('unlinkDir', dirName => deleteFile(dirName));
                    // 是否需要监听文件
                    if(!!d.useFile){
                        // 防止自己引用自己
                        const sameFile = (p1, p2) => {
                            return (path.resolve(p1) === path.resolve(p2));
                        };
                        // 监听创建文件夹
                        watcher.on('add', dirName => {
                            if(!sameFile(d.outPath, dirName)) addFile(dirName, 'file');
                        });
                        // 监听移除文件夹
                        watcher.on('unlink', dirName => {
                            if(!sameFile(d.outPath, dirName)) deleteFile(dirName);
                        });
                    }
                    // 监听错误
                    watcher.on('error', function(error) {
                        console.error('webpack AutoCodePlugin Error happened: ', error);
                    });
                })(d);
            }
        )
    }
    /**
     * 应用函数
     */
    apply(compiler) {
        // 判断环境
        let product = (process.env.NODE_ENV === 'production');
        // 可配置生产 || 测试环境 AutoCodePlugin.NODE_ENV = 'pro';
        if(this.NODE_ENV) product = (process.env.NODE_ENV === this.NODE_ENV);
        // 构建完成结束监听
        if(product && compiler.hooks && compiler.hooks.done) {
            // webpack4
            compiler.hooks.done.tap('done', () => {
                this.watcher.forEach(d => d.close());
            });
        } else if(product) {
            // < webpack4
            compiler.plugin('done', () => {
                this.watcher.forEach(d => d.close());
            });
        }
    }
}
module.exports = AutomaticPlugin;