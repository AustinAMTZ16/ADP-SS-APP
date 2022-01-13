import {platformStyle} from "../../theme";

export default {
  header: {
    height: platformStyle.platform === 'ios' ? platformStyle.deviceHeight / 7 : platformStyle.deviceHeight / 8
  },
  image: {
    resizeMode: platformStyle.platform === 'ios' ? 'stretch' : 'cover',
    width: platformStyle.deviceWidth,
    height: platformStyle.platform === 'ios' ? platformStyle.deviceHeight / 7 : platformStyle.deviceHeight / 8
  },
  menuIcon: {
    position: 'absolute',
    right: platformStyle.deviceWidth / 14,
    top: platformStyle.platform === 'ios' ? platformStyle.deviceHeight / 14 : platformStyle.deviceHeight / 25,
    fontSize: platformStyle.platform === 'ios' ? 40 : 45
  }
};
