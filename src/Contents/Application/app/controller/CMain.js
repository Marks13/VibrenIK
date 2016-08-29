App.controller.define('CMain', {
    views: [
		"VMain"
		, "VImport"
		, "VNew"
		, "VOpen"
	],

    // Fonction d'attachement des événements aux boutons.
    init: function () {

        this.control({
            "menu>menuitem": {
                click: "Menu_onClick"
            },
            "button#clickImport": {
                click: "doImport"
            },
            "TNewProject button#select_OK": {
                click: "doNewProject"
            },
            "TOpenProject grid#gridprj": {
                itemdblclick: "doOpenProject"
            },
            "mainform button#import": {
                click: "doOpenImport"
            },
            "TOpenProject grid": {
                itemdblclick: "projectGrid_click"
            },
            "mainform grid#acquisitionsGrid": {
                celldblclick: "doTabs"
            }
        });
        App.init('VMain', this.onLoad);

    },

    // Appelle cleanTab sur tous les onglets.
    cleanAllTab: function () {
        var tabPanel = App.get('mainform tabpanel#chartTab');
        tabPanel.removeAll();
    },

    // Fonction utilisée lors de l'ajout/ouverture d'étude pour rafraîchir le store d'acquisition
    // et les onglets.
    refreshStoreAndTabs(context, etudeId) {
        // Appel en base pour obtenir la liste des acquisitions de l'étude
        App.Etudes_listes.getByEtude(etudeId, function (results) {
            // Le store utilisé par le menu
            var acquisitionStore = App.get('mainform panel#mainScreen grid#acquisitionsGrid').store;

            // Grâce à l'appel en base sur l'étude, on va filtrer par la liste des 
            // acquisitions reliées à l'étude
            acquisitionStore.filterBy(function (current) {
                for (index = 0; index < results.length; index++) {
                    if (current.get("id") == results[index].acquisitionId) {
                        return true;
                    }
                }
                return false;
            });
            acquisitionStore.reload();
            App.get('mainform panel#mainScreen').show();
            context.cleanAllTab();
        });
    },

    // Fonction appellée lors du choix d'une étude
    projectGrid_click: function (me, store, ndx) {
        // Etude courante
        console.log(store.data.id);
        App.ID = store.data.id;
        App.get('mainform textarea#description').setValue(store.data.description);
        App.get('mainform textfield#etude').setValue(store.data.libelle);
        _p = this;
        _p.refreshStoreAndTabs(_p, App.ID);
        me.up('window').close();
    },

    // Ouverture de la boîte d'import.
    doOpenImport: function () {
        App.view.create('VImport').show();
    },

    // Fonction vide atm.
    doOpenProject: function () {

    },

    doTabs: function (me, td, cellIndex, selected, tr, rowIndex, e, eOpts) {
        var panel = App.get('mainform tabpanel#chartTab');

        var _p = this;

        panel.hide();

        _p.cleanAllTab();

        App.ChartsUtil.doTabs(panel, selected.data.id);
        
        // Récupération des messures correspondantes à l'acquisition courante et génération des onglets.

        App.Mesures.getByAcquisitionId(selected.data.id, function (records) {
            // Création d'un onglet qui sera réservé au diagramme circulaire.
            panel.add(new Ext.Panel({
                id: 'DC',
                title: 'DC',
                disabled: true
            }));
            
            _p.addTabToPanel(panel, 0, records);
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
                        _p.plot(tab.id, index);
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

    // Fonction appellée lors de l'ajout d'une étude
    doNewProject: function (me) {
        var o = {
            libelle: App.get('TNewProject textfield#text_title').getValue(),
            description: App.get('TNewProject textfield#text_description').getValue()
        };
        _p = this;

        App.Etudes.nouveau(o, function (result) {
            App.ID = result.insertId;
            App.get('mainform panel#mainScreen').show();
            App.get('mainform textarea#description').setValue(App.get('TNewProject textfield#text_description').getValue());
            App.get('mainform textfield#etude').setValue(App.get('TNewProject textfield#text_title').getValue());

            _p.refreshStoreAndTabs(_p, App.ID);
            me.up('window').close();
        });
    },

    // Import d'un fichier de façon récursive
    doJobs: function (JOBS, id, cb) {
        var _p = this;
        JOBS[id]["etudeCourante"] = App.ID;
        App.Files.import(JOBS[id], function (error, msg) {
            if (!error) {
                if (JOBS[id + 1]) {
                    _p.doJobs(JOBS, id + 1, function (result) {
                        cb(result + "Import de " + JOBS[id].filename + " réussi. --- ");
                    });
                } else cb("Import de " + JOBS[id].filename + " réussi. --- ");
            } else {
                cb(msg.result);
            }
        });
    },

    // Fonction appellée lors de l'import
    doImport: function () {
        var JOBS = App.get('TImport uploadfilemanager#up').getFiles();
        _p = this;
        var myJOBS = [];
        for (var i = 0; i < JOBS.length; i++) {
            if (JOBS[i].filename.indexOf('.ACQ') > -1) myJOBS.push(JOBS[i]);
        };
        for (var i = 0; i < JOBS.length; i++) {
            if (JOBS[i].filename.indexOf('.SIG') > -1) myJOBS.push(JOBS[i]);
        };

        this.doJobs(myJOBS, 0, function (msg) {
            App.notify(msg);
            _p.refreshStoreAndTabs(_p, App.ID);
            App.get("TImport").close();
        });
    },

    // Création d'une étude.
    new_project: function () {
        App.view.create('VNew', {
            modal: true
        }).show();
    },

    // Ouverture d'une étude.
    open_project: function () {
        App.view.create('VOpen', {
            modal: true
        }).show();
    },

    Menu_onClick: function (p) {
        if (p.itemId) {
            switch (p.itemId) {
                case "MNU_NEW":
                    this.new_project();
                    break;
                case "MNU_OPEN":
                    this.open_project();
                    break;
                default:
                    return;
            };
        };
    },

    onLoad: function () {

    }


});
