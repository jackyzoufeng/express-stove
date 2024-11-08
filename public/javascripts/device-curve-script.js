console.log(param);

var myChart = echarts.init(document.querySelector("#main-curve"), "dark");

const fetchPromise = fetch("/devicecurve/currentdata", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(param)
    });
fetchPromise
  .then((response) => {
    if (!response.ok) {
      throw new Error(`error occur when get http request ：${response.status}`);
    }
    return response.json();
  })
  .then((json) => {
  	showCurve(json);
  })
  
function showCurve(devdata) {
	// 指定图表的配置项和数据
	var option = {
	  title: {
	    text: param.name
	  },
	  tooltip: {},
	  legend: {
	  },
	  xAxis: {},
	  yAxis: [],
	  series: []
	};
	option.xAxis.data = devdata.xaxis;
	var yasixcount = devdata.yaxis.count;
	for (var i = 0; i < yasixcount; i++) {
		var yaxis = {};
		yaxis.type = "value";
		yaxis.name = devdata.yaxis.datalist[i].name;
		yaxis.alignTicks = true;
		yaxis.axisLabel = {};
		yaxis.axisLabel.formatter = "\{value\}";
		option.yAxis[i] = yaxis;
	}
	var seriescount = devdata.series.count;
	for (var i = 0; i < seriescount; i++) {
		var series = {};
		series.name = devdata.series.datalist[i].name;
		series.type = "line";
		series.yAxisIndex = devdata.series.datalist[i].yindex;
		series.data = devdata.series.datalist[i].data;
		series.colorBy = "data";
		option.series[i] = series;
	}
	// 使用刚指定的配置项和数据显示图表。
	myChart.setOption(option);
}
