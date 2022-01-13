import React, {Component} from "react";
import {Button, Footer, FooterTab, Text,} from "native-base";
import _ from 'lodash';
import sharedStyles from '../../shared/styles';

import styles from "./styles";
import HelperService from "../../services/HelperService";
import {platformStyle} from "../../theme";

class TabsComponent extends Component {

  render() {
    const { navigation, tabs } = this.props;
    const routeName = navigation.state.routeName;

    return (
      <Footer noElevation style={styles.container}>
        <FooterTab style={{backgroundColor: platformStyle.brandYellow}}>
          {_.map( tabs, ( tab, index ) =>
            <Button key={index}
                    style={routeName === tab.route ? {...styles.selectedTab, borderColor: platformStyle.brandSecondary} : {...styles.noselectedTab, borderColor: platformStyle.brandYellow}}
                    onPress={() => tab.disabled ? {} : HelperService.navigateTo(navigation, tab.route)}
            >
              <Text dark small black={routeName === tab.route} style={sharedStyles.textAlign('center')}>
                {tab.label.toUpperCase()}
              </Text>
            </Button>
          )}
        </FooterTab>
      </Footer>
    )
  }
}

export default TabsComponent;
