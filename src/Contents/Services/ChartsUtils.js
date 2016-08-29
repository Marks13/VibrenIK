ChartsUtils = {
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
        results["points"] = [];

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
            results["points"].push({
                x: frequence,
                y: currentPoint
            });
            /*currentX = currentX + parseFloat(o["pas"]);*/
        }

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

    getCheerio: function (o, cb) {
        try {
            ChartsUtils.using("cheerio");
            var doc = cheerio.load('<div id=divChart"/>');
            cb(doc.html());
        } catch (e) {
            console.log(e);
        }
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
