var express = require('express');
const fs = require('fs');
var router = express.Router();
const query_controller = require("../controllers/queryController");

/* GET home page. */
router.get('/', async function(req, res, next) {
  var data = fs.readFileSync('./public/data/devices.json', 'utf-8');
  const devicelist = JSON.parse(data);
  res.render('index', { title: '', secondcss: '/stylesheets/index.css', pagename: 'index', devicearray: devicelist.devices}, function(err, html) {
    if (err) {
      //console.error('Error rendering the template:', err);
      return res.status(500).send('Error rendering the template');
    }
    //console.log(html);
    res.send(html);
  });
});

router.get('/query', query_controller.query_get);

router.post('/query', query_controller.query_post);

router.get('/query/warn-nextpage', query_controller.query_warn_nextpage_get);

router.get('/query/warn-prevpage', query_controller.query_warn_prevpage_get);

router.get('/deviceinfo/:devid/devicename/:name', function(req, res, next) {
  res.send(req.params.devid+req.params.name);
});

module.exports = router;
