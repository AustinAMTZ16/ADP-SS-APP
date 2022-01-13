import React, { Component } from "react";
import { TouchableOpacity, Image } from 'react-native';
import {
  Container,
  Header,
  Icon,
  View,
  Text,
} from "native-base";
import {platformStyle} from "../../theme";
import styles from "./styles";
import { RNCamera } from 'react-native-camera';
import I18n from 'react-native-i18n';

const LATITUDE = -1.2757863;
const LONGITUDE = 36.7904395;
const LATITUDE_DELTA = 6;
const LONGITUDE_DELTA = 6;

class Initial extends Component {


  constructor( props ) {
    super(props);
    this.state = {
      showCamera: false,
      visible: true,
      markers: [],
      hackHeight: 1,
      regionChangue: null,
      region: {
        latitude: LATITUDE,
        longitude: LONGITUDE,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      },
    };
    this.markers = {};
    this.mapRef = null;
  }

  componentWillMount() {

  }

  componentDidMount() {

  }

  onBarCodeRead( e ) {
    let barcode = e.data.match(/\d/g);
    barcode = barcode.join("");
    this.setState({ showCamera: false, barCode: barcode })

  }

  takePicture() {
    const options = {};
    this.camera.capture({ metadata: options })
      .then(( data ) => console.log('*****', data))
      .catch(err => console.error(err));
  }

  render() {

    return (
      <Container>
        <Header transparent hide androidStatusBarColor={platformStyle.statusBarColor}
                iosBarStyle="light-content"></Header>
        <View style={{
          ...styles.containerMap,
        }}>
        </View>

        <TouchableOpacity
          onPress={() => {
            this.setState({ showCamera: true });
          }}
          style={{
            flexDirection: "row",
            position: "relative",
            paddingTop: 15,
            paddingLeft: 20,
          }}>

          <Icon name="md-barcode"
                style={{ fontSize: 30 }}/>

        </TouchableOpacity>

        {this.state.showCamera &&
        <View style={{ height: 100 }}>
          <RNCamera
            ref={ref => {
              this.camera = ref;
            }}
            onBarCodeRead={this.onBarCodeRead.bind(this)}
            style={styles.preview}
            type={RNCamera.Constants.Type.back}
            flashMode={RNCamera.Constants.FlashMode.on}
            permissionDialogTitle={I18n.t('MSG001')}
            permissionDialogMessage={I18n.t('MSG002')}
          >
            <Text style={styles.capture} onPress={() => {
              this.setState({ showCamera: false });
            }}>[X]</Text>
          </RNCamera>
        </View>}
      </Container>
    );
  }
}

export default Initial;
