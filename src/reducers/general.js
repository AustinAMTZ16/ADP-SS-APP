const initialState = {
  formDataHolderDocumentation: null,
  formDataEBilling: null,
  formDataSelfReading: null,
  formDataConsumption: null,
  formDataPersonalInfo: null,
  formDataPayBills:null,
  formDataLanguage: null,
  formDataContactInfo: null,
  selectAccount: {},
  loadDate:{}
};

export default function( state: any = initialState, action: Function ) {
  switch( action.type ) {
    case "LOAD_DATA_LIST_OUTAGES":
      return { ...state, reloadListOutages: new Date().valueOf()  };
    case "LOAD_DATA_FORM_EBILLING":
      return { ...state, formDataEBilling: action.formDataEBilling };
    case "LOAD_DATA_FORM_SELF_READING":
      return { ...state, formDataSelfReading: action.formDataSelfReading };
    case "LOAD_DATA_FORM_CONSUMPTION":
      return { ...state, formDataConsumption: action.formDataConsumption };
    case "LOAD_DATA_FORM_PERSONAL_INFO":
      return { ...state, formDataPersonalInfo: action.formDataPersonalInfo };
    case "LOAD_DATA_FORM_LANGUAGE":
        return { ...state, formDataLanguage: action.formDataLanguage };
    case "LOAD_ERRORS_FORM_PERSONAL_INFO":
      return { ...state, formErrorsPersonalInfo: action.formErrorsPersonalInfo, formErrorsPersonalInfoDate: new Date().valueOf() };
    case "LOAD_DATA_FORM_PAY_BILLS":
      return { ...state, formDataPayBills: action.formDataPayBills };
    case "LOAD_DATA_FORM_CONTACT_INFO":
      return { ...state, formDataContactInfo: action.formDataContactInfo };
    case "SELECT_ACCOUNT":
      return { ...state, selectAccount: action.selectAccount };
    case "LOAD_DATA_FORM_HOLDER_DOCUMENTATION":
      return { ...state, formDataHolderDocumentation: action.formDataHolderDocumentation };
    case "LOAD_DATA_FORM_HOLDER_PAYMENT":
      return { ...state, formDataHolderPayment: action.formDataHolderPayment };
    case "LOAD_DATA_FORM_HOLDER_CORRESPONDENCE":
      return { ...state, formDataHolderCorrespondence: action.formDataHolderCorrespondence };
    case "RELOAD_SUB_MENU":
      return { ...state, reloadSubMenu: new Date().valueOf() };
    case "RELOAD_MENU":
      return { ...state, reloadMenu: new Date().valueOf() };
    case "PAYMENT_REFRESH":
      return { ...state, paymentRefresh: new Date().valueOf() };
    case "PAYMENT_REFRESHED":
      return { ...state, paymentRefreshed: new Date().valueOf() };
    case "LOAD_DATE":
      return { ...state, loadDate: action.loadDate };
    default:
      return state;
  }
}
