PdfService = {
    renderPdf: function (mesure, res, cb) {
        try {
            PDFDocument = PdfService.using('pdfkit');
        } catch (e) {
            console.log(e);
        }
        
        doc = new PDFDocument;

        
        doc.fontSize(25).text('Here is some vector graphics...', 100, 80);
        doc.end();

        stream.on('finish', function () {

        });
    }

};

module.exports = PdfService;