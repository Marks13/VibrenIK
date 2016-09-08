PdfService = {
    renderPdf: function (mesure, res, cb) {

        var fs = require('fs');
        var pdf = PdfService.using('html-pdf');

        var html = fs.readFileSync('./template/template.html', 'utf8');
        var options = {
            format: 'Letter'
        };

        pdf.create(html, options).toFile('./template/template.pdf', function (err, res) {
            if (err) return console.log(err);
            console.log(res); // { filename: '/app/businesscard.pdf' } 
        });
    }

};

module.exports = PdfService;
