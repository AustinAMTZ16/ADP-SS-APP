import sharedStyles from '../../../shared/styles';

export default {
  menu: {
    item: {
      flexDirection: 'row',
      ...sharedStyles.alignItems(),
      height: 50
    },
    icon: {
      color: 'white',
      fontSize: 40,
      ...sharedStyles.margin( 'right', 2 )
    },
    iconMenu: {
      color: 'white',
      fontSize: 20,
      ...sharedStyles.margin( 'right', 2 ),
      ...sharedStyles.margin( 'vertical', 2 )
    }
  },
};
