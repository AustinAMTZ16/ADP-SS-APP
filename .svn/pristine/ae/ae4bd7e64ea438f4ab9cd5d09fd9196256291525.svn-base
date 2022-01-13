import React, { Component } from "react";
import waterfall from 'async/waterfall';
import { Image, FlatList, Keyboard,PermissionsAndroid } from 'react-native';
import { Text, View, Content, Container, Button, Footer, FooterTab,Icon } from "native-base";
import { Field, reduxForm, formValueSelector } from "redux-form";
import { connect } from 'react-redux';
import I18n from 'react-native-i18n';
import TimerMixin from "react-timer-mixin";


import Header from '../../../components/Header';
import SubHeader from '../../../components/SubHeader';
import FormField from '../../../components/FormField/';
import FormPicker from '../../../components/FormPicker/';
import DocPicker from '../../../components/DocPicker/';

import Checkbox from '../../../components/Checkbox/';
import FormPickerDate from '../../../components/FormPickerDate/';
import sharedStyles from '../../../shared/styles';
import styles from './styles'
import {platformStyle} from "../../../theme";
import { required, email, generateDate } from '../../../shared/validations';
import Spinner from '../../../components/Spinner';
import { NavigationActions } from 'react-navigation';
import PopupDialog from '../../../components/PopupDialog/';
import generalService from "../../../services/general/generalService";
import repo from '../../../services/database/repository'
import firebaseService from "../../../services/firebase/firebaseService";
import moment from 'moment';
import { loadDataListOutages } from '../../../actions/general';
import syncService from '../../../services/general/syncService'


const backAction = NavigationActions.back({
  key: null
});

const TEXT_FIELD = "ATTFORM001";
const DECIMAL_FIELD = "ATTFORM002";
const INTEGER_FIELD = "ATTFORM003";
const COMBOBOX_TYPE = "ATTFORM004";
const DATE_TYPE = "ATTFORM005";


class Outages extends Component {

  constructor() {
    super();
    this.state = {
      spinnerVisible: false,
	  fileArray:[],
      parent: null,
      type: 1,
      checkSolution:false,
      withPhone: true,
      withEmail: true,
      complaintNatures: [],
      scopes: [],
		photoList:[],
      selectedType:false,
		modeAddress:false,
		addressSelected:false,
		coordinates:null,
    };
    this.showPopupAlert = this.showPopupAlert.bind(this);
  }

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

  componentDidMount() {
    const { params } = this.props.navigation.state;

    firebaseService.supervisorAnalytic('OUTAGES');
    
    let idSector = repo.configuration.getField('idSector');
    let warningTypeList = JSON.parse(repo.configuration.getField('warningTypeList'));
   
    if(idSector && params.mode!="ADDRESS"){
    	//Filter types by idSector
    	warningTypeList = warningTypeList.filter(function(obj){
    		return obj.idSector == idSector;
    	})
    }
    
    let types = _.map(warningTypeList, function( item ) {
	    return { code: item.codDevelop, val: item.nameType }
    });
	
    this.setState({ spinnerVisible: false, types,modeAddress: params.mode=="ADDRESS"});
  }


	

  submit( value ) {
	  var me = this;
	  
	  if(me.state.spinnerVisible){
		  return;
	  }

	  // When using MODE ADDRESS
	  let coordinates= undefined;
	  let accountNumber= undefined;
	  if(this.state.modeAddress){
		  if( !this.state.addressSelected){
		  	me.showPopupAlert(I18n.t("POWER_FAILURE"), I18n.t("LOCATION_IS_NEED"));
		  	return;
		  }else{
			coordinates=this.state.coordinates;
			coordinates.ePSG="EPSG:4326";
		  }
	  }else{
		  accountNumber = repo.configuration.getField('accountNumber')
	  }

	  me.setState({ spinnerVisible: true });

	  ///Define data object
	  let customer = JSON.parse(repo.configuration.getField('customerData'));

	  let data = {
		  	  address: coordinates,
			  warningType: value.type,
			  reference: accountNumber,
			  idCustomer: customer.idCustomer,
			  contactData: {
				  name: customer.name,
				  email: value.solution && value.email ? value.email: "",
				  sms: value.solution && value.sms ? value.sms: "",
				  surname1: customer.surname1,
				  surname2: customer.surname2
			  },
			  listAttribute: []
	  };
	  
	  //Generate listattributes
	  if(me.state.attributeList && me.state.attributeList.length){
		  for(var i=0;i<me.state.attributeList.length;i++){
			  let attr = me.state.attributeList[i];
			  let val = value[attr.codAttribute];
			  data.listAttribute.push({
				  codAttribute: attr.codAttribute,
				  //valueAttribute: moment(generateDate(val)).format("YYYY-MM-DD")
				  valueAttribute: val
			  });		  
		  }
	  }  ;

	  this.sendOutageToServer(data);
	  Keyboard.dismiss();
  }

	sendOutageToServer(data){
		let warningCode = null;
		waterfall([
			( callback ) => {
				generalService.sendOutageAction(data, callback);
			},
			( arg1, callback ) => {
				warningCode = arg1.data.warningCode;
				var files = false;
				let data = new FormData();
				data.append('entityCode',warningCode);
				data.append('entityType',"1201REFTYP");

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
				if(warningCode) {
					let mess = I18n.t("WARNING_CODE");
					if(err){
						mess = I18n.t("WARNING_CODE_WITHOUT_FILE");
					}
					this.showPopupAlert(I18n.t("POWER_FAILURE"), mess + warningCode, {
						1: {
							key: 'button1',
							text: `${I18n.t('accept')}`,
							action: () => {
								this.props.loadDataListOutages();
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

  handleChangeType (value){
	  if(!value){
		  return;
	  }
	  var me = this;
	  me.setState({spinnerVisible:true});
	  generalService.getWarningAttrs({warningType: value}, function(err, res){
		 me.setState({spinnerVisible:false});
		 if(!err && res.data && res.data.length && res.data != '[]'){
			  me.setState({attributeList: res.data})
		 }
		 if ( res.data == '[]' ) {
			me.setState({attributeList:0});
		 }
	  });
  }
  
  handleCheckBox (checked){
	  this.setState({checkSolution: checked})
  }
  
  
  handleEmail (value){
	  let withPhone = true;
	  let withEmail = true;
	  
	  if(value && value.length){
		  withPhone = false;
	  }
	  
	  this.setState({withPhone: withPhone, withEmail:withEmail});
  }
  
  handlePhone(value){
	  let withPhone = true;
	  let withEmail = true;
	  if(value && value.length){
		  withEmail = false;
	  }
	  
	  this.setState({withPhone: withPhone, withEmail:withEmail});
  }
  
  componentWillReceiveProps( nextProps ) {

    if( this.props.dataForm !== nextProps.dataForm ) {
      if( this.props.dataForm.typeComplaint !== nextProps.dataForm.typeComplaint ) {
        this.setState({ type: Number(nextProps.dataForm.typeComplaint) });
      }
    }
  }	
  
  renderItem( { item } ) {
	  let name = item.codAttribute;
	  let label = item.description;
	  let component;
	  let props = {}; //Custom properties for each component
	  	  
	  switch(item.format){
	  case TEXT_FIELD: //Es un campo de texto
		  component = FormField;
		  props.keyboardType = "url";
		  break;
	  case INTEGER_FIELD || DECIMAL_FIELD: //Es un campo numerico, decimal o entero
		  component = FormField;
		  props.keyboardType = "numeric";
		  break;
	  case COMBOBOX_TYPE: //Es un combo con varias opciones
		  props.dataItems = item.attributes.map(function(item){
			  return { code: item.codDevelop, val: item.value }
		  });
		  component = FormPicker;
		  break;
	  case DATE_TYPE: //Es un campo fecha
		  component = FormPickerDate;
		  props.icon = "md-calendar";
		  props.dataFormat = repo.configuration.getField("language") == "es" ? "DD/MM/YYYY" : "MM/DD/YYYY";
		  props.label = label;
		  props.width = platformStyle.deviceWidth - 70;
		  break;
	  }
	  
	  if(component){
		  return (
			  <Field name={name}
				  component={component}
				  inputLabel={label}
				  errorActive
				  validate={[ required ]}
				  underline
				  light
				  {...props}
			  />
		  );
	  }
  }

	/**
	 * Executed when location is selected in 'ReportCoordinates' screen.
	 * @param param
     */
	refresh(param){
		if(param && param.latitude & param.longitude){
			this.setState({addressSelected: true, coordinates: {latitudeDegrees: param.latitude,longitudeDegrees:param.longitude}})
		}
	}
  
  
  _keyExtractor = ( item, index ) => item.codAttribute.toString();
  
  render() {
    return (
      <Container>
        <Header {...this.props} noDrawer
                iconAction={true}/>
        <SubHeader text={I18n.t('ReportOutages')} back
                   {...this.props}
        />
        <PopupDialog
          refModal={this.state.messageAlert}
        />
        <Content>
			{!this.state.modeAddress?
          <View style={{...styles.infoContainer, backgroundColor: platformStyle.brandYellowLight}}>
            <Text uppercase black sizeNormal style={sharedStyles.textAlign('center')}>{I18n.t("NO_POWER")}</Text>
            <Text sizeNormal style={sharedStyles.textAlign('center')}>
            	{I18n.t("REPORT_OUTGAGE")}
            </Text>
          </View>:null}

          <View style={styles.formContainer}>
           
            <Field name="type"
                component={FormPicker}
                inputLabel={I18n.t("OUTGAGE_TYPE")}
                errorActive
                validate={[ required ]}
                dataItems={this.state.types}
     			onChange={this.handleChangeType.bind(this)}
                underline
                light
            />
            
            <FlatList data={this.state.attributeList}
	            style={sharedStyles.margin('bottom', 5)}
	            renderItem={this.renderItem}
	            keyExtractor={this._keyExtractor}
            />

			  {this.state.modeAddress?
			  <Button style={{...sharedStyles.margin('top'), backgroundColor: (this.state.addressSelected?platformStyle.brandPrimary:'#c2d47d')}}
					  rounded
					  onPress={() => {
					  		this.props.navigation.navigate('OutagesReportCoordinates',{onGoBack: (param) => this.refresh(param)});
						}}	
					 >
				  <Text sizeNormal> {I18n.t('REPORT_HERE')}</Text>
			  </Button>:null}

			  <View style={{...sharedStyles.margin("top")}}>
				  
				  <DocPicker
					  freeEntity={[
                {
                  "nameType": I18n.t("WARNING_PHOTO"),
                  "codDocum": "DT0031",
                  "fileType": "IMG"
                }                
                ]}
					  fileArray={this.state.fileArray}
				  />
			  </View>


			  {/* <Field name={`photo_1`}
					 component={( { meta } ) => {
					return (
					  <View style={{ flexDirection: 'row' }}>
						<View>
						  <Button style={{...sharedStyles.margin('top'),
						  backgroundColor: (this.state.photo0?'green':platformStyle.brandPrimary)}}
							roundedCircleMedium
							onPress={() => this.checkPermissionAndOpen("photo0", 0)}>
							<Icon name="md-camera" style={{ fontSize: 40 }}/>
						  </Button>
						</View>
					</View>)
				  }}
					 validate={[]}
			  />

			  <Field name={`photo_2`}
					 component={( { meta } ) => {
					return (
					  <View style={{ flexDirection: 'row' }}>
						<View>
						  <Button style={{...sharedStyles.margin('top'),
						  backgroundColor: (this.state.photo1?'green':platformStyle.brandPrimary)}}
							roundedCircleMedium
							onPress={() => this.checkPermissionAndOpen("photo1", 1)}>
							<Icon name="md-camera" style={{ fontSize: 40 }}/>
						  </Button>
						</View>
					</View>)
				  }}
					 validate={[]}
			  />			 
				*/}

            
            <Field name="solution"
                component={Checkbox}
                label={<Text sizeNormal
                             style={{ ...sharedStyles.margin('left', 2),...sharedStyles.margin('top'), width: platformStyle.deviceWidth - 60 }}>
                  {I18n.t('MSG015')}{' '}
                </Text>
                }
            	onPress={this.handleCheckBox.bind(this)}
            	{...this.props}
            />

            {this.state.checkSolution ?
            		<Text black sizeNormal style={sharedStyles.textAlign('center')}>{I18n.t('MSG016')}</Text>
            : null}
            
            {this.state.checkSolution && this.state.withPhone ?
            		<Field name="sms"
		                component={FormField}
            			inputLabel={I18n.t('PhoneNumber')}
						onChange={this.handlePhone.bind(this)}
		        		editable={this.state.withPhone}/>
            : null}
            
            
            {this.state.checkSolution && this.state.withEmail ?		        
		        	<Field name="email"
			            component={FormField}
            			inputLabel={"Email"}
						keyboardType="email-address"
            			validate={[ email ]}
						errorActive
						onChange={this.handleEmail.bind(this)}
			    		editable={this.state.withEmail}/>
			: null}
            
            {platformStyle.platform === 'ios' ?
              <Button style={{...sharedStyles.margin('top'), backgroundColor: platformStyle.brandPrimary}}
                      block
                      rounded
                      onPress={this.props.handleSubmit(this.submit.bind(this))
                      }>
                <Text sizeNormal> {I18n.t('Submit')}</Text>
              </Button> : null}
          </View>
        </Content>
        <Spinner visible={this.state.spinnerVisible} textContent={I18n.t('Loading')}
                 overlayColor={`rgba(0, 0, 0, 0.60)`}
                 textStyle={{ color: '#FFF' }}/>

        {platformStyle.platform === 'android' ?
          <Footer
            noBorders
            padder>
            <FooterTab>
              <Button style={{backgroundColor: platformStyle.brandPrimary}}
                block
                rounded
                onPress={this.props.handleSubmit(this.submit.bind(this))
                }>
                <Text sizeNormal> {I18n.t('Submit')}</Text>
              </Button>
            </FooterTab>
          </Footer> : null
        }
      </Container>
    );
  }
}

const OutagesPage = reduxForm({
  form: "ReportOutagesForm",
  enableReinitialize: true,
})(Outages);

function bindAction( dispatch ) {
	return {
		loadDataListOutages: ( formData ) => dispatch(loadDataListOutages()),
	};
}

const selector = formValueSelector('ReportOutagesForm');
const mapStateToProps = state => {
  const accounts = JSON.parse(repo.configuration.getField('accountListAction')) || [];
  return {
    dataForm: selector(state, 'account', 'meter', 'typeComplaint'),
    initialValues: {
      accountNumber: accounts.length === 1 ? accounts[ 0 ].accountNumber : state.generalReducer.selectAccount.accountNumber,
      // idPaymentForm: accounts.length === 1 ? accounts[ 0 ].idPaymentForm : state.generalReducer.selectAccount.idPaymentForm,
    }
  }
};

export default connect(mapStateToProps,bindAction)(OutagesPage);
