import {platformStyle} from "../../theme";
import sharedStyles from '../../shared/styles';

export default {
  loginBtn: {
    ...sharedStyles.alignSelf(),
    ...sharedStyles.margin('vertical'),
  },
  card: {
    ...sharedStyles.margin('top', 10),
    ...sharedStyles.padding('bottom'),
    ...sharedStyles.margin('horizontal', 3),
  },
  links: {
    ...sharedStyles.alignSelf('end'),
    ...sharedStyles.margin('top', 2)
  },
  search: {
    self: {
      width: platformStyle.deviceWidth - 85,
      ...sharedStyles.margin('top'),
    },

    icon: {
      ...sharedStyles.alignSelf('end'),
      position: 'absolute',
      top: 5,
      right: 7
    }
  }
};
