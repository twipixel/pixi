var express = express || require('express'),
  router = express.Router(),
  env = process.env.NODE_ENV || 'development';

router.use('/goal', express.static('goal'));
router.use('/samples', express.static('samples'));
router.use(express.static('server/public'));
router.use('/dist', express.static('dist'));

router.get('/', function (req, res) {
  res.redirect('/samples/index.html');
});

module.exports = router;
