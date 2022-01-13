import {platformStyle} from "../../../theme";
import sharedStyles from '../../../shared/styles';

export default {
  listItemRow: {
    self: {
      ...sharedStyles.margin( 'bottom', 2 )
    },
    left: {
      ...sharedStyles.justifyContent('end'),
      ...sharedStyles.alignSelf('start'),
      ...sharedStyles.margin('right', 2),
      ...sharedStyles.margin('top', platformStyle.platform === 'ios' ? 0.5 : 0),
    }
  },
  publicItemRow: {
    left: {
      ...sharedStyles.alignSelf('start'),
      ...sharedStyles.alignItems('end'),
      ...sharedStyles.margin('right', 2),
      ...sharedStyles.margin('top', platformStyle.platform === 'ios' ? 0.5 : 0),
    },
    text: {
      ...sharedStyles.textAlign('right')
    }
  }
};
