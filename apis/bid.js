var Promise = require('bluebird'),
    models = require('../models'),
    bid;

bid = {
    bidPage: function(req, res) {
        models.getTeams().then(teams => {
            res.render('bid', { teams, title: '投注页面' });
        });
    },
    bid: function() {

    }
};

module.exports = bid;
