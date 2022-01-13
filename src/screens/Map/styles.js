const React = require("react-native");
const { Dimensions, Platform, StyleSheet } = React;

import {platformStyle} from "../../theme";


export default {

  containerMap: {
    width: platformStyle.deviceWidth,

  },
  map: {
    ...StyleSheet.absoluteFillObject
  },


};
