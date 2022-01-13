import {platformStyle} from "../../../theme";
import sharedStyles from '../../../shared/styles';

export default {
  listItemRow: {
    self: {
      ...sharedStyles.margin( 'bottom', 2 ),
      height: 'auto'
    },
    left: {
      ...sharedStyles.alignItems('end'),
      ...sharedStyles.justifyContent('end'),
      ...sharedStyles.margin('right', 2),
      ...sharedStyles.margin('top', platformStyle.platform === 'ios' ? 1 : 0),
    },
    text: {
      ...sharedStyles.margin('left', 0),
      ...sharedStyles.textAlign('right'),
    },
    accountText: {
      textDecorationLine: 'underline'
    }
  }
};
