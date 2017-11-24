var Promise = require('bluebird'),
    models = require('../models'),
    // 用一个子进程来计算流量
    join;

join = {
    joinPage: (req, res) => {
        if (req.session.user) {
            res.redirect('/profile');
        } else {
            res.render('join', { user: req.session.user, title: '参加活动' });
        }
    },
    join: (req, res) => {
        var phone = req.body.phone;
        req.session.user = {
            phone: phone,
            bonus: 0
        };
        res.json(req.session.user);
    }
};

module.exports = join;
