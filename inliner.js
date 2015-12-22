var cheerio = require("cheerio");
var fs = require("fs");

function inlinifyCSS(inputFile, outputFile) {
    fs.readFile(inputFile, function(error, data) {
        var $ = cheerio.load(data.toString());
        var head = $("head");
        $("link[rel=stylesheet]").each(function() {
            var link = $(this);
            var href = link.attr("href");
            if (href.slice(0, 4) !== "http") {
                fs.readFile(href, function(error, data) {
                    var css = data.toString();
                    link.remove();
                    head.append("<style>" + css + "</style>");
                    fs.writeFile(outputFile, $.html());
                });
            }
        });
    });
}