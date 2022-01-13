import React, { Component } from "react";
import { Text, View, Icon, Left, Body, Right, Header, Button } from "native-base";
import { NavigationActions } from 'react-navigation'
import _ from 'lodash'

import styles from './styles';
import {platformStyle} from "../../theme";
import IconFontAwesome from 'react-native-vector-icons/FontAwesome';

const backAction = NavigationActions.back({
  key: null
});

class SubHeader extends Component {
  constructor( props ) {
    super(props);

    this.state = {
      menuOpen: _.get(props, 'menu.isOpened') || false
    }
  }

  render() {
    const { isHeader, back, children, navigation, text, menu, onBack, rightComponent, leftIcon } = this.props;

    return (
      isHeader ?
        <Header transparent androidStatusBarColor={platformStyle.brandPrimary} style={{...styles.header.self, backgroundColor: platformStyle.brandPrimary}}>
          <Left flex02>
            {back ?
              <Button transparent backButtom onPress={() => {navigation.dispatch(backAction)}}>
                {leftIcon ?
                  <Icon name={leftIcon} style={styles.subHeader.backIcon}/> :
                  <IconFontAwesome name="arrow-left" style={styles.header.backIcon}/>}
              </Button>
              : null}
          </Left>
          <Body>
          {text ? <Text white heavy sizeNormal uppercase>{text.toUpperCase()}</Text> : children}
          </Body>
          <Right flex02/>
        </Header> :

        <View>
          <View style={{...styles.subHeader.self, backgroundColor: platformStyle.brandPrimary}}>
            <Left flex02>
              {back ?
                <Button transparent backButtom onPress={() => {onBack ? onBack() : navigation.dispatch(backAction)}}>
                  {leftIcon ?
                    <Icon name={leftIcon} style={styles.subHeader.backIcon}/> :
                    <IconFontAwesome name="arrow-left" style={styles.header.backIcon}/>}
                </Button>
                : null}
            </Left>
            <Body>
            {text ?
              <Text white heavy sizeNormal uppercase
                    style={styles.subHeader.body}>{text.toUpperCase()}</Text> : children}
            </Body>
            {menu ?
              <Right flex02>
                <Button menuSubHeader style={{backgroundColor: platformStyle.brandPrimary}}
                        onPress={() => {
                          if( this.props.showMenu ) {
                            this.props.showMenu(!this.state.menuOpen);
                          }
                          this.setState({ menuOpen: !this.state.menuOpen })
                        }}>
                  {this.state.menuOpen ?
                    <Icon name="ios-more-outline" style={styles.subHeader.menuIconSelected}/> :
                    <Icon name="ios-more" style={styles.subHeader.menuIconSelected}/>}
                </Button>
              </Right> :
              rightComponent ? <Right flex02>{rightComponent}</Right> : <Right flex02/>
            }
          </View>

          {this.state.menuOpen ? <View style={{...styles.menu, backgroundColor: platformStyle.brandPrimary}}>{menu.items}</View> : null}
        </View>
    );
  }
}

export default SubHeader;
