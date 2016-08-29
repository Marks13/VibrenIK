ChartsUtils = {

    doTabs: function (panel, selected) {
        // Récupération des messures correspondantes à l'acquisition courante et génération des onglets.

        App.Mesures.getByAcquisitionId(selected, function (records) {
            // Création d'un onglet qui sera réservé au diagramme circulaire.
            panel.add(new Ext.Panel({
                id: 'DC',
                title: 'DC',
                disabled: true
            }));

            App.ChartsUtils.addTabToPanel(panel, 0, records);
        });
    },

     // Fonction qui appelle la bibliothèque externe plotly.js
    plot: function (mesureId, tabIndex) {
        var mask = new Ext.LoadMask(Ext.getBody(), {
            msg: "Chargement en cours."
        });
        mask.show();

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
            Plotly.plot(Ext.get('chart' + mesureId).dom, [fftPoints.points], layout);
            mask.hide();
        });
    },

    addTabToPanel: function (panel, index, records) {
        var context = this;

        // Prédicat indiquant la fin de la récursivité.
        if (index < records.length) {
            // Création d'un onglet et surcharge de l'event lorqu'un onglet est 
            // sélectionné.
            tab = new Ext.Panel({
                id: records[index].id,
                title: 'Voie ' + index,
                listeners: {
                    single: true,
                    activate: function (tab, e0pts) {
                        panel.plot(tab.id, index);
                    }
                },
                html: '<div id=chart' + records[index].id + '></div>'
            });
            panel.add(tab);
            context.addTabToPanel(panel, index + 1, records);
        } else {
            panel.setActiveTab(1);
            panel.show();
        }
    },
    
    getChartPointsFFT2: function (o, cb) {

        App.Mesures.getById(o, function (mesure) {

            // On récupère le signal contenant la mesure.
            App.Signals.getSingle(mesure.acquisitionId, function (signal) {
                var args = new Object();
                args["points"] = mesure.points;
                args["freqEchantillonage"] = signal.frequence_echantillonage;
                App.ChartsUtils.getChartPointsFFT(args, function (fftPoints) {
                    cb(fftPoints);
                });

            });
        });
    },

    getChartPointsFFT: function (o, cb) {
        // Split sur les points en base.
        var splittedPoints = o["points"].split(";");

        var currentX = 0;

        // Remplissage des Y d'acquisition
        var yArray = [];
        for (pointIndex = 0; pointIndex < splittedPoints.length - 1; pointIndex++) {
            currentPoint = parseFloat(splittedPoints[pointIndex]);
            yArray.push(currentPoint);
        }

        var FFT = ChartsUtils.using("ml-fft").FFT;

        // Recherche de la puissance de 2 supérieure à notre nombre de points
        power = 1;
        while (Math.pow(2, power) <= yArray.length) {
            power++;
        }
        supPower = Math.pow(2, power);

        im = new Array(supPower);

        // Padding avec des zéros sur la différence entre la puissance et la taille de l'input
        for (pointIndex = yArray.length; pointIndex < supPower; pointIndex++) {
            yArray.push(0);
        }

        // Remplissage de la partie imaginaire de notre signal
        for (var index = 0; index < supPower; index++) {
            im[index] = 0;
        }

        // remplissage de spectrum avec frequencyjs
        try {
            var fft = ChartsUtils.using("frequencyjs");

            var spectrum = fft.Transform
                .toSpectrum(yArray, {
                    method: 'fft'
                });
        } catch (error) {
            console.log(error);
        }

        // Initialiser la FFT avec la puissance de 2 supérieure (nécessaire)
        FFT.init(supPower);
        FFT.fft(yArray, im);

        var results = new Object();

        results["points"] = new Object();

        var x = [];
        var y = [];

        var currentX = 0;
        // recherche des bornes de ml fft
        var max = parseFloat(Number.MIN_VALUE);
        var min = parseFloat(Number.MAX_VALUE);
        var progress = 0;
        // construction du tableau
        for (pointIndex = 1; pointIndex < supPower / 2; pointIndex++) {

            realPart = yArray[pointIndex];
            imaginaryPart = im[pointIndex];
            frequence = (pointIndex * o["freqEchantillonage"] / 2) / (supPower / 2);

            apmplitude = realPart * realPart + imaginaryPart * imaginaryPart;

            currentPoint = parseFloat(Math.sqrt(apmplitude));
            if (currentPoint > max) {
                max = currentPoint;
            }
            if (currentPoint < min) {
                min = currentPoint;
            }

            x.push(frequence);
            y.push(currentPoint);
            /*currentX = currentX + parseFloat(o["pas"]);*/
        }

        results["points"]["x"] = x;
        results["points"]["y"] = y;

        results["pointsMin"] = min;
        results["pointsMax"] = max;
        results["spectrum"] = [];

        var spectrumMax = Number.MIN_VALUE;
        var spectrumMin = Number.MAX_VALUE;

        // construction des résultats de frequencyjs
        for (pointIndex = 1; pointIndex <= supPower / 2; pointIndex++) {
            if (spectrum[pointIndex]) {
                currentX = parseFloat(spectrum[pointIndex]["frequency"]);
                currentY = parseFloat(spectrum[pointIndex]["amplitude"]);

                // recherche des bornes de frequencyjs
                if (currentY > spectrumMax) {
                    spectrumMax = currentY;
                }
                if (currentY < spectrumMin) {
                    spectrumMin = currentY;
                }

                results["spectrum"].push({
                    x: currentX,
                    y: currentY
                });
            }
        }

        results["spectrumMin"] = spectrumMin;
        results["spectrumMax"] = spectrumMax;

        cb(results);
    },

    getRotatedPoints: function (o, cb) {
        targetPoints = o["points"];
        angle = parseInt(o["angle"]) * (Math.PI / 180);

        results = new Object();
        results["points"] = [];


        var xMin = Number.MAX_VALUE;
        var xMax = Number.MIN_VALUE;

        var yMin = Number.MAX_VALUE;
        var yMax = Number.MIN_VALUE;

        for (pointIndex = 0; pointIndex < targetPoints.length; pointIndex++) {
            targetX = parseFloat(targetPoints[pointIndex]["x"]);
            targetY = parseFloat(targetPoints[pointIndex]["y"]);

            sqrt = Math.sqrt(targetX * targetX + targetY * targetY);

            newX = sqrt * parseFloat(Math.cos(angle));
            newY = sqrt * parseFloat(Math.sin(angle));

            if (newX < xMin) {
                xMin = newX;
            }

            if (newX > xMax) {
                xMax = newX;
            }

            if (newY < yMin) {
                yMin = newY;
            }

            if (newY > yMax) {
                yMax = newY;
            }

            results["points"].push({
                x: newX,
                y: newY
            });

        }

        results["xMin"] = xMin;
        results["xMax"] = xMax;
        results["yMin"] = yMin;
        results["yMax"] = yMax;

        cb(results);
    }

};

module.exports = ChartsUtils;
