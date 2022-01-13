const React = require("react-native");
const { Dimensions, Platform, StyleSheet } = React;

import {platformStyle} from "../../../theme";
import sharedStyles from '../../../shared/styles';

export default {
  infoContainer: {
    ...sharedStyles.padding()
  },
  formContainer: {
    paddingHorizontal: 20,
    ...sharedStyles.padding( 'vertical' )
  },
  map: {
    ...StyleSheet.absoluteFillObject
  },
};
