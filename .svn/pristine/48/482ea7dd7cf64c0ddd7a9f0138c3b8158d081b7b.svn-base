import {platformStyle} from "../../../theme";
import sharedStyles from '../../../shared/styles';
import { Dimensions } from 'react-native';
const { width } = Dimensions.get('window');

export default {
  listItemRow: {
    self: {
      ...sharedStyles.margin( 'bottom', 2 ),
      height: 'auto'
    },
    left: {
      ...sharedStyles.justifyContent('end'),
      ...sharedStyles.alignSelf('start'),
      ...sharedStyles.margin('right', 2),
      ...sharedStyles.margin('top', platformStyle.platform === 'ios' ? 1 : 0),
    },
    text: {
      ...sharedStyles.margin('left', 0)
    },
    accountText: {
      textDecorationLine: 'underline'      
    }
  },

  // Utilities
  highLight:{
    backgroundColor: platformStyle.brandYellowLight,
  },

  image: {
    width: 'auto',
    height: 80
  },

  slide: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'transparent'
  }

};
