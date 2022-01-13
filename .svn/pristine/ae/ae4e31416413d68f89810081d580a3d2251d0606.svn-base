import Config from 'react-native-config'
import syncService from '../general/syncService';

/**
 * Services used for BANNER entity
 * 20201222 - preyv
 *
 */
const bannerService = {

    /**
     * Get banner list
     * @param idCustomer
     * @param callbackFinal
     */
    getBannerList(idCustomer, callbackFinal) {
        let endPoint = Config.ENDPOINT_PROD_GET_ALERT_LIST;
        endPoint = `${endPoint}banners?idCustomer=${idCustomer}`;
        //endPoint = `http://10.0.2.2:8281/alerts/2.0.1/banners?idCustomer=33`;
        syncService.easyDownloadData(endPoint, {}, callbackFinal);
    },

    /**
     * Is Registered in Other Program
     * @param callbackFinal
     * //http://localhost:7015/adpouc-ss-server/services/adpprogram/validateRegisteredOtherProgram
     */
    isRegisteredOtherProgram(req, callbackFinal) {
        let endPoint = Config.ENDPOINT_ADP_PROGRAM;
        endPoint = `${endPoint}validateRegisteredOtherProgram`;
        //endPoint = `http://10.0.2.2:8281/adpprogram/2.0.1/validateRegisteredOtherProgram`; //TODO DELETE
        syncService.easyUploadData(endPoint, req, callbackFinal);
    },

    /**
     * is Registered Annual Payment
     * @param callbackFinal
     * // http://localhost:7015/adpouc-ss-server/services/adpprogram/validateAnnualPayment
     */
    isRegisteredAnnualPayment(req, callbackFinal) {
        let endPoint = Config.ENDPOINT_ADP_PROGRAM;
        endPoint = `${endPoint}validateAnnualPayment`;
        //endPoint = `http://10.0.2.2:8281/adpprogram/2.0.1/validateAnnualPayment`; //TODO DELETE
        syncService.easyUploadData(endPoint, req, callbackFinal);
    },

    /**
     * Get DATA AnnualPayment
     * @param callbackFinal
     * // http://localhost:7015/adpouc-ss-server/services/adpprogram/advanceAnnualPayment
     */
    getDataAnnualPayment(req, callbackFinal) {
        let endPoint = Config.ENDPOINT_ADP_PROGRAM;
        endPoint = `${endPoint}advanceAnnualPayment`;
        //endPoint = `http://10.0.2.2:8281/adpprogram/2.0.1/advanceAnnualPayment`; //TODO DELETE
        syncService.easyUploadData(endPoint, req, callbackFinal);
    },

    /**
     * Get Debt
     * @param callbackFinal
     * // http://localhost:7015/adpouc-ss-server/services/adpprogram/debtOffsetCalc
     */
    debtOffsetCalc(req, callbackFinal) {
        let endPoint = Config.ENDPOINT_ADP_PROGRAM;
        endPoint = `${endPoint}debtOffsetCalc`;
        //endPoint = `http://10.0.2.2:8281/adpprogram/2.0.1/debtOffsetCalc`; //TODO DELETE
        syncService.easyUploadData(endPoint, req, callbackFinal);
    },

    /**
     * getDebtBillSS
     * @param callbackFinal
     * // http://localhost:7015/adpouc-ss-server/services/adpprogram/getDebtBillSS
     */
    getDebtBillSS(req, callbackFinal) {
        let endPoint = Config.ENDPOINT_ADP_PROGRAM;
        endPoint = `${endPoint}getDebtBillSS`;
        //endPoint = `http://10.0.2.2:8281/adpprogram/2.0.1/getDebtBillSS`; //TODO DELETE
        
        syncService.easyUploadData(endPoint, req, callbackFinal);
    },

    /**
     * valDebtOffsetCalc
     * @param callbackFinal
     * // http://localhost:7015/adpouc-ss-server/services/adpprogram/debtOffsetCalc
     */
    valDebtOffsetCalc(req, callbackFinal) {
        let endPoint = Config.ENDPOINT_ADP_PROGRAM;
        endPoint = `${endPoint}valDebtOffsetCalc`;
        //endPoint = `http://10.0.2.2:8281/adpprogram/2.0.1/valDebtOffsetCalc`; //TODO DELETE
        //req = {"idPaymentForm":138,"programType":"200PRGTYPE"} //TODO DELETE
        syncService.easyUploadData(endPoint, req, callbackFinal);
    },

    /**
     * searchBillExtendInstalment
     * @req
     * @param callbackFinal
     *
     */
    searchBillExtendInstalment(req, callbackFinal) {
        let endPoint = Config.ENDPOINT_ADP_PROGRAM;
        endPoint = `${endPoint}searchBillExtendInstalment`;
        //endPoint = `http://10.0.2.2:8281/adpprogram/2.0.1/searchBillExtendInstalment`; //TODO DELETE
        syncService.easyUploadData(endPoint, req, callbackFinal);
    },

    /**
     * extendInstalmentBill
     * @req
     * @param callbackFinal
     *
     */
    extendInstalmentBill(req, callbackFinal) {
        let endPoint = Config.ENDPOINT_ADP_PROGRAM;
        endPoint = `${endPoint}extendInstalmentBill`;
        //endPoint = `http://10.0.2.2:8281/adpprogram/2.0.1/extendInstalmentBill`; //TODO DELETE
        syncService.easyUploadData(endPoint, req, callbackFinal);
    },

    /**
     * noDebtProof
     * @param callbackFinal
     *
     */
    noDebtProof(req, callbackFinal) {
        let endPoint = Config.ENDPOINT_ADP_PROGRAM;
        endPoint = `${endPoint}calculateCharge`;
        //endPoint = `http://10.0.2.2:8281/adpprogram/2.0.1/calculateCharge`; //TODO DELETE
        syncService.easyUploadData(endPoint, req, callbackFinal);
    },

    /**
     * valDebtAccount
     * @param callbackFinal
     *
     */
    valDebtAccount(req, callbackFinal) {
        let endPoint = Config.ENDPOINT_ADP_PROGRAM;
        endPoint = `${endPoint}valDebtAccount`;
        //endPoint = `http://10.0.2.2:8281/adpprogram/2.0.1/valDebtAccount`; //TODO DELETE
        syncService.easyUploadData(endPoint, req, callbackFinal);
    },

    /**
     * addProgramSubscriber
     * @param callbackFinal
     *
     */
    addProgramSubscriber(req, callbackFinal) {
        let endPoint = Config.ENDPOINT_ADP_PROGRAM;
        endPoint = `${endPoint}addProgramSubscriber`;
        //endPoint = `http://10.0.2.2:8281/adpprogram/2.0.1/addProgramSubscriber`; //TODO DELETE
        syncService.easyUploadData(endPoint, req, callbackFinal);
    },

    /**
     * generateCharge
     * @param callbackFinal
     *
     */
    generateCharge(req, callbackFinal) {
        let endPoint = Config.ENDPOINT_ADP_PROGRAM;
        endPoint = `${endPoint}generateCharge`;
        //endPoint = `http://10.0.2.2:8281/adpprogram/2.0.1/generateCharge`; //TODO DELETE
        syncService.easyUploadData(endPoint, req, callbackFinal);
    }

};
export default bannerService;