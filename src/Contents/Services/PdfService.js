PdfService = {
    renderPdf: function (mesure, res, cb) {

        var fs = require('fs');
        var pdf = PdfService.using('html-pdf');

        var path = PdfService.using('path');
        var jsdom = PdfService.using('jsdom');




        var virtualConsole = jsdom.createVirtualConsole();
        virtualConsole.on('log', (message) => {
            console.log('console.log called ->', message);
        });
        virtualConsole.on('jsdomError', (message) => {
            console.error('Error ->', message);
        });


        jsdom.env({
            file: './template_pdf/template.html',
            features: {
                QuerySelector: true
            },
            virtualConsole: virtualConsole,

            done: PdfService.plot
        });
    },

    plot: function (err, window) {
        if (err) throw err;

        GLOBAL.window = window;
        GLOBAL.document = window.document;

        var plotly = PdfService.using('plotly.js');
        var d3 = plotly.d3;
        var gd = document.getElementById('chart');

        window.d3 = d3.select(window.document);


        // mock XML Serializer (for now)
        window.XMLSerializer = function () {
            return {
                serializeToString: (node) => {
                    return String(node.outerHTML)
                }
            };
        };

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
                plotly.plot(gd, [fftPoints.points], layout)
                    .then(function (gd) {
                        return plotly.toImage(gd, 'svg');
                    })
                    .then(function (img) {
                        fs.writeFile('./template_pdf/template.png', img, (err) => {
                            if (err) throw err;
                            console.log('done');
                        });
                    }).catch(function (err) {
                        console.log(err);
                    });
            }

        );
    }
}
module.exports = PdfService;
