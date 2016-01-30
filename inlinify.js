var cheerio = require("cheerio");
var fs = require("fs");

function inlinifyCSS(html, callback) {
    var elements = 0, elementsDone = 0;
    var $ = cheerio.load(html);
    var head = $("head");
    var links = head.children("link[rel=stylesheet]");
    elements += links.length;
    if (elements === 0) {
        if (callback) {
            callback(html);
        }
    }
    else {
        links.each(function () {
            var link = $(this);
            fs.readFile(link.attr("href"), function(error, data) {
                if (!error) {
                    link.remove();
                    head.append("<style>" + data.toString() + "</style>");
                }
                if (++elementsDone === elements && callback) {
                    callback($.html());
                }
            });
        });
    }
}

function inlinifyJS(html, callback) {
    var elements = 0, elementsDone = 0;
    var $ = cheerio.load(html);
    var scripts = $("script");
    elements += scripts.length;
    if (elements === 0) {
        if (callback) {
            callback(html);
        }
    }
    else {
        scripts.each(function() {
            var script = $(this);
            fs.readFile(script.attr("src"), function(error, data) {
                if (!error) {
                    script.removeAttr("src").text(data.toString());
                }
                if (++elementsDone === elements && callback) {
                    callback($.html());
                }
            });
        });
    }
}
