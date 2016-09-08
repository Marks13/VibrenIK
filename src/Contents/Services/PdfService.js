PdfService = {
    renderPdf: function (mesure, res, cb) {

        var fs = require('fs');


        var pdf1 = PdfService.using("binary-parser");
        var pdf2 = PdfService.using("buffer-reader");
        var pdf3 = PdfService.using("bufferpack");
        var pdf5 = PdfService.using("ml-fft");
        var pdf6 = PdfService.using("frequencyjs");


        var pdf = PdfService.using('html-pdf');


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
