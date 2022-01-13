import React, { Component } from "react";
import { Text, Button, Content, Container, Row, Left, ListItem, Body, View, Icon } from "native-base";
import { Keyboard, FlatList, Image, PermissionsAndroid } from 'react-native';
import I18n from 'react-native-i18n';
import { Field, reduxForm } from "redux-form";
import { connect } from 'react-redux';
import moment from 'moment';
import ImagePicker from 'react-native-image-picker';

import Header from '../../../components/Header';
import YellowSubHeader from '../../../components/YellowSubHeader';
import errorStyles from '../../../components/FormField/styles';
import SubMenu from '../SubMenu';
import repo from '../../../services/database/repository';
import {platformStyle} from "../../../theme";
import sharedStyles from '../../../shared/styles';
import Spinner from '../../../components/Spinner';
import PopupDialog from '../../../components/PopupDialog/';
import { NavigationActions } from 'react-navigation'
import firebaseService from "../../../services/firebase/firebaseService";
import FormField from '../../../components/FormField/';

import generalService from "../../../services/general/generalService";

const backAction = NavigationActions.back({
  key: null
});

class AddReading extends Component {
  constructor( props ) {
    super(props);
    this.state = {
      spinnerVisible: false,
      reRender: new Date().valueOf(),
      indPrepayment: null,
      selfReadsAvailable: null,
      selfReads: null,
      available: false,
      idPaymentForm: repo.configuration.getField('idPaymentForm'),
      wss: 0,
      errors: 0,
      size: 0
    };
  }

  componentDidMount() {
    firebaseService.supervisorAnalytic('ADDREADING'); 
    let AdditionalData = JSON.parse(repo.configuration.getField('accountAdditionalData'));
    
    this.setState({spinnerVisible: true, indPrepayment: AdditionalData.indPrepayment});

	generalService.getSelfReadsAvailable(this.state.idPaymentForm, function(err, response){
		if(!err){
			//check if anyone has self read
			var hasSelfReads = false;
    		var selfReadsAvailable = response;
			for(let i=0; i < selfReadsAvailable.length; i++){
				if(selfReadsAvailable[i].hasSelfRead){
					hasSelfReads = true;
					break;
				}
			}
			
			if(hasSelfReads){

		    	generalService.getSelfReads(this.state.idPaymentForm, function(err, response2){
		    		let selfReads = response2;

		    		if(!err && selfReads.length){
		    			
		    			  let exists = false;
	    				  for(let i=0; i < selfReads.length; i++){
	    					  selfReads[i].exists = false;
	    					  
		    				  for(let j=0; j < selfReadsAvailable.length; j++){
		    					  if(selfReads[i].idService == selfReadsAvailable[j].idContractedService){
		    						  selfReads[i].exists = true;
		    						  exists = true;
		    					  }
		    				  }
	    				  }
		    			  
		    			  if(exists){
		    				  this.setState({available: true});
		    			  }
		    			  
		    			  this.setState({selfReadsAvailable: selfReadsAvailable, selfReads: selfReads});
		    		}
				    this.setState({spinnerVisible:false});
				    
		    	}.bind(this));
			}else{
			    this.setState({spinnerVisible:false});
				this.showPopupAlert("Info", I18n.t('READINGS_CLOSED'));
			}
		}else{
			this.setState({spinnerVisible:false});
		}
    	
	}.bind(this));
    
  }


  
 
  
  
  onAddRead(err, resp){
	  this.state.wss++;
	  if(err){
		  this.state.errors++;
	  }
	  if(this.state.size <= this.state.wss){
		  if(!this.state.errors){
			  this.showPopupAlert("Ok", I18n.t('READINGS_ADDED'),{
				  1: {
					  key: 'button1',
					  text: `${I18n.t('accept')}`,
					  action: () => {
						  var me = this;
						  me.props.navigation.dispatch(backAction);
					  },
					  align: ''
				  }
			  });
		  }else if(err.messageAlert){
			  this.setState({messageAlert: err.messageAlert});
		  }else{
			  if(!err){
				  err = I18n.t('HAS_ERROR');
			  }
			  this.showPopupAlert("Error!", err);
		  }
		  this.setState({spinnerVisible: false});
	  }
	  
  }
  
  submit( values ) {
    Keyboard.dismiss();
    this.setState({size: Object.keys(values).length});
    
    for (let i in values){
    	let id = i.split("-")[1];
		let value = values[i];

    	if(id && value){
    		let item = this.state.selfReads[id];
			let photo = item && item.photo && item.photo.photo?item.photo.photo:undefined;
    		let data = {
    				idService: item.idService,
    				readings:[{
    					serialNum: item.numMeter,
    					consumType: item.consumType,
    					readingValue: value,
        				photo: photo
    				}]
    		};
  		  	this.setState({spinnerVisible: true});
    		generalService.addSelfReads(this.state.idPaymentForm, data, this.onAddRead.bind(this));
    	}
    }
    
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

  selectPhotoTapped( item, index ) {
    const options = {
      title: null,
      takePhotoButtonTitle: I18n.t('TakePhoto'),
      // chooseFromLibraryButtonTitle: I18n.t('SelectPhoto'),
      chooseFromLibraryButtonTitle: null,
      quality: 0.8,
      maxWidth: 400,
      maxHeight: 400,
      storageOptions: {
        skipBackup: true
      }
    };

    // Launch Camera:
    ImagePicker.launchCamera(options, ( response ) => {
      // ImagePicker.launchCamera(options, ( response ) => {

      if( response.didCancel ) {
        //console.log('User cancelled photo picker');
      }
      else if( response.error ) {
        //console.log('ImagePicker Error: ', response.error);
      }
      else if( response.customButton ) {
        //console.log('User tapped custom button: ', response.customButton);
      }
      else {
    	let selfReads = this.state.selfReads;
    	if(!selfReads[index].photos){
    		selfReads[index].photos = [];
    	}
    	selfReads[index].photo = {
          photoName: response.fileName,
          path: response.path,
          photo: response.data,
          serialNum: item.numMeter
        };
    	console.log("selfReads", selfReads)
        this.setState({selfReads});
        
      }
    });
  }


  requestPermission = async ( item, index ) => {

    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          'title': 'Camera Permissions',
          'message': 'Please allow us to use the camera?'
        }
      );
      if( granted === PermissionsAndroid.RESULTS.GRANTED ) {
        this.selectPhotoTapped(item, index);
      } else {
        console.log("Camera permission denied");
      }
    } catch( err ) {

      console.log('hasPermission-requestPermission-err', err);
    }
  }

  hasPermission = async () => {

    try {
      return await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.CAMERA);
    } catch( err ) {
      console.log('ERROR', 'hasPermission-hasPermission');
      //console.warn(err, 'PERMISSION CHECK');
    }
  }

  checkPermissionAndOpen = ( item, index ) => {

    if( platformStyle.platform == 'ios' ) {
      this.selectPhotoTapped(item, index);
    } else {
      this.hasPermission().then(( hasPermission ) => {

        if( hasPermission ) {

          this.selectPhotoTapped(item, index);
        } else {
          this.requestPermission(item, index);
        }
      });
    }

  }
  
  renderItem({ item, index } ){	  
	  
	  return (
	      <ListItem column borderDark>
		      <Row style={sharedStyles.margin('bottom', 2)}>
            		<Text sizeNormal heavy>{item.serviceName} {item.numMeter}</Text>
	          </Row>
	          
	          <Row style={sharedStyles.margin('bottom', 2)}>

		        	{item.exists ? 
		        			<Body><Field name={"reading-" + index}
					            component={FormField}
		            			inputLabel={item.consumTypeDesc + " " + item.units}
				        		keyboardType="numeric"
				        	/></Body>
		        			:
		        			<Left>
				            	<Text sizeNormal heavy>{I18n.t("READ_PERIOD_CLOSE")}</Text>
				            </Left>
		        	}
		      </Row>
		      <Row style={sharedStyles.margin('bottom', 2)}>
		      	{
		      		item.photos && 
    				  <View style={{ marginVertical: 5, width: 50, height: 50}}>
		                <Image source={{ uri: `file://${item.photo.path}` }} style={{ flex: 1 }}/>
		              </View>
		      	}
		      </Row>
		      <Row>
		      		<Field name={`photo_${item.consumType}-${item.numMeter}`}
		              component={( { meta } ) => {
		                return (
		                  <View style={{ flexDirection: 'row' }}>
		                    <View>
		                      <Button style={{backgroundColor: platformStyle.brandPrimary}}
		                        roundedCircleMedium
		                        onPress={() => this.checkPermissionAndOpen(item, index)}>
		                        <Icon name="md-camera" style={{ fontSize: 40 }}/>
		                      </Button>
		                    </View>
		                </View>)
		              }}
		              validate={[]}
			       />
		      </Row>
	      </ListItem>
	  );
	  
  }

  _keyExtractor = ( item, index ) => item.idService.toString() + item.consumType;
  
  render() {
	  
	let actualDate = moment(new Date()).format("DD/MM/YYYY");
	  
    return (
      <Container>
        <Header {...this.props} noDrawer/>

        <SubMenu title={I18n.t("ADD_READING")} noMenu={true} leftIcon={"ios-close"} {...this.props} reRender={this.state.reRender}
                 indPrepayment={this.state.indPrepayment}/>
        
        <PopupDialog refModal={this.state.messageAlert} />
        
        <YellowSubHeader text={I18n.t("METERS")} />
        
        <Content padderHorizontal>

	        <FlatList data={this.state.selfReads}
			        style={sharedStyles.margin('bottom', 5)}
			        renderItem={this.renderItem.bind(this)}
			        keyExtractor={this._keyExtractor}
			/>
	        
        	{this.state.available ? 
    				<View>
      			      <Row>
      			      		<Text sizeNormal>{I18n.t('READING_DATE')} {actualDate}</Text>
      			      </Row>
      			      
      			      <Row style={sharedStyles.margin('top', 5)}>
      			      		<Button block rounded style={{ backgroundColor: platformStyle.brandPrimary}} onPress={this.props.handleSubmit(this.submit.bind(this))}>
      			      			<Text sizeNormal>{I18n.t('Submit')}</Text>
      			            </Button>
      			      </Row>
  			      	</View>
  			      : null
        	}
	        	
        </Content>
        <Spinner visible={this.state.spinnerVisible} textContent="..."/>
      </Container>
    );
  }
}

const AddReadingForm = reduxForm({
  form: "AddReadingForm",
  enableReinitialize: true,
})(AddReading);

const mapStateToProps = state => {
  return ({
	   ///initialValues: state.generalReducer.loadDate,
  })
};

const bindAction = dispatch => {
  return {
	   ///loadDate: ( formData ) => dispatch(loadDate(formData)),
  };
};

export default connect(mapStateToProps, bindAction)(AddReadingForm);
