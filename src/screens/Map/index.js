import React, { Component } from "react";
import { Image } from "react-native";
import {
  View,
  Text,
} from "native-base";
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import styles from "./styles";
import {platformStyle} from "../../theme";
import Config from 'react-native-config';

const ASPECT_RATIO = platformStyle.deviceWidth / (platformStyle.deviceHeight + 25);
const LATITUDE = parseFloat(Config.MAP_INITIAL_LOCATION_LATITUDE); //40.4167;
const LONGITUDE = parseFloat(Config.MAP_INITIAL_LOCATION_LONGITUDE); //-3.70325;
const LATITUDE_DELTA = parseFloat(Config.MAP_ZOOM_DELTA); //6;
const LONGITUDE_DELTA = parseFloat(Config.MAP_ZOOM_DELTA); //6;
const SPACE = 0.01;


class MapPage extends Component {
  constructor( props ) {
    super(props);
    this.state = {
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

  /**
   *
   * @param nextProps
   */
  componentWillReceiveProps( nextProps ) {
    if( this.props.markers !== nextProps.markers && nextProps.markers.length ) {      
      this.loadData(nextProps.markers);
      setTimeout(() => {
        this.setState({ hackHeight: 2 }, function() {
          this.focusMap();
        }.bind(this))
      }, 500);
    }
  }

  /**
   *
   */
  componentDidMount() {

    this.loadData(this.props.markers);
    setTimeout(() => {
      this.setState({ hackHeight: 2 }, function() {
        this.focusMap();
      }.bind(this))
    }, 500);


  }

  loadData( propMarkers ) {
    let cords = [];
    _.map(propMarkers, function( marker ) {
      cords.push({
        latitude: Number(marker.geometry.coordinates[ 0 ]),
        longitude: Number(marker.geometry.coordinates[ 1 ])
      });
    });

    this.setState({ markersfit: cords, markers: propMarkers });
  }

  focusMap() {
    if( this.state.markersfit && this.state.markersfit.length >= 1 ) {
      this.mapRef.fitToCoordinates(this.state.markersfit, {
        edgePadding: { top: 100, right: 40, bottom: 100, left: 40 },
        animated: false,
      });
    }
  }


  render() {
    return (

      <View style={{
        ...styles.containerMap,
        height: this.props.height ? this.props.height + this.state.hackHeight : (platformStyle.deviceHeight - 200) + this.state.hackHeight
      }}>

        <MapView
          provider={PROVIDER_GOOGLE}
          ref={( ref ) => {
            this.mapRef = ref
          }}
          initialRegion={this.state.region}
          style={styles.map}

          loadingEnabled={true}
          showsUserLocation={true}
          toolbarEnabled={true}
          showsMyLocationButton={true}
          showsCompass={true}
          followsUserLocation={true}
          zoomEnabled={true}
          rotateEnabled={true}
        >

          {this.state.markers.map(( marker, index ) => {

            if( marker.coordenates_type === 'origin' && marker.geometry && marker.geometry.coordinates ) {

              let coordinate = {
                latitude: Number(marker.geometry.coordinates[ 0 ]),
                longitude: Number(marker.geometry.coordinates[ 1 ]),
              };
              let color = '#008b8b';

              return (
                <MapView.Marker
                  key={marker.properties.itemID}
                  pinColor={color}
                  coordinate={coordinate}
                  title={marker.title}
                  draggable={marker.draggable}
                  onDragEnd={(e) => {                   
                    if(this.props.onDragEnd){                     
                      this.props.onDragEnd(e.nativeEvent.coordinate);
                    }
                  }}
                  description={marker.description}
                  onPress={( e ) => {
                    this.setState({ hackHeight: 1 });
                  }}
                >
                </MapView.Marker>
              )
            }
          })}

        </MapView>

      </View>


    );
  }
}

export default MapPage;
