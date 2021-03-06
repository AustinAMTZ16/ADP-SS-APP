import {variable} from "../";

export default (variables = variable) => {
	let platform = variables.platform;

  let segmentTheme = {
    height: 45,
    borderColor: variables.segmentBorderColorMain,
    flexDirection: "row",
    justifyContent: "center",
    backgroundColor: variables.segmentBackgroundColor,
    "NativeBase.Button": {
      alignSelf: "center",
      borderRadius: 0,
      paddingHorizontal: 20,
      height: 30,
      backgroundColor: "transparent",
      borderWidth: 1,
      borderColor: variables.segmentBorderColor,
      elevation: 0,
      ".active": {
        backgroundColor: variables.segmentActiveBackgroundColor,
        "NativeBase.Text": {
          color: variables.segmentActiveTextColor
        }
      },
      ".first": {
        borderTopLeftRadius: platform === "ios" ? 5 : undefined,
        borderBottomLeftRadius: platform === "ios" ? 5 : undefined,
        borderRightWidth: 0
      },
      ".last": {
        borderTopRightRadius: platform === "ios" ? 5 : undefined,
        borderBottomRightRadius: platform === "ios" ? 5 : undefined,
        borderLeftWidth: 0
      },
      "NativeBase.Text": {
        color: variables.segmentTextColor,
        fontSize: 14
      }
    }
  };

  return segmentTheme;
};
