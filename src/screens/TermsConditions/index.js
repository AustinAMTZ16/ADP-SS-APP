import React, {Component} from 'react';
import { WebView as WebViewIOS } from 'react-native-webview';
import { WebView, Platform } from 'react-native';
import {Container} from "native-base";
import I18n from 'react-native-i18n';
import Config from 'react-native-config'

import Header from '../../components/Header/'
import SubHeader from '../../components/SubHeader';

class TermsConditions extends Component {
  render() {
      let url = Config.TERMS_CONDITIONS;
      if(this.props.navigation.state.params && this.props.navigation.state.params.url){
          url = this.props.navigation.state.params.url;
          url = url.replace("http:/","https:/");
      }
    return (
      <Container>
        <Header {...this.props} noDrawer/>
        <SubHeader text={I18n.t('Terms & Conditions')} back {...this.props}/>
        {Platform.OS === 'android' ? 
          <WebView
            source={{uri: url}}
          /> : 
          <WebViewIOS
            source={{uri: url}}
          /> 
        }
      </Container>
    );
  }
}

export default TermsConditions;