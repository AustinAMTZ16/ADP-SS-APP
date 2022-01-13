import React, { Component } from "react";
import { Image } from 'react-native';
import { Text, View, Button } from "native-base";
import I18n from 'react-native-i18n';
import { Field, reduxForm, formValueSelector } from "redux-form";
import { connect } from 'react-redux';

import FormField from '../../../components/FormField/'
import FormPicker from '../../../components/FormPicker/'
import FormPickerDate from '../../../components/FormPickerDate/'
import { required, email, equalTo, validateDocNumber } from '../../../shared/validations';
import sharedStyles from '../../../shared/styles';
import {platformStyle} from "../../../theme";
import repo from '../../../services/database/repository'

const equalToEmail = equalTo('email', 'email');

class HolderRequestsPaymentPersonalInfo extends Component {
  constructor() {
    super();

    this.state = {
      documTypes: [],
      genderTypes: [],
    }
  }

  componentDidMount() {
    this.loadData();

  }

  loadData() {

    let documType = JSON.parse(repo.configuration.getField('documType'));
    let documTypes = [];
    _.map(documType, function( item ) {
      documTypes.push({ code: item.codDevelop, val: item.nameType })
    });

    let genderType = JSON.parse(repo.configuration.getField('genderType'));
    let genderTypes = [];
    _.map(genderType, function( item ) {
      genderTypes.push({ code: item.codDevelop, val: item.nameType })
    });

    this.setState({ documTypes, genderTypes });
  }

  render() {
    return (
      <View style={{
        ...sharedStyles.margin('vertical'),
        paddingHorizontal: 20,
      }}>
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
                 returnKeyType: 'next',
                 ref: c => (this.surname = c),
                 onSubmitEditing: () => this.secondSurname._root.focus(),
               }}
        />
        <Field name="surname2"
               component={FormField}
               errorActive
               inputLabel={I18n.t('Other Surname')}
               light
               inputProps={{
                 returnKeyType: 'next',
                 ref: c => (this.secondSurname = c)
               }}
        />
        <Field name="docType"
               component={FormPicker}
               validate={[ required ]}
               inputLabel={I18n.t('Identification_Document')}
               borderBottomStyle
               errorActive
               dataItems={this.state.documTypes}
        />
        <Field name="docCountry"
               component={FormPicker}
               validate={[ required ]}
               inputLabel={I18n.t('Document_Country')}
               borderBottomStyle
               errorActive
               dataItems={[ { code: 1, val: 'Other' }, { code: 2, val: 'Kenya' } ]}
        />
        <Field name="docNumber"
               component={FormField}
               errorActive
               validate={[ required, validateDocNumber ]}
               inputLabel={I18n.t('Document_Number')}
               light
               inputProps={{
                 returnKeyType: 'next'
               }}
        />
        <Field name="birthDate"
               component={FormPickerDate}
        		dataFormat={repo.configuration.getField("language") == "es" ? "DD/MM/YYYY" : "MM/DD/YYYY"}
               label={I18n.t('Date_of_Birth')}
               width={platformStyle.deviceWidth - 60}
               icon="md-calendar"
               validate={[ required ]}
               errorActive
               stylesGrp={{
                 borderTopWidth: 0,
                 borderLeftWidth: 0,
                 borderRightWidth: 0,
               }}
        />
        <Field name="codSex"
               component={FormPicker}
               validationActive
               inputLabel={I18n.t('Gender')}
               borderBottomStyle
               errorActive
               validate={[ required ]}
               dataItems={this.state.genderTypes}
        />
        <Field name="phone"
               component={FormField}
               errorActive
               inputLabel={I18n.t('Phone')}
               validate={[ required ]}
               light
               keyboardType="numeric"
               inputProps={{
                 returnKeyType: 'next',
                 onSubmitEditing: () => this.email._root.focus(),
               }}
        />
        <Field name="email"
               component={FormField}
               errorActive
               inputLabel={I18n.t('Email')}
               validate={[ required, email ]}
               light
               keyboardType="email-address"
               inputProps={{
                 returnKeyType: 'next',
                 ref: c => (this.email = c),
                 onSubmitEditing: () => this.emailConfirmation._root.focus(),
               }}
        />
        <Field name="emailConfirmation"
               component={FormField}
               errorActive
               inputLabel={I18n.t('Confirm Email')}
               validate={[ required, email, equalToEmail ]}
               light
               keyboardType="email-address"
               inputProps={{
                 ref: c => (this.emailConfirmation = c),
                 onSubmitEditing: this.props.handleSubmit(() => {}),
               }}
        />

      </View>
    )
  }
}

const HolderRequestsPaymentPersonalInfoPage = reduxForm({
  form: "HolderRequestsPaymentPersonalInfoForm"
})(HolderRequestsPaymentPersonalInfo);

const selector = formValueSelector('ComplaintForm');
const mapStateToProps = state => {
  return ({
    initialValues: {
      email: selector(state, 'email'),
      emailConfirmation: selector(state, 'emailConfirmation'),
    },
  })
};

export default connect(mapStateToProps)(HolderRequestsPaymentPersonalInfoPage);
