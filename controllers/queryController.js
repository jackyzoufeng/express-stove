const fs = require('fs');
const asyncHandler = require("express-async-handler");
var async = require("async");
const AlarmData = require("../models/alarmdata");
const xlsx = require('node-xlsx');
const { DateTime } = require("luxon");
const report_controller = require("./reportController.js");

function padZero(num) {
    return num < 10 ? '0' + num : num;
}

function formatDate(date) {
  var year = date.getFullYear();
  var month = padZero(date.getMonth() + 1); // 月份是从0开始的
  var day = padZero(date.getDate());
 
  return year + '-' + month + '-' + day;
}

function formatTime(date) {
  var hours = padZero(date.getHours());
  var minutes = padZero(date.getMinutes());
 
  return hours + ':' + minutes;
}

exports.query_get = asyncHandler(async (req, res, next) => {
  var data = fs.readFileSync('./public/data/devices.json', 'utf-8');
  const devicelist = JSON.parse(data);
  var dateobj = {};
  var datetime = new Date();
  dateobj.enddate = formatDate(datetime);
  dateobj.endtime = formatTime(datetime);
  var datetimebegin = new Date(datetime - 30*24*60*60*1000);
  dateobj.begindate = formatDate(datetimebegin);
  dateobj.begintime = formatTime(datetimebegin);
  res.render('query', 
    { 
      title: '', 
      secondcss: '/stylesheets/query.css', 
      pagename: 'query', 
      devicearray: devicelist.devices, 
      selectdate: dateobj,
    });
});

var lastQueryWarnPostParam = null;
var lastQueryWarnCount = 0;
var currentWarnPage = 0;
const warnsCountPerPage = 20;

exports.query_post = [asyncHandler(async (req, res, next) => {
  var beginDate = new Date(req.body.begin_date_1 + "T" + req.body.begin_time_1);
  var endDate = new Date(req.body.end_date_1 + "T" + req.body.end_time_1);
  var error = [];
  if (isNaN(beginDate.getTime())) {
    error.push("Invalid begin date");
  }
  if (isNaN(endDate.getTime())) {
    error.push("Invalid end date");
  }
  var num = endDate.getTime() - beginDate.getTime();
  if (isNaN(num)||(num <= 0)) {
    error.push("begin date must be earlier than end date");
  }
  if (error.length > 0) {
    var data = fs.readFileSync('./public/data/devices.json', 'utf-8');
    const devicelist = JSON.parse(data);
    var dateobj = {};
    dateobj.enddate = req.body.begin_date_1;
    dateobj.endtime = req.body.begin_time_1;
    dateobj.begindate = req.body.end_date_1;
    dateobj.begintime = req.body.end_time_1;
    res.render('query', 
      { 
        title: '', 
        secondcss: '/stylesheets/query.css', 
        pagename: 'query', 
        devicearray: devicelist.devices, 
        selectdate: dateobj, 
        errors: error,
      });
  } else {
    if (req.body.selected_type === 'warn_data') {
      lastQueryWarnPostParam = req.body;
      AlarmData['Alarm'+req.body.selected_dev]
        .where('still_on_time').gte(beginDate)
        .where('still_on_time').lte(endDate)
        .countDocuments()
        .exec(function (err, count) {
          if (err) {
            return next(err);
          }
          lastQueryWarnCount = count;
          currentWarnPage = 1;
          showWarnPage(req, res, next);
        });
    } else if (req.body.selected_type === 'report_data') {
      next();
    }
  }
}),
report_controller.query_post_report];

exports.query_warn_nextpage_get = asyncHandler(async (req, res, next) => {
  if (lastQueryWarnPostParam === null||currentWarnPage === 0||lastQueryWarnCount === 0) {
    res.send("lastQueryWarnPostParam is null or currentWarnPage is zero or lastQueryWarnCount is zero");
  } else {
    if (currentWarnPage >= Math.ceil(lastQueryWarnCount/warnsCountPerPage)) {
      currentWarnPage = Math.ceil(lastQueryWarnCount/warnsCountPerPage);
    } else {
      currentWarnPage++;
    }
    showWarnPage(req, res, next);
  }
});

exports.query_warn_prevpage_get = asyncHandler(async (req, res, next) => {
  if (lastQueryWarnPostParam === null||currentWarnPage === 0||lastQueryWarnCount === 0) {
    res.send("lastQueryWarnPostParam is null or currentWarnPage is zero or lastQueryWarnCount is zero");
  } else {
    if (currentWarnPage <= 1) {
      currentWarnPage = 1;
    } else {
      currentWarnPage--;
    }
    showWarnPage(req, res, next);
  }
});

function showWarnPage(req, res, next) {
  var beginDate = new Date(lastQueryWarnPostParam.begin_date_1 + "T" + lastQueryWarnPostParam.begin_time_1);
  var endDate = new Date(lastQueryWarnPostParam.end_date_1 + "T" + lastQueryWarnPostParam.end_time_1);
  AlarmData['Alarm'+lastQueryWarnPostParam.selected_dev]
    .where('still_on_time').gte(beginDate)
    .where('still_on_time').lte(endDate)
    .sort({'take_time':-1}) //order by desc when value is -1 or asc when value is 1
    .skip((currentWarnPage-1)*warnsCountPerPage)
    .limit(warnsCountPerPage)
    .exec(function (err, list_alarmdata) {
      if (err) {
        return next(err);
      }
      var pageobj = {};
      pageobj.currentpage = currentWarnPage;
      pageobj.pagecount = Math.ceil(lastQueryWarnCount/20);
      res.render('query-warn', 
        { 
          title: '', 
          secondcss: '/stylesheets/table.css', 
          devicename: lastQueryWarnPostParam.selected_dev, 
          warnarray: list_alarmdata, 
          pageinfo: pageobj,
        });
    });
}

exports.query_warn_export_get = asyncHandler(async (req, res, next) => {
  if (lastQueryWarnPostParam === null) {
    res.send("lastQueryWarnPostParam is null");
  } else {
    var beginDate = new Date(lastQueryWarnPostParam.begin_date_1 + "T" + lastQueryWarnPostParam.begin_time_1);
    var endDate = new Date(lastQueryWarnPostParam.end_date_1 + "T" + lastQueryWarnPostParam.end_time_1);
    AlarmData['Alarm'+lastQueryWarnPostParam.selected_dev]
      .where('still_on_time').gte(beginDate)
      .where('still_on_time').lte(endDate)
      .sort({'take_time':-1}) //order by desc when value is -1 or asc when value is 1
      .exec(function (err, list_alarmdata) {
        if (err) {
          return next(err);
        }
        var exportdata = [];
        exportdata.push(['序号', '时间', '内容']);
        for (var i = 0; i < list_alarmdata.length; i++) {
          var alarm = list_alarmdata[i];
          var datestring = DateTime.fromJSDate(alarm.take_time).toFormat('yyyy-MM-dd HH:mm');
          exportdata.push([`${i+1}`, datestring, `${alarm.name}`]);
        }
        const list = [{
          name: "报警数据",
          data: exportdata
        }];
        const buffer = xlsx.build(list);
        // 设置响应头
        res.setHeader(
          'Content-Type',
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        );
        res.setHeader('Content-Disposition', 'attachment; filename=alarmdata.xlsx');
        // 将 Excel 文件的二进制流数据返回给客户端
        res.end(buffer, 'binary');
      });
  }
});