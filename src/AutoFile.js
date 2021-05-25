/**
 * 自动生成文件
 */
const { beautify } = require('../utils/index.js');
const path = require('path');
const fs = require('fs');
module.exports = class AutoFile {
    constructor(options) {
        this.watchQueue = options;
        // 文件数据
        this.file = {};
    }
    // 创建文件数据
    setFileData(d) {
        if(!d.key) {
            console.error("缺少文件key信息");
            return;
        }
        this.file[d.key] = d;
    }
    // 写入文件
    write(d) {
        // 获取文件主体信息
        const bodyData = Object.keys(this.file).reduce((add, d) => {
            return add += this.file[d].value;
        }, '');
        // 获取文件数据 && JS美化
        const data = beautify(this.watchQueue.outPath, this.watchQueue.out ? this.watchQueue.out(bodyData, this.file) : bodyData, 
            d.beauty ? d.beauty : { indent_size: 4 }
        );
        // 写入文件
        fs.writeFileSync(this.watchQueue.outPath, data);
    }
    /**
     * 移除文件夹
     * @param {*} key 
     */
    delete(key) {
        delete this.file[key];
    }
    // 获取路径
    getPath(p) {
        return path.resolve(p).split(path.sep).join('/');
    }
    /**
     * 获取文件夹的等级
     * @param {*} p1 
     * @param {*} p2 
     */
    getLevel(p1, p2) {
        const p1Resolve = this.getPath(p1);
        const p2Resolve = this.getPath(p2);
        const replace = p2Resolve.replace(p1Resolve, '');
        return (replace.split('/').length) - 1;
    }
}