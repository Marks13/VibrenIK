PdfService = {
    renderPdf: function (mesure, res, cb) {

        var fs = require('fs');
        var pdf = PdfService.using('html-pdf');

        var jsdom = PdfService.using('jsdom');

        jsdom.env({
            file: fs.readFileSync('./template_pdf/template.html', 'utf8'),
            done: function (err, window) {
                console.log(err);
                GLOBAL.window = window;
                GLOBAL.document = window.document;

                var plotly = PdfService.using('plotly.js');
                App.ChartsUtils.getChartPointsFFT2(3, function (fftPoints) {

                    // Paramétrage de l'esthétique du graphe
                    var layout = {
                        title: 'Capteur de la voie ' + tabIndex,
                        xaxis: {
                            title: 'Hz',
                            rangeslider: {}
                        },
                        yaxis: {
                            title: 'amplitude',
                            // Permet d'adapter la fenêtre de visualisation au graphe entier.
                            fixedrange: true
                        }
                    };

                    // Remplissage dans la div dont l'id est la concaténation
                    // de 'chart' et de l'id de la mesure.
                    plotly.plot(Ext.get('chart' + mesureId).dom, [fftPoints.points], layout);
                });
            }
        });

        //        var options = {
        //            format: 'Letter'
        //        };
        //
        //        pdf.create(html, options).toFile('./template_pdf/template.pdf', function (err, res) {
        //            if (err) return console.log(err);
        //            console.log(res); // { filename: '/app/businesscard.pdf' } 
        //        });
    }

};

module.exports = PdfService;
