import {Images} from '@assets/index';
import {APP_COLORS} from '@constants/color';
import React from 'react';
import {
  FlatList,
  Image,
  ImageBackground,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import ActionSheet from 'react-native-actions-sheet';
import {moderateScale} from 'react-native-size-matters';

import CustomHeader from '@components/CustomHeader';

const DeviceConnectSheet = ({
  sheetRef,
  item = {},
  onClose,
  connectDevice,
  CONNECTED_PERIPHERAL,
  setCONNECTED_PERIPHERAL,
  scannedDevices,
  setScannedDevices,
  connectToDevice,
  startScan,
  disconnectDevice,
  maskOn,
  setMaskOn,
  batteryPercentage,
  connectedDevice,
  setConnectedDevice,
  monitoredData,
  setMonitoredData,
}) => {
  return (
    <ActionSheet ref={sheetRef} containerStyle={styles.actionContainer}>
      <ImageBackground source={Images.background} style={styles.container}>
        {/* header */}
        <CustomHeader
          type="second"
          firstIcon={<Image source={Images.back} style={styles.rightIcon} />}
          firstIconClick={onClose}
          secondIcon={
            <Text style={{fontSize: 16, fontWeight: '400', color: '#FFFFFF'}}>
              Sleep Mask
            </Text>
          }
        />

        <View style={styles.contentHeader}>
          {/* Bluetooth Toggle */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Bluetooth</Text>
            <Switch
              value={CONNECTED_PERIPHERAL}
              // value={true}
              onValueChange={() => {
                //   bluetoohEnable();
              }}
              thumbColor="#fff"
              trackColor={{false: '#555', true: '#6832C4'}}
            />
          </View>

          {/* BlueTooth Connect Info box*/}
          {connectedDevice != null && (
            <View style={styles.deviceCard}>
              <View style={styles.deviceHeader}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 8,
                  }}>
                  <Image
                    source={Images.maskIcon}
                    style={styles.sleepMaskIcon}
                  />
                  <Text style={styles.otherDeviceText}>
                    {connectedDevice?.name?.length > 20
                      ? connectedDevice?.name.substring(0, 20) + '...'
                      : connectedDevice?.name}
                  </Text>
                </View>

                <View style={styles.connectedRow}>
                  <Text style={styles.connectedText}>Connected</Text>
                </View>
              </View>

              <Text style={styles.label}>Hupnos Device Battery level</Text>

              <View style={styles.batteryBox}>
                <View style={styles.batteryRow}>
                  <Image source={Images.batterIcon} style={styles.batterIcon} />
                  <Text style={styles.batteryText}>Battery Left</Text>
                  <Text style={styles.batteryPercent}>
                    {batteryPercentage}%
                  </Text>
                </View>
                <View
                  style={{
                    borderWidth: 1,
                    borderColor: '#BFBFBF14',
                    marginVertical: 11,
                  }}
                />
                <View style={styles.switchRow}>
                  <Text style={styles.maskText}>Turn off Hupnos Mask</Text>
                  <Switch
                    value={maskOn}
                    onValueChange={() => {
                      disconnectDevice(), setMaskOn(!maskOn);
                    }}
                    thumbColor="#fff"
                    trackColor={{false: '#555', true: '#6832C4'}}
                  />
                </View>
              </View>
            </View>
          )}

          {/* other Device */}
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            <Text style={styles.otherTitle}>Available Devices</Text>
            <TouchableOpacity onPress={startScan}>
              <Image source={Images.refresh} style={styles.refresh} />
            </TouchableOpacity>
          </View>

          <FlatList
            // data={scannedDevices}
            data={scannedDevices.filter(item =>
              item.localName?.toLowerCase().startsWith('hupnos'),
            )}
            keyExtractor={item => item.id}
            renderItem={({item, index}) => (
              <View>
                <View style={styles.otherDeviceCard}>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Image
                      source={Images.blueToothIcon}
                      style={styles.blueToothIcon}
                    />
                    <Text style={styles.otherDeviceText}>
                      {item.localName?.length > 20
                        ? item.localName.substring(0, 20) + '...'
                        : item.localName}
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => {
                      connectToDevice(item);
                    }}>
                    <Text style={styles.connectText}>Connect</Text>
                  </TouchableOpacity>
                </View>
                <View
                  style={{
                    borderWidth: 1,
                    borderColor: '#BFBFBF14',
                  }}
                />
              </View>
            )}
          />
        </View>
      </ImageBackground>
    </ActionSheet>
  );
};

const styles = StyleSheet.create({
  actionContainer: {backgroundColor: 'black', height: '100%'},
  background: {},
  container: {
    height: '100%',
  },
  refresh: {
    height: 18,
    width: 18,
    resizeMode: 'contain',
    marginRight: 10,
  },
  contentHeader: {
    paddingHorizontal: 24,
  },
  sleepMaskIcon: {
    width: 20,
    height: 10,
  },
  progressHeaderContainer: {
    paddingHorizontal: 24,
    paddingTop: 20,
    backgroundColor: 'transparent',
  },
  pageText: {
    color: APP_COLORS.WHITE,
    marginLeft: 10,
    marginRight: 'auto',
  },
  skipText: {
    color: APP_COLORS.WHITE,
    fontSize: 16,
    textAlign: 'right',
  },
  scroll: {
    flexGrow: 1,
    alignItems: 'center',
    marginTop: moderateScale(15),
    // marginTop: moderateScale(42),
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    flex: 1,
    textAlign: 'center',
    fontSize: 22,
    color: '#fff',
    fontWeight: '600',
    marginRight: 28, // to offset back icon
  },
  section: {
    backgroundColor: '#1B0B3A',
    borderRadius: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    marginBottom: 20,
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '500',
  },
  deviceCard: {
    backgroundColor: '#1B0B3A',
    borderRadius: 14,
    padding: 20,
    marginBottom: 20,
  },
  deviceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  deviceName: {
    color: '#fff',
    fontSize: 16,
  },
  connectedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  connectedText: {
    color: '#888',
    fontSize: 14,
    marginRight: 4,
  },
  label: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '400',
    marginBottom: 10,
    marginTop: 28,
    marginBottom: 8,
  },
  batteryBox: {
    backgroundColor: '#240F4E',
    borderRadius: 10,
    padding: 15,
  },
  batteryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  batteryIcon: {
    fontSize: 12,
    fontWeight: '400',
    marginRight: 8,
  },
  batteryText: {
    flex: 1,
    color: '#fff',
    fontSize: 15,
  },
  batteryPercent: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  maskText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '400',
  },
  otherTitle: {
    color: '#9F67FF',
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 12,
  },
  otherDeviceCard: {
    backgroundColor: '#1B0B3A',
    borderRadius: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 18,
    marginBottom: 12,
  },
  otherDeviceText: {
    color: '#fff',
    fontSize: 15,
  },
  connectText: {
    color: '#999',
    fontSize: 12,
  },
  rightIcon: {
    width: 30,
    height: 30,
    resizeMode: 'contain',
  },
  batterIcon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
    marginRight: 8,
  },
  blueToothIcon: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
    marginRight: 8,
  },
});

export default DeviceConnectSheet;
