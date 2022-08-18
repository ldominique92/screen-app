import React from 'react';
import { View, Text } from 'react-native';
import { LogoDimension, LogoFontSize, TextColor, LogoFont } from '../globalStyles.js';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const Header = () => {
    const edges = useSafeAreaInsets();

    return <View>
                <Text style={{
                        width: LogoDimension,
                        flex: 1,
                        height: LogoFontSize * 2,
                        marginTop: LogoFontSize  + edges.top,
                        marginBottom: LogoFontSize,
                        fontFamily: LogoFont,
                        fontSize: LogoFontSize,
                        color: TextColor,
                        marginLeft: LogoFontSize,
                        paddingLeft: LogoFontSize * 0.20
                    }}>V        I       T        R        U</Text>
            </View>;
};

export default Header;