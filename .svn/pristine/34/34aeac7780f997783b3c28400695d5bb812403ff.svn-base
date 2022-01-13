import Config from 'react-native-config'
import syncService from '../general/syncService';

/**
 * Services used for CFDI entity
 * 20201229 - preyv
 *
 */
const cfdiService = {

    /**
     * Get with CFDI
     * @param req
     * @param callbackFinal
     */
    getWithCFDI(req, callbackFinal) {
        let endPoint = Config.ENDPOINT_CFDI;
        endPoint = `${endPoint}` + 'getOnlineCollectionWithCFDI';
        //endPoint = "http://10.0.2.2:8281/adpcfdi/1.0.1/getOnlineCollectionWithCFDI";
        syncService.easyUploadData(endPoint, req, callbackFinal);
    },

    /**
     * Get without CFDI
     * @param req
     * @param callbackFinal
     */
    getWithoutCFDI(req, callbackFinal) {
        let endPoint = Config.ENDPOINT_CFDI;
        endPoint = `${endPoint}` + 'getOnlineCollectionWithoutCFDI';
        //endPoint = "http://10.0.2.2:8281/adpcfdi/1.0.1/getOnlineCollectionWithoutCFDI";
        syncService.easyUploadData(endPoint, req, callbackFinal);
    },

    /**
     * Suscribe CFDI
     * @param req
     * @param callbackFinal
     */
    subscribeCFDI(req,callbackFinal) {
        let endPoint = Config.ENDPOINT_CFDI;
        endPoint = `${endPoint}` + 'subscribeCFDI';      
        syncService.easyUploadData(endPoint, req, callbackFinal);
    },

    /**
     * Create CFDI
     * @param req
     * @param callbackFinal
     */
    createCFDI(req, callbackFinal) {
        let endPoint = Config.ENDPOINT_CFDI;
        endPoint = `${endPoint}` + 'createCFDI';
        syncService.easyUploadData(endPoint, req, callbackFinal);
    },

    /**
     * getCFDIDocuments
     * @param idCustomer
     * @param callbackFinal
     */
    getCFDIDocuments(req, callbackFinal) {
        let endPoint = Config.ENDPOINT_CFDI;
        endPoint = `${endPoint}getCFDIDocuments`;
        //endPoint = `https://madppvcmsweb06.indra.es:8443/adpouc-ss-server/services/adpcfdi/getCFDIDocuments`; //TODO DELETE
        //endPoint = "http://10.0.2.2:8281/adpcfdi/1.0.1/getCFDIDocuments";
        syncService.easyDownloadData(endPoint, req, callbackFinal);
    }

};
export default cfdiService;