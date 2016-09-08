PdfService = {
    renderPdf: function (mesure, res, cb) {
        try {
            blobStream = PdfService.using('blob-stream');
            PDFDocument = PdfService.using('pdfkit');
        } catch (e) {
            console.log(e);
        }
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