import {platformStyle} from "../../../theme";
import sharedStyles from '../../../shared/styles';

export default {
  listItemRow: {
    self: {
      height: 'auto'
    },
    left: {
      ...sharedStyles.justifyContent( 'end' ),
      ...sharedStyles.alignSelf( 'start' ),
      ...sharedStyles.margin( 'right', 2 ),
      ...sharedStyles.margin( 'top', platformStyle.platform === 'ios' ? 1 : 0 ),
    },
    text: {
      ...sharedStyles.margin( 'left', 0 ),
      ...sharedStyles.alignSelf( 'right' )
    }
  }
};
