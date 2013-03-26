require.config({
    shim: {
        underscore: {
            exports: '_'
        },
        backbone: {
            deps: ['underscore', 'jquery'],
            exports: "Backbone"
        }
    }
});
require(
    [
        'jquery', 
        'underscore',
        'backbone',
        'mustache'
    ], 
    function($, _, Backbone, Mustache) {
        window.Mustache = Mustache;
        var DBL = {
            page: 1,
            Model: {},
            Collection: {},
            View: {}
        };

        var Shot = DBL.Model.Shot = Backbone.Model.extend({});
        var Square = DBL.Collection.Square = Backbone.Collection.extend({
            model: Shot,
            url: 'http://api.dribbble.com/shots/everyone?page=' + parseInt(Math.random() * 10, 10) + '&callback=?',
            parse: function(resp) {
                return resp.shots;
            }
        });
        var SquareView = DBL.View.SquareView = Backbone.View.extend({
            initialize: function() {
                _.bindAll(this, 'render');
                this.collection.bind('remove', this.render);
                this.template = $('#dribbbleTemplate').html();
            },
            render: function() {
                var templateData = {};
                templateData.square = this.collection.toJSON();
                this.$el.html(Mustache.to_html(this.template, templateData));
            }
        });

        DBL.Stage = Backbone.Router.extend({
            initialize: function(options) {
                this.square = options.square;
                this.squareView = options.squareView;
            },
            routes: {
                '': 'square',
                'p:page': 'square',
                'gn': 'pageNext',
                'gp': 'pagePrev'
            },

            square: function(page) {
                var self = this;
                DBL.page = page = page || 1;
                self.square.url = 'http://api.dribbble.com/shots/everyone?page=' + page + '&callback=?';
                self.square.fetch({
                    success: function(collectionInstance) {
                        var templateData = {};
                        templateData.square = collectionInstance.toJSON();
                        self.squareView.render();
                    }
                });
            },
            pageNext: function() {
                this.navigate('p' + (parseInt(DBL.page, 10) + 1), {
                    trigger: true
                });
            },
            pagePrev: function() {
                this.navigate('p' + (parseInt(DBL.page, 10) - 1), {
                    trigger: true
                });
            }
        });

        DBL.square = new Square(),
        DBL.squareView = new SquareView({
            el: '#stage',
            collection: DBL.square
        })

        new DBL.Stage({
            square: DBL.square,
            squareView: DBL.squareView
        });

        Backbone.history.start();


    }
);
