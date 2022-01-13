import React, {Component} from "react";
import {Image} from 'react-native';
import {Text, View} from "native-base";
import I18n from 'react-native-i18n';
import {Field, reduxForm} from "redux-form";

import FormField from '../../../components/FormField/'
import {required} from '../../../shared/validations';
import sharedStyles from '../../../shared/styles';

class HolderRequestsPersonalInfo extends Component {
  constructor() {
    super();

    this.state = {
      legalPerson: false,
    }
  }



  render() {
    const { legalPerson } = this.state;

    return (
      <View style={{
        ...sharedStyles.margin('vertical'),
        paddingHorizontal: 20,
      }}>

        {legalPerson ?
          <Field name="socialReason"
                 component={FormField}
                 errorActive
                 inputLabel={I18n.t('Business Name')}
                 validate={[ required ]}
                 light
                 inputProps={{
                   returnKeyType: 'next',
                   onSubmitEditing: this.props.handleSubmit(()=>{}),
                 }}
          /> :
          <View>
            <Field name="name"
                   component={FormField}
                   errorActive
                   inputLabel={I18n.t('First_Name')}
                   validate={[ required ]}
                   light
                   inputProps={{
                   returnKeyType: 'next',
                   onSubmitEditing: () => this.surname._root.focus(),
                 }}
            />
            <Field name="surname1"
                   component={FormField}
                   errorActive
                   inputLabel={I18n.t('Surname')}
                   validate={[ required ]}
                   light
                   inputProps={{
                 ref: c => (this.surname = c),
                 returnKeyType: 'next',
                 onSubmitEditing: () => this.surname2._root.focus(),
               }}
            />
            <Field name="surname2"
                   component={FormField}
                   errorActive
                   inputLabel={I18n.t('Other Surname')}
                   validate={[ required ]}
                   light
                   inputProps={{
                 ref: c => (this.surname2 = c),
                 returnKeyType: 'done',
                 onSubmitEditing: this.props.handleSubmit(()=>{}),
               }}
            />
          </View>
        }

      </View>
    );
  }
}

export default reduxForm( {
  form: "HolderRequestsPersonalInfoForm"
} )( HolderRequestsPersonalInfo );
