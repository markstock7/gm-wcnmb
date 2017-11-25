var Promise = require('bluebird'),
    models = require('../models'),
    profile;

profile = {
  profilePage: (req, res) => {
    var user = req.session.user;
    models.profileAnalyse(user.phone).then(result => {
      res.render('profile', {
        user,
        title: req.session.user.phone + '的页面',
        result
      });
    });
  },
  summarizePage: (req, res) => {
    var user = req.session.user;
    models.profileAnalyse(user.phone).then(result => {
      res.render('summarize', {
        user,
        title: req.session.user.phone + '的页面',
        result,
        show: Math.random() * 10 > 5
      });
    });
  }
};

module.exports = profile;
