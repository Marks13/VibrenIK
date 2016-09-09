PdfService = {
    renderPdf: function (mesure, res, cb) {

        var fs = require('fs');
        var pdf = PdfService.using('html-pdf');

        var path = PdfService.using('path');
        var jsdom = PdfService.using('jsdom');


        var PATH_TO_PLOTLYJS = './bin/node_modules/plotly.js/dist/plotly.js';
        var plotlySrc = fs.readFileSync(PATH_TO_PLOTLYJS, 'utf-8');


        var virtualConsole = jsdom.createVirtualConsole();
        virtualConsole.on('log', (message) => {
            console.log('console.log called ->', message);
        });
        virtualConsole.on('jsdomError', (message) => {
            console.error('Error ->', message);
        });


        jsdom.env({
            file: './template_pdf/template.html',
            src: [plotlySrc],
            features: {
                QuerySelector: true
            },
            virtualConsole: virtualConsole,

            done: PdfService.plot
        });
    },

    plot: function (err, window) {
        if (err) throw err;

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
            }

        );
    }
}
module.exports = PdfService;
