import React, { Component } from "react";
import { Image } from 'react-native';
import { Header, Icon } from "native-base";
import { NavigationActions } from 'react-navigation'

import headerLogo from '../../../assets/images/header1_new.png';
import styles from './styles';
import IconFontAwesome from 'react-native-vector-icons/FontAwesome';
import {platformStyle} from "../../theme";

const backAction = NavigationActions.back({
  key: null
});


class AppHeader extends Component {

  render() {
    const { noDrawer, iconAction, navigation } = this.props;

    return (
      <Header style={styles.header}
              iosBarStyle="dark-content"
      >
        <Image source={headerLogo} resizeMode="contain" style={styles.image}/>

        {noDrawer ? null :
          <IconFontAwesome name="bars" onPress={() => this.props.navigation.openDrawer()} style={{...styles.menuIcon, color: platformStyle.brandPrimary}}/>
        }
        {iconAction ?
          <IconFontAwesome name={'home'}
                        onPress={() => navigation.dispatch(backAction)}
                        style={{...styles.menuIcon, color: platformStyle.brandPrimary}}/>
          : null
        }
      </Header>
    );
  }
}

export default AppHeader;
