PdfService = {
    renderPdf: function (mesure, res, cb) {
        
        var jsreport = require('jsreport')().init();
        
        jsreport.init().then(function () {
            jsreport.render({
                template: {
                    content: '<h1>Hello {{:foo}}</h1>',
                    engine: 'jsrender',
                    recipe: 'phantom-pdf'
                },
                data: {
                    foo: "world"
                }
            }).then(function (resp) {
                //prints pdf with headline Hello world
                console.log(resp.content.toString())
            });
        }).catch(function (e) {
            console.log(e)
        })
    }

};

module.exports = PdfService;
