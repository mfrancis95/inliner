var cheerio = require("cheerio");
var fs = require("fs");

function inlinifyCSS(html) {
    var elements = 0, elementsDone = 0;
    var $ = cheerio.load(html);
    var head = $("head");
    var links = head.children("link[rel=stylesheet]");
    elements += links.length;
    return new Promise(resolve => {   
        if (elements === 0) {
            resolve(html);
        }          
        else {
            links.each(function() {
                var link = $(this);
                fs.readFile(link.attr("href"), (error, data) => {
                    if (!error) {
                        link.remove();
                        head.append("<style>" + data.toString() + "</style>");
                    }
                    if (++elementsDone === elements) {
                        resolve($.html());
                    }
                });
            });
        }
    });
}

function inlinifyJS(html) {
    var elements = 0, elementsDone = 0;
    var $ = cheerio.load(html);
    var scripts = $("script");
    elements += scripts.length;
    return new Promise(resolve => {    
        if (elements === 0) {
            resolve(html);
        }    
        else {
            scripts.each(function() {
                var script = $(this);
                fs.readFile(script.attr("src"), (error, data) => {
                    if (!error) {
                        script.removeAttr("src").text(data.toString());
                    }
                    if (++elementsDone === elements) {
                        resolve($.html());
                    }
                });
            });
        }
    });
}

module.exports.css = inlinifyCSS;
module.exports.js = inlinifyJS;
