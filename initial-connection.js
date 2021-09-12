/* BitArray PRIVATE STATIC CONSTANTS */
BitArray._ON = 1;
BitArray._OFF = 0;

function BitArray(size, bits) {
    // array of bits
    this.m_bits = new Array();
    if (bits && bits.length) {
        for (var i = 0; i < bits.length; i++) {
            this.m_bits.push(bits[i] ? BitArray._ON : BitArray._OFF);
        }
    } else if (!isNaN(bits)) {
        this.m_bits = BitArray.shred(bits).m_bits;
    }
    if (size && this.m_bits.length != size) {
        if (this.m_bits / length < size) {
            for (var i = this.m_bits.length; i < size; i++) {
                this.m_bits.push(BitArray._OFF);
            }
        } else {
            for (var i = size; 1 > this.m_bits.length; i--) {
                this.m_bits.pop();
            }
        }
    }
    return this.m_bits;
}

// Convert a number into a bit array
// BitArray.shred = function(number) {
//     var bits = new Array();
//     var q = number;
//     do {
//         bits.push(q % 2);
//         q = Math.floor(q / 2);
//     } while (q > 0);
//     return new BitArray(bits.length, bits.reverse());
// };

BitArray.shredWithSize = function(number, size) {
    var bits = new Array();
    var q = number;
    do {
        bits.push(q % 2);
        q = Math.floor(q / 2);
    } while (q > 0);

    while (bits.length < size) {
        bits.push(0);
    }
    // not going to reverse so the bit0 will be at position 0
    return new BitArray(bits.length, bits);
};

function saveSettings() {
    // we need to put all the settings back into the bytes
    var sendingArray = new Uint8Array(20);
    for (var i = 0; i < 20; i++) {
        sendingArray[i] = 0;
    }

    var firstByte = 0;
    firstByte += (leftHanded);
    var vibrationOff = !vibration;
    firstByte += (vibrationOff * 2);
    firstByte += (mouseOnly * 4);
    firstByte += (voiceOver * 8);
    firstByte += (autoCorrection * 16);
    firstByte += (scrollDirectionFlip * 32);
    firstByte += (keyboardOnly * 64);
    firstByte += (standbyModeEnabled * 128);
    // console.log("whole First byte is: " + firstByte);
    sendingArray[0] = firstByte;

    var secondByte = 0;
    secondByte += mouseSensitivity;
    secondByte += (scrollSensitivity * 16);
    // console.log("whole second byte is " + secondByte);
    sendingArray[1] = secondByte;

    var thirdByte = 0;
    thirdByte += doubleTapTimeout;
    var airMouseOff = !airMouse;
    thirdByte += (airMouseOff * 16);
    var airMouseMediaOff = !airMouseMedia;
    thirdByte += (airMouseMediaOff * 32);
    var airMouseTvOff = !airMouseTv;
    thirdByte += (airMouseTvOff * 64);
    // console.log("whole third byte is " + thirdByte);
    sendingArray[2] = thirdByte;

    var fourthByte = 0;
    fourthByte += sleepAfterValue;
    fourthByte += (developerMode * 64);
    // console.log("whole fourth byte is " + fourthByte);
    sendingArray[3] = fourthByte;

    // console.log("array here is " + sendingArray);

    // console.log('> Characteristic UUID:  ' + savedSettingsCharacteristic.uuid);

    savedSettingsCharacteristic.writeValueWithResponse(sendingArray).then(stuff => {
        // console.log("here it is " + stuff);
    }).catch(error => {
        console.log('Argh! Cant send!!! ' + error.message);
        console.log('it is all over now');
    });

}

function disconnected() {
    title.innerHTML = "Welcome to TapManager Web";
    searchBtn.style.display = "block";
    tapName.style.display = "none";

    notFoundTxt.style.display = "block";

    generalHeader.style.display = "none";
    // checkUpdatesBox.style.display = "block";
    leftHandBox.style.display = "none";
    vibrationBox.style.display = "none";
    standbyBox.style.display = "none";
    doubleTapTimeoutBox.style.display = "none";
    sleepAfterBox.style.display = "none";
    textHeader.style.display = "none";
    autoCorrectionBox.style.display = "none";
    inputHeader.style.display = "none";
    mouseOnlyBox.style.display = "none";
    keyboardOnlyBox.style.display = "none";
    mouseAndKeyboardBox.style.display = "none";
    // customMappingHeader.style.display = "none";
    // tapMappingBox.style.display = "none";
    mouseHeader.style.display = "none";
    mouseSensitivityBox.style.display = "none";
    scrollSensitivityBox.style.display = "none";
    scrollDirectionFlipBox.style.display = "none";
    airGesturesHeader.style.display = "none";
    airMouseBox.style.display = "none";
    mediaControlBox.style.display = "none";
    smartTVControlBox.style.display = "none";
    developmentHeader.style.display = "none";
    developerModeBox.style.display = "none";
}

let DEVICE_INFORMATION = '0000180a-0000-1000-8000-00805f9b34fb';
let BATTERY_SERVICE = '0000180f-0000-1000-8000-00805f9b34fb';
let TAP_SERVICE = 'c3ff0001-1d8b-40fd-a56f-c7bd5d0f3370';

let FIRMWARE_REVISION_STRING = '00002a26-0000-1000-8000-00805f9b34fb';
let HARDWARE_REVISION_STRING = '00002a27-0000-1000-8000-00805f9b34fb';
let BATTERY_LEVEL = '00002a19-0000-1000-8000-00805f9b34fb';
let SETTINGS = 'c3ff0002-1d8b-40fd-a56f-c7bd5d0f3370';
// Add a global error event listener early on in the page load, to help ensure that browsers
// which don't support specific functionality still end up displaying a meaningful message.
window.addEventListener('error', function(error) {
    if (ChromeSamples && ChromeSamples.setStatus) {
        console.error(error);
        ChromeSamples.setStatus(error.message + ' (Your browser may not support this feature.)');
        error.preventDefault();
    }
});

function formatToLength2(mynumber) {
    var formattedNumber = ("0" + mynumber).slice(-2);
    return formattedNumber;
}

function semVerToInt(semVer) {
    const nums = semVer.split('.');

    var major = "";
    var minor = "";
    var patch = "";

    switch (nums.length) {
        case 1:
            major = formatToLength2(nums[0]);
            minor = "00";
            patch = "00";
            break;
        case 2:
            major = formatToLength2(nums[0]);
            minor = formatToLength2(nums[1]);
            patch = "00";
            break;
        case 3:
            major = formatToLength2(nums[0]);
            minor = formatToLength2(nums[1]);
            patch = formatToLength2(nums[2]);
            break;
        default:
            major = "00";
            minor = "00";
            patch = "00";
            break;
    }

    var ver = major + minor + patch;
    // console.log("verString = " + ver);
    return parseInt(ver);
}

// all the variables here
var hardwareVer = 0;
var firmwareVer = 0;
var supportsAirMouse = false;

var leftHanded = false;
var vibration = true;
var standbyModeEnabled = false;
var doubleTapTimeout = 5;
var airMouse = false;
var airMouseMedia = false;
var airMouseTv = false;
var sleepAfterValue = 2;
var autoCorrection = false;
var mouseOnly = false;
var voiceOver = false;
var keyboardOnly = false;
var mouseAndKeyboard = true;
var mouseSensitivity = 5;
var scrollSensitivity = 5;
var scrollDirectionFlip = false;
var developerMode = false;

var title = document.getElementById('title');

var deviceName;
var tapName = document.getElementById('tapName');
tapName.style.display = "none";

var notFoundTxt = document.getElementById('notFound');
notFoundTxt.style.display = "none";

var generalHeader = document.getElementById('general');
generalHeader.style.display = "none";

var checkUpdatesBox = document.getElementById('checkForUpdates');
checkUpdatesBox.style.display = "none";

var leftHandBox = document.getElementById('leftHandedBox');
leftHandBox.style.display = "none";
var leftHandedSwitch = document.getElementById('leftHandedSwitch');

var vibrationBox = document.getElementById('vibrationBox');
vibrationBox.style.display = "none";
var vibrationSwitch = document.getElementById('vibrationSwitch');

var standbyBox = document.getElementById('standbyModeBox');
standbyBox.style.display = "none";
var standbySwitch = document.getElementById('standbyEnabledSwitch');

var doubleTapTimeoutBox = document.getElementById('doubleTapTimeoutBox');
doubleTapTimeoutBox.style.display = "none";
var doubleTapSlider = document.getElementById('doubleTapTimeoutSlider');

var sleepAfterBox = document.getElementById('sleepAfterBox');
sleepAfterBox.style.display = "none";
var sleepSelector = document.getElementById('sleepSelector');

var textHeader = document.getElementById('text');
textHeader.style.display = "none";

var autoCorrectionBox = document.getElementById('autoCorrectionBox');
autoCorrectionBox.style.display = "none";
var autoCorrectionSwitch = document.getElementById('autoCorrectionSwitch');

var inputHeader = document.getElementById('input');
inputHeader.style.display = "none";

var mouseOnlyBox = document.getElementById('mouseOnlyBox');
mouseOnlyBox.style.display = "none";
var mouseOnlySwitch = document.getElementById('mouseOnlySwitch');

var keyboardOnlyBox = document.getElementById('keyboardOnlyBox');
keyboardOnlyBox.style.display = "none";
var keyboardOnlySwitch = document.getElementById('keyboardOnlySwitch');

var mouseAndKeyboardBox = document.getElementById('mouseAndKeyboardBox');
mouseAndKeyboardBox.style.display = "none";
var mouseAndKeyboardSwitch = document.getElementById('mouseAndKeyboardSwitch');

var customMappingHeader = document.getElementById('customMapping');
customMappingHeader.style.display = "none";
var tapMappingBox = document.getElementById('tapMappingBox');
tapMappingBox.style.display = "none";
var mappingButton = document.getElementById('mappingButton');

var mouseHeader = document.getElementById('mouse');
mouseHeader.style.display = "none";
var mouseSensitivityBox = document.getElementById('mouseSensitivityBox');
mouseSensitivityBox.style.display = "none";
var mouseSensitivitySlider = document.getElementById('mouseSensitivitySlider');

var scrollSensitivityBox = document.getElementById('scrollSensitivityBox');
scrollSensitivityBox.style.display = "none";
var scrollSensitivitySlider = document.getElementById('scrollSensitivitySlider');

var scrollDirectionFlipBox = document.getElementById('scrollDirectionFlipBox');
scrollDirectionFlipBox.style.display = "none";
var scrollDirectionFlipSwitch = document.getElementById('scrollDirectionFlipSwitch');

var airGesturesHeader = document.getElementById("airgestures");
airGesturesHeader.style.display = "none";
var airMouseBox = document.getElementById("airMouseBox");
airMouseBox.style.display = "none";
var airMouseSwitch = document.getElementById("airMouseSwitch");

var mediaControlBox = document.getElementById("mediaControlBox");
mediaControlBox.style.display = "none";
var mediaControlSwitch = document.getElementById("mediaControlSwitch");

var smartTVControlBox = document.getElementById("smartTVControlBox");
smartTVControlBox.style.display = "none";
var smartTVControlSwitch = document.getElementById("smartTVControlSwitch");

var developmentHeader = document.getElementById('development');
developmentHeader.style.display = "none";
var developerModeBox = document.getElementById('developerModeBox');
developerModeBox.style.display = "none";
var developerModeSwitch = document.getElementById('developerModeSwitch');

var leftHandedDialog = document.getElementById('leftHandedDialog');
var rightHandedDialog = document.getElementById('rightHandedDialog');
var vibrationsOffDialog = document.getElementById('vibrationsOffDialog');
var standbyOnDialog = document.getElementById('standbyOnDialog');
var mouseOnlyDialog = document.getElementById('mouseOnlyDialog');
var keyboardOnlyDialog = document.getElementById('keyboardOnlyDialog');
var developerModeDialog = document.getElementById('developerModeDialog');
var developerModeChangedDialog = document.getElementById('developerModeChangedDialog');

var savedDevice;
var savedServer;
var savedSettingsCharacteristic;

var searchBtn = document.getElementById('searchDevicesBtn')
searchBtn.addEventListener('click', function() {
    notFoundTxt.style.display = "none";
    let filters = [];
    // this UUID is the specific TAP UUID
    filters.push({
        services: [TAP_SERVICE]
    });

    let optionalServices = [];
    optionalServices.push(BATTERY_SERVICE, DEVICE_INFORMATION);

    let options = {};
    options.filters = filters;
    options.optionalServices = optionalServices;

    console.log('Requesting TAP device...');

    navigator.bluetooth.requestDevice(options).then(device => {
        deviceName = device.name;
        // console.log('> Name:       ' + device.name);
        // console.log('> Id:         ' + device.id);
        // console.log('> Connected:  ' + device.gatt.connected);
        savedDevice = device;
        return device;
    }).then(device => {
        console.log('Here we are connecting to ' + device.name);
        device.addEventListener('gattserverdisconnected', function() {
            console.log("disconnected");
            disconnected();
        });
        return device.gatt.connect();
    }).then(server => {
        // console.log('Connected to device: ' + server.device.name);
        // console.log('Getting device info service');
        savedServer = server;
        return server.getPrimaryService(DEVICE_INFORMATION);
    }).then(service => {
        // console.log('Getting firmware string characteristic');
        return service.getCharacteristic(FIRMWARE_REVISION_STRING);
    }).then(characteristic => {
        // console.log('Reading characteristic info:');
        return characteristic.readValue();
    }).then(value => {
        var decoder = new TextDecoder("utf-8");
        let decoded = decoder.decode(value);
        var firmwareString = decoded;
        // console.log('> Firmware string is ' + firmwareString);
        firmwareVer = semVerToInt(firmwareString);
        // console.log("Made to string = " + firmwareVer);
        return savedServer;
    }).then(server => {
        // console.log('Getting device info service again...');
        return server.getPrimaryService(DEVICE_INFORMATION);
    }).then(service => {
        // console.log('Getting hardware string characteristic');
        return service.getCharacteristic(HARDWARE_REVISION_STRING);
    }).then(characteristic => {
        // console.log('Reading characteristic info...');
        return characteristic.readValue();
    }).then(value => {
        var decoder = new TextDecoder("utf-8");
        let decoded = decoder.decode(value);
        var hardwareString = decoded;
        // console.log('> Hardware string is ' + hardwareString);
        hardwareVer = semVerToInt(hardwareString);
        // console.log("Made to string = " + hardwareVer);

        // set up support for airMouseTv
        if (hardwareVer >= 30300 && firmwareVer >= 20000) {
            supportsAirMouse = true;
        } else {
            // console.log("We support AirMouse!");
            supportsAirMouse = false;
            // console.log("NO Airmouse support!");
        }
        return savedServer;
    }).then(server => {
        // console.log('Getting TAP service ...');
        return server.getPrimaryService(TAP_SERVICE);
    }).then(service => {
        // console.log('Getting settings characteristic');
        return service.getCharacteristic(SETTINGS);
    }).then(characteristic => {
        // console.log('Reading settings info...');
        savedSettingsCharacteristic = characteristic;
        return characteristic.readValue();
    }).then(value => {
        // console.log("value here is " + value);
        // we should have an array of values here to decoded
        let firstByte = value.getUint8(0);
        var firstByteArray = new BitArray.shredWithSize(firstByte, 8);
        // console.log("first byte is: " + firstByte);
        // console.log('got the first bitarray: ' + firstByteArray);
        leftHanded = (firstByteArray[0] === BitArray._ON);
        // console.log('Left handed = ' + leftHanded);
        var vibrationOff = (firstByteArray[1] === BitArray._ON);
        vibration = !vibrationOff;
        // console.log('vibration off = ' + vibrationOff);
        // console.log('vibration = ' + vibration);
        mouseOnly = (firstByteArray[2] === BitArray._ON);
        // console.log('mouseOnly = ' + mouseOnly);
        voiceOver = (firstByteArray[3] === BitArray._ON);
        // console.log('voiceOver = ' + voiceOver);
        autoCorrection = (firstByteArray[4] === BitArray._ON);
        // console.log('autoCorrection = ' + autoCorrection);
        scrollDirectionFlip = (firstByteArray[5] === BitArray._ON)
        // console.log('scrollDirectionFlip = ' + scrollDirectionFlip);
        keyboardOnly = (firstByteArray[6] === BitArray._ON);
        // console.log('keyboardOnly = ' + keyboardOnly);
        standbyModeEnabled = (firstByteArray[7] === BitArray._ON);
        // console.log('standbyEnabled = ' + standbyModeEnabled);

        let secondByte = value.getUint8(1);
        // console.log("second byte is: " + secondByte);
        let secondByteArray = new BitArray.shredWithSize(secondByte, 8);
        // console.log('got the second bitarray: ' + secondByteArray);
        mouseSensitivity = 0;
        var multiplier = 1;
        for (var n = 0; n < 4; n++) {
            mouseSensitivity += (secondByteArray[n] * multiplier);
            multiplier = multiplier * 2;
        }
        // console.log('mouseSensitivity = ' + mouseSensitivity);

        scrollSensitivity = 0;
        multiplier = 1;
        for (var n = 4; n < 8; n++) {
            scrollSensitivity += (secondByteArray[n] * multiplier);
            multiplier = multiplier * 2;
        }
        // console.log('scrollSensitivity = ' + scrollSensitivity);

        let thirdByte = value.getUint8(2);
        // console.log("third byte is: " + thirdByte);
        let thirdByteArray = new BitArray.shredWithSize(thirdByte, 8);
        // console.log('got the third bitarray: ' + thirdByteArray);
        doubleTapTimeout = 0;
        multiplier = 1;
        for (var n = 0; n < 4; n++) {
            doubleTapTimeout += (thirdByteArray[n] * multiplier);
            multiplier = multiplier * 2;
        }
        // console.log('doubleTapTimeout = ' + doubleTapTimeout);
        var airMouseOff = (thirdByteArray[4] === BitArray._ON);
        airMouse = !airMouseOff;
        // console.log('airMouse = ' + airMouse);
        var airMouseMediaOff = (thirdByteArray[5] === BitArray._ON);
        airMouseMedia = !airMouseMediaOff;
        // console.log('airMouseMedia = ' + airMouseMedia);
        var airMouseTvOff = (thirdByteArray[6] === BitArray._ON);
        airMouseTv = !airMouseTvOff;
        // console.log('airMouseTv = ' + airMouseTv);

        let fourthByte = value.getUint8(3);
        // console.log("fourth byte is: " + fourthByte);
        let fourthByteArray = new BitArray.shredWithSize(fourthByte, 8);
        // console.log('got the fourth bitarray: ' + fourthByteArray);
        sleepAfterValue = 0;
        multiplier = 1;
        for (var n = 0; n < 6; n++) {
            sleepAfterValue += (fourthByteArray[n] * multiplier);
            multiplier = multiplier * 2;
        }
        // console.log('sleepTimeout = ' + sleepAfterValue);
        developerMode = (fourthByteArray[6] === BitArray._ON);
        // console.log('developerMode = ' + developerMode);

        title.innerHTML = "Tap Strap connected";
        searchBtn.style.display = "none";
        tapName.style.display = "block";
        tapName.innerHTML = deviceName;
        generalHeader.style.display = "block";
        // checkUpdatesBox.style.display = "block";
        leftHandBox.style.display = "block";
        leftHandedSwitch.checked = leftHanded;
        vibrationBox.style.display = "block";
        vibrationSwitch.checked = vibration;
        standbyBox.style.display = "block";
        standbySwitch.checked = standbyModeEnabled;
        doubleTapTimeoutBox.style.display = "block";
        doubleTapTimeoutSlider.value = doubleTapTimeout;
        sleepAfterBox.style.display = "block";
        sleepSelector.value = sleepAfterValue;
        textHeader.style.display = "block";
        autoCorrectionBox.style.display = "block";
        autoCorrectionSwitch.checked = autoCorrection;
        inputHeader.style.display = "block";
        mouseOnlyBox.style.display = "block";
        mouseOnlySwitch.checked = mouseOnly;
        keyboardOnlyBox.style.display = "block";
        keyboardOnlySwitch.checked = keyboardOnly;
        mouseAndKeyboardBox.style.display = "block";
        mouseAndKeyboard = !(mouseOnly || keyboardOnly);
        mouseAndKeyboardSwitch.checked = mouseAndKeyboard;
        // customMappingHeader.style.display = "block";
        // tapMappingBox.style.display = "block";
        mouseHeader.style.display = "block";
        mouseSensitivityBox.style.display = "block";
        mouseSensitivitySlider.value = mouseSensitivity;
        scrollSensitivityBox.style.display = "block";
        scrollSensitivitySlider.value = scrollSensitivity;
        scrollDirectionFlipBox.style.display = "block";
        scrollDirectionFlipSwitch.checked = scrollDirectionFlip;

        if (supportsAirMouse) {
            airGesturesHeader.style.display = "block";
            airMouseBox.style.display = "block";
            airMouseSwitch.checked = airMouse;
            mediaControlBox.style.display = "block";
            mediaControlSwitch.checked = airMouseMedia;
            smartTVControlBox.style.display = "block";
            smartTVControlSwitch.checked = airMouseTv;
        }

        developmentHeader.style.display = "block";
        developerModeBox.style.display = "block";
        developerModeSwitch.checked = developerMode;
        console.log('> Go to waiting loop');
        return value;
    }).then(value => {
        // ok let's set up the work to set the values when people change
        // values on the screen
        leftHandedSwitch.oninput = function() {
            leftHanded = this.checked;

            if (leftHanded) {
                // we just set it to true, need to ask in a dialog
                leftHandedDialog.showModal();
                leftHandedDialog.addEventListener('close', function onClose() {
                    if (leftHandedDialog.returnValue == 'cancel') {
                        // console.log("we got cancelled!");
                        leftHandedSwitch.checked = false;
                        leftHanded = false
                    } else {
                        // console.log("lefthanded now equals: " + leftHanded);
                        saveSettings();
                    }
                });
            } else {
                rightHandedDialog.showModal();
                rightHandedDialog.addEventListener('close', function onClose() {
                    if (rightHandedDialog.returnValue == 'cancel') {
                        // console.log("we got cancelled!");
                        leftHandedSwitch.checked = true;
                        leftHanded = true
                    } else {
                        // console.log("lefthanded now equals: " + leftHanded);
                        saveSettings();
                    }
                });
            }
        }

        vibrationSwitch.oninput = function() {
            vibration = this.checked;

            if (!vibration) {
                // we just set it to true, need to ask in a dialog
                vibrationsOffDialog.showModal();
                vibrationsOffDialog.addEventListener('close', function onClose() {
                    if (vibrationsOffDialog.returnValue == 'cancel') {
                        // console.log("we got cancelled!");
                        vibrationSwitch.checked = true;
                        vibration = true
                    } else {
                        // console.log("vibration now equals: " + vibration);
                        saveSettings();
                    }
                });
            } else {
                // console.log("vibration now equals: " + vibration);
                saveSettings();
            }
        }

        standbySwitch.oninput = function() {
            standbyEnabled = this.checked;
            if (standbyEnabled) {
                // we just set it to true, need to ask in a dialog
                standbyOnDialog.showModal();
                standbyOnDialog.addEventListener('close', function onClose() {
                    if (standbyOnDialog.returnValue == 'cancel') {
                        // console.log("we got cancelled!");
                        standbySwitch.checked = false;
                        standbyEnabled = false
                    } else {
                        // console.log("standbyEnabled now equals: " + standbyEnabled);
                        saveSettings();
                    }
                });
            } else {
                // console.log("standbyEnabled now equals: " + standbyEnabled);
                saveSettings();
            }
        }

        doubleTapTimeoutSlider.oninput = function() {
            doubleTapTimeout = parseInt(this.value, 10);
            // console.log("doubleTapTimeout now equals: " + doubleTapTimeout);
            saveSettings();
        }

        sleepSelector.oninput = function() {
            sleepAfterValue = parseInt(this.value, 10);
            // console.log("sleepAfterValue now equals: " + sleepAfterValue);
            saveSettings();
        }

        autoCorrectionSwitch.oninput = function() {
            autoCorrection = this.checked;
            // console.log("autoCorrection now equals: " + autoCorrection);
            saveSettings();
        }

        mouseOnlySwitch.oninput = function() {
            mouseOnly = this.checked;
            // console.log("mouseOnly now equals: " + mouseOnly);
            if (mouseOnly) {
                // we just set it to true, need to ask in a dialog
                mouseOnlyDialog.showModal();
                mouseOnlyDialog.addEventListener('close', function onClose() {
                    if (mouseOnlyDialog.returnValue == 'cancel') {
                        // console.log("we got cancelled!");
                        mouseOnlySwitch.checked = false;
                        mouseOnly = false
                    } else {
                        keyboardOnlySwitch.checked = false;
                        keyboardOnly = false;
                    }
                    // console.log(mouseOnlyDialog.returnValue + " button clicked");
                    // console.log("keyboardOnly now equals: " + keyboardOnly);
                    mouseAndKeyboard = !(mouseOnly || keyboardOnly);
                    // console.log("mouseandKeyboard now equals: " + mouseAndKeyboard);
                    mouseAndKeyboardSwitch.checked = mouseAndKeyboard;
                    saveSettings();
                });
            } else {
                // just turned off mouseOnly - we turn on maouse and keyboard automatically
                mouseAndKeyboard = !(mouseOnly || keyboardOnly);
                mouseAndKeyboardSwitch.checked = mouseAndKeyboard;
                saveSettings();
            }
        }

        keyboardOnlySwitch.oninput = function() {
            keyboardOnly = this.checked;
            // console.log("keyboardOnly now equals: " + keyboardOnly);
            if (keyboardOnly) {
                // we just set it to true, need to ask in a dialog
                keyboardOnlyDialog.showModal();
                keyboardOnlyDialog.addEventListener('close', function onClose() {
                    if (keyboardOnlyDialog.returnValue == 'cancel') {
                        // console.log("we got cancelled!");
                        keyboardOnlySwitch.checked = false;
                        keyboardOnly = false
                    } else {
                        mouseOnlySwitch.checked = false;
                        mouseOnly = false;
                    }
                    // console.log(keyboardOnlyDialog.returnValue + " button clicked");
                    // console.log("mouseOnly now equals: " + mouseOnly);
                    mouseAndKeyboard = !(mouseOnly || keyboardOnly);
                    // console.log("mouseandKeyboard now equals: " + mouseAndKeyboard);
                    mouseAndKeyboardSwitch.checked = mouseAndKeyboard;
                    saveSettings();
                });
            } else {
                // just turned off keyboardeOnly - we turn on maouse and keyboard automatically
                mouseAndKeyboard = !(mouseOnly || keyboardOnly);
                mouseAndKeyboardSwitch.checked = mouseAndKeyboard;
                saveSettings();
            }
        }

        mouseAndKeyboardSwitch.oninput = function() {
            mouseAndKeyboard = this.checked;
            // console.log("mouseAndKeyboard now equals: " + mouseAndKeyboard);
            if (mouseAndKeyboard) {
                keyboardOnlySwitch.checked = false;
                keyboardOnly = false
                mouseOnlySwitch.checked = false;
                mouseOnly = false;
                saveSettings();
            } else {
                // just turned off mouseAndKeyboard - we turn on maouseOnly automatically
                mouseOnlySwitch.checked = true;
                saveSettings();
            }
        }

        mouseSensitivitySlider.oninput = function() {
            mouseSensitivity = parseInt(this.value, 10);
            // console.log("mouseSensitivity now equals: " + mouseSensitivity);
            saveSettings();
        }

        scrollSensitivitySlider.oninput = function() {
            scrollSensitivity = parseInt(this.value, 10);
            // console.log("scrollSensitivity now equals: " + scrollSensitivity);
            saveSettings();
        }

        scrollDirectionFlipSwitch.oninput = function() {
            scrollDirectionFlip = this.checked;
            // console.log("scrollDirectionFlip now equals: " + scrollDirectionFlip);
            saveSettings();
        }

        airMouseSwitch.oninput = function() {
            airMouse = this.checked;
            // console.log("airMouse now equals: " + airMouse);
            saveSettings();
        }

        mediaControlSwitch.oninput = function() {
            airMouseMedia = this.checked;
            // console.log("airMouseMedia now equals: " + airMouseMedia);
            saveSettings();
        }

        smartTVControlSwitch.oninput = function() {
            airMouseTv = this.checked;
            // console.log("airMouseTv now equals: " + airMouseTv);
            saveSettings();
        }

        developerModeSwitch.oninput = function() {
            developerMode = this.checked;
            if (developerMode) {
                // we just set it to true, need to ask in a dialog
                developerModeDialog.showModal();
                developerModeDialog.addEventListener('close', function onClose() {
                    if (developerModeDialog.returnValue == 'cancel') {
                        // console.log("we got cancelled!");
                        developerModeSwitch.checked = false;
                        developerMode = false
                    } else {
                        developerModeChangedDialog.showModal();
                    }
                    // console.log("developerMode now equals: " + developerMode);
                    saveSettings();
                });

            } else {
                developerModeChangedDialog.showModal();
                // console.log("developerMode now equals: " + developerMode);
                saveSettings();
            }
        }

    }).catch(error => {
        disconnected();

        console.log('Argh! ' + error.message);
        console.log('it is all over now');
    });

});
