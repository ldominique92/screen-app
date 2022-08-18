import React from 'react'
import { Image, Text, View } from "react-native";
import { loading } from '../../assets';
import { BackGroundColor, LogoDimension, LogoFontSize, TextFont } from '../globalStyles.js'

export default function Loading() {
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
                        <Image source={loading} style={{
                            width: LogoDimension * 0.1,
                            height: LogoDimension * 0.1,
                        }}></Image>
                        <Text style={{
                            width: LogoDimension,
                            fontFamily: TextFont,
                            fontSize: LogoFontSize * 0.5,
                            marginTop: LogoFontSize,
                            color: '#FFF9F3',
                            textAlign: 'center',
                        }}>L        O        A        D        I        N       G</Text>
                    
                    </View>

                </View>
            </View>
    );
}