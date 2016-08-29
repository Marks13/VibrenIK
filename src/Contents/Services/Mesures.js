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
            cb(records);
        });
    },
    
    getById: function (o) {
        var vibren = Mesures.using('db').using('vibren');

        vibren.mesures.find({
            where: {
                id: o
            }
        }).then(function (records) {
            return records;
        });
    }
}

module.exports = Mesures;
