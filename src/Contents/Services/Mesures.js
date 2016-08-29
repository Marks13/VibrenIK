Mesures = {
    getAll: function (o, cb) {
        Mesures.using('db').using('vibren').findAll().then(function (records) {
            cb(records);
        });
    },

    getByAcquisitionId: function (o, cb) {
        var vibren = Mesures.using('db').using('vibren');

        vibren.mesures.findAll({
            where: {
                acquisitionId: o
            }
        }).then(function (records) {
            callback(records);
        });
    },
    
    getById: function (o, cb) {
        var vibren = Mesures.using('db').using('vibren');

        vibren.mesures.find({
            where: {
                id: o
            }
        }).then(function (records) {
            cb(records);
        });
    }
}

module.exports = Mesures;
