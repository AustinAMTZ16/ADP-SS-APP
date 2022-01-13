import platformStyle from "../../../theme/variables/platform";
import sharedStyles from '../../../shared/styles';

export default {
  filterContainer: {
    backgroundColor: platformStyle.brandGrey,
    paddingHorizontal: platformStyle.contentPadding,
    ...sharedStyles.padding( 'vertical' ),
    height: 'auto'
  },
  listItemRow: {
    self: {
      height: 'auto'
    },
    left: {
      ...sharedStyles.justifyContent( 'end' ),
      ...sharedStyles.alignSelf( 'start' ),
      ...sharedStyles.margin( 'right', 2 ),
      ...sharedStyles.margin( 'top', platformStyle.platform === 'ios' ? 1 : 0 ),
    },
    text: {
      ...sharedStyles.margin( 'left', 0 )
    }
  }
};
