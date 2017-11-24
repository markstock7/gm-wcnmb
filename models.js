var knex = require('./knex'),
    Promise = require('bluebird'),
    _ = require('lodash'),
    moment = require('moment');

var defaultUser = {
    18210291778: {
        id: 1,
        name: 'chengguodong',
        mobile: '18210291778',
        show_name: '成国栋',
        mac: 'a4:44:d1:b9:30:c3',
        verify: 1
    },
    13691049423: {
        id: 2,
        name: 'zhengmeiyu',
        mobile: '13691049423',
        show_name: '郑美玉',
        mac: 'a0:8d:16:7b:a7:70',
        verify: 1
    }
}

function createUser(user) {
    return knex('aee_user').insert([user]).then(id => {
        return knex('aee_user').where({ id }).select();
    });
}

function updateUser(phone, bonus, verify) {
    return knex('aee_user')
        .where({ phone })
        .update({
            bonus,
            verify: 1
        }).then(a => console.log, error => console.log);
}

function findUser(phone) {
    return knex('aee_user').where({ phone: phone }).select();
}

function addInsights(insight) {
    return knex('aee_insights').insert([insight]).then(function(result) {}, function(error) {
        cosnole.log(error);
    });
}

function getInsights() {
    return Promise.all([
        knex('aee_insights').select(),
        knex('aee_mac_ap_log')
        .join('aee_user', 'aee_user.mac', 'aee_mac_ap_log.mac')
        .join('aee_ap', 'aee_ap.ap_id', 'aee_mac_ap_log.ap_id')
        .select('aee_mac_ap_log.tm', 'aee_user.phone', 'aee_ap.ap_name')
    ]).then(function(datas) {
        console.log(datas);
        var data1 = _.map(datas[0], function(d) {
            d.attrs = JSON.parse(d.attrs);
            d.attrs['标题'] = '中奖啦'
            d.filterHit = true;
            return d;
        });
        var data2 = datas[1].map(function(d) {
            return {
                type: 'hit-lottery',
                timestamp: moment(d.tm).valueOf(),
                attrs: {
                    '手机': d.phone,
                    '房间': d.ap_name,
                    '标题': '位置切换'
                },
                filterHit: true
            };
        })
        return Promise.resolve(_.sortBy(data1.concat(data2), ['timestamp']));
    })
}

function getLocationByApId(id) {
    return knex('aee_ap').where({ ap_id: id }).select('ap_name').limit(1);
}

function getTeams() {
    return knex('hackathon_team').select();
}

function getBidInfo(phone) {
    return knex('aee_bid').where({ phone }).select();
}

function makeBid(phone, team, money) {
    return knex('aee_bid').where({ phone, team }).select()
        .then(mybids => {
            var mybid;
            if (mybids.length) {
                mybid = mybid[0]
            } else {
                mybid = {
                    phone,
                    team,
                    money: 0
                };
            }

            mybid.money = mybid.money + money;

            return knex('aee_bid').insert(mybid);
        });
}

function profileAnalyse(phone) {
    return Promise.all([
        knex('aee_user').where({ phone }).select(),
        knex('aee_insights').select(),
        knex('aee_user').orderBy('bonus', 'DESC')
    ]).then(result => {
        var bonus = result[0].bonus;
        var insights = result[1].filter(_ => {
            _.attrs = JSON.parse(_.attrs)
            return _.attrs['类型'] === '领取红包';
        });
        var ranking = result[2].findIndex(_ => _.phone === phone) + 1;

        return Promise.resolve({
            bonus,
            num: insights.length,
            ranking
        })
    });
}

module.exports = {
    addInsights: addInsights,
    getInsights: getInsights,
    getLocationByApId: getLocationByApId,
    getTeams: getTeams,
    getBidInfo,
    makeBid,
    createUser,
    findUser,
    profileAnalyse,
    updateUser
};
