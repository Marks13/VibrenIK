PdfService = {
    renderPdf: function (mesure, res, cb) {
        var client = require("jsreport-client");

        cb(client);
    }

};

module.exports = PdfService;
