function getDeviceInfo() {
	const fetchPromise = fetch(
	  "./data/device-data.json",
	);
	
	fetchPromise
	  .then((response) => {
	    if (!response.ok) {
	      throw new Error(`error occur when get http request ：${response.status}`);
	    }
	    return response.json();
	  })
	  .then((json) => {
	    updateInfo(json);
	  })
	  //.catch((error) => {
	  //  console.error(`can not get data lists：${error}`);
	  //});

  window.setTimeout(()=>{getDeviceInfo();}, 5000);
}

function updateInfo(objs) {
  const devices = objs.devices;
  for (const device of devices) {
		const namespan = document.querySelector(`#name${device.dev_id}`);
		if (!device.online) {
			namespan.textContent = "(断线)";
			namespan.setAttribute("class", "devoffline");
		} else {
			namespan.textContent = "";
			namespan.removeAttribute("class");
		}
		const dataspan = document.querySelector(`#data${device.dev_id}`);
		if (device.type === 2) {
			dataspan.textContent = `温度:${device.temp}℃ 碳势:${device.cvalue}%Cp`;
		} else {
			dataspan.textContent = `温度:${device.temp}℃`;
		}
  }
}

getDeviceInfo();