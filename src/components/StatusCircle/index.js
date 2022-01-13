import React from "react";
import {View, Icon} from "native-base";

import styles from './styles'
import {platformStyle} from "../../theme";

export default ( { active, icon } ) => {
  return (
    <View style={styles.container}>
      <View style={{...styles.iconContainer,
                    backgroundColor: active ? platformStyle.brandPrimary : platformStyle.brandYellow}}>
        <Icon name={icon}
              style={{ color: active ? platformStyle.brandWhite : platformStyle.brandSecondary }}/>
      </View>
    </View>

  )
}
