import {variable} from "../";

export default (variables = variable) => {
	let h2Theme = {
    color: variables.textColor,
    fontSize: variables.fontSizeH2,
    lineHeight: variables.lineHeightH2
  };

  return h2Theme;
};
