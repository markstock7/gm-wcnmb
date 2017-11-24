var Promise = require('bluebird'),
    models = require('../models'),
    _ = require('lodash'),
    lottery,
    lotteries = [];

function findLottery(lotteryId) {
    return _.find(lotteries, function(_) {
        return _.id === lotteryId
    });
}

lottery = {
    hit: options => {
        var user = options.user;
        var lotteryId = options.id;
        var lottery = findLottery(lotteryId);

        if (lottery && lottery.lost === false) {
            // 新建一个
            models.addInsights({
                type: 'hit-lottery',
                timestamp: Date.now(),
                attrs: JSON.stringify({
                    '类型': '领取红包',
                    '手机': user.phone,
                    '奖金': lottery.bonus,
                    '地点': ''
                })
            });

            user.bonus = user.bonus + lottery.bonus;
            lottery.lost = true;

            return models.updateUser(user.phone, user.bonus).then(() => {
                return Promise.resolve({ status: 'ok' });
            });

        } else {

            models.addInsights({
                type: 'hit-lottery',
                timestamp: Date.now(),
                attrs: JSON.stringify({
                    '类型': '领取失败',
                    '手机': user.phone,
                    '地点': ''
                })
            });

            return Promise.resolve({ status: 'failed' });
        }
    },
    lotteryPage: (req, res) => {
        models.getLocationByApId(req.params.id).then(location => {
            var user = req.session.user;
            if (location.length === 0) {
                res.render('lottery', { title: '诈骗红包页面', type: 'cheat' });
            } else {
                location = location[0];
                if (Math.random() * 10 > 5) {
                    var lottery = {
                        id: "" + Math.round(Math.random() * 1000000000),
                        bonus: Math.round(Math.random() * 20),
                        lost: false,
                        location: location.ap_name
                    };

                    models.addInsights({
                        type: 'hit-lottery',
                        timestamp: Date.now(),
                        attrs: JSON.stringify({
                            '类型': '发现红包',
                            '手机': user.phone,
                            '地点': location.ap_name
                        })
                    });

                    lotteries.push(lottery);

                    res.render('lottery', { lottery: lottery, title: '红包页面', type: 'lottery' });
                } else {
                    res.render('lottery', { location: location.ap_name, lottery: null, title: '红包页面', type: 'none' });
                }
            }

        }, error => {
            res.render('lottery', { lottery: none, title: '红包页面' });
        });


    }
};

module.exports = lottery;
