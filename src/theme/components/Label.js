import {variable} from "../";

export default (variables = variable) => {
	let labelTheme = {
    ".focused": {
      width: 0
    },
    '.sizeNormal': {
      fontSize: 16
    },
    '.large': {
      fontSize: 18
    },
    '.medio': {
      fontSize: 14
    },
    fontFamily: variables.fontFamilyBook,
    fontSize: variables.fontSizeMedio
  };

  return labelTheme;
};
