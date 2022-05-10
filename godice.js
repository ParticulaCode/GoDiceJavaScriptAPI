
/**
 * @class
 * The main GoDice class that can be used to connect a new die, send and recieve messages.
 */
class GoDice {

	messageIdentifiers = {
		BATTERY_LEVEL: 3,
		DICE_COLOUR: 23,
		SET_LED: 8,
	}
	
	diceColour = {
		BLACK: 0,
		RED: 1,
		GREEN: 2,
		BLUE: 3,
		YELLOW: 4,
		ORANGE: 5,
	}

	bluetoothDevice;
	GoDiceService;
	CubeCharacteristics;
	GlobalDeviceId;
	diceId;
	rolledValue = 0;

	onRollStart(){};
	onBatteryLevel(){};
	onDiceColor(){};
	onStable(){};
	onFakeStable(){};
	onTiltStable(){};
	onMoveStable(){};
	onDiceConnected(){};

	/******* API functions *******/

	/**
	 * Request for the die battery, that should follow by corresponding "BatteryLevel" event (response).
	 */
	getBatteryLevel() {
		console.log(this)
		this.sendMessage([this.messageIdentifiers.BATTERY_LEVEL]);
	}

	/**
	 * Request for the die color, that should follow by corresponding "DiceColor" event (response).
	 */
	getDiceColor() {
		console.log(this)
		this.sendMessage([this.messageIdentifiers.DICE_COLOUR]);
	}

	/**
	 * Open a connection dialog to connect a single GoDice, after successfull connection it will follow by corresponding "DiceConnected" event (response).
	 */
	requestDevice() {
		return navigator.bluetooth.requestDevice({
			filters: [{ namePrefix: 'GoDice_' }],
			optionalServices: ['6e400001-b5a3-f393-e0a9-e50e24dcca9e']
		})
			.then(device => {				
				this.GlobalDeviceId = device.id.toString();				
				this.bluetoothDevice = device;				
				this.bluetoothDevice.addEventListener('gattserverdisconnected', this.onDisconnected);				
				this.connectDeviceAndCacheCharacteristics();				
			});
	}

	/**
	 * Turn On/Off RGB LEDs, will turn off if led1 and led2 are null
	 * @param {Array} led1 - an array to control the 1st LED in the following format '[R,G,B]'
	 *                                where R,G and B are numbers in the range of 0-255
	 * @param {Array} led2 - an array to control the 2nd LED in the following format '[R,G,B]'
	 *                                where R,G and B are numbers in the range of 0-255
	 */
	setLed(led1, led2) {
		console.log(led1, led2)
		let adjustedLed1 = (!led1) ? [0, 0, 0] : led1;
		let adjustedLed2 = (!led2) ? [0, 0, 0] : led2;
		adjustedLed1 = adjustedLed1.map((i) => Math.max(Math.min(i, 255), 0));
		adjustedLed2 = adjustedLed2.map((i) => Math.max(Math.min(i, 255), 0));
		if (adjustedLed1.length === 1) adjustedLed1.push(adjustedLed1[0], adjustedLed1[0]);
		if (adjustedLed2.length === 1) adjustedLed2.push(adjustedLed2[0], adjustedLed2[0]);

		const messageArray = [this.messageIdentifiers.SET_LED, ...adjustedLed1, ...adjustedLed2];
		console.debug("messageArray", messageArray);
		this.sendMessage(messageArray);
	}

	/******* Internal Helper Functions *******/

	// Send generic message to the die
	sendMessage(messageArray) {
		if (!this.GoDiceService) {
			return Promise.reject(new Error('No Cube characteristic selected yet.'));
		}
		return this.GoDiceService.getCharacteristic('6e400002-b5a3-f393-e0a9-e50e24dcca9e')
			.then(controlPoint => {
				console.debug("messageArray", messageArray);
				const byteMessage = new Uint8Array(messageArray);
				return controlPoint.writeValue(byteMessage).then(response => {
					console.debug("after write response", response);
				});
			});
	}

	// Change angles to fixed value
	getAngleValue(val) {
		if (val <= 20 && val >= 0) {
			return "255";
		}
		if (val <= 255 && val >= 230) {
			return "255";
		}
		if (val <= 85 && val >= 40) {
			return "64";
		}
		if (val <= 215 && val >= 185) {
			return "192";
		}

	}

	getXyzFromBytes(data, startByte) {
		const x = data.getUint8(startByte);
		const y = data.getUint8(startByte + 1);
		const z = data.getUint8(startByte + 2);
		return [x, y, z]
	}

	// Get D6 number from acc raw data
	getD6Value(data, startByte) {
		const xyzArray = this.getXyzFromBytes(data, startByte)
		const coord = `${this.getAngleValue(xyzArray[0])}-${this.getAngleValue(xyzArray[1])}-${this.getAngleValue(xyzArray[2])}`;
		switch (coord) {
			case ("192-255-255"):
				return 1;
			case ("255-255-64"):
				return 2;
			case ("255-64-255"):
				return 3;
			case ("255-192-255"):
				return 4;
			case ("255-255-192"):
				return 5;
			case ("64-255-255"):
				return 6;

			default:
				//сonsole.log("no hit coord",coord);
				return "";
		}
	}

	// Get a message fromn the die and fire the matchig event
	parseMessage(data, deviceId) {
		try {
			console.debug("data: ", data);
			console.debug("deviceId: ", deviceId);
			const firstByte = data.getUint8(0);
			if (firstByte === 82) {
				this.onRollStart(deviceId);
				return;
			}

			const secondByte = data.getUint8(1);
			const thirdByte = data.getUint8(2);

			if (firstByte === 66 && secondByte === 97 && thirdByte === 116) {
				this.onBatteryLevel(deviceId, data.getUint8(3));
			}

			if (firstByte === 67 && secondByte === 111 && thirdByte === 108) {
				this.onDiceColor(deviceId, data.getUint8(3));
			}

			if (firstByte === 83) {
				const diceCurrentNumber = this.getD6Value(data, 1);
				const xyzArray = this.getXyzFromBytes(data, 1)
				this.rolledValue = diceCurrentNumber;
				if (parseInt(diceCurrentNumber) > 0) {
					this.onStable(deviceId, diceCurrentNumber, xyzArray);
				}
			}

			if (firstByte === 70 && secondByte === 83) {
				const diceCurrentNumber = this.getD6Value(data, 2);
				const xyzArray = this.getXyzFromBytes(data, 2)
				this.rolledValue = diceCurrentNumber;
				this.onFakeStable(deviceId, diceCurrentNumber, xyzArray);
			}

			if (firstByte === 84 && secondByte === 83) {
				const xyzArray = this.getXyzFromBytes(data, 2)
				this.onTiltStable(deviceId, xyzArray);
			}

			if (firstByte === 77 && secondByte === 83) {
				const diceCurrentNumber = this.getD6Value(data, 2);
				const xyzArray = this.getXyzFromBytes(data, 2)
				this.rolledValue = diceCurrentNumber;
				this.onMoveStable(deviceId, diceCurrentNumber, xyzArray);
			}

		}
		catch (err) {
			console.error("err", err);
		}
	}

	/******** Bluetooth Low Energy (BLE) implementation ********/
	handleNotificationChanged(event) {
		this.parseMessage(event.target.value, event.target.service.device.id.toString());
	}

	handleNotificationChanged = this.handleNotificationChanged.bind(this);

	connectDeviceAndCacheCharacteristics() {
		console.debug('Connecting to GATT Server...');
		return this.bluetoothDevice.gatt.connect()
			.then(server => {
				return server.getPrimaryService("6e400001-b5a3-f393-e0a9-e50e24dcca9e");
			})
			.then(service => {
				this.GoDiceService = service;
				return service.getCharacteristic("6e400003-b5a3-f393-e0a9-e50e24dcca9e");
			})
			.then(characteristic => {
				this.CubeCharacteristics = characteristic;
				this.CubeCharacteristics.addEventListener('characteristicvaluechanged', this.handleNotificationChanged);
				return characteristic.getDescriptors();
			})
			.then(descriptors => {
				this.onStartNotificationsButtonClick();
			})
	}


	onStartNotificationsButtonClick() {
		console.debug('Starting Notifications...');
		this.CubeCharacteristics.startNotifications()
			.then(_ => {
				console.debug('onDiceConnected');
				this.onDiceConnected(this.GlobalDeviceId, this);
			})
			.catch(error => {
				console.error('Argh! ' + error);
			});
	}

	onDisconnectButtonClick() {
		if (this.CubeCharacteristics) {
			this.CubeCharacteristics.removeEventListener('characteristicvaluechanged', this.handleNotificationChanged.bind(this));
			this.CubeCharacteristics = null;
		}
		if (this.bluetoothDevice === null)
			return;

		if (this.bluetoothDevice.gatt.connected)
			this.bluetoothDevice.gatt.disconnect();
		else {
			console.debug('> Bluetooth Device is already disconnected');
		}

		// Note that it doesn't disconnect device.
		this.bluetoothDevice = null;
	}

	onDisconnected(event) {
		console.debug('> Bluetooth Device disconnected:' + event);
	}
}