var express = require('express'),
    app = express(),
    path = require('path'),
    bodyParser = require('body-parser'),
    session = require('express-session'),
    expressLayouts = require('express-ejs-layouts'),
    cors = require('cors'),
    _ = require('lodash');


app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.engine('.html', require('ejs').__express);
app.engine('.js', require('ejs').__express);
app.set('view engine', 'html');
app.set('views', path.resolve('./views'));
app.use(session({ secret: 'marathon', cookie: { maxAge: 60000000 } }));
app.use('/assets', express.static(path.resolve('./assets')));
app.use(expressLayouts);


app.use(require('./apis/routes')());

// var lotteries = [];

// app.get('/profile', function(req, res) {
//   if (!req.session.user) {
//     res.redirect('/join');
//   } else {
//     res.render('profile', { user: req.session.user, title: req.session.user.phone + '的页面' });
//   }
// });

// app.get('/lottery/:id', function(req, res) {
//     if (!req.session.user) {
//        res.redirect('/join');
//     } else {

//       if (Math.random()*10 > 7) {
//         var lottery = {
//           id: "" + Math.round(Math.random() * 1000000000),
//           bonus:  Math.round(Math.random() * 20),
//           lost: false,
//           location: ''
//         };


//         lotteries.push(lottery);

//         res.render('lottery', { lottery: lottery,  title: '红包页面' });
//       } else {
//         res.render('lottery', { lottery: null,  title: '红包页面' });
//       }
//     }
// });


// app.get('/join', function(req, res) {
//     if (req.session.user) {
//         res.redirect('/profile');
//     } else {
//       res.render('join', { user: req.session.user , title: '参加活动'});
//     }
// });

// app.post('/api/join', function(req, res) {
//     if (req.session.user) {
//         res.send(null);
//     } else {
//         var phone = req.body.phone;
//         req.session.user = {
//             phone: phone,
//             bonus: 0
//         };
//         res.json(req.session.user);
//     }
// });


// var models = require('./models');

// app.get('/api/lottery/hit/:id', function(req, res) {
//   var user = req.session.user;
//   if (!user) {
//        res.redirect('/join');
//   } else {
//       var lotteryId = req.params.id;
//       var lottery = findLottery(lotteryId);
//       if (lottery && lottery.lost === false) {
//         // 新建一个
//         models.addInsights({
//           type: 'hit-lottery',
//           timestamp: Date.now(),
//           attrs: JSON.stringify({
//             '手机': user.phone,
//             '奖金': lottery.bonus
//           })
//         });

//         user.bonus = user.bonus + lottery.bonus;
//         lottery.lost = true;



//         res.json({ status: 'ok' });
//       } else {

//         models.addInsights({
//           type: 'hit-lottery',
//           timestamp: Date.now(),
//           attrs: JSON.stringify({

//           });
//         })

//         res.json({ status: 'failed' });
//       }
//   }
// });


// function findLottery(lotteryId) {
//   return _.find(lotteries, function(_) {
//     return _.id === lotteryId
//   });
// }

app.listen(3000, function() {
    console.log('Example app listening on port 3000!');
});



