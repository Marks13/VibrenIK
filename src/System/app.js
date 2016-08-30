App = {
    init: function (app, server) {
        app.post('/', app.UPLOAD.any(), function (req, res, next) {
            App.upload.up(req, res);
        });


        app.get('/export/:id', function (req, res) {
            id = req.param('id');
            if (isNaN(parseInt(id))) {
                res.respond(new Error('ID must be a valid integer'), 400);
            } else {
                Mesures.exists(id, cb) {
                    if (cb == null) {
                        res.respond(new Error('Unknown ID'), 400);
                    } else {
                        res.send(id);
                    }
                }
            }
        });
    }
};

module.exports = App;
