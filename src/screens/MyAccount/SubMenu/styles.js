import {platformStyle} from "../../../theme";
import sharedStyles from '../../../shared/styles'

export default {
  menu: {
    self: {
      ...sharedStyles.padding( 'left' ),
      ...sharedStyles.padding( 'vertical', 2 ),
      borderTopWidth: platformStyle.platform === 'ios' ? 1 : 0.5,
      borderTopColor: 'white'
    },
    item: {
      flexDirection: 'row',
      ...sharedStyles.alignItems(),
      ...sharedStyles.margin('top', 1)
    }
  },

  accountInfo: {
    item: {
      height: 'auto',
      ...sharedStyles.margin('bottom', 1)

    },
    left: {
      ...sharedStyles.alignItems( 'end' ),
      ...sharedStyles.alignSelf( 'start' ),
      ...sharedStyles.margin( 'right', 2 ),
      ...sharedStyles.margin( 'top', platformStyle.platform === 'ios' ? 1 : 0 ),
    },
    toggleIcon: {
      ...sharedStyles.alignSelf( 'start' )
    },
    text: {
      ...sharedStyles.textAlign('right')
    }
  },

  selfReading: {
    self: {
      height: 'auto',
      ...sharedStyles.padding(),
      ...sharedStyles.alignItems(),
      ...sharedStyles.justifyContent('spaceBetween')
    },
    icon: {
      fontSize: 25,
    }
  }

};
