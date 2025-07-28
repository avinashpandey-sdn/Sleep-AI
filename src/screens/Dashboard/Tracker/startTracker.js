import {Images} from '@assets/index';
import DeviceConnectSheet from '@components/Sheets/DeviceConnectSheet';
import {useNavigation} from '@react-navigation/native';
import {Buffer} from 'buffer';

import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  Alert,
  Image,
  ImageBackground,
  NativeEventEmitter,
  PermissionsAndroid,
  Platform,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {BleManager} from 'react-native-ble-plx';
import {styles} from './startTrackerStyle';

const UART_SERVICE_UUID = 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx';
const UART_TX_UUID = 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx';
const UART_RX_UUID = 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx';
let voltage = 0;
let readBuzzServoAccVolt = 'voltage';
const SERVICE_UUID = '6e400001-b5a3-f393-e0a9-e50e24dcca9e'; //
const CHARACTERISTIC_UUID_READ = '00002a00-0000-1000-8000-00805f9b34fb'; // [3]
const CHARACTERISTIC_UUID_NOTIFY = '6e400003-b5a3-f393-e0a9-e50e24dcca9e'; //
const CHARACTERISTIC_UUID_WRITE = '6e400002-b5a3-f393-e0a9-e50e24dcca9e'; //
const formatTime = seconds => {
  if (seconds < 60) {
    return `${seconds} s`;
  } else if (seconds < 3600) {
    const minutes = Math.floor(seconds / 60);
    return `${minutes} m`;
  } else {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours} h ${minutes} m`;
  }
};

export default function StartTracker() {
  const bleManager = new BleManager();

  const eventEmitter = Platform.OS == 'android' ? new NativeEventEmitter() : '';
  const navigation = useNavigation();
  const monitorSubscription = useRef(null);
  const DeviceConnectSheetRef = useRef(null);
  const intervalRef = useRef(null);

  const [time, setTime] = useState('00:00');
  const [duration, setDuration] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [recordingStatus, setRecordingStatus] = useState(true);
  const [bluetoothState, setBluetoothState] = useState(null);
  const [CONNECTED_PERIPHERAL, setCONNECTED_PERIPHERAL] = useState();
  const [scannedDevices, setScannedDevices] = useState([]);
  const [connectedDevice, setConnectedDevice] = useState(null); // null
  const [maskOn, setMaskOn] = useState(false);
  const [batteryPercentage, setBatteryPercentage] = useState(0);
  const [monitoredData, setMonitoredData] = useState('N/A');
  const showAlert = () => {
    Alert.alert(
      'Stop Timer',
      'Are you sure you want to stop the timer?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: () => stopTracker(),
        },
      ],
      {cancelable: false},
    );
  };
  useEffect(() => {
    // if (isRunning) {
    //   intervalRef.current = setInterval(() => {
    //     setDuration(prev => prev + 1);
    //   }, 1000);
    // }
    // return () => clearInterval(intervalRef.current);
  }, [isRunning]);

  const handleConnectDevice = device => {
    if (Object.keys(device).length > 0) {
      setIsConnected(true);
      setIsRunning(true);
    } else {
      setIsConnected(false);
      setIsRunning(false);
    }

    // Your logic here
  };

  useEffect(() => {
    const updateClock = () => {
      const date = new Date();
      let hours = date.getHours();
      const minutes = date.getMinutes();
      const ampm = hours >= 12 ? 'PM' : 'AM';

      // If you want 12-hour format, uncomment the line below
      hours = hours % 12 || 12;

      const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes
        .toString()
        .padStart(2, '0')} ${ampm}`;

      setTime(formattedTime);
    };

    updateClock(); // Initial call
    const timer = setInterval(updateClock, 1000);
    return () => clearInterval(timer);
  }, []);

  // check the bluetooth status

  useEffect(() => {
    const subscription = bleManager.onStateChange(state => {
      setBluetoothState(state);
      if (state === 'PoweredOn') {
        setCONNECTED_PERIPHERAL(true);
      } else {
        // Alert.alert('Bluetooth', `Bluetooth is ${state}`);
        setCONNECTED_PERIPHERAL(false);
      }
    }, true);
    return () => subscription.remove();
  }, []);

  useEffect(() => {
    if (CONNECTED_PERIPHERAL) {
      startScan();
    }
  }, [CONNECTED_PERIPHERAL]);

  const requestPermissions = async () => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
    return true;
  };

  const startScan = useCallback(async () => {
    if (bluetoothState !== 'PoweredOn') {
      Alert.alert('Bluetooth Off', 'Please enable Bluetooth.');
      return;
    }
    const hasPermissions = await requestPermissions();

    if (!hasPermissions) return;
    setScannedDevices([]);

    bleManager.startDeviceScan(
      null,
      {allowDuplicates: false},
      (error, device) => {
        if (error) {
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
    }, 10000);
  }, [bluetoothState, requestPermissions]);

  const connectToDevice = useCallback(async device => {
    bleManager.stopDeviceScan();
    try {
      const connected = await device.connect();
      const filteredDevices = scannedDevices.filter(
        item => item?.localName !== connected.name,
      );
      handleConnectDevice(connected);
      setMaskOn(true);
      setScannedDevices(filteredDevices);
      setConnectedDevice(connected);

      await connected.discoverAllServicesAndCharacteristics();
      const services = await connected.services(); // [1, 15]
      for (const service of services) {
        const characteristics = await service.characteristics(); // [14]

        for (const char of characteristics) {
          if (char.uuid === UART_TX_UUID) {
          } else if (char.uuid === UART_RX_UUID) {
          }
        }
      }

      if (Platform.OS === 'android') {
        await connected.requestMTU(256);
      }

      const rssi = await connected.readRSSI();
      const name = connected.name || 'Unknown Device';
      const uniqueID = connected.id;

      const dictUserInfo = {
        rssi,
        name,
        uniqueID,
      };

      eventEmitter.emit('KRefreshTestYourMaskVC', dictUserInfo);

      Alert.alert(
        'Connected',
        `Connected to ${connected.name || connected.id}`,
      );
    } catch (error) {
      setConnectedDevice(null);
    }
  }, []);

  const writeCharacteristic = useCallback(async text => {
    if (!connectedDevice) {
      Alert.alert('Not Connected', 'Please connect to a device first.');
      return;
    }
    try {
      const maxPacketSize = (connectedDevice.mtu || 23) - 3;

      const dataBuffer = Buffer.from(text, 'utf8');
      let offset = 0;

      while (offset < dataBuffer.length) {
        const chunkSize = Math.min(dataBuffer.length - offset, maxPacketSize);
        const chunk = dataBuffer.slice(offset, offset + chunkSize);
        const base64Chunk = chunk.toString('base64');

        await connectedDevice.writeCharacteristicWithResponseForService(
          SERVICE_UUID,
          CHARACTERISTIC_UUID_WRITE,
          base64Chunk,
        ); // [16]

        offset += chunkSize;
        lay;
      }

      Alert.alert('Write Success', `Successfully sent: "${text}"`);
    } catch (error) {}
  });
  function calcPosition(x, y, z) {
    let accelAngleX = Math.atan(x / Math.sqrt(y * y + z * z)) * (180 / Math.PI);
    if (z < 0) accelAngleX = Math.abs(accelAngleX - 180);
    else if (x < 0 && z > 0) accelAngleX = Math.abs(accelAngleX + 360);

    let position = accelAngleX + 26.0;
    if (position > 360) position -= 360;
    return position;
  }

  const handleHardwareCalculation = validUTF8String => {
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
      }
    } else if (readBuzzServoAccVolt === 'voltage') {
      if (arrPosition.length >= 5) {
        const voltage = parseFloat(arrPosition[4]) || 0;

        const y = 0.5857 * voltage - 1658.1;
        let finalPercent = Math.round(y);

        if (finalPercent > 98) finalPercent = 100;
        if (finalPercent < 0) finalPercent = 0;
        setBatteryPercentage(finalPercent);
      }
    }
  };

  const monitorCharacteristic = useCallback(async () => {
    try {
      monitorSubscription.current =
        connectedDevice.monitorCharacteristicForService(
          SERVICE_UUID,
          CHARACTERISTIC_UUID_NOTIFY,
          (error, characteristic) => {
            if (error) {
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

              handleHardwareCalculation(decodedData);
            }
          },
        );
    } catch (error) {
      // Alert.alert(
      //   'Monitoring Failed',
      //   `Could not start monitoring: ${error.message} (Code: ${error.errorCode})`,
      // );
    }
  });

  useEffect(() => {
    if (connectedDevice != null) {
      setTimeout(() => {
        monitorCharacteristic();
      }, 2000);
    }

    monitorCharacteristic();
  }, [connectedDevice]);

  useEffect(() => {
    if (connectedDevice != null) {
      setTimeout(() => {
        readBuzzServoAccVolt = 'voltage';
        writeCharacteristic('0,100,2,v');
      }, 5000);
    }
  }, [connectedDevice]);

  const disconnectDevice = useCallback(async () => {
    if (connectedDevice) {
      try {
        await connectedDevice.cancelConnection();
        setConnectedDevice(null);
        setMonitoredData('N/A');
        monitorSubscription.current?.remove();
        monitorSubscription.current = null;
        Alert.alert('Disconnected');
        handleConnectDevice({});
        startScan();
      } catch (error) {
        Alert.alert('Disconnection Error', error.message);
      }
    } else {
      Alert.alert('No Device Connected');
    }
  }, [connectedDevice]);

  // ----------- process on start
  const onRecord = async () => {
    setRecordingStatus(false); // recording start
  };

  // -------------- process on stop
  const stopTracker = () => {
    clearInterval(intervalRef.current);
    setIsRunning(false);
    setRecordingStatus(true);
  };

  return (
    <ImageBackground
      source={Images.trackerBackground}
      style={styles.background}>
      <View>
        <TouchableOpacity
          style={styles.sleepMaskBox}
          onPress={() => {
            DeviceConnectSheetRef.current?.show();
          }}>
          <Image source={Images.maskIcon} style={styles.sleepMaskIcon} />
          <View>
            <Text style={styles.sleepMaskText}>Sleep Mask</Text>
            <Text style={styles.sleepMaskSubText}>
              {isConnected ? 'Connected' : 'Not Connected'}
            </Text>
          </View>
        </TouchableOpacity>

        {/* Clock */}
        <Text style={styles.clock}>{time}</Text>
        {duration > 0 && (
          <View style={{alignItems: 'center'}}>
            <Text style={styles.Duration}>Duration</Text>
            <Text style={styles.durationTime}>{formatTime(duration)}</Text>
          </View>
        )}
      </View>

      <View>
        {/* Play Button */}
        <View style={{marginBottom: 70}}>
          <TouchableOpacity
            style={styles.playButton}
            onPress={() => {
              {
                isConnected
                  ? recordingStatus
                    ? onRecord()
                    : showAlert()
                  : DeviceConnectSheetRef.current?.show();
              }
            }}>
            <Image
              source={recordingStatus ? Images.pauseIcon : Images.playIcon}
              style={styles.playIcon}
            />
          </TouchableOpacity>
          <Text style={styles.trackText}>Press to track your sleep</Text>
        </View>
      </View>

      <DeviceConnectSheet
        sheetRef={DeviceConnectSheetRef}
        onClose={() => {
          DeviceConnectSheetRef.current?.hide();
        }}
        connectDevice={handleConnectDevice}
        CONNECTED_PERIPHERAL={CONNECTED_PERIPHERAL}
        setCONNECTED_PERIPHERAL={setCONNECTED_PERIPHERAL}
        scannedDevices={scannedDevices}
        setScannedDevices={setScannedDevices}
        connectToDevice={connectToDevice}
        startScan={startScan}
        disconnectDevice={disconnectDevice}
        maskOn={maskOn}
        setMaskOn={setMaskOn}
        batteryPercentage={batteryPercentage}
        connectedDevice={connectedDevice}
        setConnectedDevice={setConnectedDevice}
        monitoredData={monitoredData}
        setMonitoredData={setMonitoredData}
      />
    </ImageBackground>
  );
}
