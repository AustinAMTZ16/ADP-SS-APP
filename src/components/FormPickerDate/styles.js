import {platformStyle} from "../../theme";

export default {

  inputGrp: {
    paddingLeft: 0,
    paddingRight: 0,
    flexDirection: "row",
  },
  formErrorIcon: {
    color: "#000",
    marginTop: 3,
    marginLeft: 4
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
  datePicker: {
    dateInput: {
      borderWidth: 0,
      alignItems: 'flex-start',
      height: 50,
      //marginLeft: 5,
      // color: 'red'
      // width: 60,
    }
  }
};
