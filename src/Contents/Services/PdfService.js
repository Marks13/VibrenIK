PdfService = {
    renderPdf: function (mesure, res, cb) {

        var fs = require('fs');
        var pdf = PdfService.using('html-pdf');

        console.log(fs.readdirSync('.'));
        
    }

};

module.exports = PdfService;
