var Promise = require('bluebird'),
    models = require('../models'),
    // 用一个子进程来计算流量
    insights;

insights = {
    browser: function(options) {
        return models.getInsights(options).then(function(data) {
            return Promise.resolve(data);
        }, function(error) {
            console.log(error);
            return Promise.resolve([]);
        });
    }
};

module.exports = insights;
