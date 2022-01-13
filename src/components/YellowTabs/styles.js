import {platformStyle} from "../../theme";
import sharedStyles from '../../shared/styles';

export default {
  container: {
    borderTopWidth: 0
  },
  selectedTab: {
    borderBottomWidth: platformStyle.platform === 'ios' ? 3 : 4,
    borderRadius: 0,
  },
  noselectedTab: {
    borderBottomWidth: platformStyle.platform === 'ios' ? 3 : 4,
    borderRadius: 0,
  }
};
