PdfService = {
    renderPdf: function (o, cb) {
        fs = require('fs');
        PDFDocument = require('pdfkit');
        blobStream = require('blob-stream');

        var writableStream = fs.createWriteStream('test.pdf')
        
        doc = new PDFDocument;

        stream = doc.pipe(writableStream);
        doc.fontSize(25).text('Here is some vector graphics...', 100, 80);
        doc.end();

    }

};

module.exports = PdfService;
