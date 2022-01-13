//
//Security System
//
import React, { Component } from 'react';
import { NetInfo, Alert } from 'react-native';
import moment from 'moment';
import waterfall from 'async/waterfall';
import repo from '../../services/database/repository'
import syncService from '../../services/general/syncService'
import Config from 'react-native-config'
import I18n from 'react-native-i18n';
import _ from 'lodash'
import DeviceInfo from 'react-native-device-info';
import generalService from '../general/generalService'

const OAUTH_ID = "";
const OAUTH_SECRET = "";

/**
 *
 * @type {{autenticateAction: (function(*=, *=, *=, *)), getAccesToken: (function(*, *, *, *=)), getIdCustomer: (function(*=, *=, *=)), handleIdCustomer: (function(*=, *)), getCustomer: (function(*=)), handleCustomer: (function(*=, *)), getServices: (function(*=)), handleServices: (function(*=, *)), handleLogin: (function(*, *, *=, *): *), logoutAction: (function(*)), clearData: (function(*): *)}}
 */
const securityService = {


  /**
   *
   * @param granType
   * @param user
   * @param pass
   * @param callbackFinal
   */
  autenticateAction( granType, user, pass, callbackFinal ) {

    waterfall([
      ( callback ) => {
        this.getAccesToken(user, pass, callback)
      },
      ( arg1, callback ) => {
        this.handleLogin(user, pass, arg1, callback)
      },
      ( arg1, callback ) => {
        if( granType === 'password' ) {
          repo.configuration.setField('user_username', user )
          waterfall([
            ( callback1 ) => {
              this.getIdCustomer(user ? user.toString() : user, pass, callback1)
            }, ( arg1, callback1 ) => {

              this.handleIdCustomer(arg1, callback1);
            }, ( arg1, callback1 ) => {

              this.getCustomer(callback1);
            }, ( arg1, callback1 ) => {

              this.handleCustomer(arg1, callback1);
            },
          ], ( err, result ) => {
            if( !err ) {
              return callback(null, arg1)
            } else {
              return callback(err, null)
            }
          })
        }
        else
          return callback(null, arg1)
      },
      ( arg1, callback ) => {
        return generalService.listDataAction(callback)
      }

    ], ( err, result ) => {

      if( !err ) {
        repo.configuration.setField('grant_type', granType);
        repo.configuration.setField('user_username', user);
        repo.configuration.setField('user_plain_password', pass);
        return callbackFinal(null, result);
      } else {
        return callbackFinal(err, null);
      }
    })
  },


  /**
   *
   * @param granType
   * @param callback
   */
  getAccesToken(username, password, callback ) {
    let endPoint;
	if(username){
      endPoint = `/token/{apiVersion}/private`;
	}else{
      endPoint = `/token/{apiVersion}/public`;
    }

    let scope = "token_public token_private accounts_private accounts_public attributes_public attributes_private customers_public customers_private documents_private documents_public listData_public rccs_private rccs_public sectorSupplies_private sectorSupplies_public selfReads_private selfReads_public serviceRequests_private serviceRequests_public services_private services_public streets_public supplies_private supplies_public users_private users_public workRequests_private workRequests_public notification_private outage_private juaforsure_private juaforsure_public prepayment_private pdfbill_private publicData_public selfReadsPeriod_private corporateAccount_private calculator_public sscalculator_public tips_private warnings_private alerts_private users_private balance_control attachments_private attachments_public adpcfdi_private adpthirdparty_private adpprogram_private ADPWebPayPayments_private adpletter_private adpremoteservice_private";

    let data = {
    	userName: username!=null?username:undefined,
        userSecret: password!=null?password:undefined,
    	scope: scope
    };
    syncService.uploadData(endPoint, data, callback, 'POST', 200, false, true);

  },

  /**
   *
   * @param user
   * @param pass
   * @param callback
   */
  getIdCustomer( user, pass, callback ) {
    let endPoint = Config.ENDPOINT_PROD_LOGIN_CUSTOMER;
    let dataObj = {
      "nickName": user,
      "currentPwd": pass
    };

    syncService.uploadData(endPoint, dataObj, callback, 'POST', 200, true);
  },


  /**
   *
   * @param customerData
   * @param callback
   */
  handleIdCustomer( customerData, callback ) {

    if( customerData && customerData.data && customerData.data.idCustomer ) {
      repo.configuration.setField('idCustomer', customerData.data.idCustomer.toString());
    }

    return callback(null, customerData);
  },

  /**
   *
   * @param callback
   */
  getCustomer( callback ) {
    let idCustomer = repo.configuration.getField('idCustomer');
    let endPoint = Config.ENDPOINT_PROD_CUSTOMER;
    endPoint = `${endPoint}${idCustomer}/`;
    syncService.downloadData(endPoint, {}, callback);
  },


  /**
   *
   * @param customerData
   * @param callback
   */
  handleCustomer( customerData, callback ) {

    if( customerData && customerData.data ) {
      repo.configuration.setField('customerData', JSON.stringify(customerData.data));
    }

    return callback(null, customerData);
  },


  /**
   *
   * @param serviceData
   * @param callback
   */
  handleServices( serviceData, callback ) {

    if( serviceData && serviceData.data ) {
      repo.configuration.setField('servicesData', JSON.stringify(serviceData.data));
    }

    return callback(null, serviceData);
  },

  /**
   * @param response
   * @param callback
   * @returns {*}
   */
  handleLogin( user, pass, response, callback ) {

    repo.configuration.setField('access_token', response[ 'access_token' ]);
    repo.configuration.setField('expires_token', moment().add(response[ 'expires_in' ], 'seconds').valueOf().toString());
    repo.configuration.setField('refresh_token', response[ 'refreshToken' ] ? response[ 'refreshToken' ] : null);

    return callback(null, response);

  },


  /**
   *
   * @param callbackFinal
   */
  logoutAction( callbackFinal ) {

    waterfall([
      ( callback ) => {
        this.clearData(callback)
      },
    ], ( err, result ) => {
      if( !err ) {
        return callbackFinal(null, result);
      } else {
        return callbackFinal(err, null);
      }
    })

  },


  /**
   *
   * @param callback
   * @returns {*}
   */
  clearData( callback ) {
    repo.configuration.setField('access_token', '');
    repo.configuration.setField('expires_token', '');
    repo.configuration.setField('refresh_token', '');
    repo.configuration.setField('grant_type', '');
    repo.configuration.setField('user_username', '');
    repo.configuration.setField('user_plain_password', '');
    return callback(null, 'OK');
  },

};

export default securityService;

