import { Dimensions, Platform } from "react-native";
const { width, height } = Dimensions.get("window");

export const COLORS = {
    primary: "#000000", //orange #FF6C44
    transparentPrimary: 'rgba(0, 0, 0, 0.4)', //'rgba(227, 120, 75, 0.4)' light orange
    orange: "#FFA133",
    lightOrange: "#FFA133",
    lightOrange2: "#FDDED4",
    lightOrange3: '#FFD9AD',
    green: "#27AE60",
    red: "#FF1717",
    blue: '#0064C0',
    blueTwitter: 'rgb(29, 155, 240)',
    darkBlue: "#111A2C",
    darkGray: "#525C67",
    darkGray2: "#757D85",
    gray: "#898B9A",
    gray2: "#BBBDC1",
    gray3: '#CFD0D7',
    lightGray1: "#DDDDDD",
    lightGray2: "#F5F5F8",
    white2: "#FBFBFB",
    white: '#FFFFFF',
    black: "#000000",

    transparent: 'transparent',
    transparentBlack1: "rgba(0, 0, 0, 0.1)",
    transparentBlack7: "rgba(0, 0, 0, 0.7)"

};
export const SIZES = {
    // global sizes
    base: 8,
    font: 14,
    radius: 12,
    padding: 24,

    // font sizes
    largeTitle: 40,
    h1: 30,
    h2: 22,
    h3: 16,
    h4: 14,
    h5: 12,
    body1: 30,
    body2: 22,
    body3: 16,
    body4: 14,
    body5: 12,

    // app dimensions
    width,
    height
};
export const FONTS = {
    largeTitle: { 
        fontFamily: "Roboto-Black", 
        fontSize: SIZES.largeTitle 
    },
    h1: { 
        fontFamily: "Roboto-Bold", 
        fontSize: SIZES.h1, 
        lineHeight: 36 
    },
    h2: { 
        fontFamily: "Roboto-Bold", 
        fontSize: SIZES.h2, 
        lineHeight: 30 
    },
    h3: { 
        fontFamily: "Roboto-Bold", 
        fontSize: SIZES.h3, 
        lineHeight: 22 
    },
    h4: { 
        fontFamily: "Roboto-Bold", 
        fontSize: SIZES.h4, 
        lineHeight: 22 
    },
    h5: { 
        fontFamily: "Roboto-Bold", 
        fontSize: SIZES.h5, 
        lineHeight: 22 
    },
    body1: { 
        fontFamily: "Roboto-Regular", 
        fontSize: SIZES.body1, 
        lineHeight: 36 
    },
    body2: { 
        fontFamily: "Roboto-Regular", 
        fontSize: SIZES.body2, 
        lineHeight: 30 
    },
    body3: { 
        fontFamily: "Roboto-Regular", 
        fontSize: SIZES.body3, 
        lineHeight: 22 
    },
    body4: { 
        fontFamily: "Roboto-Regular", 
        fontSize: SIZES.body4, 
        lineHeight: 22 
    },
    body5: { 
        fontFamily: "Roboto-Regular", 
        fontSize: SIZES.body5, 
        lineHeight: 22 
    },
};

const appTheme = { COLORS, SIZES, FONTS };

export default appTheme;
