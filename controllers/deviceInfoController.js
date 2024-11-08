const asyncHandler = require("express-async-handler");
var async = require("async");
const fs = require('fs');
var path = require('path');
const { type } = require("os");

exports.device_info_get = asyncHandler(async (req, res, next) => {
  var filepath = path.resolve(__dirname, "../public/data/device-info.json");
  var data = fs.readFileSync(filepath, 'utf-8');
  const deviceinfolist = JSON.parse(data);
  var tablelist = [];
  var switchlist = [];
  for(const data of deviceinfolist.datalist) {
    if (typeof(data.value) === 'boolean') {
      switchlist.push(data);
    } else {
      tablelist.push(data);
    }
  }
  res.render('device-info',
    { 
      title: '', 
      secondcss: '/stylesheets/info.css', 
      pagename: 'info', 
      param: encodeURI(JSON.stringify(req.params)),
      tables: tablelist,
      switchs: switchlist,
    });
});

exports.device_curve_get = asyncHandler(async (req, res, next) => {
  res.render('device-curve',
    { 
      title: '', 
      secondcss: '/stylesheets/curve.css', 
      pagename: 'curve', 
      param: encodeURI(JSON.stringify(req.params)),
    });
});

exports.device_curve_post = asyncHandler(async (req, res, next) => {
  console.log(req.body);
  var filepath = path.resolve(__dirname, "../public/data/device-curve.json");
  var data = fs.readFileSync(filepath, 'utf-8');
  const curveinfo = JSON.parse(data);
  res.json(curveinfo);
});

var str = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];
function generateMixed(n) {
     var res = "";
     for(var i = 0; i < n ; i ++) {
         var id = Math.ceil(Math.random()*25);
         res += str[id];
     }
     return res;
}
exports.device_warn_get = asyncHandler(async (req, res, next) => {
  var filepath = path.resolve(__dirname, "../public/data/device-warn.json");
  var data = fs.readFileSync(filepath, 'utf-8');
  const devicewarnlist = JSON.parse(data);  
  for (var warn of devicewarnlist.warnlist) {
    warn.id = generateMixed(6);
  }
  console.log(devicewarnlist);
  res.render('device-warn',
    { 
      title: '', 
      secondcss: '/stylesheets/warn.css', 
      pagename: 'warn', 
      param: encodeURI(JSON.stringify(req.params)),
      warns: devicewarnlist.warnlist,
    });
});