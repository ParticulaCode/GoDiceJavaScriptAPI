
/**
 * @class
 * The main GoDice class that can be used to connect a new die, send and recieve messages.
 */
class GoDice {

	messageIdentifiers = {
		BATTERY_LEVEL: 3,
		DICE_COLOUR: 23,
		SET_LED: 8,
		SET_LED_TOGGLE: 16,
	}
	
	diceColour = {
		BLACK: 0,
		RED: 1,
		GREEN: 2,
		BLUE: 3,
		YELLOW: 4,
		ORANGE: 5,
	}
	
	static diceTypes = {
		D6: 0,
		D20: 1,
		D10: 2,
		D10X: 3,
		D4: 4,
		D8: 5,
		D12: 6,
	}
	
	// The vectors for each die and shell type, used to check which side is facing up
	static d6Vectors = {
		1: [-64, 0, 0],
		2: [0, 0, 64],
		3: [0, 64, 0],
		4: [0, -64, 0],
		5: [0, 0, -64],
		6: [64, 0, 0],
	}
	
	static d20Vectors = {
		1: [-64, 0, -22],
		2: [42, -42, 40],
		3: [0, 22, -64],
		4: [0, 22, 64],
		5: [-42, -42, 42],
		6: [22, 64, 0],
		7: [-42, -42, -42],
		8: [64, 0, -22],
		9: [-22, 64, 0],
		10: [42, -42, -42],
		11: [-42, 42, 42],
		12: [22, -64, 0],
		13: [-64, 0, 22],
		14: [42, 42, 42],
		15: [-22, -64, 0],
		16: [42, 42, -42],
		17: [0, -22, -64],
		18: [0, -22, 64],
		19: [-42, 42, -42],
		20: [64, 0, 22],
	}
	
	static d24Vectors = {
		1: [20, -60, -20],
		2: [20, 0, 60],
		3: [-40, -40, 40],
		4: [-60, 0, 20],
		5: [40, 20, 40],
		6: [-20, -60, -20],
		7: [20, 60, 20],
		8: [-40, 20, -40],
		9: [-40, 40, 40],
		10: [-20, 0, 60],
		11: [-20, -60, 20],
		12: [60, 0, 20],
		13: [-60, 0, -20],
		14: [20, 60, -20],
		15: [20, 0, -60],
		16: [40, -20, -40],
		17: [-20, 60, -20],
		18: [-40, -40, -40],
		19: [40, -20, 40],
		20: [20, -60, 20],
		21: [60, 0, -20],
		22: [40, 20, -40],
		23: [-20, 0, -60],
		24: [-20, 60, 20],
	}
	
	// Transforms from each shell type to according number on shell
	// D20 Transforms
	static d10Transform = {
		1: 8,
		2: 2,
		3: 6,
		4: 1,
		5: 4,
		6: 3,
		7: 9,
		8: 0,
		9: 7,
		10: 5,
		11: 5,
		12: 7,
		13: 0,
		14: 9,
		15: 3,
		16: 4,
		17: 1,
		18: 6,
		19: 2,
		20: 8,
	}
	
	static d10XTransform = {
		1: 80,
		2: 20,
		3: 60,
		4: 10,
		5: 40,
		6: 30,
		7: 90,
		8: 0,
		9: 70,
		10: 50,
		11: 50,
		12: 70,
		13: 0,
		14: 90,
		15: 30,
		16: 40,
		17: 10,
		18: 60,
		19: 20,
		20: 80,
	}
	
	// D24 Transforms
	static d4Transform = {
		1: 3,
		2: 1,
		3: 4,
		4: 1,
		5: 4,
		6: 4,
		7: 1,
		8: 4,
		9: 2,
		10: 3,
		11: 1,
		12: 1,
		13: 1,
		14: 4,
		15: 2,
		16: 3,
		17: 3,
		18: 2,
		19: 2,
		20: 2,
		21: 4,
		22: 1,
		23: 3,
		24: 2,
	}
	
	static d8Transform = {
		1: 3,
		2: 3,
		3: 6,
		4: 1,
		5: 2,
		6: 8,
		7: 1,
		8: 1,
		9: 4,
		10: 7,
		11: 5,
		12: 5,
		13: 4,
		14: 4,
		15: 2,
		16: 5,
		17: 7,
		18: 7,
		19: 8,
		20: 2,
		21: 8,
		22: 3,
		23: 6,
		24: 6,
	}
	
	static d12Transform = {
		1: 1,
		2: 2,
		3: 3,
		4: 4,
		5: 5,
		6: 6,
		7: 7,
		8: 8,
		9: 9,
		10: 10,
		11: 11,
		12: 12,
		13: 1,
		14: 2,
		15: 3,
		16: 4,
		17: 5,
		18: 6,
		19: 7,
		20: 8,
		21: 9,
		22: 10,
		23: 11,
		24: 12,
	}
	
	bluetoothDevice;
	GoDiceService;
	CubeCharacteristics;
	GlobalDeviceId;
	diceId;
	rolledValue = 0;
	dieType = GoDice.diceTypes.D6; // Type of die

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
	
	setDieType(newDieType) {
		this.dieType = newDieType
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
	 * @param {Array} led1 - an array to control the 1st LED in the following format '[R, G, B]'
	 *                       where R,G and B are numbers in the range of 0-255
	 *
	 * @param {Array} led2 - an array to control the 2nd LED in the following format '[R, G, B]'
	 *                       where R,G and B are numbers in the ran	ge of 0-255
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
	
	/**
	 * Pulses LEDs for set time and color
	 * @param {number} pulseCount - an integer of how many times the pulse will repeat (max 255)
	 * @param {number} onTime 	- how much time should the LED be ON each pulse (units of 10ms, max 255) 
	 * @param {number} offTime 	- how much time should the LED be OFF each pulse (units of 10ms, max 255)
	 * @param {Array}  RGB  - an array to control both LEDs color's in the following format '[R, G, B]' 
	 * 						 where R, G and B are number in the range of 0-255
	 */
	pulseLed(pulseCount, onTime, offTime, RGB) {
		if (RGB.length === 3) {
			let rgbColor = RGB.map((i) => Math.max(Math.min(i, 255), 0));
			const messageArray = [this.messageIdentifiers.SET_LED_TOGGLE, pulseCount, onTime, offTime, ...rgbColor, 1, 0]
			this.sendMessage(messageArray);
		}
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
	
	/**
	* Calculates the closest vector from the table to the given coord
	* @param {dictionary} DieTable - Vector table of current shell
	* @param {dictionary} coord - Vector of die
	*
	**/
	getClosestVector(DieTable, coord) {
		
		const coordX = coord[0]
		const coordY = coord[1]
		const coordZ = coord[2]
				
		var minDistance = Number.MAX_SAFE_INTEGER
		var value = 0
		var vector = []
		var XResult = 0
		var YResult = 0
		var ZResult = 0
		var curDist = 0
		
		// Calculating distance to each value in vector array
		for (let dieValue in DieTable) 
		{	
			vector = DieTable[dieValue]
			
			XResult = coordX - vector[0]
			YResult = coordY - vector[1]
			ZResult = coordZ - vector[2]
			
			// Calculating squared magnitude (since it's only for comparing there's no need for sqrt)
			curDist = ((XResult ** 2) + (YResult ** 2) + (ZResult ** 2))
			
			if (curDist < minDistance) {
				minDistance = curDist
				value = dieValue
			}
			
		}
		return value
	}
	
	// Gets the xyz coord from sent message
	getXyzFromBytes(data, startByte) {
		const x = data.getInt8(startByte);
		const y = data.getInt8(startByte + 1);
		const z = data.getInt8(startByte + 2);
		return [x, y, z]
	}

	// Get Die number from acc raw data according to die type
	getDieValue(data, startByte) {
		
		const xyzArray = this.getXyzFromBytes(data, startByte)
		var value = 0;
		
		// Calculating closest vector according to current die type
		if (this.dieType == GoDice.diceTypes.D6){
			value = this.getClosestVector(GoDice.d6Vectors, xyzArray)
		}
		else if (this.dieType >= GoDice.diceTypes.D20 && this.dieType <= GoDice.diceTypes.D10X) {
			// D20 shell type
			value = this.getClosestVector(GoDice.d20Vectors, xyzArray)
			
			switch (this.dieType) {
				case (GoDice.diceTypes.D10):
					value = GoDice.d10Transform[value]
					break
				case (GoDice.diceTypes.D10X):
					value = GoDice.d10XTransform[value]
					break
			}
		}
		else if (this.dieType >= GoDice.diceTypes.D4 && this.dieType <= GoDice.diceTypes.D12){
			value = this.getClosestVector(GoDice.d24Vectors, xyzArray)
			
			// D24 shell type
			switch (this.dieType) {
				case (GoDice.diceTypes.D4):
					value = GoDice.d4Transform[value]
					break
				case (GoDice.diceTypes.D8):
					value = GoDice.d8Transform[value]
					break
				case (GoDice.diceTypes.D12):
					value = GoDice.d12Transform[value]
					break
			}
		}
		return value

	}
	
	getD20Value (data, startByte) {
		const xyzArray = this.getXyzFromBytes(data, startByte)
		return this.getClosestVector(this.d20Vectors, xyzArray)
	}
	
	getD24Value (data, startByte) {
		const xyzArray = this.getXyzFromBytes(data, startByte)
		return this.getClosestVector(this.d24Vectors, xyzArray)
	}
	
	// Get a message fromn the die and fire the matching event
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
				const diceCurrentNumber = this.getDieValue(data, 1);
				const xyzArray = this.getXyzFromBytes(data, 1)
				this.rolledValue = diceCurrentNumber;
				this.onStable(deviceId, diceCurrentNumber, xyzArray);
			}

			if (firstByte === 70 && secondByte === 83) {
				const diceCurrentNumber = this.getDieValue(data, 2);
				const xyzArray = this.getXyzFromBytes(data, 2)
				this.rolledValue = diceCurrentNumber;
				this.onFakeStable(deviceId, diceCurrentNumber, xyzArray);
			}

			if (firstByte === 84 && secondByte === 83) {
				const diceCurrentNumber = this.getDieValue(data, 2);
				const xyzArray = this.getXyzFromBytes(data, 2)
				this.rolledValue = diceCurrentNumber;
				this.onTiltStable(deviceId, xyzArray, diceCurrentNumber);
			}

			if (firstByte === 77 && secondByte === 83) {
				const diceCurrentNumber = this.getDieValue(data, 2);
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
