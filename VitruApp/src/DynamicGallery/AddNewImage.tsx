import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Modal, TouchableOpacity, Dimensions, Image, StyleSheet } from 'react-native';
import { BackGroundColor, LogoDimension, LogoFontSize, TextColor, TextFont, LogoFont, HorizontalPaddingSize, ButtonFont, TexrFontSize } from '../globalStyles.js'
import QRCode from 'react-native-qrcode-svg';
import { ensureScreenRegistered, requestAuthToken } from './functions';
import Constants from 'expo-constants';
import Error from '../Error/Error';
import * as Notifications from 'expo-notifications';
import { closeModal } from './images';
import Loading from '../Loading/Loading';
import Header from './Header';

Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
    }),
  });

interface AddNewImageProps {
    backFunction: Function,
}

const AddNewImage = ({ backFunction }: AddNewImageProps) => {
    const [uploadImageUrl, setUploadImageUrl] = useState<string | undefined>();
    const [visibleModal, setVisibleModal] = useState<boolean>(false);
    const [walletAddress, setWalletAddress] = useState<string | undefined>();
    const [showErrorScreen, setShowErrorScreen] = useState<boolean>(false);
    const [timerText, setTimerText] = useState<string>("05:00");
    const notificationListener = useRef();
    const responseListener = useRef();

    const updateTimer = async (timerInSeconds: number, screenID: string) => {
        if (timerInSeconds >= 0) {

            var minutes = Math.floor(timerInSeconds / 60000);
            var seconds = (timerInSeconds % 60000) / 1000;
            setTimerText(minutes + ":" + (seconds < 10 ? '0' : '') + seconds.toFixed(0));


            setTimeout(function () {
                updateTimer(timerInSeconds - 1000, screenID)
            }, 1000);
        } else {
            refreshQRCode(screenID);
        }
    };

    const refreshQRCode = (screenID: string) => {
        requestAuthToken(screenID).then(responseToken => {
            if (responseToken.success) {
                const addScreensEndpoint = `${Constants.manifest?.extra?.webApp?.url}?session_token=${responseToken.sessionToken}`;
                setUploadImageUrl(addScreensEndpoint);
                updateTimer(299000, screenID);
                setShowErrorScreen(false);
            } else {
                setShowErrorScreen(true);
            }
        });
    };

    useEffect(() => {
        ensureScreenRegistered().then(screenID => {
            if (screenID) {
                refreshQRCode(screenID);
            } else {
                setShowErrorScreen(true);
            }
        });

        // This listener is fired whenever a notification is received while the app is foregrounded
        notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
            var notificationWalletAddress = undefined;

            if (typeof notification.request.content.data["wallet_address"] == "string") 
            {
                notificationWalletAddress =  notification.request.content.data["wallet_address"];
            }
            
            if (notificationWalletAddress) {
                setWalletAddress(notificationWalletAddress);
                setVisibleModal(true);
            }
        });

        // This listener is fired whenever a user taps on or interacts with a notification (works when app is foregrounded, backgrounded, or killed)
        responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
            console.log(response);
        });

        return () => {
            Notifications.removeNotificationSubscription(notificationListener.current);
            Notifications.removeNotificationSubscription(responseListener.current);
        };

    }, []);

    if (showErrorScreen) {
        return <Error></Error>
    }

    if (uploadImageUrl) {
        return <View style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            display: 'flex'
        }}>
            <View style={{
                flex: 1,
                backgroundColor: BackGroundColor,
                zIndex: 1
            }}>
                <Header></Header>
                <View style={{
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'center',
                }}>
                    <Text style={{
                        marginBottom: TexrFontSize * 2,
                        fontFamily: TextFont,
                        fontSize: TexrFontSize,
                        color: TextColor,
                        textAlign: 'center',
                    }}>Scan the QR-code with your mobile device.</Text>
                    <View style={{
                        backgroundColor: '#FFFFFF',
                        padding: 20
                    }}>
                        <QRCode value={uploadImageUrl} size={LogoDimension / 2.5} />
                    </View>
                    <Text style={{
                        marginTop: TexrFontSize * 2,
                        fontFamily: TextFont,
                        fontSize: LogoFontSize,
                        color: TextColor,
                        textAlign: 'center',
                    }}>{timerText}</Text>
                </View>
            </View>
            <Modal visible={visibleModal} transparent={true}>
                <View style={styles.modalOverlay}></View>
                <View style={styles.modalContent}>
                    <TouchableOpacity onPress={() => setVisibleModal(false)} style={{
                        position: 'absolute',
                        right: Dimensions.get('window').height * 0.02,
                        top: Dimensions.get('window').height * 0.02
                    }
                    }>
                        <View style={styles.closeModalButton}>
                            <Image source={closeModal} style={styles.closeModalButton} ></Image>
                        </View>
                    </TouchableOpacity>
                    <Text style={styles.modalText}> Do you want to cast the NFTs from {walletAddress} </Text>
                    <View style={{ display: 'flex', flexDirection: 'row' }}>
                        <TouchableOpacity onPress={() => {
                            setVisibleModal(false);
                            backFunction(walletAddress);
                        }}>
                            <View style={styles.modalButton}>
                                <Text style={styles.modalButtonText}>CONFIRM</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => setVisibleModal(false)}>
                            <View style={styles.modalButton}>
                                <Text style={styles.modalButtonText}>CANCEL</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    } else {
        return <Loading />;
    }
};

export default AddNewImage;

const styles = StyleSheet.create({
    modalContent: {
        backgroundColor: BackGroundColor,
        paddingHorizontal: HorizontalPaddingSize,
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: 'rgba(0, 0, 0, 0.1)',
        opacity: 1,
        width: Dimensions.get('window').width * 0.8,
        height: Dimensions.get('window').width * 0.6,
        position: 'absolute',
        top: Dimensions.get('window').height * 0.3,
        left: Dimensions.get('window').width * 0.1,
        borderRadius: Dimensions.get('window').width * 0.006
    },
    modalButton: {
        backgroundColor: '#6015FF',
        color: '#FFF5DD',
        borderRadius: Dimensions.get('window').width * 0.006,
        height: Dimensions.get('window').width * 0.09,
        width: Dimensions.get('window').width * 0.2,
        display: 'flex',
        alignContent: 'center',
        textAlign: 'center',
        justifyContent: 'center',
        marginHorizontal: Dimensions.get('window').width * 0.05
    },
    modalButtonText: {
        color: '#FFF5DD',
        fontSize: LogoFontSize * 0.8,
        fontFamily: ButtonFont,
        textAlign: 'center',
    },
    modalText: {
        width: Dimensions.get('window').width * 0.6,
        fontSize: LogoFontSize * 0.8,
        color: '#FFF6DF',
        marginTop: Dimensions.get('window').width * 0.05,
        marginBottom: Dimensions.get('window').width * 0.15,
        fontFamily: TextFont,
        paddingHorizontal: Dimensions.get('window').width * 0.05
    },
    closeModalButton: {
        width: Dimensions.get('window').width * 0.02,
        height: Dimensions.get('window').width * 0.02
    },
    modalOverlay: {
        backgroundColor: '#AEB6FF',
        opacity: 0.5,
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height
    }
});