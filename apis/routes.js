var express = require('express'),
    apis = require('../apis');

var authMiddleware = (req, res, next) => {
    console.log(req.originalUrl);
    if (!req.session.user) {
        res.redirect('/join?redirectUrl=' + req.originalUrl);
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

    apiRouter.get('/api/insight', apis.http(apis.insights.browser));


    apiRouter.get('/api/lottery/hit/:id', authMiddleware, apis.http(apis.lottery.hit));
    apiRouter.get('/lottery/:id', authMiddleware, apis.lottery.lotteryPage);

    apiRouter.post('/api/join', apis.join.join);
    apiRouter.get('/joinSuccess', authMiddleware, apis.join.joinSuccess);

    apiRouter.get('/profile', authMiddleware, apis.profile.profilePage);

    apiRouter.get('/bid', authMiddleware, apis.bid.bidPage);
    apiRouter.post('/api/bid', authMiddleware, apis.http(apis.bid.bid));
    apiRouter.get('/summarize', authMiddleware, apis.profile.summarizePage);

    apiRouter.get('/*', apis.join.joinPage);

    return apiRouter;
};
