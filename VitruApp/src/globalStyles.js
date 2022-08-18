import { Dimensions, StyleSheet } from "react-native";

export const BackGroundColor = "#000000";

// Logo dimension
export const Landscape = Dimensions.get('window').height < Dimensions.get('window').width ? true : false;
export const LogoFont = 'Remachine-Script';
export const LogoDimension = Landscape ? Dimensions.get('window').height : Dimensions.get('window').width;
export const LogoFontSize = LogoDimension / 20;
export const TextColor = "#FFFFFF";
export const TextFont = 'Roboto-Light';
export const ButtonFont = 'Roboto-Light';
export const HorizontalPaddingSize = Dimensions.get('window').width * 0.025;
export const VerticalPaddingSize = Dimensions.get('window').height / 50;
export const ThumbNailWidth = Landscape ? (Dimensions.get('window').width / 50) : (Dimensions.get('window').height / 50);
export const ImageSize = Landscape ? Dimensions.get('window').height * 0.3 : Dimensions.get('window').width * 0.3;
export const TexrFontSize = LogoFontSize * 0.75;
export const TextFontBold = 'Roboto-Medium';


export const ControlBar = StyleSheet.create({
    bar: { 
        flex: 1, 
        backgroundColor: '#000000', 
        position: 'absolute', 
        bottom: 0, 
        height: Dimensions.get('window').height * 0.06, 
        width: Dimensions.get('window').width,
        opacity: 0.8,
        padding: Dimensions.get('window').height * 0.01,
        flexDirection: "row", 
    },
    button: { 
        width: Dimensions.get('window').height * 0.045, 
        height: Dimensions.get('window').height * 0.045,
        marginRight: Dimensions.get('window').width * 0.5 - (Dimensions.get('window').height * 0.06)
    },
    playPauseButton: {
        width: Dimensions.get('window').height * 0.03, 
        height: Dimensions.get('window').height * 0.03,   
    }
  });