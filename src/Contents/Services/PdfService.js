PdfService = {
    renderPdf: function (mesure, res, cb) {

        var fs = require('fs');


        var pdf1 = require("binary-parser");
        var pdf2 = require("buffer-reader");
        var pdf3 = require("bufferpack");
        var pdf4 = require("crypto");
        var pdf5 = require("ml-fft");
        var pdf6 = require("frequencyjs");


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
