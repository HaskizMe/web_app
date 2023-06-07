function _l3AppInit() {
	l3SplashInit();
	l3LoginInit();
	l3TopbarInit();
	l3BodyImgInit();
	l3ProbeIndicatorInit();
	l3PointNavInit();
	l3NavControlsInit();
	l3AutoAdvInit();
	l3PointInfoInit();
	l3GraphInit();
	l3DataInit();
	l3TestScreenInit();
	l3ConnectInit();
	l3Log("Initialized");
}

function _l3AppCheckBleAndLogin() {
	const onAuthenticated = () => {
		l3Log("Authenticated");
		_l3AppFindLuna3Device();
	}	
	l3BleCheckStatus(
		// BLE available and supported.
		() => {
			l3LoginAccessToken(
				// already logged in.
				() => {
					l3SplashStart(() => {
						onAuthenticated();
					});
				},
				// needs login.
				() => {
					l3SplashStart(() => {
						l3Login(onAuthenticated);
					});
				});
		},
		(error) => {
			l3ConnectBleErrorShow(error);
		});
}

function _l3AppFindLuna3Device() {	
	l3ConnectSetOnPairListener(()=> {
		l3BleDiscover(
			// Device found
			(device) => {
				l3Log("Device paired");
				l3TopbarBkgLogoutHide();
				_l3AppConnectLuna3Device(device);
			},
			// Discovery aborted
			() => {
				l3ConnectPairShow();
			},
			// BLE support error
			(error) => {
				l3ConnectBleErrorShow(error);
			});
	});
	l3TopbarSetOnLogoutListener(() => {
		l3AuthClear();
		window.location.reload();
	})
	l3TopbarBkgModeShow();
	l3ConnectPairShow();
}

function _l3AppConnectLuna3Device(device) {
	l3ConnectConnectingShow();	
	// small visual delay
	setTimeout(() => {
		l3BleConnect(device,
			// Device connected (L3BleICM instance)
			(bleIcm) => {
				l3Log("Connected");
				l3ConnectHide();
				_l3AppConfigureLuna3Device(bleIcm);
			},
			(error) => {
				l3LogError("Failed to connect");
				l3ConnectPairShow();
			});
	}, 2000);
}

function _l3AppConfigureLuna3Device(bleIcm) {
	l3BleSetOnDisconnectListener(() => {
		l3DataStopWorker();
		l3TestScreenHide();
		_l3AppFindLuna3Device();
	});
	
	const configure = async () => {
		const point = l3PointNavGetCurrent();
		await bleIcm.setProbe(point.probeNum);
		await bleIcm.startMeasurements();
		//_l3AppRunConfigureSettings(bleIcm);

		l3BodyImgUpdateDisplay(point.pointId, false);
		l3ProbeIndicatorEnable(point.probeNum);
		l3PointInfoSetPointName(point.name);
	};
	
	configure()
	.then(() => {
		l3TopbarSetOnShowListener(() => {
			_l3AppRunTesting(bleIcm);
		});
		l3TopbarActiveModeShow();
		// comment back in
		_l3AppRunConfigureSettings(bleIcm);
		})
	.catch((error) => {
		console.error(error);
		console.error("ICM disconnected during configure");
		bleIcm.disconnect();
	})
}

function _l3AppRunTesting(bleIcm) {
	l3PointNavSetOnPointListener((point, onFinished) => {		
		bleIcm.setProbe(point.probeNum)
		.then(() => {
			l3BodyImgUpdateDisplay(point.pointId, false);
			l3ProbeIndicatorEnable(point.probeNum);
			l3PointInfoSetPointName(point.name);
			onFinished();
		})
		.catch((error) => {
			bleIcm.disconnect();
			onFinished();
		})
	});
	l3NavControlsSetNavButtonListener((navButton, onFinished) => {
		switch (navButton)
		{
		case l3NavButton.First:
			l3PointNavFirst(onFinished);
			break;
		case l3NavButton.Back:
			l3PointNavBackWrap(onFinished);
			break;
		case l3NavButton.Next:
			l3PointNavNextWrap(onFinished);
			break;
		case l3NavButton.Last:
			l3PointNavLast(onFinished);
			break;
		}
	});
	l3GraphSetOnCompleteListener(() => {
		if (l3AutoAdvIsChecked()) {
			l3PointNavNextWrap(() => {				
			});
		}
	});
	
	l3DataSetOnDataListener((data) => {
		l3GraphData(data);
	});	
	l3DataStartWorker();
	
	l3BleSetDataListener((dataView) => {
		l3DataProcessDataView(dataView);
	});
	l3GraphClear();
	l3TestScreenShow();
}

		// comment back in


// function _l3AppRunConfigureSettings(bleIcm){
// 	// var readButton = document.getElementById("submit-read-btn");
// 	// var writeButton = document.getElementById("submit-write-btn")
// 	var button = document.getElementById("submit-button")

// 	function myFunction(){
// 		console.log("function works on click");
// 		// console.log(l3SubmitSettingsButton());
// 		// bleIcm.writeRegister(l3SubmitSettingsButton());
// 		// bleIcm.readRegister(l3SubmitSettingsButton());

// 		bleIcm.readAndWriteToRegisters(l3SubmitSettingsButton());
// 	}
// 		button.addEventListener("click", myFunction);

// }

// 	function readReg(){
// 		console.log("function works on click");
// 		// console.log(l3SubmitSettingsButton());
// 		bleIcm.writeRegister(l3SubmitSettingsButton());
// 		bleIcm.readRegister(l3SubmitSettingsButton());

// 		// bleIcm.readAndWriteToRegisters(l3SubmitSettingsButton());
// 	}
// 	// Add an event listener to wait for the button click event
// 	writeButton.addEventListener("click", writeReg);
// 	readButton.addEventListener("click", readReg);
// }
// function _l3AppRunConfigureSettings(bleIcm){
// 	var readButton = document.getElementById("submit-read-btn");
// 	var writeButton = document.getElementById("submit-write-btn")
// 	function writeReg(event){
// 		console.log("Write register works on click");
//         bleIcm.writeRegister(l3SubmitWriteRegisterBtn());

//         event.preventDefault();
// 		// bleIcm.writeRegister(l3SubmitWriteRegisterBtn());
// 	}

// 	function readReg(event){
// 		console.log("Read register works on click");
//         event.preventDefault();
// 		bleIcm.readRegister(l3SubmitReadRegisterBtn());
// 	}
// 	// Add an event listener to wait for the button click event
// 	writeButton.addEventListener("click", writeReg);
// 	readButton.addEventListener("click", readReg);
// }






function l3AppRun() {
	_l3AppInit();
	_l3AppCheckBleAndLogin();
}