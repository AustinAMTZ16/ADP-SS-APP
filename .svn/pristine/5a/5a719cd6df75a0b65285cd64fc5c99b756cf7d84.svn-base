import React from "react";
import {Image} from 'react-native';
import {Left, Body, Row, Button} from "native-base";
import {Field} from "redux-form";
import I18n from 'react-native-i18n';

import IconFontello from '../../components/IconFontello/';
import FormField from '../../components/FormField/';
import sharedStyles from '../../shared/styles';
import {platformStyle} from "../../theme";

export default ( { onSubmit, placeholder } ) => {

  return (
    <Row>
      <Left>
        <Field name="value"
               component={FormField}
               placeholder={placeholder || I18n.t('Search')}
               keyboardType="numeric"
               regularActive
               light
               widthInput={platformStyle.deviceWidth - 90}
               inputProps={{onSubmitEditing: onSubmit}}
        />
      </Left>
      <Body>
      <Button roundedCircleSmall
              style={{ ...sharedStyles.alignSelf('end'), ...sharedStyles.margin('left', 2), backgroundColor: platformStyle.brandPrimary }}
              onPress={onSubmit}>
        <IconFontello name={'search'} size={24}
                      style={{ color: platformStyle.brandWhite, }}/>
      </Button>
      </Body>
    </Row>
  );
}
