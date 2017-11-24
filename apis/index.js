var _              = require('lodash'),
    Promise        = require('bluebird'),
    insights       = require('./insights'),
    lottery        = require('./lottery'),
    profile        = require('./profile'),
    join           = require('./join'),
    bid            = require('./bid'),
    http,
    originHttp;

http = function http(apiMethod) {
    return (req, res, next) => {
        let object = req.body,
            options = _.extend({}, req.file, { user: req.session.user }, req.query, req.params);

        if (_.isEmpty(object)) {
            object = options;
            options = {};
        }

        return apiMethod(object, options).tap(response => {
            return Promise.resolve(response);
        }).then(response => {
            if (req.method === 'DELETE') {
                return res.status(204).end();
            }

            if (res.get('Content-Type') && res.get('Content-Type').indexOf('text/csv') === 0) {
                return res.status(200).send(response);
            }

            if (_.isFunction(response)) {
                return response(req, res, next);
            }

            res.json(response || {});
        }).catch(error => {
            next(error);
        })
    }
};


originHttp = function http(apiMethod) {
    return (req, res, next) => {
        return apiMethod(req, res, next).then(response => {
            if (req.method === 'DELETE') {
                return res.status(204).end();
            }

            if (res.get('Content-Type') && res.get('Content-Type').indexOf('text/csv') === 0) {
                return res.status(200).send(response);
            }

            if (_.isFunction(response)) {
                return response(req, res, next);
            }
            res.json(response || {});
        }).catch(error => {
            next(error);
        })
    }
};

module.exports = {
    http: http,
    originHttp: originHttp,
    insights,
    lottery,
    profile,
    join,
    bid
};
