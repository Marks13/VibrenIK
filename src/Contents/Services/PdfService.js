PdfService = {
    renderPdf: function (o, cb) {
        
        console.log("ici");
        PDFDocument = require('pdfkit');
        blobStream = require('blob-stream');

        doc = new PDFDocument;

        stream = doc.pipe(blobStream());
        doc.fontSize(25).text('Here is some vector graphics...', 100, 80);
        doc.end();
        stream.on('finish', function () {
            iframe.src = stream.toBlobURL('application/pdf');
        });
    }

};

module.exports = PdfService;
