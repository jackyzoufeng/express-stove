const { DateTime } = require("luxon");

function hhlresolver(list_reportdata) {
  var colname = ['序号','时间','主控温度','一区温度','二区温度','三区温度','四区温度'];
  var coldatalist = [];
  for (var i = 0; i < list_reportdata.length; i++) {
    var coldata = [];
    coldata.push(i+1);
    coldata.push(DateTime.fromJSDate(list_reportdata[i].take_time).toFormat('yyyy-MM-dd HH:mm'));
    coldata.push(Number.parseFloat(list_reportdata[i].plc_data.readInt16BE(20)*0.1).toFixed(2));
    coldata.push(Number.parseFloat(list_reportdata[i].plc_data.readInt16BE(22)*0.1).toFixed(2));
    coldata.push(Number.parseFloat(list_reportdata[i].plc_data.readInt16BE(24)*0.1).toFixed(2));
    coldata.push(Number.parseFloat(list_reportdata[i].plc_data.readInt16BE(26)*0.1).toFixed(2));
    coldata.push(Number.parseFloat(list_reportdata[i].plc_data.readInt16BE(28)*0.1).toFixed(2));
    coldatalist.push(coldata);
  }
  return { 'name': colname, 'data': coldatalist };
}

function stlresolver(list_reportdata) {
  var colname = ['序号','时间','主控温度','一区温度','二区温度','三区温度','四区温度','碳势'];
  var coldatalist = [];
  for (var i = 0; i < list_reportdata.length; i++) {
    var coldata = [];
    coldata.push(i+1);
    coldata.push(DateTime.fromJSDate(list_reportdata[i].take_time).toFormat('yyyy-MM-dd HH:mm'));
    coldata.push(Number.parseFloat(list_reportdata[i].plc_data.readInt16BE(630)*0.1).toFixed(2));
    coldata.push(Number.parseFloat(list_reportdata[i].plc_data.readInt16BE(632)*0.1).toFixed(2));
    coldata.push(Number.parseFloat(list_reportdata[i].plc_data.readInt16BE(634)*0.1).toFixed(2));
    coldata.push(Number.parseFloat(list_reportdata[i].plc_data.readInt16BE(636)*0.1).toFixed(2));
    coldata.push(Number.parseFloat(list_reportdata[i].plc_data.readInt16BE(638)*0.1).toFixed(2));
    coldata.push(Number.parseFloat(list_reportdata[i].plc_data.readInt32BE(824)*0.01).toFixed(2));
    coldatalist.push(coldata);
  }
  return { 'name': colname, 'data': coldatalist };
}

function hllresolver(list_reportdata) {
  var colname = ['序号','时间','缓冷温度','上炉壁温度','中炉壁温度','下炉壁温度'];
  var coldatalist = [];
  for (var i = 0; i < list_reportdata.length; i++) {
    var coldata = [];
    coldata.push(i+1);
    coldata.push(DateTime.fromJSDate(list_reportdata[i].take_time).toFormat('yyyy-MM-dd HH:mm'));
    coldata.push(Number.parseFloat(list_reportdata[i].plc_data.readInt16BE(40)*0.1).toFixed(2));
    coldata.push(Number.parseFloat(list_reportdata[i].plc_data.readInt16BE(44)*0.1).toFixed(2));
    coldata.push(Number.parseFloat(list_reportdata[i].plc_data.readInt16BE(46)*0.1).toFixed(2));
    coldata.push(Number.parseFloat(list_reportdata[i].plc_data.readInt16BE(48)*0.1).toFixed(2));
    coldatalist.push(coldata);
  }
  return { 'name': colname, 'data': coldatalist };
}

function zhcresolver(list_reportdata) {
  var colname = ['序号','时间','油槽温度'];
  var coldatalist = [];
  for (var i = 0; i < list_reportdata.length; i++) {
    var coldata = [];
    coldata.push(i+1);
    coldata.push(DateTime.fromJSDate(list_reportdata[i].take_time).toFormat('yyyy-MM-dd HH:mm'));
    coldata.push(Number.parseFloat(list_reportdata[i].plc_data.readInt16BE(220)*0.1).toFixed(2));
    coldatalist.push(coldata);
  }
  return { 'name': colname, 'data': coldatalist };
}

function qxjresolver(list_reportdata) {
  var colname = ['序号','时间','清水槽温度','碱水槽温度','烘干温度'];
  var coldatalist = [];
  for (var i = 0; i < list_reportdata.length; i++) {
    var coldata = [];
    coldata.push(i+1);
    coldata.push(DateTime.fromJSDate(list_reportdata[i].take_time).toFormat('yyyy-MM-dd HH:mm'));
    coldata.push(Number.parseFloat(list_reportdata[i].plc_data.readInt16BE(80)*0.1).toFixed(2));
    coldata.push(Number.parseFloat(list_reportdata[i].plc_data.readInt16BE(82)*0.1).toFixed(2));
    coldata.push(Number.parseFloat(list_reportdata[i].plc_data.readInt16BE(84)*0.1).toFixed(2));
    coldatalist.push(coldata);
  }
  return { 'name': colname, 'data': coldatalist };
}

exports.resolver = (selected_dev, list_reportdata) => {
  if (selected_dev.length > 0) {
    var devtype = selected_dev.charAt(0);
    if (devtype === '1') {
      return hhlresolver(list_reportdata);
    } else if (devtype === '2') {
      return stlresolver(list_reportdata);
    } else if (devtype === '3') {
      return hllresolver(list_reportdata);
    } else if (devtype === '4') {
      return zhcresolver(list_reportdata);
    } else if (devtype === '5') {
      return qxjresolver(list_reportdata);
    } else {
      return { 'error': 'selected_dev is incorrect'};
    }
  } else {
    return { 'error': 'selected_dev is empty'};
  }
}

function hhlresolverforcurve(list_reportdata) {
  var curvedata = {};
  curvedata.xaxis = [];
  curvedata.yaxis = {};
  curvedata.yaxis.count = 1;
  curvedata.yaxis.datalist = [{'name': '温度'}];
  curvedata.series = {};
  curvedata.series.count = 5;
  curvedata.series.datalist = [
    {'name': '主控温度', 'yindex': 0, 'data': []},
    {'name': '一区温度', 'yindex': 0, 'data': []},
    {'name': '二区温度', 'yindex': 0, 'data': []},
    {'name': '三区温度', 'yindex': 0, 'data': []},
    {'name': '四区温度', 'yindex': 0, 'data': []},
  ];
  for (var i = 0; i < list_reportdata.length; i++) {
    curvedata.xaxis.push(DateTime.fromJSDate(list_reportdata[i].take_time).toFormat('yyyy-MM-dd HH:mm'));
    curvedata.series.datalist[0].data.push(Number.parseFloat(list_reportdata[i].plc_data.readInt16BE(20)*0.1).toFixed(2));
    curvedata.series.datalist[1].data.push(Number.parseFloat(list_reportdata[i].plc_data.readInt16BE(22)*0.1).toFixed(2));
    curvedata.series.datalist[2].data.push(Number.parseFloat(list_reportdata[i].plc_data.readInt16BE(24)*0.1).toFixed(2));
    curvedata.series.datalist[3].data.push(Number.parseFloat(list_reportdata[i].plc_data.readInt16BE(26)*0.1).toFixed(2));
    curvedata.series.datalist[4].data.push(Number.parseFloat(list_reportdata[i].plc_data.readInt16BE(28)*0.1).toFixed(2));
  }
  return curvedata;
}

function stlresolverforcurve(list_reportdata) {
  var curvedata = {};
  curvedata.xaxis = [];
  curvedata.yaxis = {};
  curvedata.yaxis.count = 2;
  curvedata.yaxis.datalist = [{'name': '温度'}, {'name': '碳势'}];
  curvedata.series = {};
  curvedata.series.count = 6;
  curvedata.series.datalist = [
    {'name': '主控温度', 'yindex': 0, 'data': []},
    {'name': '一区温度', 'yindex': 0, 'data': []},
    {'name': '二区温度', 'yindex': 0, 'data': []},
    {'name': '三区温度', 'yindex': 0, 'data': []},
    {'name': '四区温度', 'yindex': 0, 'data': []},
    {'name': '碳势', 'yindex': 1, 'data': []},
  ];
  for (var i = 0; i < list_reportdata.length; i++) {
    curvedata.xaxis.push(DateTime.fromJSDate(list_reportdata[i].take_time).toFormat('yyyy-MM-dd HH:mm'));
    curvedata.series.datalist[0].data.push(Number.parseFloat(list_reportdata[i].plc_data.readInt16BE(630)*0.1).toFixed(2));
    curvedata.series.datalist[1].data.push(Number.parseFloat(list_reportdata[i].plc_data.readInt16BE(632)*0.1).toFixed(2));
    curvedata.series.datalist[2].data.push(Number.parseFloat(list_reportdata[i].plc_data.readInt16BE(634)*0.1).toFixed(2));
    curvedata.series.datalist[3].data.push(Number.parseFloat(list_reportdata[i].plc_data.readInt16BE(636)*0.1).toFixed(2));
    curvedata.series.datalist[4].data.push(Number.parseFloat(list_reportdata[i].plc_data.readInt16BE(638)*0.1).toFixed(2));
    curvedata.series.datalist[5].data.push(Number.parseFloat(list_reportdata[i].plc_data.readInt32BE(824)*0.01).toFixed(2));
  }
  return curvedata;
}

function hllresolverforcurve(list_reportdata) {
  var curvedata = {};
  curvedata.xaxis = [];
  curvedata.yaxis = {};
  curvedata.yaxis.count = 1;
  curvedata.yaxis.datalist = [{'name': '温度'}];
  curvedata.series = {};
  curvedata.series.count = 4;
  curvedata.series.datalist = [
    {'name': '缓冷温度', 'yindex': 0, 'data': []},
    {'name': '上炉壁温度', 'yindex': 0, 'data': []},
    {'name': '中炉壁温度', 'yindex': 0, 'data': []},
    {'name': '下炉壁温度', 'yindex': 0, 'data': []},
  ];
  for (var i = 0; i < list_reportdata.length; i++) {
    curvedata.xaxis.push(DateTime.fromJSDate(list_reportdata[i].take_time).toFormat('yyyy-MM-dd HH:mm'));
    curvedata.series.datalist[0].data.push(Number.parseFloat(list_reportdata[i].plc_data.readInt16BE(40)*0.1).toFixed(2));
    curvedata.series.datalist[1].data.push(Number.parseFloat(list_reportdata[i].plc_data.readInt16BE(44)*0.1).toFixed(2));
    curvedata.series.datalist[2].data.push(Number.parseFloat(list_reportdata[i].plc_data.readInt16BE(46)*0.1).toFixed(2));
    curvedata.series.datalist[3].data.push(Number.parseFloat(list_reportdata[i].plc_data.readInt16BE(48)*0.1).toFixed(2));
  }
  return curvedata;
}

function zhcresolverforcurve(list_reportdata) {
  var curvedata = {};
  curvedata.xaxis = [];
  curvedata.yaxis = {};
  curvedata.yaxis.count = 1;
  curvedata.yaxis.datalist = [{'name': '温度'}];
  curvedata.series = {};
  curvedata.series.count = 1;
  curvedata.series.datalist = [
    {'name': '油槽温度', 'yindex': 0, 'data': []},
  ];
  for (var i = 0; i < list_reportdata.length; i++) {
    curvedata.xaxis.push(DateTime.fromJSDate(list_reportdata[i].take_time).toFormat('yyyy-MM-dd HH:mm'));
    curvedata.series.datalist[0].data.push(Number.parseFloat(list_reportdata[i].plc_data.readInt16BE(220)*0.1).toFixed(2));
  }
  return curvedata;
}

function qxjresolverforcurve(list_reportdata) {
  var curvedata = {};
  curvedata.xaxis = [];
  curvedata.yaxis = {};
  curvedata.yaxis.count = 1;
  curvedata.yaxis.datalist = [{'name': '温度'}];
  curvedata.series = {};
  curvedata.series.count = 3;
  curvedata.series.datalist = [
    {'name': '清水槽温度', 'yindex': 0, 'data': []},
    {'name': '碱水槽温度', 'yindex': 0, 'data': []},
    {'name': '烘干温度', 'yindex': 0, 'data': []},
  ];
  for (var i = 0; i < list_reportdata.length; i++) {
    curvedata.xaxis.push(DateTime.fromJSDate(list_reportdata[i].take_time).toFormat('yyyy-MM-dd HH:mm'));
    curvedata.series.datalist[0].data.push(Number.parseFloat(list_reportdata[i].plc_data.readInt16BE(80)*0.1).toFixed(2));
    curvedata.series.datalist[1].data.push(Number.parseFloat(list_reportdata[i].plc_data.readInt16BE(82)*0.1).toFixed(2));
    curvedata.series.datalist[2].data.push(Number.parseFloat(list_reportdata[i].plc_data.readInt16BE(84)*0.1).toFixed(2));
  }
  return curvedata;
}

exports.resolverforcurve = (selected_dev, list_reportdata) => {
  if (selected_dev.length > 0) {
    var devtype = selected_dev.charAt(0);
    if (devtype === '1') {
      return hhlresolverforcurve(list_reportdata);
    } else if (devtype === '2') {
      return stlresolverforcurve(list_reportdata);
    } else if (devtype === '3') {
      return hllresolverforcurve(list_reportdata);
    } else if (devtype === '4') {
      return zhcresolverforcurve(list_reportdata);
    } else if (devtype === '5') {
      return qxjresolverforcurve(list_reportdata);
    } else {
      return { 'error': 'selected_dev is incorrect'};
    }
  } else {
    return { 'error': 'selected_dev is empty'};
  }
}