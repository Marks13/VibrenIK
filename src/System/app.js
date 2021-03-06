App = {
    init: function (app, server) {
        app.post('/', app.UPLOAD.any(), function (req, res, next) {
            App.upload.up(req, res);
        });


        app.get('/export/:id', function (req, res) {
            id = req.params['id'];
            if (isNaN(parseInt(id))) {
                res.send('ID must be a valid integer');
            } else {
                Mesures.exists(id, function (record) {
                    if (record == null) {
                        res.send('Unknown ID');
                    } else {
                        PdfService.renderPdf(record, res, function () {

                        });
                    }
                });
            }
        });
    }
};

module.exports = App;
