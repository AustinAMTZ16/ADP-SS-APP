import {platformStyle} from "../../../theme";
import sharedStyles from '../../../shared/styles';

export default {
  infoContainer: {
    ...sharedStyles.padding()
  },
  formContainer: {
    paddingHorizontal: 20,
    ...sharedStyles.padding('vertical')
  },
  slide1: {
    justifyContent: 'center',
    alignItems: 'center',
    margin: platformStyle.platform === "ios" ? 20: 10,
    //paddingTop: platformStyle.platform === "ios" ? 20: 20,
  },
  container: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    // height: platformStyle.platform === "ios" ? 200 : 150
    marginTop: 15,
    marginBottom: 15,
  }
};
