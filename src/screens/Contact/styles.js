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
	backgroundColor: platformStyle.brandPrimary,
    width: platformStyle.platform === "ios" ? 80 : 90,
    justifyContent: 'center', alignItems: 'center'
  },
  container: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    // height: platformStyle.platform === "ios" ? 200 : 150
    marginTop: platformStyle.platform === "ios" ? 10: 35,
    marginBottom: platformStyle.platform === "ios" ? 5: 25,
  },
  wrapper: {},
  slide1: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: platformStyle.platform === "ios" ? 20: 10,
    paddingTop: platformStyle.platform === "ios" ? 20: 0,
  },
  textSlide:{
    paddingHorizontal: 15,
    marginTop: platformStyle.platform === "ios" ? 10: 5,
  }

};
