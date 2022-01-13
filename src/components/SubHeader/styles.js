import {platformStyle} from "../../theme";
import sharedStyles from '../../shared/styles'

export default {
  subHeader: {
    self: {
      flexDirection: 'row',
      height: 50,
    },
    backIcon: {
      color: 'white',
      // ...sharedStyles.margin( 'left' ),
      fontSize: 30,
      marginHorizontal: 5
    },
    menuIconSelected: {
      color: 'white',
      fontSize: 60,
      lineHeight: platformStyle.platform === 'ios' ? 48 : undefined
    },
    body: {
      ...sharedStyles.textAlign( 'center' ),
    }
  },
  header: {
    self: {
    },
    backIcon: {
      color: 'white',
      fontSize: 30,
      marginHorizontal: 5
    },
  },
  menu: {
    ...sharedStyles.padding( 'left' ),
    ...sharedStyles.padding( 'vertical', 2 ),
    borderTopWidth: platformStyle.platform === 'ios' ? 1 : 0.5,
    borderTopColor: 'white'
  }
};
