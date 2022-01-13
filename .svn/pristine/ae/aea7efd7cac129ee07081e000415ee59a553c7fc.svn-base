import Config from 'react-native-config'
import syncService from '../general/syncService';

/**
 * Services used for REMOTE ASSISTANT entity
 * 20210420 - preyv
 *
 */
const assistantService = {

    /**
     * Get Load Combo Hours Data
     * @param date
     * @param idRemoteServiceType
     * @param callbackFinal
     */
    getLoadComboHoursData(date,idRemoteServiceType, callbackFinal) {
        let endPoint = Config.ENDPOINT_ADP_REMOTE_SERVICE;
        endPoint = `${endPoint}getLoadComboData?date=${date}&idRemoteServiceType=${idRemoteServiceType}`;
        syncService.easyDownloadData(endPoint, {}, callbackFinal);
    },

    /**
     * Get Load Combo Data
     * @param idRemoteServiceType
     * @param callbackFinal
     */
    getLoadComboData(idRemoteServiceType, callbackFinal) {
        let endPoint = Config.ENDPOINT_ADP_REMOTE_SERVICE;
        endPoint = `${endPoint}getLoadComboDaysData?idRemoteServiceType=${idRemoteServiceType}`;
        syncService.easyDownloadData(endPoint, {}, callbackFinal);
    },

    /**
     * is Data Update Needed
     * @param idCustomer
     * @param callbackFinal
     */
    isDataUpdateNeeded(idCustomer, callbackFinal) {
        let endPoint = Config.ENDPOINT_ADP_REMOTE_SERVICE;
        endPoint = `${endPoint}isDataUpdateNeeded?idCustomer=${idCustomer}`;
        //endPoint = `http://10.0.2.2:8281/adpremoteservice/1.0.1/isDataUpdateNeeded?idCustomer=33`;
        syncService.easyDownloadData(endPoint, {}, callbackFinal);
    },

    /**
     * Get Remote Service Hist
     * @param idCustomer
     * @param callbackFinal
     */
    getRemoteServiceHist(idCustomer, callbackFinal) {
        let endPoint = Config.ENDPOINT_ADP_REMOTE_SERVICE;
        endPoint = `${endPoint}getRemoteServiceHist?idCustomer=${idCustomer}`;
        syncService.easyDownloadData(endPoint, {}, callbackFinal);
    },

    /**
     * Get Remote Service Pending
     * @param idCustomer
     * @param callbackFinal
     */
    getRemoteServicePending(idCustomer, callbackFinal) {
        let endPoint = Config.ENDPOINT_ADP_REMOTE_SERVICE;
        endPoint = `${endPoint}getRemoteServicePending?idCustomer=${idCustomer}`;
        syncService.easyDownloadData(endPoint, {}, callbackFinal);
    },

    /**
     * Cancel Remote Service
     * @param idRemoteService
     * @param callbackFinal
     */
    cancelRemoteService(idRemoteService, callbackFinal) {
        let endPoint = Config.ENDPOINT_ADP_REMOTE_SERVICE;
        endPoint = `${endPoint}` + 'cancelRemoteService';
        let param = new Object();
        param.idRemoteService = idRemoteService;
        syncService.easyUploadData(endPoint, param, callbackFinal);
    },

    /**
     * New Remote Service Immediate
     *  @param idCustomer
     * @param idRemoteService
     * @param callbackFinal
     */
    newRemoteServiceImmediate(idCustomer, idRemoteServiceType, callbackFinal) {
        let endPoint = Config.ENDPOINT_ADP_REMOTE_SERVICE;
        endPoint = `${endPoint}` + 'newRemoteServiceImmediate';
        let param = new Object();
        param.idCustomer = idCustomer;
        param.idRemoteServiceType = idRemoteServiceType;
        syncService.easyUploadData(endPoint, param, callbackFinal);
    },

    /**
     * New Remote Service
     * @param idRemoteService
     * @param callbackFinal
     */
    newRemoteService(data, callbackFinal) {
        let endPoint = Config.ENDPOINT_ADP_REMOTE_SERVICE;
        endPoint = `${endPoint}` + 'newRemoteService';
        syncService.easyUploadData(endPoint, data, callbackFinal);
    }

};
export default assistantService;