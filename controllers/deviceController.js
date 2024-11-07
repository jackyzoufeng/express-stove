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