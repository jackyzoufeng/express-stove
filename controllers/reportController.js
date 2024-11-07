const asyncHandler = require("express-async-handler");
var async = require("async");
const ReportData = require("../models/reportdata");
const device_controller = require("./deviceController.js");
const xlsx = require('node-xlsx');
const fs = require('fs');
var path = require('path');

var lastQueryReportPostParam = null;
var lastQueryReportCount = 0;
var currentReportPage = 0;
const reportsCountPerPage = 28;

exports.query_post_report = asyncHandler(async (req, res, next) => {
  lastQueryReportPostParam = req.body;
  var beginDate = new Date(lastQueryReportPostParam.begin_date_1 + "T" + lastQueryReportPostParam.begin_time_1);
  var endDate = new Date(lastQueryReportPostParam.end_date_1 + "T" + lastQueryReportPostParam.end_time_1);
  ReportData['Report'+req.body.selected_dev]
    .where('take_time').gte(beginDate)
    .where('take_time').lte(endDate)
    .countDocuments()
    .exec(function (err, count) {
      if (err) {
        return next(err);
      }
      lastQueryReportCount = count;
      currentReportPage = 1;
      showReportPage(req, res, next);
    });
});

exports.query_report_get = asyncHandler(async (req, res, next) => {
  if (lastQueryReportPostParam === null) {
    res.send("lastQueryReportPostParam is null");
  } else {
    showReportPage(req, res, next);
  }
});

function showReportPage(req, res, next) {
  var beginDate = new Date(lastQueryReportPostParam.begin_date_1 + "T" + lastQueryReportPostParam.begin_time_1);
  var endDate = new Date(lastQueryReportPostParam.end_date_1 + "T" + lastQueryReportPostParam.end_time_1);
  ReportData['Report'+lastQueryReportPostParam.selected_dev]
    .where('take_time').gte(beginDate)
    .where('take_time').lte(endDate)
    .sort({'take_time':1}) //order by desc when value is -1 or asc when value is 1
    .skip((currentReportPage-1)*reportsCountPerPage)
    .limit(reportsCountPerPage)
    .exec(function (err, list_reportdata) {
      if (err) {
        return next(err);
      }
      const resolved_data = device_controller.resolver(lastQueryReportPostParam.selected_dev, list_reportdata);
      var pageobj = {};
      pageobj.currentpage = currentReportPage;
      pageobj.pagecount = Math.ceil(lastQueryReportCount/reportsCountPerPage);
      res.render('query-report', 
        { 
          title: '', 
          secondcss: '/stylesheets/table.css', 
          devicename: lastQueryReportPostParam.selected_dev, 
          dataarray: resolved_data, 
          pageinfo: pageobj,
        });
    });
}

exports.query_report_nextpage_get = asyncHandler(async (req, res, next) => {
  if (lastQueryReportPostParam === null||currentReportPage === 0||lastQueryReportCount === 0) {
    res.send("lastQueryReportPostParam is null or currentReportPage is zero or lastQueryReportCount is zero");
  } else {
    if (currentReportPage >= Math.ceil(lastQueryReportCount/reportsCountPerPage)) {
      currentReportPage = Math.ceil(lastQueryReportCount/reportsCountPerPage);
    } else {
      currentReportPage++;
    }
    showReportPage(req, res, next);
  }
});

exports.query_report_prevpage_get = asyncHandler(async (req, res, next) => {
  if (lastQueryReportPostParam === null||currentReportPage === 0||lastQueryReportCount === 0) {
    res.send("lastQueryReportPostParam is null or currentReportPage is zero or lastQueryReportCount is zero");
  } else {
    if (currentReportPage <= 1) {
      currentReportPage = 1;
    } else {
      currentReportPage--;
    }
    showReportPage(req, res, next);
  }
});

exports.query_report_export_get = asyncHandler(async (req, res, next) => {
  if (lastQueryReportPostParam === null) {
    res.send("lastQueryReportPostParam is null");
  } else {
    var beginDate = new Date(lastQueryReportPostParam.begin_date_1 + "T" + lastQueryReportPostParam.begin_time_1);
    var endDate = new Date(lastQueryReportPostParam.end_date_1 + "T" + lastQueryReportPostParam.end_time_1);
    ReportData['Report'+lastQueryReportPostParam.selected_dev]
      .where('take_time').gte(beginDate)
      .where('take_time').lte(endDate)
      .sort({'take_time':1}) //order by desc when value is -1 or asc when value is 1
      .exec(function (err, list_reportdata) {
        if (err) {
          return next(err);
        }
        const resolved_data = device_controller.resolver(lastQueryReportPostParam.selected_dev, list_reportdata);
        var exportdata = [];
        exportdata.push(resolved_data.name);
        resolved_data.data.forEach(item => exportdata.push(item));
        const list = [{
          name: "报表数据",
          data: exportdata
        }];
        const buffer = xlsx.build(list);
        // 设置响应头
        res.setHeader(
          'Content-Type',
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        );
        res.setHeader('Content-Disposition', 'attachment; filename=reportdata.xlsx');
        // 将 Excel 文件的二进制流数据返回给客户端
        res.end(buffer, 'binary');
      });
  }
});

exports.query_report_curve_get = asyncHandler(async (req, res, next) => {
  if (lastQueryReportPostParam === null) {
    res.send("lastQueryReportPostParam is null");
  } else {
    res.render('query-report-curve', { title: '', secondcss: '/stylesheets/curve.css'});
  }
});

exports.query_report_curve_data_get = asyncHandler(async (req, res, next) => {
  if (lastQueryReportPostParam === null) {
    res.send("lastQueryReportPostParam is null");
  } else {
    var beginDate = new Date(lastQueryReportPostParam.begin_date_1 + "T" + lastQueryReportPostParam.begin_time_1);
    var endDate = new Date(lastQueryReportPostParam.end_date_1 + "T" + lastQueryReportPostParam.end_time_1);
    ReportData['Report'+lastQueryReportPostParam.selected_dev]
      .where('take_time').gte(beginDate)
      .where('take_time').lte(endDate)
      .sort({'take_time':1}) //order by desc when value is -1 or asc when value is 1
      .exec(function (err, list_reportdata) {
        if (err) {
          return next(err);
        }
        var resolved_data = device_controller.resolverforcurve(lastQueryReportPostParam.selected_dev, list_reportdata);
        resolved_data.devname = lastQueryReportPostParam.selected_dev;
        res.json(resolved_data);
      });
  }
});