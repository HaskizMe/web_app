const l3BleStatus = {
	Ready: 0,
	NotSupported: 10,
	NotEnabled: 11
}

const s_IcmUuids = {
	DATA_SERVICE_UUID: "6e400001-b5a3-f393-e0a9-e50e24dcca9e",
	DATA_WRITE_CHAR_UUID: "6e400002-b5a3-f393-e0a9-e50e24dcca9e",
	DATA_READ_CHAR_UUID:  "6e400003-b5a3-f393-e0a9-e50e24dcca9e"
}

const s_IcmParams = {
	CONTROL_VAR_REST_TIME           : 0,
    CONTROL_VAR_PWM_RESET           : 1,
    CONTROL_VAR_PWM_START           : 2,
    CONTROL_VAR_PWM_RAMP            : 3,
    CONTROL_VAR_PWM_REST            : 4,
    CONTROL_VAR_PWM_MAX             : 5,
    CONTROL_VAR_VOLL_THRESHOLD      : 6,
    CONTROL_VAR_VOLL_RESET_THRESHOLD: 7,
    CONTROL_VAR_HOLD_TIME           : 8,
    CONTROL_VAR_FLATLINE_DIFF       : 9,
    CONTROL_VAR_FLATLINE_SIZE       : 10,
    CONTROL_VAR_FLATLINE_SKIP       : 11,	
    CONTROL_VAR_MANUAL_MODE         : 12,
    CONTROL_VAR_MANUAL_PWM          : 13,
    CONTROL_VAR_POINT_FINDING_FORCE : 14,
    CONTROL_VAR_AVG_FILTER_SIZE     : 15,
    CONTROL_VAR_MOVEMENT_TIMEOUT    : 16,
    CONTROL_VAR_GROUND_EN           : 17
}
function printValue(receivedString){
	var input = document.getElementById("reg-value");
	if(receivedString === undefined){
		return;
	}
	else{
		receivedString = receivedString.substring(2); // Remove the first two characters
		input.value = receivedString;
	}

}
let s_bleOnData;
let s_bleOnDisconnected;
let s_bleExplicitDisconnect;

function _l3BleStorePreferredDevice(id) {
	window.localStorage.setItem("preferred", id);
}

function _l3BleGetPreferredDevice(id) {
	return window.localStorage.getItem("preferred");
}

async function _l3BleConnectAsync(device) {
	s_bleExplicitDisconnect = false;
	device.addEventListener('gattserverdisconnected', () => {
		if (s_bleExplicitDisconnect)
			return;
		if (s_bleOnDisconnected !== undefined)
			s_bleOnDisconnected();
	});
	
	const server = await device.gatt.connect();
	const services = await server.getPrimaryServices();
	
	let dataService;
	if (!services.find((service) => {
		if (service.uuid != s_IcmUuids.DATA_SERVICE_UUID)
			return false;
		dataService = service;
		return true;
	}))
	{
		throw new Error("Failed to find data service");
	}
	
	const characteristics = await dataService.getCharacteristics();
	
	let writeChar;	
	if (!characteristics.find(characteristic => {
		if (characteristic.uuid != s_IcmUuids.DATA_WRITE_CHAR_UUID)
			return false;
		writeChar = characteristic;
		return true;			
	}))
	{
		throw new Error("Failed to find write characteristic");
	}
	
	let readChar;
	if (!characteristics.find(characteristic => {
		if (characteristic.uuid != s_IcmUuids.DATA_READ_CHAR_UUID)
			return false;
		readChar = characteristic;
		return true;			
	}))
	{
		throw new Error("Failed to find read characteristic");
	}
	
	const onDataNotification = (event) => {
		if (s_bleOnData !== undefined)
			s_bleOnData(event.target.value);

			const value = event.target.value;
			const stringValue = new TextDecoder().decode(value);
			printValue(stringValue);


	};
	
	await readChar.startNotifications()
	.then((c) => {
		c.addEventListener('characteristicvaluechanged', onDataNotification)
	});
	
	_l3BleStorePreferredDevice(device.id);
	
	const instance = {
		device: device,
		writeChar: writeChar,
	};
	return instance;
}

function l3BleCheckStatus(onSuccess, onFailure) {
	if (navigator.bluetooth == null)
		onFailure(l3BleStatus.NotSupported)
	else
	{
		navigator.bluetooth.getAvailability()
		.then(available => {
			if (available)
				onSuccess();
			else
				onFailure(l3BleStatus.NotEnabled);
		})
	}
}

function l3BleDiscover(onFound, onAborted, onFailure) {
	if (navigator.bluetooth == null) {
		onFailure(l3BleStatus.NotSupported);
		return;
	}
	
	const findDevice = () => {
		navigator.bluetooth.requestDevice({
		filters: [
			{ services: [s_IcmUuids.DATA_SERVICE_UUID]},
			{ namePrefix: 'vine'},
			{ namePrefix: 'Luna3'}
			]
		})
		.then((icmDevice) => {
			onFound(icmDevice);
		})
		.catch((error) => {
			onAborted();
		});
	};
	
	navigator.bluetooth.getAvailability()
	.then(available => {
		if (available)
			findDevice();
		else
			onFailure(l3BleStatus.NotEnabled);
	})
}

function l3BleSetDataListener(onData) {
	s_bleOnData = onData;
}

function l3BleSetOnDisconnectListener(onDisconnect) {
	s_bleOnDisconnected = onDisconnect;
}

function l3BleConnect(device, onConnected, onFailure) {
	_l3BleConnectAsync(device)
	.then((instance) =>{
		const bleIcm = new L3BleICM(instance);
		onConnected(bleIcm);
	})
	.catch((error) => {
		if (device.gatt.connected) {
			s_bleExplicitDisconnect = true;
			device.gatt.disconnect();
		}
		console.error(error);
		onFailure(error);
	});
}

class L3BleICM {
	constructor(instance) {
		this.device = instance.device;
		this.writeChar = instance.writeChar;
		this.textEncoder = new TextEncoder('utf-8');
	}
	
	async startMeasurements() {
		await this.writeChar.writeValue(this.textEncoder.encode('P 0 750 '));
		await this.writeChar.writeValue(this.textEncoder.encode('P 2 525 '));
		await this.writeChar.writeValue(this.textEncoder.encode('P 4 540 '));
		await this.writeChar.writeValue(this.textEncoder.encode('P 8 2000 '));
		await this.writeChar.writeValue(this.textEncoder.encode('R '));
	}
	
	async setProbe(probeNum) {
		let groundBits;
		switch (probeNum)
		{
		case 1:
			groundBits = 0x1;
			break;
		case 2:
			groundBits = 0x2;
			break;
		case 3:
			groundBits = 0x4;
			break;
		case 4:
			groundBits = 0x8;
			break;
		}
		if (groundBits === undefined)
			return;
		const value = 'P ' + s_IcmParams.CONTROL_VAR_GROUND_EN + ' ' + groundBits + ' ';
		console.log(value);
		await this.writeChar.writeValue(this.textEncoder.encode(value));
	}

	async writeRegister(writeValues){
		if(writeValues === undefined){
			console.log("error")
		}
		else if(writeValues !== undefined){
			await this.writeChar.writeValue(this.textEncoder.encode(writeValues));
		}
	}

	async readRegister(readValues){
		if(readValues === undefined){
			console.log("error")
		} 
		else if(readValues !== undefined){
			await this.writeChar.writeValue(this.textEncoder.encode(readValues));
		}	
	}

	
	disconnect() {
		if (this.device.gatt.connected)
			this.device.gatt.disconnect();
	}
	
};



