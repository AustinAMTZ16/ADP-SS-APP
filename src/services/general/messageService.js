import Config from 'react-native-config'
import syncService from '../general/syncService';

/**
 * Services used for MESSAGES entity
 * 20190723 - preyv
 *
 */
const messageService = {

    /**
     * Get communications for webmail
     * @param idCustomer
     * @param callbackFinal
     */
    getCommunicationAction(idCustomer, callbackFinal) {
        let endPoint = Config.ENDPOINT_PROD_COMMUNICATION;
        endPoint = `${endPoint}/${idCustomer}` + '/communications';
        syncService.easyDownloadData(endPoint, {}, callbackFinal);
    },

    /**
     * Notify communications
     * @param objData
     * @param callbackFinal
     */
    notifyCommunicationAction(idCustomer, idCommunication, callbackFinal) {
        let endPoint = Config.ENDPOINT_PROD_NOTIFY_COMMUNICATIONS;
        endPoint = `${endPoint}${idCustomer}` + '/setCommunicationReaded';
        let array = [];
        array.push(idCommunication);
        let param = new Object();
        param.communicationsReaded = array;
        syncService.easyUploadData(endPoint, param, callbackFinal);
    },

    /**
     * Get alerts
     * @param idCustomer
     * @param callbackFinal
     */
    getAlertList(idCustomer, callbackFinal) {
        let endPoint = Config.ENDPOINT_PROD_GET_ALERT_LIST;
        endPoint = `${endPoint}` + '?idCustomer=' + idCustomer;
        syncService.easyDownloadData(endPoint, {}, callbackFinal);
    },

    /**
     * Notify alert
     * @param objData
     * @param callbackFinal
     */
    notifyAlert(idAlert, callbackFinal) {
        let endPoint = Config.ENDPOINT_PROD_GET_ALERT_LIST;
        endPoint = `${endPoint}${idAlert}` + '/notifyAlert';
        syncService.easyUploadData(endPoint, {json:""}, callbackFinal,"PATCH");
    },

    /**
     * Get messages count
     * @param idCustomer
     * @param callbackFinal
     */
    getMessagesCount(idCustomer, callbackFinal) {
        let endPoint = Config.ENDPOINT_PROD_COMMUNICATION;
        endPoint = `${endPoint}` + '/messagesCount?idCustomer=' + idCustomer;
        syncService.easyDownloadData(endPoint, {}, callbackFinal);
    }

};
export default messageService;