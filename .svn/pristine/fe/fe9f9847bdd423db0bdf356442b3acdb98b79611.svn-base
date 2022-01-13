import repo from '../database/repository'
import {NetInfo} from 'react-native';
import {create} from 'apisauce';
import base64 from 'base-64';
import moment from 'moment';
import Config from 'react-native-config'

const api = create( {
  baseURL: Config.PAYMENT_URL,
  timeout: 20000
} );

export default {

  getPaymentToken( isPrepaid ) {
    return NetInfo.getConnectionInfo().then(
      ( connectionInfo ) => {
        if( connectionInfo.type === 'none' ) return { ok: false, error: 'Network not found' };

        const key = base64.encode( `${isPrepaid ? Config.PAYMENT_PREPAID_CONSUMER_KEY : Config.PAYMENT_POSTPAID_CONSUMER_KEY}:${isPrepaid ? Config.PAYMENT_PREPAID_CONSUMER_SECRET : Config.PAYMENT_POSTPAID_CONSUMER_SECRET}` );
        let headers = {
          'Authorization': `Basic ${key}`,
        };

        return api.get( 'oauth/v1/generate', { grant_type: 'client_credentials' }, { headers } );
      } );
  },

  sendPayment( data ) {
    return NetInfo.getConnectionInfo().then(
      ( connectionInfo ) => {
        if( connectionInfo.type === 'none' ) return { ok: false, error: 'Network not found' };

        let headers = {
          'Authorization': `Bearer ${data.accessToken}`,
        };

        const date = moment().format( 'YYYYMMDDHHmmss' );
        const code = data.isPrepaid ? Config.PAYMENT_PREPAID_CODE : Config.PAYMENT_POSTPAID_CODE;
        const passKey = data.isPrepaid ? Config.PAYMENT_PREPAID_PASS_KEY : Config.PAYMENT_POSTPAID_PASS_KEY;

        return api.post( 'mpesa/stkpush/v1/processrequest', {
          BusinessShortCode: code,
          Password: base64.encode( `${code}${passKey}${date}` ),
          Timestamp: date,
          TransactionType: 'CustomerPayBillOnline',
          Amount: Number( data.amount ),
          PartyA: data.phone,
          PartyB: code,
          PhoneNumber: data.phone,
          AccountReference: data.referenceNumber,
          CallBackURL: 'https://callback.backofficeprojectdata.com',
          TransactionDesc: 'Pay Now'
        }, { headers } );
      } );
  },
};