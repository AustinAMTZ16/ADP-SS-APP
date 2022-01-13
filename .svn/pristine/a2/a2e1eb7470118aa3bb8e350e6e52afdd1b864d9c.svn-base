import { NetInfo } from 'react-native';
import repo from '../database/repository';
import _ from 'lodash';
import moment from 'moment';
import securityService from '../security/securityService';
import waterfall from 'async/waterfall';
import Config from 'react-native-config';
import base64 from 'base-64';
import axios from 'axios';
import FormData from 'form-data';
import I18n from 'react-native-i18n';
import {createErrorAlert} from '../../components/ScreenUtils';


const qs = require('querystring')

/**
 *
 * @type {{uploadData: (function(*=, *=, *, *=, *=, *=)), upload: (function(*, *=, *, *=, *, *=)), downloadData: (function(*=, *=, *, *=, *=, *=)), download: (function(*=, *=, *, *=, *, *=))}}
 */
const syncService = {

  /**
   *
   * @param route
   * @param dataObj
   * @param callbackFinal
   * @param method
   * @param statusResponse
   * @param authorization
   * @param Token
   */
  uploadData( route, dataObj = {}, callbackFinal, method = 'POST', statusResponse = 200, authorization = true, Token = false ) {

    waterfall([
        ( callback ) => {
          if( authorization ) {
            this.checkAccesToken(callback, dataObj);
          } else {
            return callback(null, 'OK');
          }
        },
        ( arg1, callback ) => {
          // this.upload(route, dataObj, callback, method, statusResponse, authorization, Token)
          this.upload(route, dataObj, callback, method, statusResponse, authorization, Token)
        } ],
      function( err, result ) {
        callbackFinal(err, result)
      }.bind(this))
  },

  /**
   *
   * @param route
   * @param dataObj
   * @param callbackFinal
   * @param method
   * @param statusResponse
   * @param authorization
   * @param Token
   */
  upload( route, dataObj, callbackFinal, method, statusResponse, authorization, Token = false ) {
	  NetInfo.getConnectionInfo().then(
		  ( connectionInfo ) => {
			  if( connectionInfo.type !== 'none' ) {

          if (route && route.length)
                  route = _.replace(route, /'/g, '');
				  let TENANT = repo.configuration.getField('tenantId');

                  let contentType = 'application/json';
                  if(method.includes("_FILE")){
                      contentType='multipart/form-data'
                  }
				  
				  route = route.replace("{apiVersion}", repo.configuration.getField('apiVersion'));
				  let headers = {
					  'Content-Type': contentType,
					  'X-Incms-App-Client': repo.configuration.getField('xAppClient'),
					  'X-Incms-Origin-I': repo.configuration.getField('userIp'),
					  'X-Incms-Origin-D': repo.configuration.getField('user_username')
				  };

                  headers['Accept-Language'] = repo.configuration.getField('language');
                  if(Config.IS_MULTITENANT === "true" && TENANT.length){
                      route = "/t/" + TENANT + route;
                      headers["x-incms-tenant"] = TENANT;
                  }
	
				  if( authorization ) {
					  let access_token = repo.configuration.getField('access_token');
					  let authorizationHeader = {
						'Authorization': 'Bearer ' + access_token,
					  };
					  headers = _.merge(headers, authorizationHeader)
				  }
  
          let domainConfig = repo.configuration.getField('domain');
          if (domainConfig && domainConfig.length)
            domainConfig = _.replace(domainConfig, /'/g, '');

				  const api = axios.create({
					  baseURL: domainConfig,
					  headers,
					  transformRequest: [ ( data, headers ) => {
						  delete headers.common.Accept;
						  delete headers.Accept;				
						  return data
					  } ]
				  });

		          const { CancelToken: { source } } = axios;
		          const { cancel, token } = source();
				  setTimeout(cancel, 20000);

                  let body="";
                  // Upload file based on: https://aboutreact.com/file-uploading-in-react-native/
                  if(method.includes("_FILE")){
                      method=method.substring(0,method.indexOf("_")); //OBTAIN METHOD TO USE WHEN UPLOADING FILES                    
                      body = dataObj;
                  }else{
                      body = JSON.stringify(dataObj);
                  }

				  const promise = method === 'POST' ? api.post(route, body, {cancelToken: token}) : method === 'PATCH' ? api.patch(route, body, {cancelToken: token}) : api.put(route, body, {cancelToken: token});
				  promise
				  .then(( response ) => {
					  if( statusResponse === response.status ) {
						  return callbackFinal(null, response.data);
					  } else {
						  if( response.data && response.data.error_description )
							  return callbackFinal(response.data.error_description);
						  else if( response.data && response.data.msgUser )
							  return callbackFinal(response.data.msgUser);
						  else if( response.data && response.data.msgDeveloper )
							  return callbackFinal(response.data.msgDeveloper);
						  else if( !response.ok ) {
                              if(Config.DEV){
                                  console.error("syncService - Error on upload NO API \n\nURL: " + route + "\n\nMETHOD: " + method);
                              }
							  return callbackFinal(" - " + I18n.t("HAS_ERROR_RETRY"));
						  }
						  else{
                              if(Config.DEV){
                                  console.error("syncService - Error on upload ELSE \n\nURL: " + route + "\n\nMETHOD: " + method);
                              }
                              return callbackFinal(" * " + I18n.t("HAS_ERROR_RETRY"));
                          }
					  }
				  }).catch(( error ) => {
                      if (Config.DEV) {
                          console.error("syncService - Error on upload CATCH \n\nURL: " + route + "\n\nMETHOD: " + method + "\n\nERROR DESC: " + JSON.stringify(error));
                      }

                      if (error && error.response && error.response.data) {
                            let data = error.response.data;
                            if(data.error && data.error=="invalid_grant"){
                                return callbackFinal('INVALID_PASSWORD'); //SPECIAL CASE FOR API MANAGER USER MANAGEMENT
                            }   else if (data.error_description) {
                                return callbackFinal(data.error_description);
                            } else if (data.msgUser){
                                return callbackFinal(data.msgUser);
                            } else if (data.msgDeveloper){
                                return callbackFinal(data.msgDeveloper);
                            }
                      }
                      return callbackFinal(I18n.t("HAS_ERROR_RETRY"));
				  });
	
			  } else {
                  if(Config.DEV){
                      console.error("syncService - Error on upload NETWORK \n\nURL:" + route + "\n\nMETHOD: " + method);
                  }
				  return callbackFinal(I18n.t("NETWORK_ERROR"));
			  }
		  });

  },



  /**
   *
   * @param route
   * @param parameter
   * @param callbackFinal
   * @param method
   * @param statusResponse
   * @param authorization
   * @param Token
   */
  downloadData( route, parameter = {}, callbackFinal, method = 'GET', statusResponse = 200, authorization = true, Token = false ) {

    waterfall([
        ( callback ) => {
          if( authorization ) {
            this.checkAccesToken(callback, parameter);
          } else {
            return callback(null, 'OK');
          }
        },
        ( arg1, callback ) => {
          // this.download(route, parameter, callback, method, statusResponse, authorization, Token)
          this.download(route, parameter, callback, method, statusResponse, authorization, Token)
        } ],
      function( err, result ) {
        return callbackFinal(err, result)
      }.bind(this))


  },

  
  /**
   *
   * @param route
   * @param parameter
   * @param callbackFinal
   * @param method
   * @param statusResponse
   * @param authorization
   * @param Token
   */
  download( route, parameter, callbackFinal, method, statusResponse, authorization, Token = false ) {

    NetInfo.getConnectionInfo().then(
      ( connectionInfo ) => {
        if( connectionInfo.type !== 'none' ) {

          let API_URL = repo.configuration.getField('domain');
          let TENANT = repo.configuration.getField('tenantId'); 
		      route = route.replace("{apiVersion}", repo.configuration.getField('apiVersion'));

          if(route && route.length)
            route = _.replace(route, /'/g, '');

          let headers = {
        	  'Content-Type': 'application/json',
        	  'Accept-Language': repo.configuration.getField('language'),
			  'X-Incms-App-Client': repo.configuration.getField('xAppClient'),
			  'X-Incms-Origin-I': repo.configuration.getField('userIp'),
			  'X-Incms-Origin-D': repo.configuration.getField('user_username')
          };
          
          
          if(Config.IS_MULTITENANT === "true" && TENANT.length){
			route = "/t/" + TENANT + route;
			headers["x-incms-tenant"] = TENANT;
		  }

          if( authorization ) {
            let access_token = repo.configuration.getField('access_token');
            let authorizationHeader = {
              'Authorization': 'Bearer ' + access_token,
            };
            headers = _.merge(headers, authorizationHeader)
          }

          if (API_URL && API_URL.length)
            API_URL = _.replace(API_URL, /'/g, '');

          const api = axios.create({
            baseURL: API_URL,
            headers,
            transformRequest: [ ( data, headers ) => {
              delete headers.common.Accept;
              delete headers.Accept;
              return data
            } ]
          });
          

          const { CancelToken: { source } } = axios;
          const { cancel, token } = source();
          
		  setTimeout(cancel, 40000);

          api.get(route, {params: parameter, cancelToken: token}).then(( response ) => {
            if( statusResponse === response.status ) {
              return callbackFinal(null, response.data);
            } else {
              if( response.data && response.data.error_description )
                return callbackFinal(response.data.error_description);
              else if( response.data && response.data.msgUser )
                return callbackFinal(response.data.msgUser);
              else if( response.data && response.data.msgDeveloper )
                return callbackFinal(response.data.msgDeveloper);
              else if( !response.ok ){
                  if(Config.DEV){
                      console.error("syncService - Error on download NO API \n\nURL: " + route + "\n\nMETHOD: " + method);
                  }
                  return callbackFinal(" - " + I18n.t("HAS_ERROR_RETRY"));
              }
              else{
                  if(Config.DEV){
                      console.error("syncService - Error on download ELSE \n\nURL: " + route + "\n\nMETHOD: " + method);
                  }
                  return callbackFinal(" * " + I18n.t("HAS_ERROR_RETRY"));
              }

            }
          }).catch(( error ) => {
              if(Config.DEV){
                  console.error("syncService - Error on download CATCH \n\nURL: " + route + "\n\nMETHOD: " + method + "\n\nERROR DESC: " + JSON.stringify(error));
              }

              if (error && error.response && error.response.data) {
                  let data = error.response.data;
                  if (data.error_description) {
                      return callbackFinal(data.error_description);
                  } else if (data.msgUser){
                      return callbackFinal(data.msgUser);
                  } else if (data.msgDeveloper){
                      return callbackFinal(data.msgDeveloper);
                  }
              }
              return callbackFinal(I18n.t("HAS_ERROR_RETRY"));
          });

        } else {
            if(Config.DEV){
                console.error("syncService - Error on download NETWORK \n\nURL: " + route + "\n\nMETHOD: " + method);
            }
            return callbackFinal(I18n.t("NETWORK_ERROR"));
        }
      });
  },

  /**
   *
   * @param callbackFinal
   * @returns {*}
   */
  checkAccesToken( callbackFinal, params ) {
    let et = repo.configuration.getField('expires_token');
    let gt = repo.configuration.getField('grant_type');

    let etDate = moment.unix(et / 1000);
    let cuDate = moment();
    let diffDate = etDate.diff(cuDate, 'minutes');

    if(diffDate < 5 ) {//5 TODO
        let user = repo.configuration.getField('user_username');
        let pass = repo.configuration.getField('user_plain_password');

      waterfall([
        ( callback ) => {
          return securityService.getAccesToken(user, pass, callback)
        },
        ( arg1, callback ) => {
          return securityService.handleLogin('', '', arg1, callback)
        }

      ], ( err, result ) => {

        if( !err ) {
          return callbackFinal(null, result);
        } else {
          return callbackFinal(err, null);
        }
      })
    } else {
      return callbackFinal(null, 'OK');
    }
  },

    /**
     * Easy error management UPLOAD call
     * @param route
     * @param parameter
     * @param callbackFinal
     * @param method
     * @author preyv
     */
    easyUploadData( route, parameter, callbackFinal, method) {
        waterfall([
            (callback) => {
                this.uploadData(route, parameter, callback, method);
            }
        ], (err, result) => {
            if (!err) {              
                return callbackFinal(null, result);
            } else {
                return callbackFinal({messageAlert: createErrorAlert(err)}, null);
            }
        })        
    },

    /**
     * Easy error management DOWNLOAD call
     * @param route
     * @param parameter
     * @param callbackFinal
     */
    easyDownloadData(route, parameter, callbackFinal) {
        waterfall([
            (callback) => {
                this.downloadData(route, parameter, callback);
            }
        ], (err, result) => {
            if (!err) {
                return callbackFinal(null, result.data);
            } else {
                return callbackFinal({messageAlert: createErrorAlert(err)}, null);
            }
        })
    }
};

export default syncService;