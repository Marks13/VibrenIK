PdfService = {
    renderPdf: function (o, cb) {
        app = require('express');
        PDFDocument = require('pdfkit');
        blobStream = require('blob-stream');

        app.post('/pdf.pdf', function (req, res) {

            doc = new PDFDocument;

            stream = doc.pipe(res);
            doc.fontSize(25).text('Here is some vector graphics...', 100, 80);
            doc.end();
            
            res.send('Got a POST request');
        });




    }

};

module.exports = PdfService;
