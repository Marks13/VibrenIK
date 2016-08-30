Mesures = {
    
    vibren: function(){
        return Mesures.using('db').using('vibren').mesures;
    },
    
    getAll: function (o, cb) {
        Mesures.vibren().findAll().then(function (records) {
            cb(records);
        });
    },

    getByAcquisitionId: function (o, cb) {
        Mesures.vibren().findAll({
            where: {
                acquisitionId: o
            }
        }).then(function (records) {
            cb(records);
        });
    },
    
    getById: function (o, cb) {
        Mesures.vibren().find({
            where: {
                id: o
            }
        }).then(function (records) {
            cb(records);
        });
    },
    
    exists: function (id, cb) {
        Mesures.vibren().findOne({ where: {id: id}}).then(function (record) {
           cb(record); 
        });
    }
}

module.exports = Mesures;
