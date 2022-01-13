import React, { Component } from "react";
import { Text, Button, Content, Container, View, Row } from "native-base";
import I18n from 'react-native-i18n';
import { Field, reduxForm, formValueSelector } from "redux-form";
import { connect } from 'react-redux';

import Header from '../../../components/Header';
import YellowSubHeader from '../../../components/YellowSubHeader';
import SubMenu from '../SubMenu';
import waterfall from "async/waterfall";
import { loadDataFormSelfReading, reloadSubmenu } from '../../../actions/general'
import { required } from '../../../shared/validations';
import Checkbox from '../../../components/Checkbox/'
import FormField from '../../../components/FormField/';
import {platformStyle} from "../../../theme";
import sharedStyles from '../../../shared/styles';
import styles from './styles'
import repo from '../../../services/database/repository'
import generalService from "../../../services/general/generalService";
import PopupDialog from '../../../components/PopupDialog/';
import Spinner from '../../../components/Spinner';
import TimerMixin from "react-timer-mixin";
import { NavigationActions } from 'react-navigation';

const backAction = NavigationActions.back({
	  key: null
});

class RegisterSelfReading extends Component {
  constructor( props ) {
    super(props);

    this.state = {
      selfReading: false,
      spinnerVisible: false,
      isSelfReader: false,
      changeState: false
    };
  }

  componentDidMount() {

	  let AdditionalData = JSON.parse(repo.configuration.getField('accountAdditionalData'));
	  let customerData = JSON.parse(repo.configuration.getField('customerData'));
	  console.log(AdditionalData);
	  console.log(AdditionalData.indSelfReader);
	  this.setState({isSelfReader: AdditionalData.indSelfReader});
	  this.props.loadDataFormSelfReading({
		  indSelfReader: AdditionalData.indSelfReader,
		  phone: (customerData && customerData.phone1) ? customerData.phone1 : '',
	  });

  }

  submit( values ) {
	  waterfall([
		  ( callback ) => {
			  this.setState({ spinnerVisible: true });
			  let accountServices = JSON.parse(repo.configuration.getField('accountServices'));
			  if( values.indSelfReader )
				  generalService.selfReaderAction({ "phone": values.phone }, accountServices[ 0 ].idSectorSupply, callback);
			  else
				  generalService.selfReaderAction({}, accountServices[ 0 ].idSectorSupply, callback, 'POST');
		  },
		  ( arg1, callback ) => {
			  let serviceInfo = JSON.parse(repo.configuration.getField('serviceInfo'));
			  let idPaymentForm = repo.configuration.getField('idPaymentForm');
			  let idService = serviceInfo.idContractedService;
			  generalService.AccountAdditionalDataAction(idPaymentForm, idService, callback);
		  },

		  ], ( err, result ) => {
			  this.setState({ spinnerVisible: false }, function() {
				  if( !err ) {
					  
					  TimerMixin.setTimeout(() => {
						  this.showPopupAlert(I18n.t("INFO"), I18n.t("OPERATION_SUCCESS2"), {
							  1: {
								  key: 'button1',
								  text: `${I18n.t('accept')}`,
								  action: () => {var me = this;
								  me.props.navigation.dispatch(backAction);
								  },
								  align: ''
							  }
						  });
					  }, 1000);
					  
					  this.setState({ isSelfReader: values.indSelfReader, changeState: false });

				  } else {
					  TimerMixin.setTimeout(() => {
						  this.showPopupAlert(I18n.t("INFO"), err);
					  }, 1000);

				  }
			  });
		  })
  }

  
  onPressRegister(value){
	  let changeState = false;
	  if(this.state.isSelfReader != value){
		  changeState = true;
	  }
	  
	  this.setState({changeState});
  }
  
  
  componentWillReceiveProps( nextProps ) {
    
  }


  /**
   *
   * @param title
   * @param text
   * @param content
   * @param options
   */
  showPopupAlert( title, text, options, content ) {
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
      <Container>
        <Header noDrawer {...this.props}
                iconAction={'ios-home-outline'}/>
        <SubMenu title={I18n.t('ACCOUNT_SELF_READING')} noMenu leftIcon="md-close" {...this.props}/>
        <YellowSubHeader text={I18n.t('REGISTRATION')}/>
        <PopupDialog
          refModal={this.state.messageAlert}
        />
        <Content padderHorizontal>

          <Row style={{...styles.selfReading.self}}>
            <View style={{flex: 1}}>

              <Field name="indSelfReader"
                     component={Checkbox}
                     label={I18n.t('REGISTER_SS')}
              		 onPress={this.onPressRegister.bind(this)}
                     {...this.props}
              />

              {this.props.dataForm.indSelfReader ?
                <Field name="phone"
                       component={FormField}
                       errorActive
                       inputLabel={I18n.t('PHONE')}
                       validate={[ required ]}
                       underline
                       light
                /> : null
              }
              {this.state.changeState ?
                <Field name="termsConditions"
                       component={Checkbox}
                       validate={[ required ]}
                       label={<Text sizeNormal
                                    style={{
                                      ...sharedStyles.margin('left', 2),
                                      width: platformStyle.deviceWidth - 60
                                    }}>
                         {I18n.t('MSG003')}{' '}
                         <Text style={{ textDecorationLine: 'underline' }}
                               onPress={() => this.props.navigation.navigate('TermsConditions')}>
                           {I18n.t('Terms_and_Conditions')}
                         </Text>
                       </Text>
                       }
                       {...this.props}
                /> : null
              }
            </View>
          </Row>
          {
        	  this.state.changeState ? 

        	          <Button block rounded style={{backgroundColor: platformStyle.brandPrimary}} onPress={this.props.handleSubmit(this.submit.bind(this))}>
        	            <Text sizeNormal>{I18n.t('SAVE')}</Text>
        	          </Button>
        	          
        	          :
        	        	  null
          }
          
        </Content>
        <Spinner visible={this.state.spinnerVisible} textContent={I18n.t('Loading')}
                 overlayColor={`rgba(0, 0, 0, 0.60)`}
                 textStyle={{ color: '#FFF' }}/>

      </Container>
    );
  }
}

const AccountSelfReadingPage = reduxForm({
  form: "AccountSelfReadingForm",
  enableReinitialize: true,
})(RegisterSelfReading);

const selector = formValueSelector('AccountSelfReadingForm');
const mapStateToProps = state => {
	  return {
	    dataForm: selector(state, 'indSelfReader', 'phone', 'termsConditions'),
	    initialValues: state.generalReducer.formDataSelfReading
	  }
};

function bindAction( dispatch ) {
  return {
    loadDataFormSelfReading: ( formData ) => dispatch(loadDataFormSelfReading(formData)),
    reloadSubmenu: () => dispatch(reloadSubmenu()),
  };
}

export default connect(mapStateToProps, bindAction)(AccountSelfReadingPage);
