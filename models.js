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

function createUser(phoneNumber) {
  return knex('aee_user').insert(defaultUser[phoneNumber]);
}

function findUser() {

}

function addUserBouns() {

}

function addInsights(insight) {
  return knex('aee_insights').insert([insight]).then(function(result) {
  }, function(error) {
    cosnole.log(error);
  });
}

function getInsights() {
  return Promise.all([
    knex('aee_insights').select(),
    knex('aee_mac_ap_log')
      .join('aee_user', 'aee_user.mac', 'aee_mac_ap_log.mac')
      .join('aee_ap', 'aee_ap.ap_id', 'aee_mac_ap_log.ap_id')
      .select('aee_mac_ap_log.tm', 'aee_user.mobile', 'aee_ap.ap_name')
  ]).then(function(datas) {
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
            '手机': d.mobile,
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

module.exports = {
  addInsights: addInsights,
  getInsights: getInsights,
  getLocationByApId: getLocationByApId
};
