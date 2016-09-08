PdfService = {
    renderPdf: function (mesure, res, cb) {

        var fs = require('fs');

        var b = require("buffer-reader");
        var c = require("bufferpack");
        var d = require("frequencyjs");
        var e = require("plotly.js");
        var f = require("binary-parser");



        var pdf = require('html-pdf');


        var html = fs.readFileSync('http://google.com', 'utf8');
        var options = {
            format: 'Letter'
        };

        pdf.create(html, options).toFile('./businesscard.pdf', function (err, res) {
            if (err) return console.log(err);
            console.log(res); // { filename: '/app/businesscard.pdf' } 
        });

    }

};

module.exports = PdfService;
