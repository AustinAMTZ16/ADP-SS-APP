import {platformStyle} from "../../../theme";
import sharedStyles from '../../../shared/styles';

export default {
  listItemRow: {
    self: {
      ...sharedStyles.margin( 'bottom', 2 )
    },
    left: {
      ...sharedStyles.justifyContent('end'),
      ...sharedStyles.margin('right', 2),
      ...sharedStyles.margin('top', platformStyle.platform === 'ios' ? 1 : 0),
    },
    text: {
      ...sharedStyles.textAlign('right')
    },
  },
  menu: {
    item: {
      flexDirection: 'row',
      ...sharedStyles.alignItems(),
    },
    icon: {
      color: 'white',
      fontSize: 40,
      ...sharedStyles.margin( 'right', 2 )
    }
  },
};
