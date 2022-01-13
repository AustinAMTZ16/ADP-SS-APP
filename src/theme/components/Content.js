import {variable} from "../";

export default (variables = variable) => {
	let contentTheme = {
    ".base": {
      backgroundColor: variables.brandPrimary
    },
    ".padder": {
      padding: variables.contentPadding
    },
    ".padderHorizontal": {
      padding: variables.contentPadding,
      paddingHorizontal: 20
    },
    flex: 1,
    backgroundColor: "transparent",
    "NativeBase.Segment": {
      borderWidth: 0,
      backgroundColor: "transparent"
    }
  };

  return contentTheme;
};
