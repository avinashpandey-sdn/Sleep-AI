import { Buffer } from 'buffer';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
    Alert,
    FlatList,
    NativeEventEmitter,
    PermissionsAndroid,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';
import { BleManager } from 'react-native-ble-plx';
import SoundLevel from 'react-native-sound-level';
const TimeToUpdateAudioPeakHeight = 100; // milliseconds (0.1 second)

let arr10SecData = [];
let arr1MinData = [];

const MAX_10SEC_ENTRIES = 100; // 10s / 0.1s
const MAX_1MIN_ENTRIES = 600; // 60s / 0.1s
export const useAudioPeakCapture = () => {
    const [isRecording, setIsRecording] = useState(false);
    const intervalRef = useRef(null);

    const requestMicrophonePermission = async () => {
        if (Platform.OS === 'android') {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
            );
            return granted === PermissionsAndroid.RESULTS.GRANTED;
        }
        return true;
    };

    const startAudioCapture = async () => {
        const hasPermission = await requestMicrophonePermission();
        if (!hasPermission) {
            Alert.alert('Permission Required', 'Microphone access is needed.');
            return;
        }

        arr10SecData = [];
        arr1MinData = [];

        SoundLevel.start();

        SoundLevel.onNewFrame = data => {
            const peakPower = data.value; // typically in dB

            // Store in 10-second buffer
            arr10SecData.push(peakPower);
            if (arr10SecData.length > MAX_10SEC_ENTRIES) {
                arr10SecData.shift(); // Keep 10 sec worth of data
            }

            // Store in 1-minute buffer
            arr1MinData.push(peakPower);
            if (arr1MinData.length > MAX_1MIN_ENTRIES) {
                arr1MinData.shift(); // Keep 1 min worth of data
            }

            // console.log('Peak Power:', peakPower);
        };

        setIsRecording(true);
    };

    const stopAudioCapture = () => {
        SoundLevel.stop();
        SoundLevel.onNewFrame = null;
        setIsRecording(false);
    };

    const getArr10SecData = () => arr10SecData;

    return {
        isRecording,
        startAudioCapture,
        stopAudioCapture,
        getArr10SecData,
    };
};

const bleManager = new BleManager();
let connectedDevice = null;
let uartTXCharacteristic = null;
let uartRXCharacteristic = null;
let voltage = 0;
const UART_SERVICE_UUID = 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx';
const UART_TX_UUID = 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx';
const UART_RX_UUID = 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx';

const eventEmitter = new NativeEventEmitter();
const HardwareReading = {
    voltage: 'v',
    accelerometer: 'a',
    servo: 's',
    buzzer: 'b',
};
let readBuzzServoAccVolt = 'voltage';
const SERVICE_UUID = '6e400001-b5a3-f393-e0a9-e50e24dcca9e'; //

// Device Name Characteristic (from Generic Access Service) - Supports Read
const CHARACTERISTIC_UUID_READ = '00002a00-0000-1000-8000-00805f9b34fb'; // [3]

// Nordic UART Service RX Characteristic - Supports Notify (for receiving data from device)
const CHARACTERISTIC_UUID_NOTIFY = '6e400003-b5a3-f393-e0a9-e50e24dcca9e'; //

// Nordic UART Service TX Characteristic - Supports Write (for sending data to device)
const CHARACTERISTIC_UUID_WRITE = '6e400002-b5a3-f393-e0a9-e50e24dcca9e'; //
// --- END OF UPDATED UUIDs ---

const App = () => {
    const { startAudioCapture, stopAudioCapture, getArr10SecData } =
        useAudioPeakCapture();
    const audioRecorderPlayer = useRef(new AudioRecorderPlayer()).current;
    const [isRecording, setIsRecording] = useState(false);
    const [arr10SecData, setArr10SecData] = useState([]);
    const [arr1MinData, setArr1MinData] = useState([]);
    const intervalRef = useRef(null);
    const lastValueRef = useRef(0);
    const peakOccurranceRef = useRef(9);
    const arrPeakInAudioRef = useRef([]);
    const arrPeakHeightTestRef = useRef([]);

    const [bluetoothState, setBluetoothState] = useState(null);
    const [scannedDevices, setScannedDevices] = useState([]);
    const [connectedDevice, setConnectedDevice] = useState(null);
    console.log('connectedDevice>>>>>', connectedDevice);
    const [readData, setReadData] = useState('N/A');
    const [monitoredData, setMonitoredData] = useState('N/A');
    const monitorSubscription = useRef(null);
    const [batterPercentage, setBatteryPercentage] = useState(0);

    const requestPermissions = async () => {
        if (Platform.OS === 'android') {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
            );
            return granted === PermissionsAndroid.RESULTS.GRANTED;
        }
        return true;
    };

    //  get batter start

    function handleNotification(base64Value) {
        const decoded = Buffer.from(base64Value, 'base64').toString('utf8');
        console.log('Received:', decoded);
        hardwareCalculation(decoded);
    }
    function hardwareCalculation(dataString) {
        const parts = dataString.split(',');
        if (parts.length >= 4) {
            const x = parseFloat(parts[0]) * (2 / 512);
            const y = parseFloat(parts[1]) * (2 / 512);
            const z = parseFloat(parts[2]) * (2 / 512);
            const temperature = parseFloat(parts[3]);
            const position = calcPosition(x, y, z);
            console.log(
                `x: ${x}, y: ${y}, z: ${z}, temp: ${temperature}, position: ${position}`,
            );
        }
        if (parts.length >= 5) {
            voltage = parseFloat(parts[4]);
            console.log('Voltage:', voltage);
        }
    }

    const useBatteryListener = () => {
        const [batteryPercentage, setBatteryPercentage] = useState(0);

        useEffect(() => {
            const eventEmitter = new NativeEventEmitter();

            const subscription = eventEmitter.addListener(
                'KRefreshTestYourMaskVC',
                dict => {
                    if (
                        dict?.type === HardwareReading.voltage &&
                        typeof dict.battery === 'number'
                    ) {
                        const voltage = dict.battery;

                        const y = 0.5857 * voltage - 1658.1;
                        let finalPercent = Math.round(y);

                        if (finalPercent > 98) finalPercent = 100;
                        if (finalPercent < 0) finalPercent = 0;

                        setBatteryPercentage(finalPercent);
                        console.log(`Battery Voltage: ${voltage}`);
                        console.log(`Battery %: ${finalPercent}`);

                        updateMaskStatusToMixpanel(finalPercent);
                        animateBattery(() => {
                            scrollToBatteryView();
                            Alert.alert('showBatteryPercentage', y);
                            // showBatteryPercentage(y); // Optional voltage visual
                        });
                    }
                },
            );

            return () => {
                subscription.remove();
            };
        }, []);

        return { batteryPercentage };
    };

    const { batteryPercentage } = useBatteryListener();

    // get batter stop

    useEffect(() => {
        const subscription = bleManager.onStateChange(state => {
            setBluetoothState(state);
            if (state === 'PoweredOn') {
                console.log('Bluetooth is on');
            } else {
                Alert.alert('Bluetooth', `Bluetooth is ${state}`);
            }
        }, true);
        return () => subscription.remove();
    }, []);

    const startScan = useCallback(async () => {
        if (bluetoothState !== 'PoweredOn') {
            Alert.alert('Bluetooth Off', 'Please enable Bluetooth.');
            return;
        }

        const hasPermissions = await requestPermissions();
        if (!hasPermissions) return;

        setScannedDevices([]);
        console.log('Scanning for devices...');

        bleManager.startDeviceScan(
            null,
            { allowDuplicates: false },
            (error, device) => {
                if (error) {
                    Alert.alert('Scan Error', error.message);
                    bleManager.stopDeviceScan();
                    return;
                }

                if (device && (device.name || device.localName)) {
                    setScannedDevices(prev => {
                        if (!prev.some(d => d.id === device.id)) {
                            return [...prev, device];
                        }
                        return prev;
                    });
                }
            },
        );

        setTimeout(() => {
            bleManager.stopDeviceScan();
            console.log('Scan stopped.');
        }, 10000);
    }, [bluetoothState, requestPermissions]);

    const connectToDevice = useCallback(async device => {
        bleManager.stopDeviceScan();
        try {
            const connected = await device.connect();
            setConnectedDevice(connected);
            await connected.discoverAllServicesAndCharacteristics();
            // --- NEW CODE TO PRINT SERVICES AND CHARACTERISTICS ---
            const services = await connected.services(); // [1, 15]
            console.log('Discovered Services:');
            for (const service of services) {
                console.log(`  Service UUID: ${service.uuid}`);
                const characteristics = await service.characteristics(); // [14]

                for (const char of characteristics) {
                    if (char.uuid === UART_TX_UUID) {
                        uartTXCharacteristic = char;
                    } else if (char.uuid === UART_RX_UUID) {
                        uartRXCharacteristic = char;
                    }
                }

                if (uartTXCharacteristic) {
                    await connectedDevice.monitorCharacteristicForService(
                        UART_SERVICE_UUID,
                        UART_TX_UUID,
                        (error, characteristic) => {
                            if (error) {
                                console.log('Notification error:', error);
                                return;
                            }
                            handleNotification(characteristic?.value);
                        },
                    );
                }
            }
            // --- END OF NEW CODE ---

            if (Platform.OS === 'android') {
                await connected.requestMTU(256);
            }

            // 💡 Set MTU (optional for Android)
            if (Platform.OS === 'android') {
                await connected.requestMTU(256);
            }

            // ✅ Equivalent to Swift's dictUserInfo
            const rssi = await connected.readRSSI();
            const name = connected.name || 'Unknown Device';
            const uniqueID = connected.id;

            const dictUserInfo = {
                rssi,
                name,
                uniqueID,
            };

            console.log('dictUserInfo:', dictUserInfo);

            // ✅ Post notification-like event (like NotificationCenter)
            eventEmitter.emit('KRefreshTestYourMaskVC', dictUserInfo);

            Alert.alert(
                'Connected',
                `Connected to ${connected.name || connected.id}`,
            );
        } catch (error) {
            Alert.alert('Connection Error', error.message);
            setConnectedDevice(null);
        }
    }, []);

    const readCharacteristic = useCallback(async () => {
        if (!connectedDevice) {
            Alert.alert('Not Connected', 'Please connect to a device.');
            return;
        }

        try {
            const DEVICE_INFO_SERVICE_UUID = '00001800-0000-1000-8000-00805f9b34fb';

            const characteristic = await connectedDevice.readCharacteristicForService(
                DEVICE_INFO_SERVICE_UUID,
                CHARACTERISTIC_UUID_READ,
            );
            if (characteristic.value) {
                const decoded = Buffer.from(characteristic.value, 'base64').toString(
                    'utf8',
                );
                setReadData(decoded);
                Alert.alert('Read Success', decoded);
            } else {
                setReadData('No value received');
            }
        } catch (error) {
            Alert.alert('Read Error', error.message);
            setReadData('Error reading');
        }
    }, [connectedDevice]);

    const writeCharacteristic = useCallback(async text => {
        if (!connectedDevice) {
            Alert.alert('Not Connected', 'Please connect to a device first.');
            return;
        }
        try {
            // Get the current MTU for the connected device. Default is 23, but can be negotiated.
            // The actual payload size for a write is MTU - 3 bytes. [1, 15]
            const maxPacketSize = (connectedDevice.mtu || 23) - 3; // Use 23 as fallback if MTU is not yet negotiated or available [1]

            const dataBuffer = Buffer.from(text, 'utf8');
            let offset = 0;

            console.log(
                `Attempting to write data: "${text}" in chunks of max ${maxPacketSize} bytes.`,
            );

            while (offset < dataBuffer.length) {
                const chunkSize = Math.min(dataBuffer.length - offset, maxPacketSize);
                const chunk = dataBuffer.slice(offset, offset + chunkSize);
                const base64Chunk = chunk.toString('base64'); //

                console.log(
                    `Sending chunk (offset ${offset}, size ${chunkSize}): ${chunk.toString(
                        'utf8',
                    )} (Base64: ${base64Chunk})`,
                );

                // Use writeCharacteristicWithResponseForService as the characteristic supports it [16]
                await connectedDevice.writeCharacteristicWithResponseForService(
                    SERVICE_UUID, // Nordic UART Service UUID
                    CHARACTERISTIC_UUID_WRITE,
                    base64Chunk,
                ); // [16]

                offset += chunkSize;
                // Add a small delay between chunks if needed for flow control on the peripheral side,
                // especially if it's a low-power device. This is often crucial for stability.
                // await new Promise(resolve => setTimeout(resolve, 10)); // Example delay
            }

            Alert.alert('Write Success', `Successfully sent: "${text}"`);
        } catch (error) {
            console.error('Write characteristic error:', error); // [3]
            Alert.alert(
                'Write Failed',
                `Could not write characteristic: ${error.message} (Code: ${error.errorCode})`,
            ); // [3]
        }
    }); // Add connectedDevice to dependencies

    const handleHardwareCalculation = validUTF8String => {
        console.log(`"${validUTF8String}" received`);

        const arrPosition = validUTF8String.split(',');

        if (readBuzzServoAccVolt === 'accelerometer') {
            if (arrPosition.length > 3) {
                let x = parseFloat(arrPosition[0]) || 0;
                let y = parseFloat(arrPosition[1]) || 0;
                let z = parseFloat(arrPosition[2]) || 0;
                const temperature = parseFloat(arrPosition[3]) || 0;

                const lsbGConversionFactor = 2 / 512.0;
                x *= lsbGConversionFactor;
                y *= lsbGConversionFactor;
                z *= lsbGConversionFactor;

                const position = calcPosition(x, y, z);

                const data = {
                    type: 'accelerometer',
                    x,
                    y,
                    z,
                    position,
                    temperature,
                };

                console.log('Accelerometer Data:', data);
            }
        } else if (readBuzzServoAccVolt === 'voltage') {
            if (arrPosition.length >= 5) {
                const voltage = parseFloat(arrPosition[4]) || 0;

                const data = {
                    type: 'voltage',
                    battery: voltage,
                };

                const y = 0.5857 * voltage - 1658.1;
                let finalPercent = Math.round(y);

                if (finalPercent > 98) finalPercent = 100;
                if (finalPercent < 0) finalPercent = 0;
                console.log('Battery Voltage:>>>>', voltage, 'V');
                console.log('Battery finalPercent:>>>>', finalPercent, '%');
                setBatteryPercentage(finalPercent);
            }
        }
    };

    function calcPosition(x, y, z) {
        let accelAngleX = Math.atan(x / Math.sqrt(y * y + z * z)) * (180 / Math.PI);
        if (z < 0) accelAngleX = Math.abs(accelAngleX - 180);
        else if (x < 0 && z > 0) accelAngleX = Math.abs(accelAngleX + 360);

        let position = accelAngleX + 26.0; // basePosition
        if (position > 360) position -= 360;
        return position;
    }

    const parseSensorData = dataString => {
        const parts = dataString.replace('Monitored data: ', '').split(',');

        if (parts.length >= 4) {
            const x = parseInt(parts[0], 10);
            const y = parseInt(parts[1], 10);
            const z = parseInt(parts[2], 10);
            const temperature = parseInt(parts[3], 10);

            return { x, y, z, temperature };
        }
        return null;
    };
    const monitorCharacteristic = useCallback(async () => {
        //... (existing code)

        console.log('Starting characteristic monitoring...');
        try {
            monitorSubscription.current =
                connectedDevice.monitorCharacteristicForService(
                    SERVICE_UUID,
                    CHARACTERISTIC_UUID_NOTIFY,
                    (error, characteristic) => {
                        if (error) {
                            console.error('Monitor error:', error);
                            Alert.alert(
                                'Monitor Error',
                                `Error monitoring: ${error.message} (Code: ${error.errorCode})`,
                            );
                            monitorSubscription.current?.remove();
                            monitorSubscription.current = null;
                            setMonitoredData('Monitoring stopped due to error');
                            return;
                        }
                        if (characteristic?.value) {
                            const decodedData = Buffer.from(
                                characteristic.value,
                                'base64',
                            ).toString('utf-8');
                            console.log('Data received:', decodedData);

                            handleHardwareCalculation(decodedData);
                        }
                    },
                );
            Alert.alert('Monitoring Started', 'Receiving real-time data updates.');
        } catch (error) {
            console.error('Failed to start monitoring:', error);
            Alert.alert(
                'Monitoring Failed',
                `Could not start monitoring: ${error.message} (Code: ${error.errorCode})`,
            );
        }
    });
    const stopMonitor = useCallback(() => {
        if (monitorSubscription.current) {
            monitorSubscription.current.remove();
            monitorSubscription.current = null;
            setMonitoredData('Monitoring stopped');
            Alert.alert('Stopped Monitoring');
        } else {
            Alert.alert('Not Monitoring');
        }
    }, []);

    const disconnectDevice = useCallback(async () => {
        if (connectedDevice) {
            try {
                await connectedDevice.cancelConnection();
                setConnectedDevice(null);
                setReadData('N/A');
                setMonitoredData('N/A');
                monitorSubscription.current?.remove();
                monitorSubscription.current = null;
                Alert.alert('Disconnected');
            } catch (error) {
                Alert.alert('Disconnection Error', error.message);
            }
        } else {
            Alert.alert('No Device Connected');
        }
    }, [connectedDevice]);

    useEffect(() => {
        if (connectedDevice) {
            const disconnectListener = bleManager.onDeviceDisconnected(
                connectedDevice.id,
                (error, device) => {
                    if (error) {
                        Alert.alert('Disconnected Unexpectedly', error.message);
                    } else {
                        Alert.alert('Device Disconnected', `${device?.name || device?.id}`);
                    }
                    setConnectedDevice(null);
                    setReadData('N/A');
                    setMonitoredData('N/A');
                    monitorSubscription.current?.remove();
                    monitorSubscription.current = null;
                },
            );
            return () => disconnectListener.remove();
        }
    }, [connectedDevice]);

    // device monitering
    const [snoreResult, setSnoreResult] = useState('No Snore Detected');

    const detectSnore = () => {
        // Simulate analysis of recent monitored data
        if (readBuzzServoAccVolt === 'accelerometer') {
            const result =
                Math.random() > 0.5 ? 'Snore Detected' : 'No Snore Detected';
            setSnoreResult(result);
            Alert.alert('Snore Detection', result);
        } else {
            Alert.alert('Snore Detection', 'Accelerometer data not available');
        }
    };
    let arrSnoreState = [];
    let peakOccurrance = 9;
    let snoringFound = false;
    let arrPeakInAudio = [];
    let arrPeakHeightTest = [];
    let lastValue = 0;

    console.log('arrPeakInAudio>>>>>', arrPeakInAudio);
    const startRecording = async () => {
        const hasPermission = await requestPermissions();
        if (!hasPermission) {
            Alert.alert('Permission denied');
            return;
        }

        try {
            await audioRecorderPlayer.startRecorder();
            audioRecorderPlayer.addRecordBackListener(() => { });
            setIsRecording(true);
            startSoundLevelTracking();
        } catch (error) {
            console.log('Recording error:', error);
        }
    };

    const stopRecording = async () => {
        try {
            await audioRecorderPlayer.stopRecorder();
            audioRecorderPlayer.removeRecordBackListener();
            SoundLevel.stop();
            clearInterval(intervalRef.current);
            setIsRecording(false);
        } catch (error) {
            console.log('Stop error:', error);
        }
    };

    const startSoundLevelTracking = () => {
        SoundLevel.start();
        SoundLevel.onNewFrame = data => {
            const peak = data.value;

            setArr10SecData(prev => {
                const updated = [...prev, peak];
                if (updated.length > MAX_10SEC_ENTRIES) updated.shift();
                return updated;
            });

            setArr1MinData(prev => {
                const updated = [...prev, peak];
                if (updated.length > MAX_1MIN_ENTRIES) updated.shift();
                return updated;
            });
        };

        intervalRef.current = setInterval(() => {
            updateSnoreLevelGraphDataForEvery10Second();
        }, 10000);
    };

    const updateSnoreLevelGraphDataForEvery10Second = () => {
        const data = [...arr10SecData];
        const arrPeakInAudio = [];
        let peakOccurrance = peakOccurranceRef.current;
        let lastValue = lastValueRef.current;

        for (let i = 0; i < data.length; i++) {
            const peak = data[i];

            if (peakOccurrance >= 3 && peak !== lastValue) {
                const peakStart = i - peakOccurrance;
                let leftCount = i - peakOccurrance;
                let leftTime = 0;

                while (leftCount > 0) {
                    const currentLeftPeak = data[leftCount];
                    const leftPeak = data[leftCount - 1];
                    if (leftPeak <= currentLeftPeak) {
                        leftCount--;
                        leftTime++;
                    } else {
                        break;
                    }
                }

                const left = leftTime;
                if (left < 10) {
                    lastValue = peak;
                    peakOccurrance = 1;
                    continue;
                }

                for (let j = 0; j < left; j++) {
                    if (peakStart - j < 0) break;

                    const peakValue = data[peakStart - j];

                    if (peakValue < lastValue && j === left - 1 && peakOccurrance > 1) {
                        let rightCount = i;
                        let rightTime = 0;

                        while (rightCount < data.length - 1) {
                            const currentRightPeak = data[rightCount];
                            const rightPeak = data[rightCount + 1];
                            if (rightPeak - 2 <= currentRightPeak) {
                                rightCount++;
                                rightTime++;
                            } else {
                                break;
                            }
                        }

                        const right = rightTime;
                        if (right < 10) {
                            lastValue = peak;
                            peakOccurrance = 1;
                            break;
                        }

                        for (let k = 0; k < right; k++) {
                            const index = peakStart + peakOccurrance + k;
                            if (index >= data.length) break;

                            const rightPeak = data[index];
                            if (rightPeak < lastValue && k === right - 1) {
                                const time = left + right + peakOccurrance;
                                const leftPeakVal = data[leftCount];
                                const height = Math.abs(leftPeakVal) + lastValue;
                                const rightPeakVal = data[rightCount];

                                const dictPeak = {
                                    peakEnd: peakStart + peakOccurrance,
                                    peakValueOccurrance: peakOccurrance,
                                    lastPeak: lastValue,
                                    peakStart: peakStart,
                                    peakHeight: height,
                                    time: time,
                                    start: peakStart - left,
                                    end: peakStart + peakOccurrance + right,
                                    noOfLeft: left,
                                    noOfRight: right,
                                    noOfTime: i - peakOccurrance,
                                    startAndEndDifference:
                                        Math.abs(leftPeakVal) - Math.abs(rightPeakVal),
                                };

                                console.log('dictPeak:', dictPeak);
                                arrPeakHeightTestRef.current.push(lastValue);
                                arrPeakInAudio.push(dictPeak);
                                peakOccurrance = 1;
                                break;
                            } else if (rightPeak <= lastValue) {
                                continue;
                            } else {
                                break;
                            }
                        }
                    } else if (peakValue <= lastValue) {
                        continue;
                    } else {
                        break;
                    }
                }
            }

            if (peak === lastValue) {
                peakOccurrance++;
            } else {
                lastValue = peak;
                peakOccurrance = 1;
            }
        }

        console.log('arrPeakInAudio:', arrPeakInAudio);
        arrPeakInAudioRef.current = arrPeakInAudio;
    };

    const detectSnoring = arr => {
        let isSnoreFirst = false;

        for (const dict of arr) {
            const {
                peakHeight: height,
                time,
                lastPeak: peak,
                startAndEndDifference: diff,
            } = dict;

            const isTime = time > 30 && time < 80;
            const isHeight = height > 4 && height < 40;
            const isPeak = peak > -40 && peak < 20;

            if (isTime && isHeight && isPeak && Math.abs(diff) < 20) {
                if (!isSnoreFirst) isSnoreFirst = true;
                console.log('Snoring found!!');
                updateTheMask(true);
            } else {
                console.log('Snoring Not found!!');
                updateTheMask(false);
            }
        }
    };

    const updateTheMask = isSnoringFound => {
        const message = isSnoringFound ? 'Snoring Found!' : 'Snoring Not Found!';
        console.log(message);

        if (isSnoringFound) {
            // Example: Send Bluetooth command
            // sendBluetoothCommand('A');
        }
    };

    return (
        <ScrollView style= { styles.container } >
        <Text style={ styles.title }> BLE Data Reader </Text>
            < Text style = { styles.statusText } > Bluetooth State: { bluetoothState } </Text>

    {
        !connectedDevice ? (
            <View style= { styles.section } >
            <TouchableOpacity onPress={ startScan } style = { styles.button } >
                <Text style={ styles.buttonText }> Scan for Devices </Text>
                    </TouchableOpacity>
          {
                scannedDevices.length === 0 ? (
                    <Text>No devices found.</Text>
          ) : (
                <FlatList
              data= { scannedDevices }
        keyExtractor = { item => item.id}
renderItem = {({ item }) => (
    <TouchableOpacity
                  onPress= {() => connectToDevice(item)}
style = { styles.deviceItem } >
    <Text style={ styles.deviceName }>
        { item.name || 'Unknown Device' }
        </Text>
        < Text style = { styles.deviceId } > { item.id } </Text>
            </TouchableOpacity>
              )}
            />
          )}
</View>
      ) : (
    <View style= { styles.section } >
    <Text style={ styles.subtitle }> Connected Device: </Text>
        < Text style = { styles.connectedDeviceName } >
            { connectedDevice.name || 'Unknown' }
            </Text>
            < Text style = { styles.connectedDeviceId } > { connectedDevice.id } </Text>

                < TouchableOpacity onPress = { readCharacteristic } style = { styles.button } >
                    <Text style={ styles.buttonText }> Read Characteristic </Text>
                        </TouchableOpacity>
                        < Text style = { styles.dataText } > Read Data: { readData } </Text>
                            < TouchableOpacity
onPress = { monitorCharacteristic }
style = { styles.button } >
    <Text style={ styles.buttonText }> Start Monitor </Text>
        </TouchableOpacity>
        < TouchableOpacity onPress = { stopMonitor } style = { styles.button } >
            <Text style={ styles.buttonText }> Stop Monitor </Text>
                </TouchableOpacity>

{/* get Battery percentage */ }

<TouchableOpacity
            onPress={
    () => {
        readBuzzServoAccVolt = 'voltage';
        writeCharacteristic('0,100,2,v'); // command to request voltage
    }
}
style = { styles.button } >
    <Text style={ styles.buttonText }>
        Get Battery Voltage: { batterPercentage }%
            </Text>
            </TouchableOpacity>

{/* snore result */ }

<TouchableOpacity
            onPress={
    () => {
        readBuzzServoAccVolt = 'servo';
        // writeCharacteristic('220,0,0,s');
        writeCharacteristic('5,100,2,s'); // command to request voltage
        // Simulated arr10SecData (replace this with actual received array of float data)
        // const arr10SecData = [];

        // updateSnoreLevelGraphDataForEvery10Second(arr10SecData);
    }
}
style = { [styles.button, { backgroundColor: '#6f42c1' }]} >
    <Text style={ styles.buttonText }> Detect Snore </Text>
        </TouchableOpacity>

        < Text style = { styles.dataText } > Snore Result: { snoreResult } </Text>

            < TouchableOpacity
onPress = {() => {
    readBuzzServoAccVolt = 'accelerometer';
    writeCharacteristic('0,100,0,a');
}}
style = { styles.button } >
    <Text style={ styles.buttonText }> Set Accelerometer Mode </Text>
        </TouchableOpacity>

{/* second result */ }
<TouchableOpacity
            onPress={ isRecording ? stopAudioCapture : startAudioCapture }
style = {{ backgroundColor: '#007bff', padding: 15, borderRadius: 10 }}>
    <Text style={ { color: '#fff', fontWeight: 'bold' } }>
        { isRecording? 'Stop Listening': 'Start Listening' }
        </Text>
        </TouchableOpacity>

        < TouchableOpacity
onPress = {() => {
    const arr10SecData = getArr10SecData();
    console.log('Last 10 seconds peak data:', arr10SecData);
    updateSnoreLevelGraphDataForEvery10Second(arr10SecData);

    // Send voice to
}}
style = {{
    marginTop: 20,
        backgroundColor: '#28a745',
            padding: 15,
                borderRadius: 10,
                    marginBottom: 20,
            }}>
    <Text style={ { color: '#fff' } }> Print arr10SecData </Text>
        </TouchableOpacity>

{/* Vibrate device */ }

{/* 15 jul code */ }
<TouchableOpacity
            onPress={ isRecording ? stopRecording : startRecording }
style = {{ backgroundColor: '#6f42c1', padding: 15, borderRadius: 10 }}>
    <Text style={ { color: '#fff', textAlign: 'center' } }>
        { isRecording? 'Stop': 'Start Recording' }
        </Text>
        </TouchableOpacity>

        < TouchableOpacity
onPress = {() => writeCharacteristic('0,100,1,b')}
style = { styles.button } >
    <Text style={ styles.buttonText }> Write Data to Device </Text>
        </TouchableOpacity>

        < Text style = { styles.dataText } > Monitored Data: { monitoredData } </Text>

            < TouchableOpacity
onPress = { disconnectDevice }
style = { [styles.button, styles.disconnectButton]} >
    <Text style={ styles.buttonText }> Disconnect </Text>
        </TouchableOpacity>
        </View>
      )}
</ScrollView>
  );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f0f2f5',
        paddingTop: 50,
    },
    title: {
        fontSize: 26,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
        color: '#333',
    },
    statusText: {
        fontSize: 16,
        marginBottom: 15,
        textAlign: 'center',
        color: '#555',
    },
    section: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 15,
        marginBottom: 20,
        elevation: 3,
    },
    subtitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 10,
        color: '#333',
    },
    button: {
        backgroundColor: '#007bff',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 10,
    },
    disconnectButton: {
        backgroundColor: '#dc3545',
        marginBottom: 50,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    deviceItem: {
        backgroundColor: '#e9ecef',
        padding: 10,
        borderRadius: 5,
        marginBottom: 8,
    },
    deviceName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    deviceId: {
        fontSize: 12,
        color: '#666',
    },
    connectedDeviceName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#28a745',
        marginBottom: 5,
    },
    connectedDeviceId: {
        fontSize: 14,
        color: '#666',
        marginBottom: 15,
    },
    dataText: {
        fontSize: 16,
        marginVertical: 8,
        color: '#333',
    },
});

export default App;
