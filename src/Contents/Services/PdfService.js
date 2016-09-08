PdfService = {
    renderPdf: function (mesure, res, cb) {

        var fs = require('fs');
        var pdf = PdfService.using('html-pdf');
        try {
            var plotly = PdfService.using('plotly.js');
        } catch(e) {
            console.log(e);
        }
        
          App.ChartsUtils.getChartPointsFFT2(mesureId, function (fftPoints) {

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
            plotly.toImage(Ext.get('chart' + mesureId).dom, {
                format: 'png',
                width: 800,
                height: 600
            });
        });
        
        
        var html = fs.readFileSync('./template_pdf/template.html', 'utf8');
        var options = {
            format: 'Letter'
        };

        pdf.create(html, options).toFile('./template_pdf/template.pdf', function (err, res) {
            if (err) return console.log(err);
            console.log(res); // { filename: '/app/businesscard.pdf' } 
        });
    }

};

module.exports = PdfService;
