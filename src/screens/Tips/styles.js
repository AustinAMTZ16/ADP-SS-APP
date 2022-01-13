import {platformStyle} from "../../theme";
import sharedStyles from '../../shared/styles';

export default {
  listItemRow: {
    self: {
      ...sharedStyles.margin('bottom', 2)
    },
    left: {
      ...sharedStyles.justifyContent('end'),
      ...sharedStyles.alignSelf('start'),
      ...sharedStyles.margin('right', 2)
    }
  },
  iconContainer: {
    flexDirection: 'column',
    borderRadius: platformStyle.platform === "ios" ? 40 : 45,
    height: platformStyle.platform === "ios" ? 80 : 90,
    width: platformStyle.platform === "ios" ? 80 : 90,
    justifyContent: 'center', alignItems: 'center'
  },
  container: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    // height: platformStyle.platform === "ios" ? 200 : 150
    marginTop: platformStyle.platform === "ios" ? 10: 50,
    marginBottom: platformStyle.platform === "ios" ? 5: 50,
  },
  wrapper: {},
  slide1: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20
  },

};
