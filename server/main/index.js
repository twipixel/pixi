var express = express || require('express'),
  router = express.Router(),
  env = process.env.NODE_ENV || 'development';

router.use('/dist', express.static('dist'));
router.use('/asset', express.static('asset'));
router.use('/practice', express.static('practice'));
router.use('/samples', express.static('samples'));
router.use(express.static('server/public'));
router.get('/', function (req, res) {
  res.redirect('/samples/index.html');
});

module.exports = router;
