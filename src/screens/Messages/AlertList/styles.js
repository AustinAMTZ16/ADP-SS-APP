import sharedStyles from '../../../shared/styles';

export default {
  listItemRow: {
    self: {
      ...sharedStyles.margin( 'bottom', 2 ),
      ...sharedStyles.margin('right', 4)
    }
  },
  menu: {
    item: {
      flexDirection: 'row',
      ...sharedStyles.alignItems(),
    },
    icon: {
      color: 'white',
      fontSize: 40,
      ...sharedStyles.margin( 'right', 2 )
    }
  }
};
