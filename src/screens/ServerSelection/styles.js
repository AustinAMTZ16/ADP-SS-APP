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
  container: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 30,
    paddingBottom: 30,
  },
  loginBtn: {
    ...sharedStyles.margin('top'),
  },
  wrapper: {},
  slide1: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20
  },

};
