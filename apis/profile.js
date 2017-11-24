var Promise = require('bluebird'),
    models = require('../models'),
    // 用一个子进程来计算流量
    profile;

profile = {
  profilePage: (req, res) => {
    res.render('profile', { user: req.session.user, title: req.session.user.phone + '的页面' });
  }
};

module.exports = profile;
