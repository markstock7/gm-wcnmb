var Promise = require('bluebird'),
    models = require('../models'),
    join;

join = {
    joinPage: (req, res) => {
        if (req.session.user) {
            res.redirect('/profile');
        } else {
            res.render('join', { user: req.session.user, title: '欢迎参加马拉松红包争夺赛' });
        }
    },
    join: (req, res) => {
        var phone = req.body.phone;
        models.findUser(phone).then(user => {
            if (user.length) {
                req.session.user = user[0];

                models.updateUser(phone, req.session.user.bonus);

                res.json(req.session.user);
            } else {
                req.session.user = user = {
                    phone,
                    bonus: 0,
                    name: '呵呵',
                    show_name: '呵呵',
                    mac: '',
                    verify: true
                };

                models.createUser(user).then(user => {
                    user = user[0];
                    req.session.user = user;
                    res.json(req.session.user);
                });
            }
        })
    },
    joinSuccess: (req, res) => {
        res.render('join_success', { title: '参加成功' })
    }
};

module.exports = join;
