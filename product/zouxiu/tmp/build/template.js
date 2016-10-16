/*TMODJS:{"version":"1.0.0"}*/
!function () {

    function template (filename, content) {
        return (
            /string|function/.test(typeof content)
            ? compile : renderFile
        )(filename, content);
    };


    var cache = template.cache = {};
    var String = this.String;

    function toString (value, type) {

        if (typeof value !== 'string') {

            type = typeof value;
            if (type === 'number') {
                value += '';
            } else if (type === 'function') {
                value = toString(value.call(value));
            } else {
                value = '';
            }
        }

        return value;

    };


    var escapeMap = {
        "<": "&#60;",
        ">": "&#62;",
        '"': "&#34;",
        "'": "&#39;",
        "&": "&#38;"
    };


    function escapeFn (s) {
        return escapeMap[s];
    }


    function escapeHTML (content) {
        return toString(content)
        .replace(/&(?![\w#]+;)|[<>"']/g, escapeFn);
    };


    var isArray = Array.isArray || function(obj) {
        return ({}).toString.call(obj) === '[object Array]';
    };


    function each (data, callback) {
        if (isArray(data)) {
            for (var i = 0, len = data.length; i < len; i++) {
                callback.call(data, data[i], i, data);
            }
        } else {
            for (i in data) {
                callback.call(data, data[i], i);
            }
        }
    };


    function resolve (from, to) {
        var DOUBLE_DOT_RE = /(\/)[^/]+\1\.\.\1/;
        var dirname = ('./' + from).replace(/[^/]+$/, "");
        var filename = dirname + to;
        filename = filename.replace(/\/\.\//g, "/");
        while (filename.match(DOUBLE_DOT_RE)) {
            filename = filename.replace(DOUBLE_DOT_RE, "/");
        }
        return filename;
    };


    var utils = template.utils = {

        $helpers: {},

        $include: function (filename, data, from) {
            filename = resolve(from, filename);
            return renderFile(filename, data);
        },

        $string: toString,

        $escape: escapeHTML,

        $each: each
        
    };


    var helpers = template.helpers = utils.$helpers;


    function renderFile (filename, data) {
        var fn = template.get(filename) || showDebugInfo({
            filename: filename,
            name: 'Render Error',
            message: 'Template not found'
        });
        return data ? fn(data) : fn; 
    };


    function compile (filename, fn) {

        if (typeof fn === 'string') {
            var string = fn;
            fn = function () {
                return new String(string);
            };
        }

        var render = cache[filename] = function (data) {
            try {
                return new fn(data, filename) + '';
            } catch (e) {
                return showDebugInfo(e)();
            }
        };

        render.prototype = fn.prototype = utils;
        render.toString = function () {
            return fn + '';
        };

        return render;
    };


    function showDebugInfo (e) {

        var type = "{Template Error}";
        var message = e.stack || '';

        if (message) {
            // 利用报错堆栈信息
            message = message.split('\n').slice(0,2).join('\n');
        } else {
            // 调试版本，直接给出模板语句行
            for (var name in e) {
                message += "<" + name + ">\n" + e[name] + "\n\n";
            }  
        }

        return function () {
            if (typeof console === "object") {
                console.error(type + "\n\n" + message);
            }
            return type;
        };
    };


    template.get = function (filename) {
        return cache[filename.replace(/^\.\//, '')];
    };


    template.helper = function (name, helper) {
        helpers[name] = helper;
    };


    if (typeof define === 'function') {define(function() {return template;});} else if (typeof exports !== 'undefined') {module.exports = template;} else {this.template = template;}
    
    /*v:1*/
template('node_modules/tmodjs/test/index','<!DOCTYPE HTML> <html> <head> <meta charset="UTF-8"> <title>加载模板演示</title> </head> <body> <h1>加载模板演示</h1> <ul> <li><a href="templatejs.html">使用script标签加载模板</a></li> <li><a href="seajs.html">使用SeaJS加载模板</a></li> <li><a href="requirejs.html">使用RequireJS加载模板</a></li> <li>使用NodeJS加载模板，运行示例：node node.js</li> </ul> </body> </html> ');/*v:1*/
template('node_modules/tmodjs/test/requirejs','<!DOCTYPE HTML> <html> <head> <meta charset="UTF-8"> <title>RequireJS - 调用模板演示</title> <script src="./js/require.js"></script> </head> <body> <div id="doc">loading..</div> <script> // 演示JSON数据 var data = { title: \'国内要闻\', time: (new Date).toString(), list: [ { title: \'<油价>调整周期缩至10个工作日 无4%幅度限制\', url: \'http://finance.qq.com/zt2013/2013yj/index.htm\' }, { title: \'明起汽油价格每吨下调310元 单价回归7元时代\', url: \'http://finance.qq.com/a/20130326/007060.htm\' }, { title: \'广东副县长疑因抛弃情妇遭6女子围殴 纪检调查\', url: \'http://news.qq.com/a/20130326/001254.htm\' }, { title: \'湖南27岁副县长回应质疑：父亲已不是领导\', url: \'http://news.qq.com/a/20130326/000959.htm\' }, { title: \'朝军进入战斗工作状态 称随时准备导弹攻击美国\', url: \'http://news.qq.com/a/20130326/001307.htm\' } ] }; require([\'./tpl/build/template\'], function (template) { document.getElementById(\'doc\').innerHTML = template(\'index\', data); }); </script> </body> </html> ');/*v:1*/
template('node_modules/tmodjs/test/seajs','<!DOCTYPE HTML> <html> <head> <meta charset="UTF-8"> <title>SeaJS - 调用模板演示</title> <script src="./js/sea.js"></script> </head> <body> <div id="doc">loading..</div> <script> // 演示JSON数据 var data = { title: \'国内要闻\', time: (new Date).toString(), list: [ { title: \'<油价>调整周期缩至10个工作日 无4%幅度限制\', url: \'http://finance.qq.com/zt2013/2013yj/index.htm\' }, { title: \'明起汽油价格每吨下调310元 单价回归7元时代\', url: \'http://finance.qq.com/a/20130326/007060.htm\' }, { title: \'广东副县长疑因抛弃情妇遭6女子围殴 纪检调查\', url: \'http://news.qq.com/a/20130326/001254.htm\' }, { title: \'湖南27岁副县长回应质疑：父亲已不是领导\', url: \'http://news.qq.com/a/20130326/000959.htm\' }, { title: \'朝军进入战斗工作状态 称随时准备导弹攻击美国\', url: \'http://news.qq.com/a/20130326/001307.htm\' } ] }; // 加载index模板 seajs.use(\'./tpl/build/template\', function (template) { document.getElementById(\'doc\').innerHTML = template(\'index\', data); }); </script> </body> </html> ');/*v:1*/
template('node_modules/tmodjs/test/templatejs','<!DOCTYPE HTML> <html> <head> <meta charset="UTF-8"> <title>TemplateJS - 调用模板演示</title> </head> <body> <div id="doc">loading..</div> <script src="./tpl/build/template.js"></script> <script> // 演示JSON数据 var data = { title: \'国内要闻\', time: (new Date).toString(), list: [ { title: \'<油价>调整周期缩至10个工作日 无4%幅度限制\', url: \'http://finance.qq.com/zt2013/2013yj/index.htm\' }, { title: \'明起汽油价格每吨下调310元 单价回归7元时代\', url: \'http://finance.qq.com/a/20130326/007060.htm\' }, { title: \'广东副县长疑因抛弃情妇遭6女子围殴 纪检调查\', url: \'http://news.qq.com/a/20130326/001254.htm\' }, { title: \'湖南27岁副县长回应质疑：父亲已不是领导\', url: \'http://news.qq.com/a/20130326/000959.htm\' }, { title: \'朝军进入战斗工作状态 称随时准备导弹攻击美国\', url: \'http://news.qq.com/a/20130326/001307.htm\' } ] }; // 加载index模板 document.getElementById(\'doc\').innerHTML = template(\'index\', data); </script> </body> </html> ');/*v:1*/
template('node_modules/tmodjs/test/test-all/amd/copyright','(c) 2013');/*v:1*/
template('node_modules/tmodjs/test/test-all/amd/index',function($data,$filename
/**/) {
'use strict';var $utils=this,$helpers=$utils.$helpers,include=function(filename,data){data=data||$data;var text=$utils.$include(filename,data,$filename);$out+=text;return $out;},$escape=$utils.$escape,title=$data.title,$each=$utils.$each,list=$data.list,$value=$data.$value,$index=$data.$index,$out='';include('./public/header');
$out+=' <div id="main"> <h3>';
$out+=$escape(title);
$out+='</h3> <ul> ';
$each(list,function($value,$index){
$out+=' <li><a href="';
$out+=$escape($value.url);
$out+='">';
$out+=$escape($value.title);
$out+='</a></li> ';
});
$out+=' </ul> </div> ';
include('./public/footer');
return new String($out);
});/*v:1*/
template('node_modules/tmodjs/test/test-all/amd/public/footer',function($data,$filename
/**/) {
'use strict';var $utils=this,$helpers=$utils.$helpers,time=$data.time,$escape=$utils.$escape,include=function(filename,data){data=data||$data;var text=$utils.$include(filename,data,$filename);$out+=text;return $out;},$out='';$out+='<div id="footer"> ';
if(time){
$out+=' <p class=\'time\'>';
$out+=$escape(time);
$out+='</p> ';
}
$out+=' ';
include('../copyright');
$out+=' </div>';
return new String($out);
});/*v:1*/
template('node_modules/tmodjs/test/test-all/amd/public/header',function($data,$filename
/**/) {
'use strict';var $utils=this,$helpers=$utils.$helpers,include=function(filename,data){data=data||$data;var text=$utils.$include(filename,data,$filename);$out+=text;return $out;},$out='';$out+=' <div id="header"> ';
include('./logo');
$out+=' <ul id="nav"> <li><a href="http://www.qq.com">首页</a></li> <li><a href="http://news.qq.com/">新闻</a></li> <li><a href="http://pp.qq.com/">图片</a></li> <li><a href="http://mil.qq.com/">军事</a></li> </ul> </div>  ';
return new String($out);
});/*v:1*/
template('node_modules/tmodjs/test/test-all/amd/public/logo',' <h1 id="logo"> <a href="http://www.qq.com"> <img width=\'134\' height=\'44\' src="http://mat1.gtimg.com/www/images/qq2012/qqlogo_1x.png" alt="腾讯网" /> </a> </h1> ');/*v:1*/
template('node_modules/tmodjs/test/test-all/amd','<!DOCTYPE HTML> <html> <head> <meta charset="UTF-8"> <title>RequireJS - 调用模板演示</title> <script src="../js/require.js"></script> </head> <body> <div id="doc">loading..</div> <script> // 演示JSON数据 var data = { title: \'国内要闻\', time: (new Date).toString(), list: [ { title: \'<油价>调整周期缩至10个工作日 无4%幅度限制\', url: \'http://finance.qq.com/zt2013/2013yj/index.htm\' }, { title: \'明起汽油价格每吨下调310元 单价回归7元时代\', url: \'http://finance.qq.com/a/20130326/007060.htm\' }, { title: \'广东副县长疑因抛弃情妇遭6女子围殴 纪检调查\', url: \'http://news.qq.com/a/20130326/001254.htm\' }, { title: \'湖南27岁副县长回应质疑：父亲已不是领导\', url: \'http://news.qq.com/a/20130326/000959.htm\' }, { title: \'朝军进入战斗工作状态 称随时准备导弹攻击美国\', url: \'http://news.qq.com/a/20130326/001307.htm\' } ] }; require([\'./amd/build/index\'], function (index) { document.getElementById(\'doc\').innerHTML = index(data); }); </script> </body> </html> ');/*v:1*/
template('node_modules/tmodjs/test/test-all/cmd/copyright','(c) 2013');/*v:1*/
template('node_modules/tmodjs/test/test-all/cmd/index',function($data,$filename
/**/) {
'use strict';var $utils=this,$helpers=$utils.$helpers,include=function(filename,data){data=data||$data;var text=$utils.$include(filename,data,$filename);$out+=text;return $out;},$escape=$utils.$escape,title=$data.title,$each=$utils.$each,list=$data.list,$value=$data.$value,$index=$data.$index,$out='';include('./public/header');
$out+=' <div id="main"> <h3>';
$out+=$escape(title);
$out+='</h3> <ul> ';
$each(list,function($value,$index){
$out+=' <li><a href="';
$out+=$escape($value.url);
$out+='">';
$out+=$escape($value.title);
$out+='</a></li> ';
});
$out+=' </ul> </div> ';
include('./public/footer');
return new String($out);
});/*v:1*/
template('node_modules/tmodjs/test/test-all/cmd/public/footer',function($data,$filename
/**/) {
'use strict';var $utils=this,$helpers=$utils.$helpers,time=$data.time,$escape=$utils.$escape,include=function(filename,data){data=data||$data;var text=$utils.$include(filename,data,$filename);$out+=text;return $out;},$out='';$out+='<div id="footer"> ';
if(time){
$out+=' <p class=\'time\'>';
$out+=$escape(time);
$out+='</p> ';
}
$out+=' ';
include('../copyright');
$out+=' </div>';
return new String($out);
});/*v:1*/
template('node_modules/tmodjs/test/test-all/cmd/public/header',function($data,$filename
/**/) {
'use strict';var $utils=this,$helpers=$utils.$helpers,include=function(filename,data){data=data||$data;var text=$utils.$include(filename,data,$filename);$out+=text;return $out;},$out='';$out+=' <div id="header"> ';
include('./logo');
$out+=' <ul id="nav"> <li><a href="http://www.qq.com">首页</a></li> <li><a href="http://news.qq.com/">新闻</a></li> <li><a href="http://pp.qq.com/">图片</a></li> <li><a href="http://mil.qq.com/">军事</a></li> </ul> </div>  ';
return new String($out);
});/*v:1*/
template('node_modules/tmodjs/test/test-all/cmd/public/logo',' <h1 id="logo"> <a href="http://www.qq.com"> <img width=\'134\' height=\'44\' src="http://mat1.gtimg.com/www/images/qq2012/qqlogo_1x.png" alt="腾讯网" /> </a> </h1> ');/*v:1*/
template('node_modules/tmodjs/test/test-all/cmd-alias/copyright','(c) 2013');/*v:1*/
template('node_modules/tmodjs/test/test-all/cmd-alias/index',function($data,$filename
/**/) {
'use strict';var $utils=this,$helpers=$utils.$helpers,include=function(filename,data){data=data||$data;var text=$utils.$include(filename,data,$filename);$out+=text;return $out;},$escape=$utils.$escape,title=$data.title,$each=$utils.$each,list=$data.list,$value=$data.$value,$index=$data.$index,$out='';include('./public/header');
$out+=' <div id="main"> <h3>';
$out+=$escape(title);
$out+='</h3> <ul> ';
$each(list,function($value,$index){
$out+=' <li><a href="';
$out+=$escape($value.url);
$out+='">';
$out+=$escape($value.title);
$out+='</a></li> ';
});
$out+=' </ul> </div> ';
include('./public/footer');
return new String($out);
});/*v:1*/
template('node_modules/tmodjs/test/test-all/cmd-alias/public/footer',function($data,$filename
/**/) {
'use strict';var $utils=this,$helpers=$utils.$helpers,time=$data.time,$escape=$utils.$escape,include=function(filename,data){data=data||$data;var text=$utils.$include(filename,data,$filename);$out+=text;return $out;},$out='';$out+='<div id="footer"> ';
if(time){
$out+=' <p class=\'time\'>';
$out+=$escape(time);
$out+='</p> ';
}
$out+=' ';
include('../copyright');
$out+=' </div>';
return new String($out);
});/*v:1*/
template('node_modules/tmodjs/test/test-all/cmd-alias/public/header',function($data,$filename
/**/) {
'use strict';var $utils=this,$helpers=$utils.$helpers,include=function(filename,data){data=data||$data;var text=$utils.$include(filename,data,$filename);$out+=text;return $out;},$out='';$out+=' <div id="header"> ';
include('./logo');
$out+=' <ul id="nav"> <li><a href="http://www.qq.com">首页</a></li> <li><a href="http://news.qq.com/">新闻</a></li> <li><a href="http://pp.qq.com/">图片</a></li> <li><a href="http://mil.qq.com/">军事</a></li> </ul> </div>  ';
return new String($out);
});/*v:1*/
template('node_modules/tmodjs/test/test-all/cmd-alias/public/logo',' <h1 id="logo"> <a href="http://www.qq.com"> <img width=\'134\' height=\'44\' src="http://mat1.gtimg.com/www/images/qq2012/qqlogo_1x.png" alt="腾讯网" /> </a> </h1> ');/*v:1*/
template('node_modules/tmodjs/test/test-all/cmd-alias','<!DOCTYPE HTML> <html> <head> <meta charset="UTF-8"> <title>SeaJS - 调用模板演示</title> <script src="../js/sea.js"></script> <script> seajs.config({ base: \'../test-all\', alias: { "template": "cmd-alias/build/template" } }); </script> </head> <body> <div id="doc">loading..</div> <script> // 演示JSON数据 var data = { title: \'国内要闻\', time: (new Date).toString(), list: [ { title: \'<油价>调整周期缩至10个工作日 无4%幅度限制\', url: \'http://finance.qq.com/zt2013/2013yj/index.htm\' }, { title: \'明起汽油价格每吨下调310元 单价回归7元时代\', url: \'http://finance.qq.com/a/20130326/007060.htm\' }, { title: \'广东副县长疑因抛弃情妇遭6女子围殴 纪检调查\', url: \'http://news.qq.com/a/20130326/001254.htm\' }, { title: \'湖南27岁副县长回应质疑：父亲已不是领导\', url: \'http://news.qq.com/a/20130326/000959.htm\' }, { title: \'朝军进入战斗工作状态 称随时准备导弹攻击美国\', url: \'http://news.qq.com/a/20130326/001307.htm\' } ] }; // 加载index模板 seajs.use(\'./cmd-alias/build/index\', function (index) { document.getElementById(\'doc\').innerHTML = index(data); }); </script> </body> </html> ');/*v:1*/
template('node_modules/tmodjs/test/test-all/cmd','<!DOCTYPE HTML> <html> <head> <meta charset="UTF-8"> <title>SeaJS - 调用模板演示</title> <script src="../js/sea.js"></script> </head> <body> <div id="doc">loading..</div> <script> // 演示JSON数据 var data = { title: \'国内要闻\', time: (new Date).toString(), list: [ { title: \'<油价>调整周期缩至10个工作日 无4%幅度限制\', url: \'http://finance.qq.com/zt2013/2013yj/index.htm\' }, { title: \'明起汽油价格每吨下调310元 单价回归7元时代\', url: \'http://finance.qq.com/a/20130326/007060.htm\' }, { title: \'广东副县长疑因抛弃情妇遭6女子围殴 纪检调查\', url: \'http://news.qq.com/a/20130326/001254.htm\' }, { title: \'湖南27岁副县长回应质疑：父亲已不是领导\', url: \'http://news.qq.com/a/20130326/000959.htm\' }, { title: \'朝军进入战斗工作状态 称随时准备导弹攻击美国\', url: \'http://news.qq.com/a/20130326/001307.htm\' } ] }; // 加载index模板 seajs.use(\'./cmd/build/index\', function (index) { document.getElementById(\'doc\').innerHTML = index(data); }); </script> </body> </html> ');/*v:1*/
template('node_modules/tmodjs/test/test-all/combo-off/copyright','(c) 2013');/*v:1*/
template('node_modules/tmodjs/test/test-all/combo-off/index',function($data,$filename
/**/) {
'use strict';var $utils=this,$helpers=$utils.$helpers,include=function(filename,data){data=data||$data;var text=$utils.$include(filename,data,$filename);$out+=text;return $out;},$escape=$utils.$escape,title=$data.title,$each=$utils.$each,list=$data.list,$value=$data.$value,$index=$data.$index,$out='';include('./public/header');
$out+=' <div id="main"> <h3>标题 ';
$out+=$escape(title);
$out+='</h3> <ul> ';
$each(list,function($value,$index){
$out+=' <li><a href="';
$out+=$escape($value.url);
$out+='">';
$out+=$escape($value.title);
$out+='</a></li> ';
});
$out+=' </ul> </div> ';
include('./public/footer');
return new String($out);
});/*v:1*/
template('node_modules/tmodjs/test/test-all/combo-off/public/footer',function($data,$filename
/**/) {
'use strict';var $utils=this,$helpers=$utils.$helpers,time=$data.time,$escape=$utils.$escape,include=function(filename,data){data=data||$data;var text=$utils.$include(filename,data,$filename);$out+=text;return $out;},$out='';$out+='<div id="footer"> ';
if(time){
$out+=' <p class=\'time\'>';
$out+=$escape(time);
$out+='</p> ';
}
$out+=' ';
include('../copyright');
$out+=' </div>';
return new String($out);
});/*v:1*/
template('node_modules/tmodjs/test/test-all/combo-off/public/header',function($data,$filename
/**/) {
'use strict';var $utils=this,$helpers=$utils.$helpers,include=function(filename,data){data=data||$data;var text=$utils.$include(filename,data,$filename);$out+=text;return $out;},$out='';$out+=' <div id="header"> ';
include('./logo');
$out+=' <ul id="nav"> <li><a href="http://www.qq.com">首页</a></li> <li><a href="http://news.qq.com/">新闻</a></li> <li><a href="http://pp.qq.com/">图片</a></li> <li><a href="http://mil.qq.com/">军事</a></li> </ul> </div>  ';
return new String($out);
});/*v:1*/
template('node_modules/tmodjs/test/test-all/combo-off/public/logo',' <h1 id="logo"> <a href="http://www.qq.com"> <img width=\'134\' height=\'44\' src="http://mat1.gtimg.com/www/images/qq2012/qqlogo_1x.png" alt="腾讯网" /> </a> </h1> ');/*v:1*/
template('node_modules/tmodjs/test/test-all/combo-off','<!DOCTYPE HTML> <html> <head> <meta charset="UTF-8"> <title>TemplateJS - 调用模板演示</title> </head> <body> <div id="doc">loading..</div> <script src="./combo-off/build/template.js"></script> <script src="./combo-off/build/index.js"></script> <script src="./combo-off/build/copyright.js"></script> <script src="./combo-off/build/public/header.js"></script> <script src="./combo-off/build/public/logo.js"></script> <script src="./combo-off/build/public/footer.js"></script> <script> // 演示JSON数据 var data = { title: \'国内要闻\', time: (new Date).toString(), list: [ { title: \'<油价>调整周期缩至10个工作日 无4%幅度限制\', url: \'http://finance.qq.com/zt2013/2013yj/index.htm\' }, { title: \'明起汽油价格每吨下调310元 单价回归7元时代\', url: \'http://finance.qq.com/a/20130326/007060.htm\' }, { title: \'广东副县长疑因抛弃情妇遭6女子围殴 纪检调查\', url: \'http://news.qq.com/a/20130326/001254.htm\' }, { title: \'湖南27岁副县长回应质疑：父亲已不是领导\', url: \'http://news.qq.com/a/20130326/000959.htm\' }, { title: \'朝军进入战斗工作状态 称随时准备导弹攻击美国\', url: \'http://news.qq.com/a/20130326/001307.htm\' } ] }; // 加载index模板 document.getElementById(\'doc\').innerHTML = template(\'index\', data); </script> </body> </html> ');/*v:1*/
template('node_modules/tmodjs/test/test-all/escape-off/index',function($data,$filename
/**/) {
'use strict';var $utils=this,$helpers=$utils.$helpers,$escape=$utils.$escape,title=$data.title,$each=$utils.$each,list=$data.list,$value=$data.$value,$index=$data.$index,$out='';$out+='<div id="main"> <h3>';
$out+=$escape(title);
$out+='</h3> <ul> ';
$each(list,function($value,$index){
$out+=' <li><a href="';
$out+=$escape($value.url);
$out+='">';
$out+=$escape($value.title);
$out+='</a></li> ';
});
$out+=' </ul> </div>';
return new String($out);
});/*v:1*/
template('node_modules/tmodjs/test/test-all/escape-off','<!DOCTYPE HTML> <html> <head> <meta charset="UTF-8"> <title>TemplateJS - 调用模板演示</title> </head> <body> <div id="doc">loading..</div> <script src="./escape-off/build/template.js"></script> <script> // 演示JSON数据 var data = { title: \'国内<span style="color:red">要闻</span>\', time: (new Date).toString(), list: [ { title: \'油价调整周期缩至10个工作日 无4%幅度限制\', url: \'http://finance.qq.com/zt2013/2013yj/index.htm\' }, { title: \'明起汽油价格每吨下调310元 单价回归7元时代\', url: \'http://finance.qq.com/a/20130326/007060.htm\' }, { title: \'广东副县长疑因抛弃情妇遭6女子围殴 纪检调查\', url: \'http://news.qq.com/a/20130326/001254.htm\' }, { title: \'湖南27岁副县长回应质疑：父亲已不是领导\', url: \'http://news.qq.com/a/20130326/000959.htm\' }, { title: \'朝军进入战斗工作状态 称随时准备导弹攻击美国\', url: \'http://news.qq.com/a/20130326/001307.htm\' } ] }; // 加载index模板 document.getElementById(\'doc\').innerHTML = template(\'index\', data); </script> </body> </html> ');/*v:1*/
template('node_modules/tmodjs/test/test-all/global/copyright','(c) 2013');/*v:1*/
template('node_modules/tmodjs/test/test-all/global/index',function($data,$filename
/**/) {
'use strict';var $utils=this,$helpers=$utils.$helpers,include=function(filename,data){data=data||$data;var text=$utils.$include(filename,data,$filename);$out+=text;return $out;},$escape=$utils.$escape,title=$data.title,$each=$utils.$each,list=$data.list,$value=$data.$value,$index=$data.$index,$out='';include('./public/header');
$out+=' <div id="main"> <h3>';
$out+=$escape(title);
$out+='</h3> <ul> ';
$each(list,function($value,$index){
$out+=' <li><a href="';
$out+=$escape($value.url);
$out+='">';
$out+=$escape($value.title);
$out+='</a></li> ';
});
$out+=' </ul> </div> ';
include('./public/footer');
return new String($out);
});/*v:1*/
template('node_modules/tmodjs/test/test-all/global/public/footer',function($data,$filename
/**/) {
'use strict';var $utils=this,$helpers=$utils.$helpers,time=$data.time,$escape=$utils.$escape,include=function(filename,data){data=data||$data;var text=$utils.$include(filename,data,$filename);$out+=text;return $out;},$out='';$out+='<div id="footer"> ';
if(time){
$out+=' <p class=\'time\'>';
$out+=$escape(time);
$out+='</p> ';
}
$out+=' ';
include('../copyright');
$out+=' </div>';
return new String($out);
});/*v:1*/
template('node_modules/tmodjs/test/test-all/global/public/header',function($data,$filename
/**/) {
'use strict';var $utils=this,$helpers=$utils.$helpers,include=function(filename,data){data=data||$data;var text=$utils.$include(filename,data,$filename);$out+=text;return $out;},$out='';$out+=' <div id="header"> ';
include('./logo');
$out+=' <ul id="nav"> <li><a href="http://www.qq.com">首页</a></li> <li><a href="http://news.qq.com/">新闻</a></li> <li><a href="http://pp.qq.com/">图片</a></li> <li><a href="http://mil.qq.com/">军事</a></li> </ul> </div>  ';
return new String($out);
});/*v:1*/
template('node_modules/tmodjs/test/test-all/global/public/logo',' <h1 id="logo"> <a href="http://www.qq.com"> <img width=\'134\' height=\'44\' src="http://mat1.gtimg.com/www/images/qq2012/qqlogo_1x.png" alt="腾讯网" /> </a> </h1> ');/*v:1*/
template('node_modules/tmodjs/test/test-all/global','<!DOCTYPE HTML> <html> <head> <meta charset="UTF-8"> <title>TemplateJS - 调用模板演示</title> </head> <body> <div id="doc">loading..</div> <script src="./global/build/template.js"></script> <script> // 演示JSON数据 var data = { title: \'国内要闻\', time: (new Date).toString(), list: [ { title: \'<油价>调整周期缩至10个工作日 无4%幅度限制\', url: \'http://finance.qq.com/zt2013/2013yj/index.htm\' }, { title: \'明起汽油价格每吨下调310元 单价回归7元时代\', url: \'http://finance.qq.com/a/20130326/007060.htm\' }, { title: \'广东副县长疑因抛弃情妇遭6女子围殴 纪检调查\', url: \'http://news.qq.com/a/20130326/001254.htm\' }, { title: \'湖南27岁副县长回应质疑：父亲已不是领导\', url: \'http://news.qq.com/a/20130326/000959.htm\' }, { title: \'朝军进入战斗工作状态 称随时准备导弹攻击美国\', url: \'http://news.qq.com/a/20130326/001307.htm\' } ] }; // 加载index模板 document.getElementById(\'doc\').innerHTML = template(\'index\', data); </script> </body> </html> ');/*v:1*/
template('node_modules/tmodjs/test/test-all/helper/index',function($data,$filename
/**/) {
'use strict';var $utils=this,$helpers=$utils.$helpers,$escape=$utils.$escape,time=$data.time,$out='';$out+=$escape($helpers. dateFormat(time , 'yyyy-MM-dd hh:mm:ss'));
return new String($out);
});/*v:1*/
template('node_modules/tmodjs/test/test-all/helper','<!DOCTYPE HTML> <html> <head> <meta charset="UTF-8"> <title>TemplateJS - 调用模板演示</title> </head> <body> <div id="doc">loading..</div> <script src="./helper/build/template.js"></script> <script> // 演示JSON数据 var data = { time: (new Date).toString(), }; // 加载index模板 document.getElementById(\'doc\').innerHTML = template(\'index\', data); </script> </body> </html> ');/*v:1*/
template('node_modules/tmodjs/test/test-all/include/include','<%include(\'./a\', {labe: \')\'})%><%include(\'./b\', {labe: \'(\'})%> <%include("./e", {include: "./v"});%> <% if ("include(\'./n\')") {} %> <% include("./d"); //include(\'.z\') xxx.include(\'./c\') //include(\'./x\')%>');/*v:1*/
template('node_modules/tmodjs/test/test-all/syntax/index','<div id="main"> <h3></h3> <ul>  <li><a href=""></a></li>  </ul> </div>');/*v:1*/
template('node_modules/tmodjs/test/test-all/syntax-native/index','<div id="main"> <h3><%=title%></h3> <ul> <%for (var i = 0; i < list.length; i ++) {%> <li><a href="<%=list[i].url%>"><%=list[i].title%></a></li> <%}%> </ul> </div>');/*v:1*/
template('node_modules/tmodjs/test/test-all/syntax-native','<!DOCTYPE HTML> <html> <head> <meta charset="UTF-8"> <title>TemplateJS - 调用模板演示</title> </head> <body> <div id="doc">loading..</div> <script src="./syntax-native/build/template.js"></script> <script> // 演示JSON数据 var data = { title: \'国内要闻\', time: (new Date).toString(), list: [ { title: \'<油价>调整周期缩至10个工作日 无4%幅度限制\', url: \'http://finance.qq.com/zt2013/2013yj/index.htm\' }, { title: \'明起汽油价格每吨下调310元 单价回归7元时代\', url: \'http://finance.qq.com/a/20130326/007060.htm\' }, { title: \'广东副县长疑因抛弃情妇遭6女子围殴 纪检调查\', url: \'http://news.qq.com/a/20130326/001254.htm\' }, { title: \'湖南27岁副县长回应质疑：父亲已不是领导\', url: \'http://news.qq.com/a/20130326/000959.htm\' }, { title: \'朝军进入战斗工作状态 称随时准备导弹攻击美国\', url: \'http://news.qq.com/a/20130326/001307.htm\' } ] }; // 加载index模板 document.getElementById(\'doc\').innerHTML = template(\'index\', data); </script> </body> </html> ');/*v:1*/
template('node_modules/tmodjs/test/test-all/syntax','<!DOCTYPE HTML> <html> <head> <meta charset="UTF-8"> <title>TemplateJS - 调用模板演示</title> </head> <body> <div id="doc">loading..</div> <script src="./syntax/build/template.js"></script> <script> // 演示JSON数据 var data = { title: \'国内[i]要闻[/i]\', time: (new Date).toString(), list: [ { title: \'<油价>调整周期缩至10个工作日 无4%幅度限制\', url: \'http://finance.qq.com/zt2013/2013yj/index.htm\' }, { title: \'明起汽油价格每吨下调[b]310[/b]元 单价回归7元时代\', url: \'http://finance.qq.com/a/20130326/007060.htm\' }, { title: \'广东副县长疑因抛弃情妇遭6女子围殴 纪检调查\', url: \'http://news.qq.com/a/20130326/001254.htm\' }, { title: \'湖南27岁副县长回应质疑：父亲已不是领导\', url: \'http://news.qq.com/a/20130326/000959.htm\' }, { title: \'朝军进入战斗工作状态 称随时准备导弹攻击美国\', url: \'http://news.qq.com/a/20130326/001307.htm\' } ] }; // 加载index模板 document.getElementById(\'doc\').innerHTML = template(\'index\', data); </script> </body> </html> ');/*v:1*/
template('node_modules/tmodjs/test/tpl/copyright','(c) 2013');/*v:1*/
template('node_modules/tmodjs/test/tpl/index',function($data,$filename
/**/) {
'use strict';var $utils=this,$helpers=$utils.$helpers,include=function(filename,data){data=data||$data;var text=$utils.$include(filename,data,$filename);$out+=text;return $out;},$escape=$utils.$escape,title=$data.title,$each=$utils.$each,list=$data.list,$value=$data.$value,$index=$data.$index,$out='';include('./public/header');
$out+=' <div id="main"> <h3>';
$out+=$escape(title);
$out+='</h3> <ul> ';
$each(list,function($value,$index){
$out+=' <li><a href="';
$out+=$escape($value.url);
$out+='">';
$out+=$escape($value.title);
$out+='</a></li> ';
});
$out+=' </ul> </div> ';
include('./public/footer');
return new String($out);
});/*v:1*/
template('node_modules/tmodjs/test/tpl/public/footer',function($data,$filename
/**/) {
'use strict';var $utils=this,$helpers=$utils.$helpers,time=$data.time,$escape=$utils.$escape,include=function(filename,data){data=data||$data;var text=$utils.$include(filename,data,$filename);$out+=text;return $out;},$out='';$out+='<div id="footer"> ';
if(time){
$out+=' <p class=\'time\'>';
$out+=$escape(time);
$out+='</p> ';
}
$out+=' ';
include('../copyright');
$out+=' </div>';
return new String($out);
});/*v:1*/
template('node_modules/tmodjs/test/tpl/public/header',function($data,$filename
/**/) {
'use strict';var $utils=this,$helpers=$utils.$helpers,include=function(filename,data){data=data||$data;var text=$utils.$include(filename,data,$filename);$out+=text;return $out;},$out='';$out+=' <div id="header"> ';
include('./logo');
$out+=' <ul id="nav"> <li><a href="http://www.qq.com">首页</a></li> <li><a href="http://news.qq.com/">新闻</a></li> <li><a href="http://pp.qq.com/">图片</a></li> <li><a href="http://mil.qq.com/">军事</a></li> </ul> </div>  ';
return new String($out);
});/*v:1*/
template('node_modules/tmodjs/test/tpl/public/logo',' <h1 id="logo"> <a href="http://www.qq.com"> <img width=\'134\' height=\'44\' src="http://mat1.gtimg.com/www/images/qq2012/qqlogo_1x.png" alt="腾讯网" /> </a> </h1> ');/*v:12*/
template('tpl/banner',function($data,$filename
/**/) {
'use strict';var $utils=this,$helpers=$utils.$helpers,$each=$utils.$each,$value=$data.$value,$index=$data.$index,$escape=$utils.$escape,$out='';$out+='<div class="swiper-container"> <div class="swiper-wrapper"> ';
$each($data,function($value,$index){
$out+=' <div class="swiper-slide"><img src="';
$out+=$escape($value);
$out+='" alt=""></div> ';
});
$out+=' </div> <div class="swiper-pagination"></div> </div> ';
return new String($out);
});/*v:3*/
template('tpl/footer','<a href="index.html" class="span"> <span class="border"></span> <i class="iconfont">&#xe644;</i> <div class="name">首页</div> </a> <a href="classify.html" class="span"> <span></span> <i class="iconfont">&#xe644;</i> <div class="name">分类</div> </a> <a href="cart.html" class="span"> <span></span> <i class="iconfont">&#xe61b;</i> <div class="name">购物车</div> </a> <a href="myXiu.html" class="span"> <span></span> <i class="iconfont">&#xe646;</i> <div class="name">我的秀</div> </a> <a href="more.html" class="span"> <span></span> <i class="iconfont">&#xe644;</i> <div class="name">更多</div> </a> ');/*v:15*/
template('tpl/goodsList',function($data,$filename
/**/) {
'use strict';var $utils=this,$helpers=$utils.$helpers,$each=$utils.$each,$value=$data.$value,$index=$data.$index,$escape=$utils.$escape,$out='';$out+='<div id="wrapper"> <div id="scroller"> <div id="pullDown" class=""> <div class="pullDownLabel"></div> </div> <div class="pulldown-tips">下拉刷新</div> <ul> ';
$each($data,function($value,$index){
$out+=' <li> <div class="shopPic"> <img src="';
$out+=$escape($value.goodsListImg);
$out+='" alt=""> </div> <div class="name"> <p><a href="detail.html?goodsID=';
$out+=$escape($value.goodsID);
$out+='" class="getGoodId">';
$out+=$escape($value.goodsName);
$out+='</a></p> <div class="price"> <div class="priceLeft"> <h3> <b>￥<span class="num">';
$out+=$escape($value.price);
$out+='</span></b> <del> ';
if($value.discount == 0){
$out+=' <b>￥<span class="del">';
$out+=$escape($value.price);
$out+='</span></b> ';
}else{
$out+=' <b>￥<span class="del">';
$out+=$escape(($value.price*10/$value.discount).toFixed(2));
$out+='</span></b> ';
}
$out+=' </del> </h3> <h4><span class="discount">';
$out+=$escape($value.discount);
$out+='</span>折</h4> </div> <div class="cartBtn"> <a class="iconfont">&#xe61b;</a> </div> </div> </div> </li> ';
});
$out+=' </ul> <div id="pullUp" class=""> <div class="pullUpLabel">加载更多</div> </div> </div> </div>';
return new String($out);
});/*v:24*/
template('tpl/header','<div class="left"> <a href="javascript:history.go(-1)"> </a> </div> <div class="center"> <img src="img/logo1.jpg" alt=""> <b>走秀网</b> </div> <div class="right"> </div> ');/*v:10*/
template('tpl/iconNav',function($data,$filename
/**/) {
'use strict';var $utils=this,$helpers=$utils.$helpers,$each=$utils.$each,$value=$data.$value,$index=$data.$index,$escape=$utils.$escape,$out='';$out+='<div class="swiper-container-top"> <div class="swiper-wrapper"> ';
$each($data,function($value,$index){
$out+=' <div class="swiper-slide" id="';
$out+=$escape($value.classID);
$out+='"><i class="iconfont">';
$out+=$escape($value.icon);
$out+='</i></div> ';
});
$out+=' </div> </div>';
return new String($out);
});/*v:3*/
template('tpl/search','<div class="search"> <div class="span"> <i class="iconfont">&#xe615;</i> <input type="text" placeholder="请输入搜索内容"> </div> </div>');

}()