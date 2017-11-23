var express = require('express'),
    app = express(),
    path = require('path'),
    bodyParser = require('body-parser'),
    session = require('express-session'),
    expressLayouts = require('express-ejs-layouts');


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.engine('.html', require('ejs').__express);
app.engine('.js', require('ejs').__express);
app.set('view engine', 'html');
app.set('views', path.resolve('./views'));
app.use(session({ secret: 'marathon', cookie: { maxAge: 60000 } }));
app.use('/assets', express.static(path.resolve('./assets')));
app.use(expressLayouts);

var lotteries = [{
    id: "123",
    bonus: 100,
    lost: false
}, {
    id: "456",
    bonus: 100,
    lost: false
}];


app.get('/profile', function(req, res) {
  if (!req.session.user) {
    res.redirect('/join');
  } else {
    res.render('profile', { user: req.session.user, title: req.session.user.phone + '的页面' });
  }
});

app.get('/lottery/:id', function(req, res) {
    if (!req.session.user) {
       res.redirect('/join');
    } else {
      var lotteryId = req.params.id;
      var lottery = lotteries.find(_ => _.id === lotteryId);

      res.render('lottery', { lottery: lottery,  title: '红包页面' });
    }
});


app.get('/join', function(req, res) {
    if (req.session.user) {
        res.redirect('/profile');
    } else {
      res.render('join', { user: req.session.user , title: '参加活动'});
    }
});

app.post('/api/join', function(req, res) {
    if (req.session.user) {
        res.send(null);
    } else {
        var phone = req.body.phone;
        req.session.user = {
            phone: phone,
            bonus: 0
        };
        res.json(req.session.user);
    }
});

app.get('/api/lottery/hit/:id', function(req, res) {
  if (!req.session.user) {
       res.redirect('/join');
  } else {
      var lotteryId = req.params.id;
      var lottery = lotteries.find(_ => _.id === lotteryId);
      if (lottery && lottery.lost === false) {
        req.session.user.bonus = req.session.user.bonus + lottery.bonus;
        res.json({ status: 'ok' });
      } else {
        res.json({ status: 'failed' });
      }

  }
});

app.listen(3000, function() {
    console.log('Example app listening on port 3000!');
});



