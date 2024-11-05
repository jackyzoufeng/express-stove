const { DateTime } = require("luxon");
const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const AlarmDataSchema = new Schema({
  name: { type: String, required: true },
  take_time: { type: Date },
  still_on_time: { type: Date },
});

AlarmDataSchema.virtual("take_time_formated").get(function () {
  return DateTime.fromJSDate(this.take_time).toFormat('yyyy-MM-dd HH:mm');
});

var Alarm1160 = mongoose.model("Alarm1160", AlarmDataSchema, "1160_alarm_data");
var Alarm2090 = mongoose.model("Alarm2090", AlarmDataSchema, "2090_alarm_data");
var Alarm2100 = mongoose.model("Alarm2100", AlarmDataSchema, "2100_alarm_data");
var Alarm2110 = mongoose.model("Alarm2110", AlarmDataSchema, "2110_alarm_data");
var Alarm2120 = mongoose.model("Alarm2120", AlarmDataSchema, "2120_alarm_data");
var Alarm3130 = mongoose.model("Alarm3130", AlarmDataSchema, "3130_alarm_data");
var Alarm4140 = mongoose.model("Alarm4140", AlarmDataSchema, "4140_alarm_data");
var Alarm5150 = mongoose.model("Alarm5150", AlarmDataSchema, "5150_alarm_data");

module.exports = {Alarm1160,Alarm2090,Alarm2100,Alarm2110,Alarm2120,Alarm3130,Alarm4140,Alarm5150};
