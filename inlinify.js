var cheerio = require("cheerio");
var fs = require("fs");

function inlinifyCSS(html) {
    return new Promise(resolve => {
        var elementsDone = 0;
        var $ = cheerio.load(html);
        var head = $("head");
        var links = head.children("link[rel=stylesheet]");
        var elements = links.length;
        if (elements === 0) {
            resolve(html);
        }
        else {
            links.each(function() {
                var link = $(this);
                fs.readFile(link.attr("href"), (error, data) => {
                    if (!error) {
                        data = data.toString().replace(/\.\.\//g, "");
                        var media = link.attr("media");
                        link.remove();
                        if (media) {
                            head.append(`<style media="${media}">${data}</style>`);
                        }
                        else {
                            head.append(`<style>${data}</style>`);
                        }
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
    return new Promise(resolve => {
        var elementsDone = 0;
        var $ = cheerio.load(html);
        var scripts = $("script");
        var elements = scripts.length;
        if (elements === 0) {
            resolve(html);
        }
        else {
            var body = $("body");
            scripts.each(function() {
                var script = $(this);
                fs.readFile(script.attr("src"), (error, data) => {
                    if (!error) {
                        script.removeAttr("async").removeAttr("src").text(data.toString());
                        if (script.attr("defer")) {
                            body.append(script.removeAttr("defer").remove());
                        }
                    }
                    if (++elementsDone === elements) {
                        resolve($.html());
                    }
                });
            });
        }
    });
}

exports.css = inlinifyCSS;
exports.js = inlinifyJS;
