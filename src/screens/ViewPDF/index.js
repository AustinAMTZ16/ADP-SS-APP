import React, { Component } from 'react';
import { Platform, Share as ShareRN, PermissionsAndroid } from "react-native";
import {
  Container,
  Icon,
  Text,
  Content,
  Button,
} from "native-base";
import I18n from 'react-native-i18n';
import PDFView from 'react-native-view-pdf';
import PleaseWait from '../../components/PleaseWait/';
import {platformStyle} from "../../theme";
import syncService from "../../services/general/syncService";
import repo from "../../services/database/repository";
import RNFetchBlob from "react-native-fetch-blob";
import Header from '../../components/Header';
import PopupDialog from '../../components/PopupDialog/';
import SubHeader from '../../components/SubHeader';
import firebaseService from "../../services/firebase/firebaseService";
import Share from 'react-native-share';
import Spinner from '../../components/Spinner';
import Config from 'react-native-config';
import TimerMixin from "react-timer-mixin";

import {createAlert} from '../../components/ScreenUtils';

import { NavigationActions} from 'react-navigation'

const backAction = NavigationActions.back({
	key: null
});

class ViewPDF extends Component {

  constructor( props ) {
    super(props);
    const { navigation } = this.props;
    
    this.state = {
      pdfPath: null,
	  messageAlert:"",
      spinnerVisible: false,
      downloadUrl: navigation.getParam('downloadUrl', null),
      title: navigation.getParam('title', I18n.t('STATEMENT_PREV')),
      filename: navigation.getParam('filename', "file.pdf"),
		back:false,
	  source: navigation.getParam('source', null),
    };

  }

  componentDidMount() {
    firebaseService.supervisorAnalytic('STATEMENTPDF');
	this.downloadStatement(null);
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

  
  downloadStatement( callback ){
	  //Check device permissions first
	  this.showSpinner();
	  this.requestPermission().then(function( granted ){
		  if(granted){
			  //if granted check the access token
	          syncService.checkAccesToken(function(err){
	        	  //if no problem with access token... download the file
	        	  if(!err){
				      let fs = RNFetchBlob.fs;
				      let folder = Platform.OS === 'ios' ? fs.dirs.DocumentDir : fs.dirs.DownloadDir;
				      let filename = this.state.filename;
				      let pdfPath = folder + '/' + filename;
					  let URL = this.state.downloadUrl;
					  if (URL && URL.length)
					  	URL = _.replace(URL, /'/g, '');
				     
				      if(fs.exists(pdfPath)){
				    	  fs.unlink(pdfPath);
				      }
				      
				      let addAndroidDownloads = {
							useDownloadManager : true,
							notification : false,
							overwrite : true,
							path:  pdfPath				    	  
				      }

					  if(this.state.source!=null){
						  this.writePDF(addAndroidDownloads,URL,pdfPath,filename,callback);
					  }else{
						  this.downloadPDF(addAndroidDownloads,URL,pdfPath,filename,callback);
					  }
				     
	        	  }else{
	    			  this.hideSpinner();
	    			  if(callback){
	    				  callback(null, "ACCESS_TOKEN");
	    			  }
	        	  }
	          }.bind(this));
			  
		  }else{
			  this.hideSpinner();
			  if(callback){
				  callback(null, "NO_PERMISSIONS");
			  }
		  }

	  }.bind(this));
  }

  writePDF(addAndroidDownloads,URL,pdfPath,filename,callback) {
	  const fs = RNFetchBlob.fs;
	  fs.createFile(pdfPath, this.state.source, 'base64');

	  if (filename.endsWith("xml")) {
		  this.hideSpinner();
		  let options =  {
			  1: {
				  key: 'button1',
				  text: `${I18n.t('accept')}`,
				  action: () => {
					  TimerMixin.setTimeout(() => {
						  this.props.navigation.dispatch(backAction);
					  }, 500);
				  },
				  align: ''
			  },
		  };
		  if (Platform.OS === 'android') {
			this.showPopupAlert(I18n.t('DOWNLOAD_XML'), I18n.t('PDF_DOWNLOADED') + filename,"",options);
		  }
	  } else {
		  this.setState({pdfPath});
		  if (Platform.OS === 'android') {
			this.showPopupAlert(I18n.t('DOWNLOAD_PDF'), I18n.t('PDF_DOWNLOADED') + filename);
		  }
	  }
	  
	  if(callback){
		  callback(res);
	  }
  }
	
  downloadPDF(addAndroidDownloads,URL,pdfPath,filename,callback){
	  let headers = {
		  'Authorization': 'Bearer ' + repo.configuration.getField('access_token'),
		  'Accept-Language': repo.configuration.getField('language'),
		  'Cache-Control': 'no-store',
		  'clientVersion': Config.CLIENT_VERSION
	  };

	  let TENANT = repo.configuration.getField('tenantId');
	  if(Config.IS_MULTITENANT === "true" && TENANT.length){
		  headers["x-incms-tenant"] = TENANT;
	  }

	  console.log("URL: " + URL + "name: " + filename);
	  RNFetchBlob.config({
		  path: pdfPath,
		  fileCache: true,
		  overwrite : true,
		  appendExt: 'pdf',
		  addAndroidDownloads
	  }).fetch('GET', URL, headers).then((res) =>{		 
		  this.hideSpinner();
		  this.setState({pdfPath});
		  TimerMixin.setTimeout(() => {
			  if (Platform.OS === 'android') {
				this.showPopupAlert(I18n.t('DOWNLOAD_PDF'), I18n.t('PDF_DOWNLOADED') + filename);
			  }
		  },1000);

		  if(callback){
			  callback(res);
		  }
	  }).catch((errorMessage) =>{
		  console.error("ViewPDF - Error on downloading PDF from: " + URL);
		  console.error("ViewPDF - Err: " + errorMessage);

		  //Error downloading
		  //this.hideSpinner();
          //
		  // this.setState({ spinnerVisible: false });
			//   TimerMixin.setTimeout(() => {
			// 	  this.showPopupAlert(I18n.t('DOWNLOAD_PDF'), errorMessage);
			//   },1000);
		  //
		  let errMSG= 'Documento no encontrado. En caso de tratarse de un documento con costo debe realizar el pago del mismo antes de descargarlo.';
		  TimerMixin.setTimeout(() => {
			  this.setState({spinnerVisible:false,back:true,messageAlert: createAlert(I18n.t("DOWNLOAD_PDF"), errMSG.toString())})
		  }, 1000);

		  if(callback){
			  callback(null, errorMessage);
		  }
	  });
  }	
  
  ShareStatement() {

	  if( platformStyle.platform === 'ios' ) {

		  ShareRN.share({
			  message: I18n.t("SHARE_STATEMENT"),
			  url: this.state.pdfPath,
			  title: I18n.t("SHARE_STATEMENT")
		  }, {
			  // Android only:
			  dialogTitle: I18n.t("SHARE_STATEMENT"),
			  // iOS only:
			  excludedActivityTypes: [
				  'com.apple.UIKit.activity.PostToTwitter'
				  ]
		  });

	  } else {
		  let resource = "file://" + this.state.pdfPath;
		  let shareImageBase64 = {
				  title: I18n.t("SHARE_STATEMENT"),
				  message: "",
				  url: resource,
				  subject: I18n.t("SHARE_STATEMENT")
		  };
		  Share.open(shareImageBase64);
	  }
  }
  
  
  async requestPermission() {
	  
	  if(platformStyle.platform === 'ios'){return true;}
	  
	  let isGranted = await this.hasPermission();
	  if(!isGranted){//doesnt have permissions request it
		  try {
			  const granted = await PermissionsAndroid.request(
				  PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
				  {
					  'title': I18n.t("STORAGE_PERMISSION"),
					  'message': I18n.t("ALLOW_STORAGE_PERMISSION")
				  }
			  );
			  isGranted = granted === PermissionsAndroid.RESULTS.GRANTED;
		  } catch( err ) {isGranted = false;}
	  }
	  return isGranted;
  };

  hasPermission () {
	  try {
		  return PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE);
	  } catch( err ) {
		  return false;
	  }
  };
  

  showSpinner() {
    this.setState({ spinnerVisible: true });
  }

  hideSpinner() {
    this.setState({ spinnerVisible: false });
  }


  render() {

    if( this.state.pdfPath ) {
    	let resource = "file://" + this.state.pdfPath;
        let resourceType = 'url';
        
        return (

          <Container>
          	<PopupDialog
	          refModal={this.state.messageAlert}
	        />
            <Header {...this.props} noDrawer
                    iconAction={true}
            />
            <SubHeader text={this.state.title} back={true} {...this.props} rightComponent={ 
            	this.state.pdfPath  && 
                     <Container style={{flexDirection: 'row', backgroundColor: 'transparent', paddingTop: 5}}>
                         <Button style={{backgroundColor: platformStyle.brandPrimary}} menuSubHeader
                             onPress={() => {
                               this.ShareStatement();
                             }}>
                           	<Icon name="md-share" style={{ fontSize: 35 }}/>
						</Button>
						{/** DOWNLOAD BUTTON. Commented for future uses
						
						<Button style={{backgroundColor: platformStyle.brandPrimary}} menuSubHeader
	                         onPress={() => {
	                             this.downloadStatement( null, true );
	                         }}>
							<Icon name="md-download" style={{ fontSize: 35 }}/>
						</Button>**/}
					</Container>
            }/>
            
            {this.state.pdfPath && 
            	<PDFView style={{ flex: 1, height: platformStyle.deviceHeight }} resource={resource} resourceType={resourceType}/>
            }
                         
          </Container>
        );
    } else {
    	return ( 
    		<Container>
		        <Header {...this.props} noDrawer
		                iconAction={true}
		        />
		        <SubHeader text={this.state.title} back={this.state.back} {...this.props}/>
				<PopupDialog
					refModal={this.state.messageAlert}
				/>
		        <Content>
		          <PleaseWait/>
		        </Content>
		        <Spinner visible={this.state.spinnerVisible} textContent="..."/>
	        </Container>
	   )
    }
 }
  
  

  
}


export default ViewPDF;