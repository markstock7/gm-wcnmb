var Promise = require('bluebird'),
    models = require('../models'),
    bid;

bid = {
    bidPage: function(req, res) {
        var user = req.session.user;
        models.getTeams().then(teams => {
            res.render('bid', { teams, title: '投注页面', user });
        });
    },
    bid: function(object, options) {
        var user = options.user;
        var team = object.team;
        return models.makeBid(user.phone, team, user.bonus).then(result => {
            return Promise.resolve();
        }, error => {
            return Promise.resolve({ error });
        });
    }
};

module.exports = bid;
