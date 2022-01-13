import {platformStyle} from "../theme";

export default {
  alignSelf: ( align = 'center' ) => {
    switch( align ) {
      case 'start':
        return { alignSelf: 'flex-start' };
      case 'end':
        return { alignSelf: 'flex-end' };
      default:
        return { alignSelf: 'center' }
    }
  },

  alignItems: ( align = 'center' ) => {
    switch( align ) {
      case 'start':
        return { alignItems: 'flex-start' };
      case 'end':
        return { alignItems: 'flex-end' };
      default:
        return { alignItems: 'center' }
    }
  },


  justifyContent: ( align = 'center' ) => {
    switch( align ) {
      case 'spaceBetween':
        return { justifyContent: 'space-between' };
      case 'spaceAround':
        return { justifyContent: 'space-around' };
      case 'start':
        return { justifyContent: 'flex-start' };
      case 'end':
        return { justifyContent: 'flex-end' };
      default:
        return { justifyContent: 'center' }
    }
  },

  textAlign: ( direction = 'left' ) => {
    switch( direction ) {
      case 'center':
        return { textAlign: 'center' };
        break;
      case 'justify':
        return { textAlign: 'justify' };
        break;
      case 'right':
        return { textAlign: 'right' };
      default:
        return { textAlign: 'left' };
    }
  },

  // Margins
  margin: ( marginTo = true, size = 5 ) => {
    size = platformStyle.deviceWidth * (size / 100);
    switch( marginTo ) {
      case 'top':
        return { marginTop: size };
        break;
      case 'bottom':
        return { marginBottom: size };
        break;
      case 'left':
        return { marginLeft: size };
        break;
      case 'right':
        return { marginRight: size };
        break;
      case 'vertical':
        return { marginBottom: size, marginTop: size };
        break;
      case 'horizontal':
        return { marginLeft: size, marginRight: size };
        break;
      default:
        return { margin: size };
    }
  },

  padding: ( paddingTo = true, size = 5 ) => {
    size = platformStyle.deviceWidth * (size / 100);
    switch( paddingTo ) {
      case 'top':
        return { paddingTop: size };
        break;
      case 'bottom':
        return { paddingBottom: size };
        break;
      case 'left':
        return { paddingLeft: size };
        break;
      case 'right':
        return { paddingRight: size };
        break;
      case 'vertical':
        return { paddingBottom: size, paddingTop: size };
        break;
      case 'horizontal':
        return { paddingLeft: size, paddingRight: size };
        break;
      default:
        return { padding: size };
    }
  },

  // Utilities
  highLight: ( border = 2, color = platformStyle.brandSecondaryLight ) => {
    return {
      borderWidth: border,
      borderRadius: border,
      borderColor: color
    }
  },

  circle: ( size ) => {
    return {
      width: size,
      height: size,
      borderRadius: size / 2,
      alignItems: 'center',
      justifyContent: 'center',
    }
  },
  divider: ( direction = 'top' ) => {
    switch( direction ) {
      case 'bottom':
        return {
          borderBottomWidth: 1,
          borderBottomColor: platformStyle.brandLight,
        };
      case 'right':
        return {
          borderRightWidth: 1,
          borderRightColor: platformStyle.brandLight,
        };
      case 'horizontal':
        return {
          borderTopWidth: 1,
          borderBottomWidth: 1,
          borderTopColor: platformStyle.brandLight,
          borderBottomColor: platformStyle.brandLight,
        };
      default:
        return {
          borderTopWidth: 1,
          borderTopColor: platformStyle.brandLight,
        }
    }
  },
}

