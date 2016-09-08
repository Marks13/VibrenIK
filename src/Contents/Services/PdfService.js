PdfService = {
    renderPdf: function (mesure, res, cb) {

        var fs = require('fs');
        var pdf = PdfService.using('html-pdf');
        try {
            var plotly = PdfService.using('plotly.js');
        } catch(e) {
            console.log(e);
        }
        
        
        var html = fs.readFileSync('./template_pdf/template.html', 'utf8');
        var options = {
            format: 'Letter'
        };

        pdf.create(html, options).toFile('./template_pdf/template.pdf', function (err, res) {
            if (err) return console.log(err);
            console.log(res); // { filename: '/app/businesscard.pdf' } 
        });
    }

};

module.exports = PdfService;
