import {platformStyle} from "../../../theme";
import sharedStyles from '../../../shared/styles';

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
	backgroundColor: platformStyle.brandPrimary,
    width: platformStyle.platform === "ios" ? 80 : 90,
    justifyContent: 'center', alignItems: 'center'
  },
  container: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    // height: platformStyle.platform === "ios" ? 200 : 150
    marginTop: 15,
    marginBottom: 15,
  },
  wrapper: {},
  slide1: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10
  },
  textSlide: {
    paddingHorizontal: 10
  },
  separator: {
    height: 4,
    width: platformStyle.deviceWidth - 60,
    borderBottomColor: platformStyle.brandSecondary,
    borderBottomWidth: 1,
    marginVertical: 15
  }

};
