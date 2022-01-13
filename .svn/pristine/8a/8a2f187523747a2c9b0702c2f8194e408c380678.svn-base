import repo from '../database/repository'
import _ from 'lodash';
import moment from 'moment';
import Config from 'react-native-config'
import I18n from 'react-native-i18n';
import syncService from '../general/syncService';
import waterfall from 'async/waterfall';
import eachSeries from 'async/eachSeries';
import RNFetchBlob from 'react-native-fetch-blob';
import { Platform } from "react-native";

/*
Nuevos enpoints
 *ENDPOINT_PROD_METER_QUERY_NEW='/rn/2.0.1-rn/publicData/newContractList'
 *ENDPOINT_PROD_BALANCE='/rn/2.0.1-rn/balancePdf'
 *ENDPOINT_PROD_ACCOUNT_COORDS='/rn/2.0.1-rn/accounts/coords'  - idCustomer=2121&others=true
 *ENDPOINT_PROD_SELFREADING='/rn/2.0.1-rn/selfReads'
 *ENDPOINT_PROD_CALC_RATE='/rn/2.0.1-rn/sscalculator/sstarifs'
 *ENDPOINT_PROD_CALC_CONS='/rn/2.0.1-rn/calculator/consumptionTypes'
 *ENDPOINT_PROD_CALCULATOR='/rn/2.0.1-rn/calculator'

*/
const generalService = {

		/**
		 *
		 * @param callbackFinal
		 */
		listDataAction( callbackFinal ) {

			waterfall([
				( callback ) => {
					let endPoint = Config.ENDPOINT_PROD_DATA;
					syncService.downloadData(endPoint, {}, callback);
				}, ( arg1, callback ) => {
					if( arg1.data && arg1.data.complaintType ) {
						repo.configuration.setField('complaintType', JSON.stringify(arg1.data.complaintType));
						repo.configuration.setField('genderType', JSON.stringify(arg1.data.genderType));
						repo.configuration.setField('documType', JSON.stringify(arg1.data.documType));
						repo.configuration.setField('countryDocs', JSON.stringify(arg1.data.countryDocs));
						repo.configuration.setField('typeStreet', JSON.stringify(arg1.data.typeStreet));

						if(arg1.data.phoneMask){
							repo.configuration.setField('phoneMask', JSON.stringify(arg1.data.phoneMask));
						}
						
						repo.configuration.setField('countryListStreet', JSON.stringify(arg1.data.countryListStreet));
						repo.configuration.setField('departmentListStreet', JSON.stringify(arg1.data.departmentListStreet));
						repo.configuration.setField('cityListStreet', JSON.stringify(arg1.data.cityListStreet));
						repo.configuration.setField('currencies', JSON.stringify(arg1.data.currencies));
						if(arg1.data.warningTypeList){
							repo.configuration.setField('warningTypeList', JSON.stringify(arg1.data.warningTypeList));
						}
						if(arg1.data.timeZone){
							repo.configuration.setField('timeZone', arg1.data.timeZone);
						}
						//PIEI-53294 GAP 130 - Pago parcial en SS
						if(arg1.data.partialPayments){
							repo.configuration.setField('partialPayments', arg1.data.partialPayments);							
						}

						
						repo.configuration.setField('documMandatoryList', JSON.stringify(arg1.data.documMandatoryList));
						//repo.configuration.setField('documentList', JSON.stringify(arg1.data.documentList));
						return callback(null, 'OK');
					} else {
						callback('Error', null);
					}


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
		 * @param callbackFinal
		 */
		postUserAction( data, callbackFinal ) {

			waterfall([
				( callback ) => {
					let endPoint = Config.ENDPOINT_PROD_POST_USER;
					let dataObj = {
							"docType": data.docType,
							"expeditionCountry": data.expeditionCountry,
							"docNumber": data.docNumber,
							"email": data.email,
							"accountReference": data.accountReference,
							"phone": data.phone,
							"nickName": data.nickName,
							"pwdUser": ""
							//"userLoginEmail": true
					};
					syncService.uploadData(endPoint, dataObj, callback, 'POST', 200, true);
					// syncService.downloadData(endPoint, dataObj, callback, 'POST', 200, true);
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
		 * @param callbackFinal
		 */
		getWarningAttrs( data, callbackFinal ) {
			let endPoint = Config.ENDPOINT_PROD_WARNING_ATTRS;
			syncService.downloadData(endPoint, data, callbackFinal, 'GET', 200, true);
		},
		
		
		
		
		
		
		/**
		 *
		 * @param callbackFinal
		 *
		 */
		changePasswordAction( data, callbackFinal ) {

			waterfall([
				( callback ) => {
					let endPoint = Config.ENDPOINT_PROD_POST_USER;
					endPoint = `${endPoint}password`;
					let dataObj = data;
					syncService.uploadData(endPoint, dataObj, callback, 'PATCH', 200, true);
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
		 * @param callbackFinal
		 *
		 */
		forgotPasswordAction( login, callbackFinal ) {

			waterfall([
				( callback ) => {
					let endPoint = Config.ENDPOINT_PROD_POST_USER;
					endPoint = `${endPoint}${login}/password`;
					syncService.downloadData(endPoint, {}, callback,'PATCH');
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
		 * @param callbackFinal
		 */
		postSuggestionAction( data, callbackFinal ) {
			waterfall([
				( callback ) => {
					let endPoint = Config.ENDPOINT_PROD_POST_SUGGESTION;
					let dataObj = {
							email: data.email,
							name: data.name,
							phone: data.phone,
							text: data.description,
					};
					syncService.uploadData(endPoint, dataObj, callback, 'POST', 200, true)
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
		 * @param type
		 * @param staffNumber
		 */
		juaForSureAction( type, staffNumber, callbackFinal ) {
			waterfall([
				( callback ) => {
					let endPoint = Config.ENDPOINT_PROD_JUA;
					if( type === 'kenya' ) {
						endPoint = `${endPoint}juaforsureKplc`;
						syncService.downloadData(endPoint, { staffNumber: staffNumber }, callback)
					} else {
						endPoint = `${endPoint}juaforsureContractor`;
						syncService.downloadData(endPoint, { staffNumber: staffNumber }, callback)
					}


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
		 * @param none
		 */
		tipsInformationAction( callbackFinal ) {
			let endPoint = Config.ENDPOINT_PROD_TIPS;
			syncService.easyDownloadData(endPoint, {}, callbackFinal);
		},

		/**
		 * PIEI-54707 3.2 Asociar contratos de terceros - Front - APP. Changed service
		 * @param idCustomer
		 * Retrieves the detail of the account
		 */
		AccountListAction( idCustomer, callbackFinal ) {
			waterfall([
				( callback ) => {
					let endPoint = Config.ENDPOINT_THIRD_PARTY;
					endPoint = `${endPoint}appaccounts?idCustomer=${idCustomer}`;
					//endPoint = "http://10.0.2.2:8281/adpthirdparty/1.0.1/appaccounts?idCustomer=4510";
					syncService.downloadData(endPoint, {}, callback)
				}

			], ( err, result ) => {
				if( !err ) {
					return callbackFinal(null, result);
				} else {
					return callbackFinal(err, null);
				}
			})

		},

		/**
		 * Get communications for webmail
		 * @param idCustomer
		 * @param callbackFinal
		 */
		getOtherAccounts(idCustomer, callbackFinal) {
			let endPoint = Config.ENDPOINT_PROD_ACCOUNT;
			endPoint = `${endPoint}?idCustomer=${idCustomer}&others=true`;
			syncService.easyDownloadData(endPoint, {}, callbackFinal);
		},

		/**
		 *
		 * @param idCustomer
		 * Retrieves the list of accounts with coordinates
		 * https://selfservice.kplc.co.ke/accounts/2.0.1/coords?idCustomer=250103&others=false
		 */
		CoordsListAction( idCustomer, callbackFinal ) {

			waterfall([
				( callback ) => {
					let endPoint = Config.ENDPOINT_PROD_ACCOUNT;
					endPoint = `${endPoint}coords?idCustomer=${idCustomer}&EPSGGPS=EPSG:4326`;
					syncService.downloadData(endPoint, {}, callback)
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
		 * Get Offices
		 * https://tesla.indra.es:8244/offices/1.0.1/
		 */
		GetOffices(callbackFinal ) {
			waterfall([
				( callback ) => {
					let endPoint = Config.ENDPOINT_PROD_OFFICES;
					endPoint = `${endPoint}`;
					syncService.downloadData(endPoint, {}, callback)
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
		 * @param idAcount
		 * Retrieves the detail of the account
		 * https://selfservice.kplc.co.ke/api/accounts/2.0.1/1258715/
		 */
		AccountDetailAction( idAcount, callbackFinal ) {
			waterfall([
				( callback ) => {
					let endPoint = Config.ENDPOINT_PROD_ACCOUNT;
					endPoint = `${endPoint}${idAcount}`;
					syncService.downloadData(endPoint, {}, callback)
				},
				( arg1, callback ) => {
					if( arg1.data ) {
						repo.configuration.setField('accountDetail', JSON.stringify(arg1.data));
						return callback(null, arg1.data)
					} else {
						return callback('No data found', null)
					}
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
		 * @param idAcount
		 * Retrieve the services associated to this account
		 * https://selfservice.kplc.co.ke/api/accounts/2.0.1/1258715/services
		 */
		AccountServicesAction( idAcount, callbackFinal ) {
			waterfall([
				( callback ) => {
					let endPoint = Config.ENDPOINT_PROD_ACCOUNT;
					endPoint = `${endPoint}${idAcount}/services`;
					syncService.downloadData(endPoint, {}, callback)
				},
				( arg1, callback ) => {
					if( arg1.data && arg1.data.length ) {
						repo.configuration.setField('accountServices', JSON.stringify(arg1.data));
						return callback(null, arg1.data)
					} else {
						repo.configuration.setField('accountServices', "{}");
						return callback(I18n.t("NO_DATA_FOUND"), null)
					}
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
		 * @param idAcount
		 * Retrieve additional data associated to this account
		 * https://selfservice.kplc.co.ke/api/accounts/2.0.1/1258715/additionalData
		 */
		AccountAdditionalDataAction( idAccount,idContractedService, callbackFinal ) {
			waterfall([
				( callback ) => {
					let endPoint = Config.ENDPOINT_PROD_ACCOUNT;
					endPoint = `${endPoint}${idAccount}/additionalData`;

					syncService.downloadData(endPoint, {}, callback)
				},
				( arg1, callback ) => {
					if( arg1.data && arg1.data.length ) {
						let accountAdditionalData = new Object();
						_.map(arg1.data, function( item ) {
							if(item.idService ==idContractedService){
								accountAdditionalData = item;
							}
						});
						repo.configuration.setField('accountAdditionalData', JSON.stringify(accountAdditionalData));
						return callback(null, arg1.data)
					} else {
						return callback('No data found', null)
					}
				}

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
		 * @param idAcount
		 * Retrieve additional data associated to this account
		 *  https://selfservice.kplc.co.ke/api/accounts/2.0.1/1258715/agreement
		 */
		AccountAgreementAction( idAcount, callbackFinal ) {
			waterfall([
				( callback ) => {
					let endPoint = Config.ENDPOINT_PROD_ACCOUNT;
					endPoint = `${endPoint}${idAcount}/agreement`;

					syncService.downloadData(endPoint, {}, callback)
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
		 * @param idPaymentForm
		 * Retrieve the documents for the account
		 * https://tesla.indra.es:8254/t/icdesa3_jueves.tesla.indra.es/accounts/1.0.1/5583/documents?lastPeriod=true
		 */
		LoadDocumentsAction( idPaymentForm, callbackFinal ) {
			waterfall([
				( callback ) => {
					let endPoint = Config.ENDPOINT_PROD_ACCOUNT;
					endPoint = `${endPoint}${idPaymentForm}/documents?lastPeriod=true`;

					syncService.downloadData(endPoint, {}, callback)
				},
				( arg1, callback ) => {
					if( arg1.data) {
						//PIEI-52747 APP SS - Mis Facturas -- I have to make a conversion because prepaid has same fields
						let result  = _.map(arg1.data, function( item ) {
							let res = {};
							res.emissionDate = item.docEmissionDate;
							res.billAmount = item.docAmount;
							res.billPendAmount = item.docPending;
							res.billNumber = item.docReference;
							res.dueDate = item.docDueDate;
							res.idDocument = item.idDocument;
							res.billList = item.bills;
							return res;
						});

						repo.configuration.setField('bills', JSON.stringify(result));
						return callback(null, arg1.data)
					} else {
						return callback('No data found', null)
					}
				}
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
		 * @param idContactedService
		 * Retrieve the bills for the service
		 * https://selfservice.kplc.co.ke/api/prePaymentRecharges/2.0.1/?startDate=1494618696616&amp;endDate=152615469
   6616&amp;refIdPaymentForm=1165630&amp;refIdContractedService=803876
		 */
		LoadRechargesAction( idAcount, idContactedService, callbackFinal ) {
			waterfall([
				( callback ) => {
					// let endPoint = Config.ENDPOINT_PROD_RECHARGES;
					// endPoint = `${endPoint}?startDate=${new Date().valueOf()}&endDate=${new Date().valueOf()}&refIdPaymentForm=${idAcount}&refIdContractedService=${idContactedService}`;
					//
					//Convert into product call: https://tesla.indra.es:8244/services/1.0.1/104/recharges?lastPeriod=true
					let endPoint = Config.ENDPOINT_PROD_SERVICES;
					endPoint = `${endPoint}${idContactedService}/recharges?lastPeriod=true`;

					syncService.downloadData(endPoint, {}, callback)
				},
				( arg1, callback ) => {
					if( arg1.data) {
						repo.configuration.setField('recharges', JSON.stringify(arg1.data));
						return callback(null, arg1.data)
					} else {
						return callback('No data found', null)
					}
				}


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
		 * @param idContractedService
		 * Retrieve the meters for the service
		 * https://selfservice.kplc.co.ke/api/services/2.0.1/630821/meters
		 */
		LoadMetersAction( idContractedService, callbackFinal ) {
			waterfall([
				( callback ) => {
					let endPoint = Config.ENDPOINT_PROD_SERVICES;
					endPoint = `${endPoint}${idContractedService}/metersNew`;

					syncService.downloadData(endPoint, {}, callback)
				},
				( arg1, callback ) => {
					if( arg1.data && arg1.data.length ) {
						repo.configuration.setField('consumptionMeters', JSON.stringify(arg1.data));
						return callback(null, arg1)
					} else {
						return callback('No data found', null)
					}
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
		 * @param idAccount
		 * @param idDevice
		 * Retrieve the types of consumptions for the meter
		 * https://selfservice.kplc.co.ke/api/services/2.0.1/1258715/usageTypes?idMeter=2066671
		 */
		LoadUsageTypesAction( idAccount, idDevice, callbackFinal ) {
			waterfall([
				( callback ) => {
					let endPoint = Config.ENDPOINT_PROD_SERVICES;
					endPoint = `${endPoint}${idAccount}/usageTypes?idMeter=${idDevice}`;

					syncService.downloadData(endPoint, {}, callback)
				},
				( arg1, callback ) => {
					if( arg1.data && arg1.data.length ) {
						repo.configuration.setField('consumptionUsages', JSON.stringify(arg1.data));
						return callback(null, arg1)
					} else {
						return callback('No data found', null)
					}
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
		 * @param idContractedService
		 * @param idDevice
		 * @param TypeConsumption
		 * Retrieve consumptions for the meter and type of consumption
		 * https://selfservice.kplc.co.ke/api/services/2.0.1/630821/usages?idMeter=2066671&typConsum=TPCONS0001&lastPeriod=true
		 */
		LoadUsagesAction( idContractedService, idDevice, TypeConsumption, callbackFinal ) {
			waterfall([
				( callback ) => {
					let endPoint = Config.ENDPOINT_PROD_SERVICES;
					endPoint = `${endPoint}${idContractedService}/usages?idMeter=${idDevice}&typConsum=${TypeConsumption}&lastPeriod=true`;
					syncService.downloadData(endPoint, {}, callback)
				},
				( arg1, callback ) => {
					if( arg1.data ) {
						repo.configuration.setField('consumptionLoadData', JSON.stringify(arg1));
						return callback(null, arg1)
					} else {
						return callback('No data found', null)
					}
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
		 * @param idAccount
		 * Retrieve all the account movements ( FI)
		 * https://selfservice.kplc.co.ke/api/accounts/2.0.1/1258715/entries
		 */
		LoadAccountMovementsAction( idAccount, callbackFinal ) {
			waterfall([
				( callback ) => {
					let endPoint = Config.ENDPOINT_PROD_ACCOUNT;
					endPoint = `${endPoint}${idAccount}/entries`;
					syncService.downloadData(endPoint, {}, callback)
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
		 * @param idBill
		 * Retrieve the image of the bill in PDF
		 * https://selfservice.kplc.co.ke/api/pdfbill/2.0.1/?billId=82440165
		 * Return example
		 * {"data":[{"billArray":"JVBERi0xLjQKJeLjz9MKMSAwIG9iago8PC9Db2xvclNwYWNlL0RldmljZVJHQi9TdWJ0eXBlL0lt\g==\n","message":"success","code":"0","billId":"82440165"}]}
		 *
		 */
		LoadBillPDFAction( idDocument, callbackFinal ) {
			

		    let fs = RNFetchBlob.fs;
		    let dirs = fs.dirs;
		    let endPoint = Config.ENDPOINT_PROD_POST_PDF;
			let API_URL = repo.configuration.getField('domain');
	        let TENANT = repo.configuration.getField('tenantId'); 
			let filename = `${idDocument}.pdf`;
			let URL_FINAL = `/${endPoint}${idDocument}/pdf`;
			URL_FINAL = URL_FINAL.replace("{apiVersion}", repo.configuration.getField('apiVersion'));
		    let access_token = repo.configuration.getField('access_token');
		    
		    let PDFPath = '';
		    
		    let headers = {
		        'Authorization': 'Bearer ' + access_token,
		        'Accept-Language': 'en',
		        'Cache-Control': 'no-store',
				'clientVersion': Config.CLIENT_VERSION
			};
		    
		    if(Config.IS_MULTITENANT === "true" && TENANT.length){
		    	URL_FINAL = "/t/" + TENANT + URL_FINAL;
				headers["x-incms-tenant"] = TENANT;
			 }
		    
		    if( Platform.OS === 'ios' ) {
		      PDFPath = `${dirs.DocumentDir}/${filename}`;
		    } else {
		      PDFPath = `${dirs.DownloadDir}/${filename}`;
		    }

	
			URL_FINAL = API_URL + URL_FINAL;
			if (URL_FINAL && URL_FINAL.length)
				URL_FINAL = _.replace(URL_FINAL, /'/g, '');

		    RNFetchBlob.config({
		        path: PDFPath,
		        fileCache: true,
		        appendExt: 'pdf'
		    }).fetch('GET', URL_FINAL, headers).then(( res ) => {
		    	callbackFinal(res, PDFPath);
		    });
		    
		},

		/**
		 *
		 * @param idAccount
		 *
		 * https://selfservice.kplc.co.ke/api/accounts/2.0.1/1258715/billsPaperLess
		 * Return example
		 * {"data":{"phone":null,"codSendingWayType":"MOENV00004","sendingWayType":"E-mail","email":"GDIERKSMEIER@GMAIL.COM"}}
		 *
		 */
		billsPaperLessAction( idAccount, callbackFinal ) {
			waterfall([
				( callback ) => {
					let endPoint = Config.ENDPOINT_THIRD_PARTY;
					endPoint = `${endPoint}billsPaperLess?idAccount=${idAccount}`;
					syncService.downloadData(endPoint, {}, callback)
				},
				], ( err, result ) => {
					if( !err ) {
						return callbackFinal(null, result);
					} else {
						return callbackFinal(err, null);
					}
				});
		},

		/**
		 *
		 * @param dataObj
		 * @param callbackFinal
		 * @param method
		 * https://selfservice.kplc.co.ke/api/accounts/2.0.1/1258715/billsPaperLess
		 * Return example
		 * {"data":{"phone":null,"codSendingWayType":"MOENV00004","sendingWayType":"E-mail","email":"GDIERKSMEIER@GMAIL.COM"}}
		 *
		 */

		sendBillsPaperLessAction( dataObj,callbackFinal) {
			waterfall([
				( callback ) => {
					let endPoint = Config.ENDPOINT_THIRD_PARTY;
					endPoint = `${endPoint}billsPaperLess`;
					syncService.uploadData(endPoint, dataObj, callback, 'PUT')
				},
			], ( err, result ) => {
				if( !err ) {
					return callbackFinal(null, result);
				} else {
					return callbackFinal(err, null);
				}
			})
		},

		sendBillsPaperNotInvoice( idAccount,callbackFinal) {
			waterfall([
				( callback ) => {
					let endPoint = Config.ENDPOINT_THIRD_PARTY;
					endPoint = `${endPoint}${idAccount}/billsPaperLess`;
					syncService.uploadData(endPoint, null, callback)
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
		 * @param dataObj
		 * @param callbackFinal
		 * @param method
		 * https://selfservice.kplc.co.ke/api/accounts/2.0.1/1258715/billsPaperLess
		 * Return example
		 * {"data":{"phone":null,"codSendingWayType":"MOENV00004","sendingWayType":"E-mail","email":"GDIERKSMEIER@GMAIL.COM"}}
		 *
		 */

		selfReaderAction( dataObj, idAccount, callbackFinal, method = 'PUT' ) {
			waterfall([
				( callback ) => {
					let endPoint = Config.ENDPOINT_PROD_SECTOR_SUPPLIES;
					endPoint = `${endPoint}${idAccount}/selfReader`;
					syncService.uploadData(endPoint, dataObj, callback, method)
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
		 * @param idAccount
		 * @param callbackFinal
		 */
		getSelfReaderAction( idAccount, callbackFinal ) {
			let hasSelfRead = false;
			waterfall([
				( callback ) => {
					let endPoint = Config.ENDPOINT_PROD_ACCOUNT2;
					endPoint = `${endPoint}${idAccount}/selfReadsAvailable`;
					syncService.downloadData(endPoint, {}, callback)
				},
				( arg1, callback ) => {
					if( arg1.data && arg1.data[ 0 ] && arg1.data[ 0 ].hasSelfRead ) {
						hasSelfRead = true;
						let endPoint = Config.ENDPOINT_PROD_ACCOUNT;
						endPoint = `${endPoint}${idAccount}/selfReads`;
						syncService.downloadData(endPoint, {}, callback)
					} else {
						return callback(false, null)
					}
				},
				], ( err, result ) => {

					if( !err ) {
						if( result && result.data && result.data.length ) {
							result[ 'hasSelfRead' ] = hasSelfRead;
							return callbackFinal(null, result);
						} else {
							if( err === false )
								return callbackFinal(null, { hasSelfRead: false, data: [] });
							else
								return callbackFinal("No data", null);
						}
					} else {
						return callbackFinal(err, null);
					}
				})
		},

		/**
		 *
		 * @param idAccount
		 * @param callbackFinal
		 */
		getSelfReaderPeriodAction( idPaymentForm, callbackFinal ) {

			waterfall([
				( callback ) => {
					let endPoint = Config.ENDPOINT_PROD_SELF_READS_PERIOD;
					endPoint = `${endPoint}${idPaymentForm}/selfReads`;
					syncService.downloadData(endPoint, {}, callback);
				},
				], ( err, result ) => {

					if( !err ) {
						if( result && result.data && result.data.length ) {
							return callbackFinal(null, result.data[ 0 ]);
						} else {
							return callbackFinal(null, null);
						}
					} else {
						return callbackFinal(err, null);
					}
				})
		},


		/**
		 *
		 * @param objData
		 * @param idAccount
		 * @param callbackFinal
		 */
		postSelfReaderAction( objData, idAccount, callbackFinal ) {
			waterfall([
				( callback ) => {
					let endPoint = Config.ENDPOINT_PROD_ACCOUNT;
					endPoint = `${endPoint}${idAccount}/selfReads`;
					syncService.uploadData(endPoint, objData, callback)
				},
				], ( err, result ) => {
					if( !err ) {

						return callbackFinal(null, 'OK');
						// else
						//   return callbackFinal("No data found");
					} else {
						return callbackFinal(err, null);
					}
				})

		},
		/**
		 *
		 * @param objData
		 * @param callbackFinal
		 */
		postSelfReaderPhotoAction( objData, callbackFinal ) {
			waterfall([
				( callback ) => {
					let endPoint = Config.ENDPOINT_PROD_SELFREADING;
					endPoint = `${endPoint}/loadPhoto`;
					syncService.uploadData(endPoint, objData, callback)
				},
				], ( err, result ) => {
					if( !err ) {
						return callbackFinal(null, result);

					} else {
						return callbackFinal('ERROR-PHOTO', null);
					}
				})

		},

		/**
		 *
		 * @param idCustomer
		 *
		 * https://selfservice.kplc.co.ke/api/rccs/2.0.1/?idCustomer=250103&fromDate=1523185308933&toDate=1525726908933
		 */
		getRccAction( idCustomer, callbackFinal ) {
			waterfall([
				( callback ) => {
					let endPoint = Config.ENDPOINT_THIRD_PARTY;
					let from = new Date();
					from = from.setDate(from.getDate() - 31).valueOf();
					endPoint = `${endPoint}rccs?idCustomer=${idCustomer}&fromDate=${from}&toDate=${new Date().valueOf()}`;

					syncService.downloadData(endPoint, {}, callback)
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
		 *
		 *
		 * https://selfservice.kplc.co.ke/api/rccs/2.0.1/?idCustomer=250103&fromDate=1523185308933&toDate=1525726908933
		 */

		postRccAction( objData, type, callbackFinal ) {
			let endPoint = Config.ENDPOINT_PROD_RCC;
			endPoint = `${endPoint}${type}`;
			syncService.easyUploadData(endPoint, objData, callbackFinal);			
		},

		/**
		 *
		 *
		 *ENDPOINT_PROD_CUSTOMER='/rn/2.0.1-rn/customers/'
		 */
		sendCustomerAction(idCustomer, objData, callbackFinal, method = 'PATCH' ) {
			let endPoint = Config.ENDPOINT_PROD_CUSTOMER;
			endPoint = `${endPoint}${idCustomer}`;
			syncService.easyUploadData(endPoint, objData, callbackFinal,method);
		},

		/**
		 *
		 *
		 *ENDPOINT_PROD_CUSTOMER='/rn/2.0.1-rn/customers/'
		 */
		sendCustomerDataAction( idCustomer, objData, callbackFinal, method = 'POST' ) {
			waterfall([
				( callback ) => {
					let endPoint = Config.ENDPOINT_PROD_CUSTOMER;
					endPoint = `${endPoint}${idCustomer}/customerRequests`;
					syncService.uploadData(endPoint, objData, callback, method)
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
		 * @param idCustomer
		 * Retrieves the list of supplies with GPS coordinates
		 */
		CoordsListAction2( idCustomer, callbackFinal ) {
			waterfall([
				( callback ) => {
					let endPoint = Config.ENDPOINT_PROD_ACCOUNT_COORDS;
					endPoint = `${endPoint}?idCustomer=${idCustomer}&others=true`;

					syncService.downloadData(endPoint, {}, callback)
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
		 *
		 * ENDPOINT_PROD_CALCULATOR='/rn/2.0.1-rn/sscalculator/sstariffs'
		 */
		getTariffAction( callbackFinal ) {
			waterfall([
				( callback ) => {
					let endPoint = Config.ENDPOINT_PROD_CALC_RATE;
					syncService.downloadData(endPoint, {}, callback)
				},

				], ( err, result ) => {
					if( !err ) {
						return callbackFinal(null, result.data);
					} else {
						return callbackFinal(err, null);
					}
				})

		},


		/**
		 *
		 *
		 * ENDPOINT_PROD_CALCULATOR='/rn/2.0.1-rn/calculator/consumptionTypes'
		 */
		getConsumptionTypesAction( idFare, fromDate, callbackFinal ) {
			waterfall([
				( callback ) => {
					let endPoint = Config.ENDPOINT_PROD_CALC_CONS;
					endPoint = `${endPoint}?idFare=${idFare}&fromDate=${fromDate}`;
					syncService.downloadData(endPoint, {}, callback)
				},

				], ( err, result ) => {
					if( !err ) {
						if( result.data )
							return callbackFinal(null, result.data);
						else
							return callbackFinal('No data found', null);
					} else {
						return callbackFinal(err, null);
					}
				})
		},
		/**
		 *
		 *
		 * ENDPOINT_ POR DEFINIR
		 */
		getTariffByAccountAction( account, callbackFinal ) {
			waterfall([
				( callback ) => {
					let endPoint = Config.ENDPOINT_PROD_TARRIF_ACCOUNT;
					endPoint = `${endPoint}${account}`;
					// console.tron.log(endPoint);
					syncService.downloadData(endPoint, {}, callback);
				},

				], ( err, result ) => {

					if( !err ) {
						if( result && result.data )
							return callbackFinal(null, result.data);
						else
							return callbackFinal('No data found', null);
					} else {
						return callbackFinal(err, null);
					}
				})

		},


		/**
		 *
		 */
		getOutageAction( idCustomer, callbackFinal ) {
			waterfall([
				( callback ) => {
					let endPoint = Config.ENDPOINT_THIRD_PARTY;
					endPoint = `${endPoint}warning?idCustomer=${idCustomer}`;
					syncService.downloadData(endPoint, {}, callback)
				},

				], ( err, result ) => {
					if( !err ) {
						if( result.data )
							return callbackFinal(null, result.data);
						else
							return callbackFinal('No data found', null);
					} else {
						return callbackFinal(err, null);
					}
				})

		},


		/**
		 *
		 */
		getOutageMasterAction( callbackFinal ) {
			waterfall([
				( callback ) => {
					let endPoint = Config.ENDPOINT_PROD_OUTAGE;
					endPoint = `${endPoint}`;
					syncService.downloadData(endPoint, {}, callback)
				},
				( arg1, callback ) => {
					if( arg1.data ) {
						repo.configuration.setField('outageMaster', JSON.stringify(arg1.data));
						return callback(null, arg1)
					} else {
						return callback(arg1, null)
					}
				},
				], ( err, result ) => {
					if( !err ) {
						if( result.data ) {
							return callbackFinal(null, result.data);
						} else
							return callbackFinal('No data found', null);
					} else {
						return callbackFinal(err, null);
					}
				})

		},

		/**
		 *
		 *
		 *
		 */
		sendOutageAction( objData, callbackFinal ) {
			let endPoint = Config.ENDPOINT_PROD_OUTAGE;			
			syncService.easyUploadData(endPoint, objData, callbackFinal);
		},

		/**
		 *
		 *
		 *
		 */
		getServiceCustomerAction( idCustomer, callbackFinal ) {
			waterfall([
				( callback ) => {
					let endPoint = Config.ENDPOINT_PROD_SERVICE_REQUEST;
					endPoint = `${endPoint}?idCustomer=${idCustomer}&Activo=1`;
					syncService.downloadData(endPoint, {}, callback)
				},

				], ( err, result ) => {
					if( !err ) {
						if( result.data )
							return callbackFinal(null, result.data);
						else
							return callbackFinal('No data found', null);
					} else {
						return callbackFinal(err, null);
					}
				})

		},

		/**
		 *
		 *
		 */
		postConsumtionAction( obj, callbackFinal ) {

			waterfall([
				( callback ) => {
					let endPoint = Config.ENDPOINT_PROD_CALCULATOR;
					syncService.uploadData(endPoint, obj, callback)
				},
				], ( err, result ) => {
					if( !err ) {
						if( result.data )
							return callbackFinal(null, result.data);
						else
							return callbackFinal('No data Found', result);
					} else {
						return callbackFinal(err, null);
					}
				});

		},


		/**
		 *
		 *
		 *
		 */
		getStreetAction( idCity, callbackFinal ) {
			waterfall([
				( callback ) => {
					let endPoint = Config.ENDPOINT_PROD_STREETS;
					endPoint = `${endPoint}?containsWord=&idCity=${idCity}`;
					syncService.downloadData(endPoint, {}, callback)
				},

				], ( err, result ) => {
					if( !err ) {
						if( result.data ) {
							return callbackFinal(null, result.data);
						} else {
							return callbackFinal('No data found', null);
						}
					} else {
						return callbackFinal(err, null);
					}
				})

		},

		getWRAction( idCustomer, callbackFinal ) {
			waterfall([
				( callback ) => {
					let endPoint = Config.ENDPOINT_PROD_WR;
					endPoint = `${endPoint}?idCustomer=${idCustomer}`;
					syncService.downloadData(endPoint, {}, callback)
				},

				], ( err, result ) => {
					if( !err ) {
						if( result.data ) {
							return callbackFinal(null, result.data);
						}
						else {
							return callbackFinal('No data found', null);
						}
					} else {
						return callbackFinal(err, null);
					}
				})
		},

		/**
		 * Get service requests
		 * @param idCustomer
		 * @param callbackFinal
		 */
		getServiceRequests(idCustomer, callbackFinal) {
			let endPoint = Config.ENDPOINT_PROD_SERVICE_REQUEST;
			endPoint = `${endPoint}?idCustomer=${idCustomer}`;
			syncService.easyDownloadData(endPoint, {}, callbackFinal);
		},


		/**
		 *
		 *
		 */
		postHolderRequestAction( obj, callbackFinal ) {

			waterfall([
				( callback ) => {
					let endPoint = Config.ENDPOINT_PROD_SERVICE_REQUEST;
					syncService.uploadData(endPoint, obj, callback)
				},
				], ( err, result ) => {
					if( !err ) {
						if( result.data )
							return callbackFinal(null, result.data);
						else
							return callbackFinal('No data Found', result);
					} else {
						return callbackFinal(err, null);
					}
				});

		},


		/**
		 *
		 *
		 */
		postHolderDocAction( idSr, type, obj, callbackFinal ) {

			waterfall([
				( callback ) => {
					let endPoint = Config.ENDPOINT_PROD_SERVICE_REQUEST;
					endPoint = `${endPoint}/doc?docType=${type}`;
					syncService.uploadData(endPoint, obj, callback)
				},
				], ( err, result ) => {
					if( !err ) {
						if( result )
							return callbackFinal(null, result);
						else
							return callbackFinal('No data Found', result);
					} else {
						return callbackFinal(err, null);
					}
				});

		},


		/**
		 * Get disconnection list
		 * @param idService
		 * @param callbackFinal
		 */
		getDisconnectionList(idService, callbackFinal) {
			let endPoint = Config.ENDPOINT_PROD_TEMPORARY_DISCONNECTION;
			endPoint = endPoint.replace("{idService}", idService);
			syncService.downloadData(endPoint, {}, callbackFinal);
		},
		
		/**
		 * Get RemainingBalance
		 * @param idCustomer
		 * @param callbackFinal
		 */
		getRemainingBalance(idAccount, callbackFinal) {
			let endPoint = Config.ENDPOINT_PROD_REMAINING_BALANCE;
			endPoint = `${endPoint}?idAccount=${idAccount}`;
			syncService.easyDownloadData(endPoint, {}, callbackFinal);
		},
		

		/**
		 * Get disconnection list
		 * @param idService
		 * @param callbackFinal
		 */
		newDisconnection(idService, data, callbackFinal) {
			let endPoint = Config.ENDPOINT_PROD_NEW_TEMPORARY_DISCONNECTION;
			endPoint = endPoint.replace("{idService}", idService);
			syncService.uploadData(endPoint, data, callbackFinal);
		},
		
		

		/**
		 * Get self reads available
		 * @param idPaymentForm
		 * @param callbackFinal
		 */
		getSelfReadsAvailable(idPaymentForm, callbackFinal) {
			let endPoint = Config.ENDPOINT_PROD_SELF_READS_AVAILABLE;
			endPoint = endPoint.replace("{idPaymentForm}", idPaymentForm);
			syncService.easyDownloadData(endPoint, {}, callbackFinal);
		},
		

		/**
		 * Get self reads
		 * @param idPaymentForm
		 * @param callbackFinal
		 */
		getSelfReads(idPaymentForm, callbackFinal) {
			let endPoint = Config.ENDPOINT_PROD_SELF_READS;
			endPoint = endPoint.replace("{idPaymentForm}", idPaymentForm);
			syncService.easyDownloadData(endPoint, {}, callbackFinal);
		},
		
		

		/**
		 * Add self reads
		 * @param idPaymentForm
		 * @param callbackFinal
		 */
		addSelfReads(idPaymentForm, data, callbackFinal) {
			let endPoint = Config.ENDPOINT_PROD_ADD_SELF_READS;
			endPoint = endPoint.replace("{idPaymentForm}", idPaymentForm);
			syncService.easyUploadData(endPoint, data, callbackFinal);
		},
		
		

		/**
		 * Get meters
		 * @param idService
		 * @param callbackFinal
		 */
		getMeters(idService, callbackFinal) {
			let endPoint = Config.ENDPOINT_PROD_METERS;
			endPoint = endPoint.replace("{idService}", idService);
			syncService.easyDownloadData(endPoint, {}, callbackFinal);
		},
		
		
		/**
		 * Calculate the payment
		 * @param data
		 * @param callbackFinal
		 */
		calculatePayment(data, callbackFinal) {
			let endPoint = Config.ENDPOINT_CALCULATE;
			syncService.easyDownloadData(endPoint, data, callbackFinal);
		},
		
		
		
		/**
		 * Get new payment reference
		 * @param data
		 * @param callbackFinal
		 */
		getReference(data, callbackFinal) {
			let endPoint = Config.ENDPOINT_PAYMENTS_NEW_REFERENCE;
			//endPoint = "http://10.0.2.2:8281/payments/1.0.1/newReference";
			syncService.easyUploadData(endPoint, data, callbackFinal);
		},
		
		/**
		 * Calculate the payment
		 * @param data
		 * @param callbackFinal
		 */
		getUrlIframe(data, callbackFinal) {
			let endPoint = Config.ENDPOINT_PAYMENTS_GET_URL_IFRAME;
			//endPoint = "http://10.0.2.2:8281/payments/1.0.1/getURLiFrame";
			syncService.easyDownloadData(endPoint, data, callbackFinal);
		},

		/**
		 * Calculate the payment for webpay
		 * @param data
		 * @param callbackFinal
		 */
		getUrlIframeWebPay(data, callbackFinal) {
			let endPoint = Config.ENDPOINT_PAYMENTS_GET_URL_IFRAME_WEBPAY;
			//endPoint = "http://10.0.2.2:8281/payments/1.0.1/getURLiFrame";
			syncService.easyDownloadData(endPoint, data, callbackFinal);
		},

		/**
		 * Read curve period
		 * @param data
		 * @param callbackFinal
		 */
		getReadCurvePeriod(idService, data, callbackFinal) {
			let endPoint = Config.ENDPOINT_READ_CURVE;
			endPoint = endPoint.replace("{idService}", idService);
			syncService.easyDownloadData(endPoint, data, callbackFinal);
		},

		/**
		 * Upload File
		 * @param data
		 * @param callbackFinal
		 */
		uploadFiles(data, callbackFinal) {
			let endPoint = Config.ENDPOINT_ATTACHMENTS;
			endPoint = `${endPoint}`;
			syncService.easyUploadData(endPoint, data, callbackFinal,"POST_FILE");
    },

		/**
		 * Upload File
		 * @param data
		 * @param callbackFinal
		 */
		getMethodPayment(data, callbackFinal) {
			let endPoint = Config.ENDPOINT_ADP_WEBPAY;
			endPoint = `${endPoint}` + "getPaymentMethods";
			//endPoint = `http://10.0.2.2:8281/ADPWebPayPayments/{apiVersion}/getPaymentMethods`;
			syncService.easyDownloadData(endPoint, data, callbackFinal);
		},
    
    validateDocumentsAction (data, callback) {
      let endPoint = Config.ENDPOINT_VALIDATE_DOCS

      if (data && data.numLetter) {
        endPoint = `${endPoint}?numLetter=${data.numLetter}`
      }
      syncService.downloadData(endPoint, null, callback)
    }
};
export default generalService;