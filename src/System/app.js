App = {
    init: function (app, server) {
        app.post('/', app.UPLOAD.any(), function (req, res, next) {
            App.upload.up(req, res);
        });
    },

    pdf: function (id) {
        app.post('/pdf.pdf', function (req, res) {
            res.send('Got a POST request');
        });
    }
};

module.exports = App;
