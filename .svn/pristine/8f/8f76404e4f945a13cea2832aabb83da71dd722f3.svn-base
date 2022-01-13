import {variable} from "../";

export default (variables = variable) => {
	let platformStyle = variables.platformStyle;
	let platform = variables.platform;

	let footerTheme = {
    "NativeBase.Left": {
      "NativeBase.Button": {
        ".transparent": {
          backgroundColor: "transparent",
          borderColor: null,
          elevation: 0,
          shadowColor: null,
          shadowOffset: null,
          shadowRadius: null,
          shadowOpacity: null
        },
        "NativeBase.Icon": {
          color: variables.topTabBarActiveTextColor
        },
        "NativeBase.IconNB": {
          color: variables.topTabBarActiveTextColor
        },
        alignSelf: null
      },
      flex: 1,
      alignSelf: "center",
      alignItems: "flex-start"
    },
    "NativeBase.Body": {
      flex: 1,
      alignItems: "center",
      alignSelf: "center",
      flexDirection: "row",
      "NativeBase.Button": {
        alignSelf: "center",
        ".transparent": {
          backgroundColor: "transparent",
          borderColor: null,
          elevation: 0,
          shadowColor: null,
          shadowOffset: null,
          shadowRadius: null,
          shadowOpacity: null
        },
        ".full": {
          height: variables.footerHeight,
          flex: 1
        },
        "NativeBase.Icon": {
          color: variables.topTabBarActiveTextColor
        },
        "NativeBase.IconNB": {
          color: variables.topTabBarActiveTextColor
        }
      }
    },
    "NativeBase.Right": {
      "NativeBase.Button": {
        ".transparent": {
          backgroundColor: "transparent",
          borderColor: null,
          elevation: 0,
          shadowColor: null,
          shadowOffset: null,
          shadowRadius: null,
          shadowOpacity: null
        },
        "NativeBase.Icon": {
          color: variables.topTabBarActiveTextColor
        },
        "NativeBase.IconNB": {
          color: variables.topTabBarActiveTextColor
        },
        alignSelf: null
      },
      flex: 1,
      alignSelf: "center",
      alignItems: "flex-end"
    },
    ".noBorders": {
      borderTopWidth: 0,
      borderBottomWidth: 0,
    },
    ".padder": {
      paddingHorizontal: 10,
      marginBottom: 10,
      elevation: 0,
    },
    ".noElevation": {
      elevation: 0,
    },
    backgroundColor: variables.footerDefaultBg,
    flexDirection: "row",
    justifyContent: "center",
    borderTopWidth: variables.footerBorderTop,
    borderColor: "#EEF3F5",
    height: variables.footerHeight,
    elevation: 1,
    left: 0,
    right: 0
  };

  return footerTheme;
};
