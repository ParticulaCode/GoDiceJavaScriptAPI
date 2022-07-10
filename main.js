const connectedDice = {};

// Open the Bluetooth connection dialog for choosing a GoDice to connect
function openConnectionDialog() {
	const newDice = new GoDice();
	newDice.requestDevice();
}

/**
 * Get a new dice element or it's instance if it already exists
 * @param {string} diceID - the die unique identifier	 
 */
function getDiceHtmlEl(diceID) {
	if (!document.getElementById(diceID)) {
		const newDiceEl = document.createElement("div");
		newDiceEl.id = diceID;
		newDiceEl.className = "dice-wrapper";
		return newDiceEl;
	}
	return document.getElementById(diceID);
}

GoDice.prototype.onDiceConnected = (diceId, diceInstance) => {
	console.log("Dice connected: ", diceId);
	
	// Called when a new die is connected - create a dedicate panel for this die
	connectedDice[diceId] = diceInstance;

	// get new die element or it's instance if it's already exists
	const diceHtmlEl = getDiceHtmlEl(diceId);
	
	// clear existing die element content if it exists
	while (diceHtmlEl.firstChild) {
        	diceHtmlEl.removeChild(diceHtmlEl.lastChild);
	}

	// get die host from html, where we will put our connected dices
	const diceHost = document.getElementById("dice-host");

	// add name to die element
	const diceName = document.createElement('div');
	diceName.className = 'dice-name';
	diceName.textContent = `Dice ID: ${diceId}`;
	diceHtmlEl.append(diceName)

	// add battery level button goDice.getBatteryLevel(diceID);
	const batteryLevelButton = document.createElement('button');
	batteryLevelButton.className = 'btn btn-outline-primary';
	batteryLevelButton.onclick = diceInstance.getBatteryLevel.bind(diceInstance);
	batteryLevelButton.textContent = 'Get Battery Level';
	diceHtmlEl.append(batteryLevelButton)

	// add battery level indicator
	const batteryIndicator = document.createElement('div');
	batteryIndicator.id = `${diceId}-battery-indicator`;
	diceHtmlEl.append(batteryIndicator)

	// set RGB color for the Led (e.g. blue)
	const colorProfile = [[0, 0, 255], [0, 0, 255]];

	// add "Led On" button to use goDice.switchOnLed(diceID,colorProfile) function
	const ledOnButton = document.createElement('button');
	ledOnButton.className = 'btn btn-outline-primary';
	ledOnButton.onclick = diceInstance.setLed.bind(diceInstance, colorProfile[0], colorProfile[1])
	ledOnButton.textContent = 'Switch On Led';
	diceHtmlEl.append(ledOnButton)

	// add "Led Off" button to use goDice.switchOffLed(diceID) function
	const ledOffButton = document.createElement('button');
	ledOffButton.className = 'btn btn-outline-primary';
	ledOffButton.onclick = diceInstance.setLed.bind(diceInstance, [0], [0])
	ledOffButton.textContent = 'Switch Off Led';
	diceHtmlEl.append(ledOffButton)

	// get Dice color to use goDice.getDiceColor(diceID) function
	const getDiceColorButton = document.createElement('button');
	getDiceColorButton.className = 'btn btn-outline-primary';
	getDiceColorButton.onclick = diceInstance.getDiceColor.bind(diceInstance)
	getDiceColorButton.textContent = 'Get Dice Color';
	diceHtmlEl.append(getDiceColorButton)
	
	// Change die type buttons select
	const d6Button = document.createElement('button');
	d6Button.className = 'diebtn btn-outline-primary';
	d6Button.onclick = diceInstance.setDieType.bind(diceInstance, GoDice.diceTypes.D6)
	d6Button.textContent = 'D6';
	diceHtmlEl.append(d6Button)
	
	// D20 Shell
	const d20Button = document.createElement('button');
	d20Button.className = 'diebtn btn-outline-primary';
	d20Button.onclick = diceInstance.setDieType.bind(diceInstance, GoDice.diceTypes.D20)
	d20Button.textContent = 'D20';
	diceHtmlEl.append(d20Button)
	
	const d10Button = document.createElement('button');
	d10Button.className = 'diebtn btn-outline-primary';
	d10Button.onclick = diceInstance.setDieType.bind(diceInstance, GoDice.diceTypes.D10)
	d10Button.textContent = 'D10';
	diceHtmlEl.append(d10Button)
	
	const d10XButton = document.createElement('button');
	d10XButton.className = 'diebtn btn-outline-primary';
	d10XButton.onclick = diceInstance.setDieType.bind(diceInstance, GoDice.diceTypes.D10X)
	d10XButton.textContent = 'D10X';
	diceHtmlEl.append(d10XButton)
	
	// D24 Shell
	const d4Button = document.createElement('button');
	d4Button.className = 'diebtn btn-outline-primary';
	d4Button.onclick = diceInstance.setDieType.bind(diceInstance, GoDice.diceTypes.D4)
	d4Button.textContent = 'D4';
	diceHtmlEl.append(d4Button)
	
	const d8Button = document.createElement('button');
	d8Button.className = 'diebtn btn-outline-primary';
	d8Button.onclick = diceInstance.setDieType.bind(diceInstance, GoDice.diceTypes.D8)
	d8Button.textContent = 'D8';
	diceHtmlEl.append(d8Button)
	
	const d12Button = document.createElement('button');
	d12Button.className = 'diebtn btn-outline-primary';
	d12Button.onclick = diceInstance.setDieType.bind(diceInstance, GoDice.diceTypes.D12)
	d12Button.textContent = 'D12';
	diceHtmlEl.append(d12Button)
	

	// add battery level indicator
	const colorIndicator = document.createElement('div');
	colorIndicator.id = `${diceId}-color-indicator`;
	diceHtmlEl.append(colorIndicator)

	// add die status indicator
	const dieStatus = document.createElement('div');
	dieStatus.id = `${diceId}-die-status`;
	diceHtmlEl.append(dieStatus)

	// inject dice into html
	diceHost.appendChild(diceHtmlEl);
};


GoDice.prototype.onRollStart = (diceId) => {
	console.log("Roll Start: ", diceId);

	// get rolling indicator
	const diceIndicatorEl = document.getElementById(diceId + "-die-status");

	// show rolling 
	diceIndicatorEl.textContent = "Rollling....";
};

GoDice.prototype.onStable = (diceId, value, xyzArray) => {
	console.log("Stable event: ", diceId, value);

	// Get roll value indicator and show stable value
	const diceIndicatorEl = document.getElementById(diceId + "-die-status");
	diceIndicatorEl.textContent = "Stable: " + value;
};

GoDice.prototype.onTiltStable = (diceId, xyzArray, value) => {
	console.log("TiltStable: ", diceId, xyzArray);

	// Get tile indicator and show raw data
	const diceIndicatorEl = document.getElementById(diceId + "-die-status");
	diceIndicatorEl.textContent = "Tilt Stable: value: " + value + " , x=" + xyzArray[0] + " ,y=" + xyzArray[1] + " ,z=" + xyzArray[2];
};

GoDice.prototype.onFakeStable = (diceId, value, xyzArray) => {
	console.log("FakeStable: ", diceId, value);

	// Get tile indicator and show fake value
	const diceIndicatorEl = document.getElementById(diceId + "-die-status");
	diceIndicatorEl.textContent = "Fake Stable: " + value;
};

GoDice.prototype.onMoveStable = (diceId, value, xyzArray) => {
	console.log("MoveStable: ", diceId, value);

	// Get tile indicator and show fake value
	const diceIndicatorEl = document.getElementById(diceId + "-die-status");
	diceIndicatorEl.textContent = "Move Stable: " + value;
};

GoDice.prototype.onBatteryLevel = (diceId, batteryLevel) => {
	console.log("BetteryLevel: ", diceId, batteryLevel);

	// get dice battery indicator element
	const batteryLevelEl = document.getElementById(diceId + "-battery-indicator");

	// put battery level value into battery indicator html element
	batteryLevelEl.textContent = batteryLevel;
};

GoDice.prototype.onDiceColor = (diceId, color) => {
	console.log("DiceColor: ", diceId, color);

	// get dice color indicator element
	const diceColorEl = document.getElementById(diceId + "-color-indicator");

	// put dice color value into battery indicator html element
	diceColorEl.textContent = "Color: " + color;
};
