const { DateTime } = require("luxon");
const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ReportDataSchema = new Schema({
  plc_data: { type: Buffer, required: true },
  take_time: { type: Date }
});

ReportDataSchema.virtual("take_time_formated").get(function () {
  return DateTime.fromJSDate(this.take_time).toFormat('yyyy-MM-dd HH:mm');
});

var Report1160 = mongoose.model("Report1160", ReportDataSchema, "1160_data");
var Report2090 = mongoose.model("Report2090", ReportDataSchema, "2090_data");
var Report2100 = mongoose.model("Report2100", ReportDataSchema, "2100_data");
var Report2110 = mongoose.model("Report2110", ReportDataSchema, "2110_data");
var Report2120 = mongoose.model("Report2120", ReportDataSchema, "2120_data");
var Report3130 = mongoose.model("Report3130", ReportDataSchema, "3130_data");
var Report4140 = mongoose.model("Report4140", ReportDataSchema, "4140_data");
var Report5150 = mongoose.model("Report5150", ReportDataSchema, "5150_data");

module.exports = {Report1160,Report2090,Report2100,Report2110,Report2120,Report3130,Report4140,Report5150};
