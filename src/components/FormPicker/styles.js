import {platformStyle} from "../../theme";

export default {

  inputGrp: {
    paddingRight: 0,
    flexDirection: "row",
    marginBottom: 0,
    paddingBottom: 0,
    paddingLeft: 0,
    backgroundColor: 'transparent',
    height: 40,
  },
  inputsWidthIcon: {
    width: (platformStyle.platform.OS === 'ios') ? undefined : platformStyle.deviceWidth - 75,
  },
  inputsWidth: {
    width: (platformStyle.platform.OS === 'ios') ? undefined : platformStyle.deviceWidth - 25,
  },
  inputs: {
    // width: (platformStyle.platform.OS === 'ios') ? undefined : ((platformStyle.deviceWidth / 8) * 7 ),
    paddingTop: 0,
    margin: 0,
    marginLeft: 0,
    // height: 50,
  },
  textPicker: {
    // width: (platformStyle.platform.OS === 'ios') ? undefined : ((platformStyle.deviceWidth / 8) * 7 ),
    paddingTop: 0,
    margin: 0,
    marginLeft: 0
  },
  formErrorIcon: {
    color: "#000",
    marginTop: 5,
    right: 10
  },
  formErrorText1: {
    fontSize: platformStyle.platform.OS === "android" ? 12 : 15,
    textAlign: "right"
  },
  formErrorText11: {
	    fontSize: platformStyle.platform.OS === "android" ? 12 : 15,
	    textAlign: "right"
  },
  formErrorText2: {
    fontSize: platformStyle.platform.OS === "android" ? 12 : 15,
    color: "transparent",
    textAlign: "right"
  },
  inputLabel: {
    fontSize: platformStyle.platform.OS === "android" ? 12 : 15,
    textAlign: "left",
  },
  labelError: {
    marginTop: 2,
  },
};
