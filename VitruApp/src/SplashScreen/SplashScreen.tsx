import React, { useEffect, useRef } from 'react'
import { Animated, Dimensions, View } from "react-native";
import { splash } from '../../assets';
import DynamicGallery from '../DynamicGallery/DynamicGallery';
import { BackGroundColor, LogoDimension, LogoFontSize, VerticalPaddingSize, LogoFont, TextColor } from '../globalStyles.js'

export default function SplashScreen() {
    // Animation Values....
    const startAnimation = useRef(new Animated.Value(0)).current;
    // Scaling Down Both logo and Title...
    const scaleLogo = useRef(new Animated.Value(1)).current;
    const scaleTitle = useRef(new Animated.Value(1)).current;

    // Offset Animation....
    const moveLogo = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
    const moveTitle = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;

    // Animating COntent...
    const contentTransition = useRef(new Animated.Value(Dimensions.get('window').height)).current;

    // Animation Done....
    useEffect(() => {
        // Starting Animation after 500ms....
        setTimeout(() => {
            // Parallel Animation...
            Animated.parallel([
                Animated.timing(
                    startAnimation,
                    {
                        // For same Height for non safe Area Devices...
                        toValue: -Dimensions.get('window').height,
                        useNativeDriver: true
                    }
                ),
                Animated.timing(
                    scaleLogo,
                    {
                        // Scaling to 0.35
                        toValue: 0,
                        useNativeDriver: true
                    }
                ),
                Animated.timing(
                    scaleTitle,
                    {
                        // Scaling to 0.8
                        toValue: 0,
                        useNativeDriver: true
                    }
                ),
                Animated.timing(
                    moveLogo,
                    {
                    // Moving to Right Most...
                    toValue: {
                            x: 0,
                            // Since image size is 100...
                            y: (Dimensions.get('window').height / 2) - 90
                        },
                        useNativeDriver: true
                    }
                ),
                Animated.timing(
                    moveTitle,
                    {
                    // Moving to Right Most...
                    toValue: {
                            x: 0,
                            // Since image size is 100...
                            y: (Dimensions.get('window').height / 2) - 90
                        },
                        useNativeDriver: true
                    }
                ),
                Animated.timing(
                    contentTransition,
                        {
                            toValue: 0,
                            useNativeDriver: true
                        }
                    )
                ])
                .start();

            }, 3000);
    }, [])

    // Going to Move Up like Nav Bar...
    return (
            <View style={{
                position: 'absolute',
                top: 0,
                bottom: 0,
                left: 0,
                right: 0,
            }}>
                <Animated.View style={{
                    flex: 1,
                    backgroundColor: BackGroundColor,
                    zIndex: 1,
                    transform: [
                        { translateY: startAnimation }
                    ]
                }}>

                    <Animated.View style={{
                        flex: 1,
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}>
                        <Animated.Image source={splash} style={{
                            width: LogoDimension,
                            height: LogoDimension,
                            transform: [
                                { translateX: moveLogo.x },
                                { translateY: moveLogo.y },
                                { scale: scaleLogo },

                            ]
                        }}></Animated.Image>
                        <Animated.Text style={{
                        width: LogoDimension,
                        flex: 1,
                        height: LogoFontSize,
                        fontFamily: LogoFont,
                        fontSize: LogoFontSize,
                        color: TextColor,
                        textAlign: 'center',
                        position: 'absolute',
                        bottom: VerticalPaddingSize + LogoFontSize,
                        transform: [
                            { translateX: moveLogo.x },
                            { translateY: moveLogo.y },
                            { scale: scaleLogo },

                        ]
                    }}>V        I        T        R        U</Animated.Text> 
                    </Animated.View>

                </Animated.View>

                <Animated.View style={{
                    position: 'absolute',
                    top: 0,
                    bottom: 0,
                    left: 0,
                    right: 0,
                    backgroundColor: "#1A0F01",
                    zIndex: 0,
                    transform: [
                        { translateY: contentTransition }
                    ]
                }}>
                    <View style={{ flex: 1 }}>
                        <DynamicGallery />
                    </View>

                </Animated.View>

            </View>
    );
}