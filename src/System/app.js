App = {
    init: function (app, server) {
        app.post('/', app.UPLOAD.any(), function (req, res, next) {
            App.upload.up(req, res);
        });


        app.get('/export/:id', function (req, res) {
            if (isNaN(parseInt(req.param('id')))) {
                res.respond(new Error('ID must be a valid integer'), 400);
            } else {
                res.send(id);
            }
        });
    }
};

module.exports = App;
