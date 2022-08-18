import React, { useEffect, useState } from 'react';
import {
    View,
    FlatList,
    StyleSheet,
    Image,
    TouchableHighlight,
    Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
    BackGroundColor,
    HorizontalPaddingSize,
    VerticalPaddingSize,
    ImageSize,
    Landscape,
    ControlBar
} from '../globalStyles.js';
import StaticGallery from '../StaticGallery/StaticGallery';
import { videoDefaultThumb, playAllImages } from './images';
import axios from 'axios';
import ImageArtwork from './Image';
import VideoArtWork from './Video';
import { getWalletAddressFromLocalStorage, saveWalletAddressOnLocalStorage } from '../Storage/wallet';
import Loading from '../Loading/Loading';
import AddNewImage from './AddNewImage';
import Error from '../Error/Error';
import Header from './Header';

interface MediaItem {
    key: string,
    imageURL: string | undefined,
    video: string | undefined,
    thumb: string
}

const DynamicGallery = () => {
    console.log("render");
    const [galleryItems, setGalleryItems] = useState<MediaItem[]>([]);
    const [carrousellItems, setCarrousellItems] = useState<string[]>([]);
    const [viewName, setviewName] = useState<string | undefined>();
    const [currentImage, setCurrentImage] = useState<MediaItem | undefined>(undefined);
    const [currentVideo, setcurrentVideo] = useState<MediaItem | undefined>(undefined);
    const edges = useSafeAreaInsets();

    const apiKey = "lSHAClf-5A5mj37BJ82gVdRMHiXbX7LC";
    const baseURL = `https://eth-mainnet.alchemyapi.io/nft/v2/${apiKey}/getNFTs/`;

    const loadWallet = async (walletAddress: string | null | undefined) => {
        setviewName("loading");

        walletAddress = walletAddress?.trim();

        const carrousell: string[] = [];
        const gallery: MediaItem[] = [];

        // walletAddress = "0xfae46f94ee7b2acb497cecaff6cff17f621c693d"; 
        if (walletAddress) {
            var config = {
                method: 'get',
                url: `${baseURL}?owner=${walletAddress}`
            };

            try {
                const response = await axios(config);
                for (let index = 0; index < response.data.ownedNfts.length; index++) {
                    const nft = response.data.ownedNfts[index];

                    if (nft && nft.media && nft.media[0] && nft.media[0].gateway) {
                        var thumb = nft.media[0].thumbnail;
                        if (!thumb) {
                            thumb = nft.media[0].gateway;
                        }

                        try {
                            const content = await axios(
                                {
                                    method: 'get',
                                    url: nft.media[0].gateway,
                                    timeout: 5000
                                });

                            const contentType = content.headers["content-type"];

                            // TODO: json
                            // TODO: pagination

                            if (contentType.indexOf("video") >= 0) {
                                gallery.push({
                                    key: nft.id.tokenId,
                                    imageURL: undefined,
                                    video: nft.media[0].gateway,
                                    thumb: nft.media[0].thumbnail
                                });

                            } else if (contentType.indexOf("image") >= 0) {
                                gallery.push({
                                    key: nft.id.tokenId,
                                    imageURL: nft.media[0].gateway,
                                    video: undefined,
                                    thumb: thumb
                                });

                                carrousell.push(nft.media[0].gateway);
                            }
                        } catch (e) {
                            gallery.push({
                                key: nft.id.tokenId,
                                imageURL: nft.media[0].gateway,
                                video: undefined,
                                thumb: thumb
                            });

                            carrousell.push(nft.media[0].gateway);
                        };
                    }
                }

                saveWalletAddressOnLocalStorage(walletAddress);
            } catch (e) {
                setviewName("error");
            };
        }

        setGalleryItems(gallery);
        setCarrousellItems(carrousell);

        setviewName("gallery");
    };

    const imageStyle = [styles.image, { width: ImageSize, height: ImageSize }];

    useEffect(() => {
        getWalletAddressFromLocalStorage().then((address) => {
            if (address) {
                loadWallet(address);
            } else {
                setviewName(undefined);
            }
        });
    }, []);

    switch (viewName) {
        case "error":
            return <Error></Error>

        case "loading":
            return <Loading />;

        case "gallery":
            return <View style={{
                display: viewName == "gallery" && galleryItems ? 'flex' : 'none',
                backgroundColor: BackGroundColor,
                zIndex: 1,
                flex: 1,
                flexDirection: 'column'
            }}>
                <Header></Header>
                <FlatList
                    data={galleryItems}
                    renderItem={({ item }) => {
                        if (item.imageURL) {
                            return (
                                <TouchableHighlight
                                    activeOpacity={0.6}
                                    onPress={() => {
                                        setviewName("image");
                                        setCurrentImage(item);
                                    }}>
                                    <Image style={imageStyle} source={{ uri: item.thumb }} />
                                </TouchableHighlight>
                            );
                        } else {
                            return (
                                <TouchableHighlight
                                    activeOpacity={0.6}
                                    onPress={() => {
                                        console.log(item);
                                        setcurrentVideo(item);
                                        setviewName("video");
                                    }}>
                                    <Image style={imageStyle} source={item.thumb ? { uri: item.thumb } : videoDefaultThumb} />
                                </TouchableHighlight>);
                        }
                    }}
                    style={{
                        marginBottom: VerticalPaddingSize * 4 + edges.bottom,
                        display: 'flex',
                        paddingLeft: HorizontalPaddingSize,
                    }}
                    numColumns={Landscape ? 5 : 3}
                />
                <View style={ControlBar.bar} >
                    <TouchableHighlight onPress={() => setviewName("slideshow")}>
                        <Image source={playAllImages} style={ControlBar.button}></Image>
                    </TouchableHighlight>
                </View>
            </View>;

        case "slideshow":
            return <StaticGallery media={carrousellItems} backFunction={() => setviewName("gallery")}></StaticGallery>;

        case "image":
            return <ImageArtwork imageURL={currentImage?.imageURL} backFunction={() => setviewName("gallery")}></ImageArtwork>;

        case "video":
            return <VideoArtWork videoURL={currentVideo?.video} backFunction={() => setviewName("gallery")}></VideoArtWork>;

        default:
            return <AddNewImage backFunction={(wallet: string | undefined) => {
                setviewName("gallery");
                if (wallet) {
                    loadWallet(wallet);
                }
            }
            }></AddNewImage>;
    }
};

export default DynamicGallery;

const styles = StyleSheet.create({
    image: {
        marginRight: HorizontalPaddingSize,
        marginBottom: HorizontalPaddingSize,
        borderRadius: Dimensions.get('window').width * 0.006
    },
    addWallet: {
        marginRight: HorizontalPaddingSize,
        marginBottom: HorizontalPaddingSize,
        display: "flex",
        alignItems: "center",
        borderRadius: Dimensions.get('window').width * 0.006
    }
});