// Barcode and QR Code Scanner using Camera in React Native
// https://aboutreact.com/react-native-scan-qr-code/

// import React in our code
import React, {useEffect, useRef, useState} from 'react';

// import all the components we are going to use
import {
  SafeAreaView,
  Text,
  View,
  Linking,
  TouchableHighlight,
  PermissionsAndroid,
  Platform,
  StyleSheet,
  Rationale,
  Alert,
  Dimensions,
  TouchableOpacity,
  Image,
} from 'react-native';

// import CameraScreen
import {Camera, CameraScreen, CameraType} from 'react-native-camera-kit';

const App = () => {
  const [qrvalue, setQrvalue] = useState('');
  const [opneScanner, setOpneScanner] = useState(false);
  const camRef = useRef(null);
  const onOpenlink = () => {
    // If scanned then function to open URL in Browser
    Linking.openURL(qrvalue);
  };
  const {height, width} = Dimensions.get('window');
  const maskRowHeight = Math.round((height - 300) / 20);
  const maskColWidth = (width - 300) / 2;
  const onBarcodeScan = (qrvalue: any) => {
    // Called after te successful scanning of QRCode/Barcode
    setQrvalue(qrvalue);
    setOpneScanner(false);
  };
  const [torchMode, setTorchMode] = useState(false);

  const onOpneScanner = () => {
    // To Start Scanning
    if (Platform.OS === 'android') {
      async function requestCameraPermission() {
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.CAMERA,
            {
              title: 'Camera Permission',
              message: 'App needs permission for camera access',
            } as Rationale,
          );
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            // If CAMERA Permission is granted
            setQrvalue('');
            setOpneScanner(true);
          } else {
            Alert.alert('CAMERA permission denied');
          }
        } catch (err) {
          Alert.alert(`Camera permission err: ${err}`);
          console.warn(err);
        }
      }
      // Calling the camera permission function
      requestCameraPermission();
    } else {
      setQrvalue('');
      setOpneScanner(true);
    }
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      {opneScanner ? (
        <View style={{flex: 1}}>
          <Camera
            style={styles.cameraView}
            ref={camRef}
            cameraType={CameraType.Back} // front/back(default)
            torchMode={torchMode ? 'on' : 'off'}
            // torchMode={torchMode}
            scanBarcode={true}
            onReadCode={(event: any) =>
              onBarcodeScan(event.nativeEvent.codeStringValue)
            } // optional
            showFrame={false} // (default false) optional, show frame with transparent layer (qr code or barcode will be read on this area ONLY), start animation for scanner, that stops when a code has been found. Frame always at center of the screen
            laserColor="black" // (default red) optional, color of laser in scanner frame
            frameColor="white" // (default
            hideControls={false}
          />
          <View
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              backgroundColor: 'rgba(0.2, 0.2, 0.2, 0.2)',
              // backgroundColor: 'rgba(1,1,1,0.6)',
              alignItems: 'center',
              justifyContent: 'space-around',
            }}>
              <View style={{height: 30, width: 300, justifyContent: 'flex-end', flexDirection: 'row'}}>
              <TouchableOpacity onPress={() => setOpneScanner(false)}>
                <Image source={require('./cancel.png')} style={{width: 20, height: 30, tintColor: 'white'}}/>
              </TouchableOpacity>
</View>
            <View
              style={{
                width: 300,
                height: 300,
                backgroundColor: 'transparent',
                borderColor: 'white',
                borderWidth: 1,
              }}
            />
            
            <View
            style={{
              width: 300,
              height: 30,
              // backgroundColor: 'white',
              // opacity: 0.1
              justifyContent: 'space-around',
              alignItems: 'center',
              flexDirection: 'row',
            }}
            >
              <TouchableOpacity onPress={() => setTorchMode(!torchMode)}>
                <Image source={require('./flash.png')} style={{width: 20, height: 30, tintColor: 'white'}}/>
              </TouchableOpacity>
              <TouchableOpacity>
                <Image source={require('./gallery.png')} style={{width: 30, height: 30,  tintColor: 'white'}}/>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      ) : (
        <View style={styles.container}>
          <Text style={styles.titleText}>
           QR Code Scanner
          </Text>
          <Text style={styles.textStyle}>
            {qrvalue ? 'Scanned Result: ' + qrvalue : ''}
          </Text>
          {qrvalue.includes('https://') ||
          qrvalue.includes('http://') ||
          qrvalue.includes('geo:') ? (
            <TouchableHighlight onPress={onOpenlink}>
              <Text style={styles.textLinkStyle}>
                {qrvalue.includes('geo:') ? 'Open in Map' : 'Open Link'}
              </Text>
            </TouchableHighlight>
          ) : null}
          <TouchableHighlight
            onPress={onOpneScanner}
            style={styles.buttonStyle}>
            <Text style={styles.buttonTextStyle}>Open QR Scanner</Text>
          </TouchableHighlight>
        </View>
      )}
    </SafeAreaView>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  cameraView: {
    flex: 1,
    justifyContent: 'center',
  },
  maskOutter: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  maskInner: {
    width: 300,
    backgroundColor: 'transparent',
    borderColor: 'white',
    borderWidth: 1,
  },
  maskFrame: {
    backgroundColor: 'rgba(1,1,1,0.6)',
  },
  maskRow: {
    width: '100%',
  },
  maskCenter: {flexDirection: 'row'},
  titleText: {
    fontSize: 22,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  textStyle: {
    color: 'black',
    fontSize: 16,
    textAlign: 'center',
    padding: 10,
    marginTop: 16,
  },
  buttonStyle: {
    fontSize: 16,
    color: 'white',
    backgroundColor: 'green',
    padding: 5,
    minWidth: 250,
  },
  buttonTextStyle: {
    padding: 5,
    color: 'white',
    textAlign: 'center',
  },
  textLinkStyle: {
    color: 'blue',
    paddingVertical: 20,
  },
});
