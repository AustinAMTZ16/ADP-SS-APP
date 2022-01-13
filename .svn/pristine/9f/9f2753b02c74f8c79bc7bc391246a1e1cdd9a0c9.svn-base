import React, { Component } from "react";
import { Image, Keyboard } from 'react-native';
import { Text, View } from "native-base";
import I18n from 'react-native-i18n';
import { Field, reduxForm } from "redux-form";
import PopupDialog from '../../../components/PopupDialog/';
import FormField from '../../../components/FormField/'
import FormPicker from '../../../components/FormPicker/'
import { required } from '../../../shared/validations';
import sharedStyles from '../../../shared/styles';
import waterfall from 'async/waterfall';
import generalService from '../../../services/general/generalService';
import repo from '../../../services/database/repository'
import Spinner from '../../../components/Spinner';
import TimerMixin from "react-timer-mixin";

class HolderRequestsAddress extends Component {
  constructor() {
    super();

    this.state = {
      spinnerVisible: false,
      countryListStreet: [],
      countryListStreets: [],
      departmentListStreets: [],
      cityListStreets: [],
      Streets: [],
    }
  }


  componentDidMount() {
    let countryListStreet = JSON.parse(repo.configuration.getField('countryListStreet'));
    let countryListStreets = _.map(countryListStreet, function( item ) {
      return { code: item.idGeoEntity, val: item.entityName }
    });
    this.setState({ countryListStreet, countryListStreets });
  }

  loadStreet( idCity ) {
    Keyboard.dismiss();

    this.setState({ spinnerVisible: true });
    waterfall([
      ( callback ) => {
        generalService.getStreetAction(idCity, callback);
      },
    ], ( err, result ) => {
      if( !err ) {
        let Streets = [];
        _.map(result, function( item ) {
          Streets.push({ code: item.idStreet, val: item.streetName })
        });
        this.setState({ Streets, spinnerVisible: false });
      } else {
        this.setState({ spinnerVisible: false }, function() {

          TimerMixin.setTimeout(() => {
            this.showPopupAlert(I18n.t("INFO"), I18n.t("NO_DATA"));
          }, 1000);

        });

      }
    })
  }

  loadDepartmentListStreet( idGeoEntityP ) {
    let departmentListStreet = JSON.parse(repo.configuration.getField('departmentListStreet'));
    let departmentListStreets = [];
    _.map(departmentListStreet, function( item ) {
      if( item.idGeoEntityP === idGeoEntityP )
        departmentListStreets.push({ code: item.idGeoEntity, val: item.entityName })
    });
    this.setState({ departmentListStreets });
  }

  loadCityListStreet( idGeoEntityP ) {
    let cityListStreet = JSON.parse(repo.configuration.getField('cityListStreet'));
    let cityListStreets = [];
    _.map(cityListStreet, function( item ) {
      if( item.idGeoEntityP === idGeoEntityP )
        cityListStreets.push({ code: item.idGeoEntity, val: item.entityName })
    });
    this.setState({ cityListStreets });
  }

  componentWillReceiveProps( nextProps ) {
    // if( this.props.dataForm.indSelfReader !== nextProps.dataForm.indSelfReader ) {
    //   this.setState({ selfReadingChecked: !this.state.selfReadingChecked })
    // }
  }


  /**
   *
   * @param title
   * @param text
   * @param options
   */
  showPopupAlert( title, text, content, options ) {
    this.setState({
      messageAlert: {
        refresh: new Date().valueOf(),
        outside: false,
        title: title,
        height: 300,
        animation: 2,
        contentText: text,
        content: content,
        options: options ? options : {
          1: {
            key: 'button1',
            text: `${I18n.t('accept')}`,
            align: ''
          }
        },
      }

    })
  }

  render() {
    return (
      <View style={{
        ...sharedStyles.margin('vertical'),
        paddingHorizontal: 20,
      }}>
        <PopupDialog
          refModal={this.state.messageAlert}
        />
        {this.state.countryListStreets.length ?
          <Field name="county"
                 component={FormPicker}
                 validationActive
                 inputLabel={I18n.t('County')}
                 borderBottomStyle
                 errorActive
                 validate={[ required ]}
                 onChange={( value ) => {
                   this.props.change('constituency', null);
                   this.loadDepartmentListStreet(value);
                 }}
                 dataItems={this.state.countryListStreets}
          /> : null}
        <Field name="constituency"
               component={FormPicker}
               validationActive
               inputLabel={I18n.t('Constituency')}
               borderBottomStyle
               errorActive
               validate={[ required ]}
               onChange={( value ) => {
                 this.props.change('location', null);
                 this.loadCityListStreet(value);
               }}
               dataItems={this.state.departmentListStreets}
        />
        <Field name="location"
               component={FormPicker}
               validationActive
               inputLabel={I18n.t('Location')}
          //  placeholder={I18n.t('Select a Location')}
               borderBottomStyle
               errorActive
               validate={[ required ]}
               onChange={( value ) => {
                 this.props.change('idStreet', null);
                 this.loadStreet(value);
               }}
               dataItems={this.state.cityListStreets}
        />
        <Field name="idStreet"
               component={FormPicker}
               validationActive
               inputLabel={I18n.t('Street Name')}
          //  placeholder={I18n.t('Select a Street')}
               borderBottomStyle
               errorActive
               validate={[ required ]}
               dataItems={this.state.Streets}
        />
        <Field name="number"
               component={FormField}
               errorActive
               inputLabel={I18n.t('Street Number')}
          //  placeholder="Eg.: 5"
               validate={[ required ]}
               light
               inputProps={{
                 returnKeyType: 'next',
                 onSubmitEditing: () => this.unitNumber._root.focus(),
               }}
        />
        <Field name="unitNumber"
               component={FormField}
               errorActive
               inputLabel={I18n.t('Unit Number')}
          //  placeholder="Eg.: 3A"
               light
               validate={[ required ]}
               inputProps={{
                 ref: c => (this.unitNumber = c),
                 returnKeyType: 'next',
                 onSubmitEditing: () => this.comments._root.focus(),
               }}
        />
        <Field name="observations"
               component={FormField}
               errorActive
               inputLabel={I18n.t('Landmark')}
               light
               inputProps={{
                 ref: c => (this.comments = c),
                 returnKeyType: 'next',
                 onSubmitEditing: this.props.handleSubmit(() => {}),
               }}
        />

        <Spinner visible={this.state.spinnerVisible} textContent={I18n.t('Loading')}
                 overlayColor={`rgba(0, 0, 0, 0.60)`}
                 textStyle={{ color: '#FFF' }}/>
      </View>
    );
  }
}

export default reduxForm({
  form: "HolderRequestsAddressForm2"
})(HolderRequestsAddress);
