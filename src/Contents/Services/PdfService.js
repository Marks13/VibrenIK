PdfService = {
    renderPdf: function (mesure, res, cb) {
        PDFDocument = require('pdfkit');
        blobStream = require('blob-stream');

        doc = new PDFDocument;

        stream = doc.pipe(blobStream());
        doc.fontSize(25).text('Here is some vector graphics...', 100, 80);
        doc.end();
        stream.on('finish', function () {
            blob = stream.toBlob('application/pdf');
            res.send(blob);
        });
    }

};

module.exports = PdfService;
