import Realm from 'realm';
import Config from 'react-native-config';


class Configuration extends Realm.Object {
}

Configuration.schema = {
  name: 'Configuration',
  primaryKey: 'id',
  properties: {
    id: { type: 'int', default: 1 },
    version_app: { type: 'string', default: '0' },
    first_time: { type: 'bool', default: true },
    //domain: { type: 'string', default: 'http://10.0.2.2:8080' },
    //domain: { type: 'string', default: 'https://ss-node.herokuapp.com/api' },
    domain: { type: 'string', default: Config.PRODUCTION_BASE_URL },
    
    phone_hwid: { type: 'string', default: '' },
    phone_device_token: { type: 'string', default: '' },
    phone_platform: { type: 'string', default: '' },
    phone_model: { type: 'string', default: '' },
    phone_version: { type: 'string', default: '' },
    phone_language: { type: 'string', default: '' },
    phone_region: { type: 'string', default: '' },

    language: { type: 'string', default: '' },
    access_token: { type: 'string', optional: true },
    refresh_token: { type: 'string', optional: true },
    expires_token: { type: 'string', optional: true },
    grant_type: { type: 'string', optional: true },
    internet: { type: 'bool', optional: true },
    load_data: { type: 'bool', optional: true },
    setting: { type: 'string', optional: true },
    app_status: { type: 'string', optional: true },
    is_connected: { type: 'bool', optional: true },
    user_username: { type: 'string', optional: true },
    user_plain_password: { type: 'string', optional: true },
    user_remember: { type: 'bool', default: false },
    password_remember: { type: 'bool', default: false },
    activateFingerprint: { type: 'string', default: "NOT_CHECKED" },
    loginWithFingerprint: { type: 'bool', default: false },


    appliances: { type: 'string', default: JSON.stringify({}) },
    bisStreet: { type: 'string', default: JSON.stringify({}) },
    complaintType: { type: 'string', default: JSON.stringify({}) },
    countryListStreet: { type: 'string', default: JSON.stringify({}) },
    departmentListStreet: { type: 'string', default: JSON.stringify({}) },
    cityListStreet: { type: 'string', default: JSON.stringify({}) },
    countryDocs: { type: 'string', default: JSON.stringify({}) },
    outageMaster: { type: 'string', default: JSON.stringify({}) },
    genderType: { type: 'string', default: JSON.stringify({}) },
    documType: { type: 'string', default: JSON.stringify({}) },
    typeStreet: { type: 'string', default: JSON.stringify({}) },
    
    accountNumber: { type: 'string', optional: true  },
    accountNumberSelected: { type: 'string', optional: true  },
    idPaymentFormSelected: { type: 'int', optional: true  },
    accountNumberIndThirdParty: { type: 'bool', optional: true,default: false},
    idCustomer: { type: 'string', optional: true  },
    idSector: { type: 'int', optional: true  },
    customerData: { type: 'string', default: JSON.stringify({}) },
    idPaymentForm: { type: 'string', optional: true },
    serviceInfo: { type: 'string', default: JSON.stringify({}) },
    accountServices: { type: 'string', default: JSON.stringify({}) },
    accountDetail: { type: 'string', default: JSON.stringify({}) },
    accountAdditionalData: { type: 'string', default: JSON.stringify({}) },
    bills: { type: 'string', default: JSON.stringify({}) },
    recharges: { type: 'string', default: JSON.stringify({}) },
    accountAgreement: { type: 'string', default: JSON.stringify({}) },
    remainingBalance: { type: 'string', default: JSON.stringify({}) },

    alertsNumber: { type: 'int', optional: true  },
    commNumber: { type: 'int', optional: true  },

    consumptionMeters: { type: 'string',  default: JSON.stringify({}) },
    consumptionMeter: { type: 'string',  optional: true },
    consumptionUsages: { type: 'string',  default: JSON.stringify({}) },
    consumptionUsage: { type: 'string',  optional: true },
    consumptionLoadData: { type: 'string',  default: JSON.stringify({}) },
    accountListAction: { type: 'string',  default: JSON.stringify({}) },
    bannerListCache: { type: 'string',  default: JSON.stringify({}) },
    bannerListCacheData: { type: 'int', optional: true},
    warningTypeList: { type: 'string',  default: JSON.stringify({}) },
    documMandatoryList: { type: 'string',  default: JSON.stringify({}) },
    partialPayments: { type: 'bool', default: false },
    loginInfoDone: { type: 'bool', default: false },
    timeZone: { type: 'string', default: "Europe/Madrid" },
    apiVersion: { type: 'string', default: Config.PRODUCTION_API_VERSION },
    tenantId: { type: 'string', default: "" },
    isoCode: { type: 'string', default: "EUR" },
    currencies: { type: 'string', default: JSON.stringify({}) },
    xAppClient: { type: 'int', optional: true, default: 55875455},
    userIp: { type: 'string', optional: true, default: null},
    isPrepWithTelecontrol: { type: 'bool', optional: true, default: false},
    phoneMask: {type: "string", default: JSON.stringify({})},
    notificationsActivated: { type: 'bool', default: false },
    notificationsToken: { type: 'string', optional: true  },

    adpProgramData: { type: 'string', default: ""}
  }
};


export default new Realm({
  schema: [ Configuration ],
  schemaVersion: 26,
  migration: function( oldRealm, newRealm ) {

  }
});