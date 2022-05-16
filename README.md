# GoDice JavaScript API (with demo)

## Overview

Use the GoDice JavaScript API to integrate GoDice functionality into your own JavaScript applications.

Here are some of the things that you can do with the GoDice JavaScript API:

* Turn ON/OFF GoDice RGB Leds
* Ask for the die Color (dots color)
* Ask for the die battery level
* Get differernt notifications reagrding the die state (Rolling or Stable and get the outcome number)

To run the demo (that use the API) just open the index.html file in Chrome or Microsoft Edge browser



## Getting Started

1. Create a web page and include the GoDice JavaScript API file (godice.js):
    <script src="godice.js"></script>

2. In your main JavaScript file create a new instance of the GoDice class:
    goDice = new GoDice();
    
3. To open the Bluetooth connection dialog and connect to your GoDice, call the following funtion:
    goDice.requestDevice();
    
4. After successfull connection the function onDiceConnected will be called from the GoDice class
    

	
	
## API Functions    

There are few types of API calls:
1. Message - a message to the die
2. Request - a message to the die, that should follow by corresponding response.
3. Response - an event that is expected after sending the request
4. Events - a message sent by the die 

Once you followed the "Getting Started" section and you have the goDice instance ready you can call to the following class functions:

  
Message:
---------
```javascript
/**
 * Turn On/Off RGB LEDs (the LEDs will turn off if both led1 and led2 are null or set to [0,0,0])
 * @param {Array} led1 - an array to control the 1st LED in the following format '[R,G,B]'
 *                       where R,G and B are numbers in the range of 0-255
 * @param {Array} led2 - an array to control the 2nd LED in the following format '[R,G,B]'
 *                       where R,G and B are numbers in the range of 0-255
 */                          
 setLed(led1, led2);
```

Requests:
---------
```javascript
 /**
  * Open a browser connection dialog to connect a single GoDice, after successfull connection it will followed 
  * by corresponding "onDiceConnected" callback function (response) from the GoDice class (instance).
  */	
  requestDevice();
```

```javascript
 /**
  * Request for the die color, that should follow by corresponding "onDiceColor" callback function (response) 
  * from the GoDice class (instance).
  */
  getDiceColor(){
```  

```javascript
 /**
  * Request for the die battery, that should follow by corresponding "onBatteryLevel" callback function (response)
  * from the GoDice class (instance).
  */
  getBatteryLevel()
```   
   
   
Responses:   
----------
```javascript
/**
  * To recognize connected die, override the function "onDiceConnected" in the GoDice class, with the following parameter:
  * @param {string} diceID - the die unique identifier	 
  * @param {GoDice class} diceInstance - the die class instance	 
  */

// example:
  
GoDice.prototype.onDiceConnected = (diceId, diceInstance) => {  
  // die unique identifier
  let dieIdentifier = diceID;
	
  // die unique identifier
  let dieClass = diceInstance;		
};
```    
  
 ```javascript
 /**
  * To recognize the battery level, override the function "onBatteryLevel" in the GoDice class, with the following parameter:
  * @param {string} diceID - the die unique identifier	 
  * @param {string} level - the battery level of this diceID 
  */
  
  //example:
  
  GoDice.prototype.onBatteryLevel = (diceId, batteryLevel) => {
    // die unique identifier
	  let dieIdentifier = diceID;
	  
    // battery level
    let dieBatLevel = batteryLevel; 
  };
```    
  
```javascript 
 /**
  * To recognize the color of the die, override the function "onDiceColor" in the GoDice class, with the following parameter:
  * @param {string} diceID - the die unique identifier	 
  * @param {string} color - the color of the die (corresponding to the diceID). 
  * COLOR_BLACK		0
  * COLOR_RED		1
  * COLOR_GREEN		2
  * COLOR_BLUE		3
  * COLOR_YELLOW	4
  * COLOR_ORANGE	5
  */
  
  // example:
  
  GoDice.prototype.onDiceColor = (diceId, color) => {
    // die unique identifier
    let dieIdentifier = diceID;
	  
    // die color
    let dieColor = color; 
  };
```  
  
Events:
-------
```javascript
 /**
  * When the die is stable after a legit roll the function "onStable" will be called from the GoDice class with the following parameter:
  * @param {string} diceId - the die unique identifier	 
  * @param {string} value - the D6 outcome value (1-6)
  * @param {array} xyzAccRaw [x, y, z] - the acc raw data x, y, z 
  */
  
  // example:
  
  GoDice.prototype.onStable = (diceId, value, xyzAccRaw) => {
      // die unique identifier
      let dieIdentifier = diceID;
	  
      // the D6 outcome value (1-6)
      let dieValue = value;
	  
      // the acc raw values x,y,z
      let accX = xyzAccRaw[0];
      let accY = xyzAccRaw[1];
      let accZ = xyzAccRaw[2];
  };
``` 
  
  
```javascript  
 /**
  * When the die is stable (but not flat) after a legit roll the function "onTiltStable" will be called from the GoDice class with the following parameter:
  * @param {string} diceId - the die unique identifier	 
  * @param {array} xyzAccRaw [x, y, z] - the acc raw data x, y, z 
  */
  
  // example:
  
  GoDice.prototype.onTiltStable = (diceId, xyzAccRaw) => {
      // die unique identifier
      let dieIdentifier = diceID;

      // the acc raw values x,y,z
      let accX = xyzAccRaw[0];
      let accY = xyzAccRaw[1];
      let accZ = xyzAccRaw[2];
  };
```


```javascript
 /**
  * When the die is stable after a "fake" roll the function "onFakeStable" will be called from the GoDice class with the following parameter:
  * @param {string} diceId - the die unique identifier	 
  * @param {string} value - the D6 outcome value (1-6)
  * @param {array} xyzAccRaw [x, y, z] - the acc raw data x, y, z 
  */
  
  // example:
  
  GoDice.prototype.onFakeStable = (diceId, value, xyzAccRaw) => {
      // die unique identifier
      let dieIdentifier = diceID;
	  
      // the D6 outcome value (1-6)
      let dieValue = value;
	  
      // the acc raw values x,y,z
      let accX = xyzAccRaw[0];
      let accY = xyzAccRaw[1];
      let accZ = xyzAccRaw[2];
  };
```


 ```javascript 
 /**
  * When the die is stable after a small movement (rotating from one face to different face) the function "onMoveStable" will be called from the GoDice class with the   * following parameter:
  * @param {string} diceId - the die unique identifier	 
  * @param {string} value - the D6 outcome value (1-6)
  * @param {array} xyzAccRaw [x, y, z] - the acc raw data x, y, z 
  */
  
  // example:
  
  GoDice.prototype.onMoveStable = (diceId, value, xyzAccRaw) => {
      // die unique identifier
      let dieIdentifier = diceID;
	  
      // the D6 outcome value (1-6)
      let dieValue = value;
	  
      // the acc raw values x,y,z
      let accX = xyzAccRaw[0];
      let accY = xyzAccRaw[1];
      let accZ = xyzAccRaw[2];
  };
```   
