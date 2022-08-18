import React from 'react'
import { Text, View } from "react-native";
import { BackGroundColor, TextFont, TextColor, TexrFontSize, TextFontBold} from '../globalStyles.js'

export default function Error() {
    return (
            <View style={{
                position: 'absolute',
                top: 0,
                bottom: 0,
                left: 0,
                right: 0,
            }}>
                <View style={{
                    flex: 1,
                    backgroundColor: BackGroundColor,
                    zIndex: 1,
                }}>

                    <View style={{
                        flex: 1,
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}>
                        <Text style={{
                            fontFamily: TextFontBold,
                            fontSize: TexrFontSize,
                            color: TextColor,
                            textAlign: 'center',
                        }}>
                            OOPS! SOMETHING WENT WRONG...
                            {'\n'}
                            {'\n'}
                        </Text>
                        <Text style={{
                            fontFamily: TextFont,
                            fontWeight: '400',
                            fontSize: TexrFontSize,
                            color: TextColor,
                            textAlign: 'center',
                        }}>
                            Please reload the app and try again.
                            {'\n'}
                            Or go to www.vitru.io/support
                        </Text>
                    </View>
                </View>
            </View>
    );
}