import {platformStyle} from "../../theme";
import sharedStyles from '../../shared/styles';

export default {
  content: {
    marginTop: 10
  },
  loginBtn: {
    ...sharedStyles.margin('top'),
  },
  card: {
    ...sharedStyles.margin('top', 10),
    ...sharedStyles.padding('bottom'),
    ...sharedStyles.margin('horizontal', 3),
  },
  links: {
    ...sharedStyles.alignSelf('end'),
    ...sharedStyles.margin('top', 2),
    fontSize: platformStyle.fontSizeLarge,
    textDecorationLine: 'underline',
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
  },
  contentButtonFooter: {
	    flexDirection: 'row',  marginBottom: 5, justifyContent: 'center', alignItems: 'center'
  },
};
