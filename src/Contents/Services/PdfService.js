PdfService = {
    renderPdf: function (o, cb) {
       
        
        
        
        PDFDocument = require('pdfkit');
        blobStream = require('blob-stream');
        
        doc = new PDFDocument;

        stream = doc.pipe(writableStream);
        doc.fontSize(25).text('Here is some vector graphics...', 100, 80);
        doc.end();

    }

};

module.exports = PdfService;
