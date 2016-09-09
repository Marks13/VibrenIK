PdfService = {
    renderPdf: function (mesure, res, cb) {

        var fs = require('fs');
        var pdf = PdfService.using('html-pdf');

        var jsdom = PdfService.using('path');

        var PATH_TO_PLOTLYJS = PdfService.using.resolve('plotly.js/dist/plotly.js');
        var plotlySrc = fs.readFileSync(PATH_TO_PLOTLYJS, 'utf-8');

        console.log(PATH_TO_PLOTLYJS);
        
        jsdom.env({
            file: './template_pdf/template.html',
            done: function (err, window) {
                GLOBAL.window = window;
                GLOBAL.document = window.document;

                var plotly = PdfService.using('plotly.js');
                var DOMParser = PdfService.using('xmldom').DOMParser;

                App.ChartsUtils.getChartPointsFFT2(3, function (fftPoints) {

                    // Paramétrage de l'esthétique du graphe
                    var layout = {
                        title: 'Capteur de la voie ' + 1,
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
                    plotly.plot(document.getElementById('chart'), [fftPoints.points], layout);
                });
            }
        });
    }

};

module.exports = PdfService;
