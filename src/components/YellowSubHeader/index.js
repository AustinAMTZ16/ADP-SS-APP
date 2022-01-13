import React, {Component} from "react";
import {Text, View, Left, Body, Right, Row} from "native-base";

import styles from './styles';
import {platformStyle} from "../../theme";

class YellowSubHeader extends Component {
  render() {
    const { text, right } = this.props;

    return (
      right ?
        <Row style={{...styles.subHeader, backgroundColor: platformStyle.brandYellow}}>
          <Left>
            <Text black>{text.toUpperCase()}</Text>
          </Left>
          <Right>
            {right}
          </Right>
        </Row> :
        <View style={{...styles.subHeaderCenter, backgroundColor: platformStyle.brandYellow}}>
          <Text black>{text.toUpperCase()}</Text>
        </View>
    );
  }
}

export default YellowSubHeader;
