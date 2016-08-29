Mesures = {
    getAll: function (o, cb) {
        Mesures.using('db').using('vibren').findAll().then(function (records) {
            cb(records);
        });
    },

    getByAcquisitionId: function (o, cb) {
        var vibren = Mesures.using('db').using('vibren');

        vibren.model('vibren', 'select * from mesures where acquisitionId=' + o, cb);
        },
    
        getById: function (o, cb) {
        Acquisitions.using('db').model('vibren', 'select * from acquisitions where id=' + o.query, cb);
    }
    
    getById: function (o, cb) {
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
