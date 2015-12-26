var cheerio = require("cheerio");
var fs = require("fs");

function inlinify(inputFile, outputFile, properties) {
    properties = properties || {};
    var callback = properties.callback;
    var css = properties.css || true;
    var js = properties.js || true;
    fs.readFile(inputFile, function(error, data) {
        var elements = 0, elementsDone = 0;
        var $ = cheerio.load(data.toString());
        if (css) {
            var head = $("head");
            var links = head.children("link[rel=stylesheet]");
            elements += links.length;
            links.each(function () {
                var link = $(this);
                fs.readFile(link.attr("href"), function(error, data) {
                    if (!error) {
                        link.remove();
                        head.append("<style>" + data.toString() + "</style>");
                    }
                    if (++elementsDone === elements) {
                        fs.writeFile(outputFile, $.html(), callback);
                    }
                });
            });
        }
        if (js) {
            var scripts = $("script");
            elements += scripts.length;
            scripts.each(function() {
                var script = $(this);
                fs.readFile(script.attr("src"), function(error, data) {
                    if (!error) {
                        script.removeAttr("src").text(data.toString());
                    }
                    if (++elementsDone === elements) {
                        fs.writeFile(outputFile, $.html(), callback);
                    }
                });
            });
        }
        if (elements === 0 && callback) {
            callback();
        }
    });
}