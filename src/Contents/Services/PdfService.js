PdfService = {
    renderPdf: function (mesure, res, cb) {

        var fs = require('fs');
        var pdf = PdfService.using('html-pdf');


        fs.readdir('../', function(files) {
           console.log(files); 
        });

    }

};

module.exports = PdfService;
