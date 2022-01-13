export default {

  replaceStack( stackNavigator ) {
    const screenPrevGetStateForAction = stackNavigator.router.getStateForAction;

    return {
      ...stackNavigator.router,
      getStateForAction( action, state ) {
        if( state && action.type === 'ReplaceCurrentScreen' ) {
          const routes = state.routes.slice( 0, state.routes.length - 1 );
          routes.push( action );
          return {
            ...state,
            routes,
            index: routes.length - 1

          }
        }
        return screenPrevGetStateForAction( action, state )
      }
    }
  },

  navigateTo( navigation, screen, params = undefined ) {
    const routeName = navigation.state.routeName;

    if( routeName !== screen )
      navigation.dispatch( {
        type: 'ReplaceCurrentScreen',
        routeName: screen,
        params: params,
        key: screen
      } );
  }
}