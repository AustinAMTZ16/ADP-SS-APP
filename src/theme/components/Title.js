import { Platform } from "react-native";

import {variable} from "../";

export default (variables = variable) => {
	let titleTheme = {
    fontSize: variables.titleFontSize,
    fontFamily: variables.titleFontfamily,
    color: variables.titleFontColor,
    fontWeight: Platform.OS === "ios" ? undefined : undefined,
    textAlign: "center",
    '.left': {
      textAlign: "left",
    },
    '.semibold': {
      fontFamily: variables.fontFamilyHeavy
    }
  };

  return titleTheme;
};
