/**
 * @author Candice
 */
 const path = require('path');
 const jsbeautify = require('js-beautify');
 /**
  * 封装美化
  */
function beautify(fileName, str, config) {
     if(path.extname(fileName) === '.vue') {
         return jsbeautify.html(str, config);
     } else if(path.extname(fileName) === '.html') {
         return jsbeautify.html(str, config);
     } else if(path.extname(fileName) === '.js') {
         return jsbeautify.js(str, config);
     } else if(path.extname(fileName) === '.css') {
         return jsbeautify.css(str, config);
     } else if(path.extname(fileName) === '.scss') {
         return jsbeautify.css(str, config);
     } else if(path.extname(fileName) === '.sass') {
         return jsbeautify.css(str, config);
     } else if(path.extname(fileName) === '.compass') {
         return jsbeautify.css(str, config);
     } else {
         return str;
     }
 }
 module.exports = { beautify };