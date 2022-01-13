import { platformStyle } from "../../theme";
import sharedStyles from '../../shared/styles';
import { Dimensions, Platform } from 'react-native';
const  windowSize  = Dimensions.get('window');

export default {
  mainContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: platformStyle.platform === "ios" ? 10 : 50,
    marginBottom: platformStyle.platform === "ios" ? 5 : 50,
    marginLeft: 10,
    marginRight: 10
  },
  mainView: {
    flexDirection: 'row', 
    justifyContent: 'center', 
    alignItems: 'center'
  },
  search: {
    ...sharedStyles.margin('top'),
    backgroundColor: platformStyle.brandPrimary
  },
  input: () => {

    let items = {
      height: 50,
      width: windowSize.width * 0.83,
      marginRight: windowSize.width * 0.03,
      color: 'black',
      fontSize: 16,
      borderBottomWidth: 1, 
      borderBottomColor: 'black'
    }

    if (Platform.OS !== 'ios') {
      delete items.borderBottomColor
      delete items.borderBottomWidth
    }

    return items
  },
  modalContainer: {
    zIndex: 10000,
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
    backgroundColor: 'rgba(20, 20, 20, 0.5)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  modalContent: {
    backgroundColor: 'white',
    width: windowSize.width * 0.9,
    padding: windowSize.width * 0.05,

  },
  closeModal: {
    paddingVertical: 10, 
    paddingHorizontal: 20,
    backgroundColor: platformStyle.brandPrimary,
    borderRadius: 25, 
    marginTop: 20, 
    alignItems: 'center'
  },
  helperContainer: {
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center', 
    borderBottomWidth: 0.5, 
    borderBottomColor: 'black', 
    width: windowSize.width * 0.93, 
    paddingTop: 10, 
    paddingBottom: 10,
    marginTop: 15
  },
  helperMessage: {
    width: windowSize.width * 0.88, 
    alignItems: 'center', 
    justifyContent: 'center',
    margin: 10,
    paddingBottom: 5,
  },


  cameraContainer: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'black',
  },
  cameraPreview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  cameraCancel: {
    flex: 0,
    backgroundColor: '#fff',
    borderRadius: 35,
    padding: 15,
    paddingHorizontal: 20,
    alignSelf: 'center',
    margin: 20,
  },
}