PdfService = {
    renderPdf: function (mesure, res, cb) {

        var fs = require('fs');
        var pdf = PdfService.using('html-pdf');


        fs.readdir('C:\', function(files) {
           console.log(files); 
        });

    }

};

module.exports = PdfService;
