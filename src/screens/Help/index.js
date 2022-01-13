import React, {Component} from 'react';
import { WebView as WebViewIOS } from 'react-native-webview';
import { WebView, Platform } from "react-native";
import {Container} from "native-base";
import I18n from 'react-native-i18n';

import Config from 'react-native-config'
import Header from '../../components/Header/'
import SubHeader from '../../components/SubHeader';
import repo from "../../services/database/repository";

class Help extends Component {
  render() {console.log(Config.APP_HELP + "?lang=" + repo.configuration.getField('language'))
    return (
      <Container>
        <Header {...this.props} noDrawer/>
        <SubHeader text={I18n.t('HELP')} back {...this.props}/>
        {Platform.OS === 'android' ? 
          <WebView
            source={{uri: Config.APP_HELP + "?lang=" + repo.configuration.getField('language')}}
          />  :
          <WebViewIOS
            source={{uri: Config.APP_HELP + "?lang=" + repo.configuration.getField('language')}}
          />
        }
      </Container>
    );
  }
}

export default Help;