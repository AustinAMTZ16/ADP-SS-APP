import {platformStyle} from "../../theme";

const React = require("react-native");
const { StyleSheet } = React;


export default {
  containerMap: {
    width: platformStyle.deviceWidth,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
    height: platformStyle.platform === 'ios' ? platformStyle.deviceHeight - 125 : platformStyle.deviceHeight - 140,
    width: platformStyle.deviceWidth,
  },
};
