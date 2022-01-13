import Config from 'react-native-config'
import syncService from '../general/syncService';

/**
 * Services used for Link - Unlink Contract
 * 20210115 - preyv
 *
 */
const linkContractService = {    

    /**
     * Link Contract
     * @param req
     * @param callbackFinal
     */
    link(req,callbackFinal) {
        let endPoint = Config.ENDPOINT_THIRD_PARTY;
        endPoint = `${endPoint}` + 'link';
        syncService.easyUploadData(endPoint, req, callbackFinal);
    },

    /**
     * Unlink Contract
     * @param req
     * @param callbackFinal
     */
    unlink(req, callbackFinal) {
        let endPoint = Config.ENDPOINT_THIRD_PARTY;
        endPoint = `${endPoint}` + 'unlink';
        syncService.easyUploadData(endPoint, req, callbackFinal);
    },

    /**
     * Get ticketList
     * @param req
     * @param callbackFinal
     */
    getTicket(req, callbackFinal) {
        let endPoint = Config.ENDPOINT_THIRD_PARTY;
        endPoint = `${endPoint}` + 'getTickettoList';
        syncService.easyDownloadData(endPoint, req, callbackFinal);
    }

};
export default linkContractService;