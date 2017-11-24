var express = require('express'),
    apis = require('../apis');

var authMiddleware = (req, res, next) => {
    if (!req.session.user) {
        res.redirect('/join');
    } else {
        next(null, req, res);
    }
};

module.exports = function apiRoutes() {
    var apiRouter = express.Router();

    // alias delete with del
    apiRouter.del = apiRouter.delete;

    // ## CORS pre-flight check
    // apiRouter.options('*', cors);

    apiRouter.get('/api/insight', authMiddleware, apis.http(apis.insights.browser));


    apiRouter.get('/api/lottery/hit/:id', authMiddleware, apis.http(apis.lottery.hit));
    apiRouter.get('/lottery/:id', authMiddleware, apis.lottery.lotteryPage);

    apiRouter.post('/api/join', apis.join.join);
    apiRouter.get('/joinSuccess', authMiddleware, apis.join.joinSuccess);

    apiRouter.get('/profile', authMiddleware, apis.profile.profilePage);

    apiRouter.get('/bid', apis.bid.bidPage);

    apiRouter.get('/*', apis.join.joinPage);

    return apiRouter;
};
