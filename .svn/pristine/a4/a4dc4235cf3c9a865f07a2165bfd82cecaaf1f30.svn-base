import React, {Component} from "react";
import {Image} from 'react-native';
import {Header, View} from "native-base";
import Spinner from 'react-native-spinkit';

import {platformStyle} from "../../theme";
import ImgBackgroundContainer from '../../components/ImageBackground/'
import sharedStyles from '../../shared/styles';
import splash from "../../../assets/images/splash_blurred.png";
import yellowImg from "../../../assets/images/yellow_login.png";

class Initial extends Component {

  render() {
    return (
      <ImgBackgroundContainer source={splash}>
        <Header transparent style={{height: 40}}/>
        <View style={sharedStyles.alignItems('end')}>
          <Image source={yellowImg}/>
        </View>

        <Spinner style={{ alignSelf: 'center', position: 'absolute', bottom: platformStyle.deviceHeight / 2 }}
                 type="9CubeGrid" color={platformStyle.brandPrimary}/>

      </ImgBackgroundContainer>
    );
  }
}

export default Initial;
