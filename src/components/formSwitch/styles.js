import {platformStyle} from "../../theme";

export default {

  inputGrp: {
    paddingLeft: 0,
    paddingRight: 0,
    flexDirection: "row",
    //alignItems: 'flex-end',
  },
  title: {
    fontSize: platformStyle.titleFontSize,
    alignSelf: "flex-start"
  },
  inputs: {
    width: 50,
    alignSelf: 'flex-start',
    flexDirection: 'row',
    height: platformStyle.inputHeightBase
  },
  formErrorText2: {
    fontSize: platformStyle.platform.OS === "android" ? 12 : 15,
    color: "transparent",
    textAlign: "right"
  },
};
