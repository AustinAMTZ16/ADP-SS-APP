import React, { Component } from "react";
import { Text, Button, Content, Container, Footer, FooterTab, View, Label, Item, Input } from "native-base";
import { Keyboard } from 'react-native';
import I18n from 'react-native-i18n';
import { Field, reduxForm } from "redux-form";
import { connect } from 'react-redux';

import { selectAccount } from '../../../actions/general';
import Header from '../../../components/Header';
import SubHeader from '../../../components/SubHeader';
import FormField from '../../../components/FormField/';
import formFieldStyles from '../../../components/FormField/styles';
import FormPicker from '../../../components/FormPicker/';
import DocPicker from '../../../components/DocPicker/';
import { required } from '../../../shared/validations';
import {platformStyle} from "../../../theme";
import sharedStyles from '../../../shared/styles';
import repo from '../../../services/database/repository'
import waterfall from 'async/waterfall';
import generalService from '../../../services/general/generalService';

import Spinner from '../../../components/Spinner';
import PopupDialog from '../../../components/PopupDialog/';
import { NavigationActions } from 'react-navigation'
import TimerMixin from "react-timer-mixin";
import firebaseService from "../../../services/firebase/firebaseService";

const backAction = NavigationActions.back({
  key: null
});

class NewComplaint extends Component {
  constructor( props ) {
    super(props);

    this.state = {
      spinnerVisible: false,
      fileArray:[],
      types: [],
      type:null,
      description:null
    };
  }

  componentDidMount() {
    firebaseService.supervisorAnalytic('NEWCOMPLAINT');

    let complaintType = JSON.parse(repo.configuration.getField('complaintType'));
    let types = _.map(complaintType, function( item ) {
      return { code: item.idComplaintType, val: item.nameType }
    });
    this.setState({
      types
    }, function(){
        this.props.selectAccount({idPaymentForm: repo.configuration.getField('idPaymentForm')});
    });
  }

  submit( values ) {
	  if(this.state.spinnerVisible){
		  return;
	  }
	  Keyboard.dismiss();
	  this.setState({ spinnerVisible: true });
      
      let complaintCode = null;
      let data = {idAccount: values.idPaymentForm,complaintType: values.type,text: values.description};
      waterfall([
          ( callback ) => {
              generalService.postRccAction(data,"complaint", callback);
          },
          ( arg1, callback ) => {
              complaintCode = arg1.data.reference;
              var files = false;
              let data = new FormData();
              data.append('entityCode',complaintCode);
              data.append('entityType',"6600REFTYP");

              var i =0;
              //1. LOOP INSIDE ALL DOCUMENTS
              this.state.fileArray.map((item,idx)=>{
                  if(item.attached){
                      //1. LOOP INSIDE ATTACHED FILES IN EACH DOCUMENT
                      item.attached.map((item2,idx2)=>{
                          files=true;
                          data.append('file-' + i , item.attached[idx2]);
                          data.append('codDocum-' + i , item.codDocum);
                          i++;
                      });
                  }
              });

              if(files){
                  //console.log("Files attached Login: " + JSON.stringify(files));
                  generalService.uploadFiles(data,callback);
              }else{
                  callback(null,arg1);
              }
          }
      ], ( err, result ) => {
          this.setState({ spinnerVisible: false }, function() {
              if(complaintCode) {
                  let mess = I18n.t("OPERATION_SUCCESS");
                  if(err){
                      mess = I18n.t("OPERATION_SUCCESS_WITHOUT_FILE");
                  }
                  this.showPopupAlert(I18n.t("INFO"), mess + complaintCode, {
                      1: {
                          key: 'button1',
                          text: `${I18n.t('accept')}`,
                          action: () => {
                              if(this.props.navigation.state.params.load){
                                  this.props.navigation.state.params.load();
                              }
                            this.props.navigation.dispatch(backAction);
                          },
                          align: ''
                      }
                  });
              } else {
                  TimerMixin.setTimeout(() => {
                      this.setState(err)
                  }, 1000);
              }
          });
      })

  }


  /**
   * POPUP
   * @param title
   * @param text
   * @param options
   */
  showPopupAlert( title, text, options, content ) {
    this.setState({
      messageAlert: {
        refresh: new Date().valueOf(),
        outside: false,
        title: title,
        height: 200,
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

  onChangeType(value){
	  this.setState({type: value});
  }
  
  onChangeDescription(value){
	  this.setState({description: value});
  }
  
  render() {
    return (
      <Container>
        <Header {...this.props} noDrawer/>
        <SubHeader text={I18n.t('NewComplaint')} back {...this.props}/>
        <PopupDialog
          refModal={this.state.messageAlert}
        />
        <Content padderHorizontal>
          <Field name="accountNumber"
                 validate={[ required ]}
                 component={( props ) =>
                   <View>
                     <Label style={formFieldStyles.inputLabel}>{I18n.t('Account')}</Label>
                     <Item error={props.meta.error && props.meta.touched}
                           onPress={() => this.props.navigation.navigate('Accounts', {type: this.state.type, description: this.state.description})}
                     		//onPress={() => console.log(this.state)}
                           style={{ height: platformStyle.inputHeightBase }}>
                       <Text style={{
                         fontSize: platformStyle.fontSizeLarge, fontFamily: platformStyle.fontFamilyBlack,
                         color: props.input.value ? platformStyle.brandSecondary : platformStyle.inputBorderColor
                       }}>
                         {props.input.value || repo.configuration.getField('accountNumber') || '...'}
                       </Text>
                     </Item>
                     <View style={formFieldStyles.labelError}>
                       <Text
                         style={props.meta.touched && props.meta.error ? formFieldStyles.formErrorText1 : formFieldStyles.formErrorText2}>
                         {props.meta.error || 'error here'}
                       </Text>
                     </View>
                   </View>
                 }
          />
          
      	  <Input name="idPaymentForm"
	        	keyboardType="numeric"
	        	style={{ height: 0 }}
          />
          
          {this.state.types.length ?
            <Field name="type"
                   component={FormPicker}
                   inputLabel={I18n.t('ComplaintType')}
                   errorActive
                   validate={[ required ]}
                   dataItems={this.state.types}
                   underline
                   light
                   onChange={this.onChangeType.bind(this)}
                   inputProps={{
                       returnKeyType: 'next',
                       ref: c => (this.type = c)
                   }}
            /> : null}
          
          <Field name="description"
                 component={FormField}
                 errorActive
                 inputLabel={I18n.t('Description')}
                 validate={[ required ]}
                 underline
                 light
                 multiline
                 height={70}
          		 onChange={this.onChangeDescription.bind(this)}
                 inputProps={{
                   numberOfLines: 3
                 }}
          />

            <View style={{...sharedStyles.margin("top"),...sharedStyles.margin("bottom")}}>
                <DocPicker
                    entitiyType={this.state.type}
                    fileArray={this.state.fileArray}
                />
            </View>

          {platformStyle.platform === 'ios' ?
            <Button block rounded style={{ backgroundColor: platformStyle.brandPrimary}} onPress={this.props.handleSubmit(this.submit.bind(this))}
                    style={sharedStyles.margin('top')}
            >
              <Text sizeNormal>{I18n.t('Submit')}</Text>
            </Button> : null
          }
        </Content>
        <Spinner visible={this.state.spinnerVisible} textContent="..."/>
        <Footer noBorders padder>
          <FooterTab>
            {platformStyle.platform === 'android' ?
              <Button block rounded style={{ backgroundColor: platformStyle.brandPrimary}} onPress={this.props.handleSubmit(this.submit.bind(this))}>
                <Text sizeNormal>{I18n.t('Submit')}</Text>
              </Button> : null}
          </FooterTab>
        </Footer>
      </Container>
    );
  }
}

const NewComplaintForm = reduxForm({
  form: "ComplaintForm",
  enableReinitialize: true,
})(NewComplaint);

const mapStateToProps = state => {
  const accounts = JSON.parse(repo.configuration.getField('accountListAction')) || [];
  let account = state.generalReducer.selectAccount.accountNumber ? state.generalReducer.selectAccount.accountNumber : repo.configuration.getField('accountNumber');
  
  return ({
    initialValues: {
      accountNumber: account,
      idPaymentForm: accounts.length === 1 ? accounts[ 0 ].idPaymentForm : state.generalReducer.selectAccount.idPaymentForm,
      type: state.generalReducer.selectAccount.type,
      description: state.generalReducer.selectAccount.description,
    }
  })
};

const bindAction = dispatch => {
  return {
    selectAccount: ( account ) => dispatch(selectAccount(account)),
  };
};

export default connect(mapStateToProps, bindAction)(NewComplaintForm);
