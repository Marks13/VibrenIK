Acquisitions = {
    getAll: function (o, cb) {
        Acquisitions.using("db").model("vibren", "select * from acquisitions", cb);
    },

    getById: function (o, cb) {
        Acquisitions.using('db').model('vibren', 'select * from acquisitions where id=' + o.query, cb);
    }
}

module.exports = Acquisitions;