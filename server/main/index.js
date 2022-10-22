var express = express || require('express'),
  router = express.Router(),
  env = process.env.NODE_ENV || 'development';

router.use('/dist', express.static('dist'));
router.use('/libs', express.static('libs'));
router.use('/asset', express.static('asset'));
router.use('/practice', express.static('practice'));
router.use('/examples', express.static('examples'));
router.use(express.static('server/public'));
router.get('/', function (req, res) {
  res.redirect('/examples/index.html');
});

module.exports = router;
