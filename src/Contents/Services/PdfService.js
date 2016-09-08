PdfService = {
    renderPdf: function (mesure, res, cb) {

        var fs = require('fs');
        var pdf = PdfService.using('html-pdf');

        var jsdom = PdfService.using('jsdom');

        jsdom.env({
            file: './template_pdf/template.html',
            done: function (err, window) {
                GLOBAL.window = window;
                GLOBAL.document = window.document;

                try {
                    var try = PdfService.using('3d-view');
                    var plotly = PdfService.using('plotly.js');

                } catch (e) {
                    console.log(e);
                }

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
    }

};

module.exports = PdfService;
