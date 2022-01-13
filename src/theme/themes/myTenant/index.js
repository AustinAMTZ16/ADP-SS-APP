import color from "color";

import { Platform, Dimensions, PixelRatio } from "react-native";

const deviceHeight = Dimensions.get("window").height;
const deviceWidth = Dimensions.get("window").width;
const platform = Platform.OS;
const platformStyle = undefined;

export default {
  platformStyle,
  platform,
  // AndroidRipple
  androidRipple: true,
  androidRippleColor: "rgba(256, 256, 256, 0.3)",
  androidRippleColorDark: "rgba(0, 0, 0, 0.15)",

  // Badge
  badgeBg: "#ED1727",
  badgeColor: "#fff",
  badgeBgWarning: "#FFDD7D",
  badgeColorWarning: "#000000",
  badgeBgDark: "#9B9B9B",

  // New Variable
  badgePadding: platform === "ios" ? 0 : 0,

  // Button
  btnFontFamily: platform === "ios" ? "AvenirLTStd-Medium" : "AvenirLTStd-Medium",
  btnFontBoldFamily: platform === "ios" ? "AvenirLTStd-Black" : "AvenirLTStd-Black",
  btnDisabledBg: "#b5b5b5",
  btnDisabledClr: "#f1f1f1",

  btnRedBg: "#F02020",
  btnRedDisabledBg: "#F02020",
  btnRedFontColor: "#fff",

  btnWarningBgColor: "#FFDD7D",
  btnWarningDisabledBg: "#FFDD7D",
  btnWarningFontColor: "#fff",

  btnRed2Bg: "#D71B42",
  btnRed2DisabledBg: "#D71B42",
  btnRed2FontColor: "#fff",

  btnSalmonBg: "#FFCE00",
  btnSalmonDisabledBg: "#FFCE00",
  btnSalmonFontColor: "#fff",

  btnPinkBg: "#FF788D",
  btnPinkDisabledBg: "#FF788D",
  btnPinkFontColor: "#fff",


  btnBlueBg: "#61CFE9",
  btnBlueDisabledBg: "#61CFE9",
  btnBlueFontColor: "#fff",

  btnActiononSuccessBg: "#8BA5DA",
  btnActiononSuccessDisabledBg: "#8BA5DA",
  btnActiononFontColor: "#fff",

  btnActiononCurrentBg: "#80A754",
  btnActiononCurrentDisabledBg: "#80A754",

  btnActiononNextBg: "#FFCE00",
  btnActiononNextDisabledBg: "#FFCE00",


  // CheckBox
  CheckboxRadius: platform === "ios" ? 13 : 0,
  CheckboxBorderWidth: platform === "ios" ? 1 : 2,
  CheckboxPaddingLeft: platform === "ios" ? 4 : 2,
  CheckboxPaddingBottom: platform === "ios" ? 0 : 5,
  CheckboxIconSize: platform === "ios" ? 21 : 14,
  CheckboxIconMarginTop: platform === "ios" ? undefined : 1,
  CheckboxFontSize: platform === "ios" ? 23 / 0.9 : 18,
  DefaultFontSize: 17,
  checkboxBgColor: "#039BE5",
  checkboxSize: 20,
  checkboxTickColor: "#fff",

  // Segment
  segmentBackgroundColor: platform === "ios" ? "#000" : "#000",
  segmentActiveBackgroundColor: platform === "ios" ? "#000" : "#000",
  segmentTextColor: platform === "ios" ? "#000" : "#000",
  segmentActiveTextColor: platform === "ios" ? "#000" : "#000",
  segmentBorderColor: platform === "ios" ? "#000" : "#000",
  segmentBorderColorMain: platform === "ios" ? "#000" : "#000",

  // New Variable
  get defaultTextColor() {
    return this.textColor;
  },

  get btnPrimaryBg() {
    return this.brandPrimary;
  },
  get btnPrimaryColor() {
    return this.inverseTextColor;
  },
  get btnSecundaryColor() {
    return this.brandYellowLight;
  },
  get btnInfoBg() {
    return this.brandInfo;
  },
  get btnInfoColor() {
    return this.inverseTextColor;
  },
  get btnSuccessBg() {
    return this.brandSuccess;
  },
  get btnSuccessColor() {
    return this.inverseTextColor;
  },
  get btnDangerBg() {
    return this.brandDanger;
  },
  get btnDangerColor() {
    return this.inverseTextColor;
  },
  get btnWarningBg() {
    return this.brandWarning;
  },
  get btnWarningBgC() {
    return this.btnWarningBgColor;
  },
  get btnWarningColor() {
    return this.inverseTextColor;
  },
  get btnTextSize() {
    return this.fontSizeBase - 1;
  },
  get btnTextSizeLarge() {
    return this.fontSizeBase * 1.5;
  },
  get btnTextSizeSmall() {
    return this.fontSizeBase * 0.8;
  },
  get borderRadiusLarge() {
    return this.fontSizeBase * 3.8;
  },

  buttonPadding: 6,

  get iconSizeLarge() {
    return this.iconFontSize * 1.5;
  },
  get iconSizeSmall() {
    return this.iconFontSize * 0.6;
  },

  // Card
  cardDefaultBg: "#fff",

  // Color
  //Kenia: brandPrimary: "#004B8D",
  brandPrimary: "red",

  //Kenia: brandYellow: "#FFCE00",
  brandYellow: "#A2ACB3",

  brandYellowLight: "#FFF2B9",
  brandSecondary: "#4A4A4A",
  brandLight: "#E2E2E2",
  brandWhite: "#fff",
  brandGrey: "#F1F1F1",

  brandPink: "#FF788D",
  brandRed: "#D71B42",
  brandAzul: "#8BA5DA",
  brandAzulLight: "#61CFE9",
  brandPurple: "#AC85D4",
  brandDark: "#000",
  brandSuccess: "#80A754",
  brandGreen: "#97C66B",
  brandGrisBase: "#EEF3F5",

  brandGreyDark: "#75888C",
  brandGreyDark2: "#233539",
  brandBlank: "#000",
  brandInfo: "#61CFE9",
  brandDanger: "#D71B42",
  brandWarning: "#FFDD7D",
  brandSidebar: "#252932",

  // Font
  fontFamily: "AvenirLTStd-Medium",
  fontFamilyBook: "AvenirLTStd-Book",
  fontFamilyMedium: "AvenirLTStd-Medium",
  fontFamilyBlack: "AvenirLTStd-Black",
  fontFamilyOblique: "AvenirLTStd-Oblique",
  fontFamilyLight: "AvenirLTStd-Light",
  fontFamilyLightOblique: "AvenirLTStd-LightOblique",
  fontFamilyHeavy: platform === "ios" ?  "Avenir-Heavy":"AvenirLTStd-Heavy",
  fontSizeXXSmall: 8,
  fontSizeXSmall: 10,
  fontSizeSmall: 12,
  fontSizeMedio: 14,
  fontSizeBase: 16,
  fontSizeLarge: 18,
  fontSizeExtraLarge: 20,
  fontSizeXXLarge: 24,
  fontSizeXXXLarge: 30,

  get fontSizeH1() {
    return this.fontSizeBase * 1.8;
  },
  get fontSizeH2() {
    return this.fontSizeBase * 1.6;
  },
  get fontSizeH3() {
    return this.fontSizeBase * 1.4;
  },

  // Footer
  footerHeight: deviceWidth / 8,
  footerDefaultBg: "#fff",
  footerBorderTop: 1,

  // FooterTab
  tabBarTextColor:  "#fff",
  tabBarTextSize: 14,
  activeTab: platform === "ios" ? "#F9F9FA" : "#F9F9FA",
  sTabBarActiveTextColor: "#fff",
  tabBarActiveTextColor: platform === "ios" ? "#FFCE00" : "#FFCE00",
  tabActiveBgColor: platform === "ios" ? "#F9F9FA" : "#F9F9FA",

  // Tab
  tabDefaultBg: platform === "ios" ? "#fff" : "#fff",
  topTabBarTextColor: platform === "ios" ? "#000" : "#000",
  topTabBarActiveTextColor: platform === "ios" ? "#FFCE00" : "#FFCE00",
  topTabActiveBgColor: platform === "ios" ? "#F9F9FA" : "#F9F9FA",
  topTabBarBorderColor: platform === "ios" ? "#FFCE00" : "#FFCE00",
  topTabBarActiveBorderColor: platform === "ios" ? "#FFCE00" : "#FFCE00",

  // Header
  toolbarBtnColor: platform === "ios" ? "#233539" : "#233539",
  //Kenia: toolbarDefaultBg:  "#FFCE00",
  toolbarDefaultBg:  "#A2ACB3",
  toolbarHeight: platform === "ios" ? 64 : 56,
  toolbarIconSize: platform === "ios" ? 20 : 22,
  toolbarSearchIconSize: platform === "ios" ? 20 : 23,
  toolbarInputColor: platform === "ios" ? "#CECDD2" : "#fff",
  searchBarHeight: platform === "ios" ? 30 : 40,
  toolbarInverseBg: "#222",
  toolbarTextColor: platform === "ios" ? "#000" : "#fff",
  toolbarDefaultBorder: platform === "ios" ? "#EEF3F5" : "#EEF3F5",
  iosStatusbar: "light-content",
  get statusBarColor() {
    return color(this.toolbarDefaultBg).hex();
  },

  // Icon
  iconFamily: "Ionicons",
  iconFontSize: platform === "ios" ? 30 : 28,
  iconMargin: 7,
  iconHeaderSize: platform === "ios" ? 33 : 24,

  // InputGroup
  inputFontSize: 16,
  inputBorderColor: "#696769",
  inputSuccessBorderColor: "#2b8339",
  inputErrorBorderColor: "#ed2f2f",

  get inputColor() {
    return this.textColor;
  },
  get inputColorPlaceholder() {
    return "rgba(255,255,255,0.5)";
  },

  inputGroupMarginBottom: 10,
  inputHeightBase: 40,
  inputPaddingLeft: 5,

  get inputPaddingLeftIcon() {
    return this.inputPaddingLeft * 8;
  },

  // Line Height
  btnLineHeight: 19,
  lineHeightH1: 32,
  lineHeightH2: 27,
  lineHeightH3: 22,
  iconLineHeight: platform === "ios" ? 37 : 30,
  lineHeight: platform === "ios" ? 22 : 18,

  // List
  listBg: "#222",
  listTransBg: "transparent",
  listBorderColor: "#F2F2F2",
  listBorderColorDark: "#CCCCCC",
  listDividerBg: "#f4f4f4",
  listItemHeight: 45,
  listBtnUnderlayColor: "#DDD",

  // Card
  cardBorderColor: "#ccc",

  // Changed Variable
  listItemPadding: 5,

  listNoteColor: "#808080",
  listNoteSize: 13,

  // Progress Bar
  defaultProgressColor: "#E4202D",
  inverseProgressColor: "#1A191B",

  // Radio Button
  radioBtnSize: platform === "ios" ? 25 : 23,
  radioSelectedColorAndroid: this.brandPrimary,
  radioBtnLineHeight: platform === "ios" ? 29 : 24,
  radioColor: this.brandPrimary,
  get radioSelectedColor() {
    return this.brandPrimary;
  },

  // Spinner
  defaultSpinnerColor: "#45D56E",
  inverseSpinnerColor: "#1A191B",

  // Tabs
  tabBgColor: "#F8F8F8",
  tabFontSize: 15,
  tabTextColor: "#222222",

  // Text
  textColor: "#000",
  inverseTextColor: "#fff",
  lightTextColor: "#95969B",
  standarTextColor: "#75888C",
  contentTextColor: "#444",
  noteFontSize: 14,

  // Title
  titleFontfamily: platform === "ios" ? "AvenirLTStd-Medium" : "AvenirLTStd-Medium",
  titleFontSize: platform === "ios" ? 16 : 18,
  subTitleFontSize: platform === "ios" ? 12 : 14,
  subtitleColor: platform === "ios" ? "#8e8e93" : "#FFF",

  // New Variable
  titleFontColor: platform === "ios" ? "#233539" : "#233539",

  // Other
  borderRadiusBase: platform === "ios" ? 4 : 4,
  borderRadiusBold: platform === "ios" ? 50 : 50,
  borderWidth: 1 / PixelRatio.getPixelSizeForLayoutSize(1),
  borderWidth2: 2 ,
  borderWidth4: 4 ,
  contentPadding: 10,

  get darkenHeader() {
    return color(this.tabBgColor).darken(0.03).hex();
  },

  dropdownBg: "#000",
  dropdownLinkColor: "#414142",
  inputLineHeight: 24,
  jumbotronBg: "#C9C9CE",
  jumbotronPadding: 30,
  deviceWidth,
  deviceHeight,

  // New Variable
  inputGroupRoundedBorderRadius: 30,

  //Drawer
  drawerBgColor: "#000",
  drawerFontColor: "#fff",
  drawerFontSize: 30
};
