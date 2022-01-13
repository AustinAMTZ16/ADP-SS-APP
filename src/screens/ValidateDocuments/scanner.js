import React, { PureComponent } from 'react';
import { AppRegistry, StyleSheet, Text, TouchableOpacity, View, Platform } from 'react-native';
import { RNCamera } from 'react-native-camera';
import styles from "./style";
import I18n from 'react-native-i18n';

class QRCodeScanner extends PureComponent {
  
  constructor(props) {
    super(props)
    //
  }

  render() {
    let gvBarcodeType = null
    let regulatBarcodeType = RNCamera.Constants.BarCodeType.qr

    if (Platform.OS === 'android')
      gvBarcodeType = RNCamera.Constants.GoogleVisionBarcodeDetection.BarcodeType.QR_CODE
    
    return (
      <View style={styles.cameraContainer}>
        {Platform.OS === 'android' ? 
            <RNCamera
                ref={ref => {
                  this.camera = ref;
                }}
                autoFocus={RNCamera.Constants.AutoFocus.on}
                style={styles.cameraPreview}
                type={RNCamera.Constants.Type.back}
                flashMode={RNCamera.Constants.FlashMode.auto}
                androidCameraPermissionOptions={{
                  title: 'Permission to use camera',
                  message: 'We need your permission to use your camera',
                  buttonPositive: 'Ok',
                  buttonNegative: 'Cancel',
                }}
                detectedImageInEvent={false}

                googleVisionBarcodeType={gvBarcodeType}
                onGoogleVisionBarcodesDetected={( result ) => {
                  if (result && result.type === gvBarcodeType && result.data) {
                    if (this.props.navigation.state.params.onScanResult) {
                      this.props.navigation.state.params.onScanResult(result.data)
                      this.props.navigation.goBack()
                    }
                  }
                }}
                
                barCodeTypes={[regulatBarcodeType]}
                onBarCodeRead={( result ) => {
                  if (result && result.type === regulatBarcodeType && result.data) {
                    if (this.props.navigation.state.params.onScanResult) {
                      this.props.navigation.state.params.onScanResult(result.data)
                      this.props.navigation.goBack()
                    }
                  }
                }}
            /> :

            <RNCamera
              ref={ref => {
                this.camera = ref;
              }}
              autoFocus={RNCamera.Constants.AutoFocus.on}
              style={styles.cameraPreview}
              type={RNCamera.Constants.Type.back}
              flashMode={RNCamera.Constants.FlashMode.auto}
              detectedImageInEvent={false}

              barCodeTypes={[regulatBarcodeType]}
              onBarCodeRead={( result ) => {
                if (result && result.type === regulatBarcodeType && result.data) {
                  if (this.props.navigation.state.params.onScanResult) {
                    this.props.navigation.state.params.onScanResult(result.data)
                    this.props.navigation.goBack()
                  }
                }
              }}
          />
        }
        <View style={{ flex: 0, flexDirection: 'row', justifyContent: 'center' }}>
          <TouchableOpacity onPress={this.onCancel.bind(this)} style={styles.cameraCancel}>
            <Text style={{ fontSize: 16, color: 'black' }}>{I18n.t('cancel')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  onCancel = async () => {
    this.props.navigation.goBack()
  };
}


export default QRCodeScanner;