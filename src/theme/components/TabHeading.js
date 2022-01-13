import {variable} from "../";

export default (variables = variable) => {
	let platform = variables.platform;

	let tabHeadingTheme = {
    flexDirection: "row",
    backgroundColor: variables.tabDefaultBg,
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    ".scrollable": {
      paddingHorizontal: 20,
      flex: platform === "android" ? 0 : 1,
      minWidth: platform === "android" ? undefined : 60
    },
    "NativeBase.Text": {
      color: variables.topTabBarTextColor,
      marginHorizontal: 7
    },
    "NativeBase.Icon": {
      color: variables.topTabBarTextColor,
      fontSize: platform === "ios" ? 26 : undefined
    },
    ".active": {
      "NativeBase.Text": {
        color: variables.topTabBarActiveTextColor,
        fontWeight: "600"
      },
      "NativeBase.Icon": {
        color: variables.topTabBarActiveTextColor
      }
    }
  };

  return tabHeadingTheme;
};