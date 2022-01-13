import {platformStyle} from "../../theme";
import sharedStyles from '../../shared/styles';

export default {
  container: {
    position: 'absolute',
    top: 0,
    left: platformStyle.deviceWidth - 70
  },
  iconContainer: {
    height: 30,
    width: 30,
    borderRadius: 18,
    flexDirection: 'row',
    ...sharedStyles.justifyContent(),
    ...sharedStyles.alignItems()
  }
};
