import React, { useState, useContext, useEffect, useRef } from 'react';
import {
    View,
    Text,
    ActivityIndicator,
    TouchableWithoutFeedback,
    SafeAreaView,
    Dimensions,
    TouchableOpacity,
    FlatList
} from 'react-native';
import { FONTS, COLORS, SIZES, icons } from '../../constants';
import { PostCard, TextButton, Header, IconButton, TextIconButton, FormPicker } from '../../components';
import Icon from 'react-native-vector-icons/AntDesign';
import IconF from 'react-native-vector-icons/Feather';
import axios from 'axios';
import moment from 'moment';
import { BASE_URL_API } from '../../config';
import FastImage from 'react-native-fast-image';
import { FlashList } from '@shopify/flash-list';
import { AuthContext } from '../../Context/authContext';
import ImageView from "react-native-image-viewing";


const Asset = ({ navigation, route }) => {

    const [collectionList, setCollectionList] = React.useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [commonError, setCommonError] = useState("");

    const [isLoadingExtra, setIsLoadingExtra] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [count, setCount] = useState(true);

    const [images, setImages] = useState([]);
    const [imagesIndex, setImagesIndex] = useState(0);
    const [visible, setIsVisible] = useState(false);

    const flashListRef = useRef(null);
  
    const { userInfo } = useContext(AuthContext);

    useEffect(() => {
       getNftsUserCollections();
    }, []);
   
    const getNftsUserCollections = async () => {
        setIsLoading(true);
        setCollectionList([]);
        try {
            const response = await axios.get(`${BASE_URL_API}//atomicassets/v1/templates?collection_name=${route?.params?.collection_name}&page=1&limit=${pageSize}&order=desc&sort=created`);
            setIsLoading(false);
            setCollectionList(response.data.data);
            flashListRef.current?.scrollToIndex(0);
            if (response.data.data.length < pageSize) {
                setCount(false);                
            }
        } catch (error) {
            console.log('called err: ', error);
            if (error.response && error.response.status && (error.response.status === 404 || error.response.status === 400 || error.response.status === 401 || error.response.status === 500)) {
                setCommonError(error.response.data.msg);
                setIsLoading(false);
            } else {
                setCommonError('Unknown Error, Try again later');
                setIsLoading(false);
            }
        }
    }

    function renderHeader() {
        return (
            <Header
                title={`${route?.params?.collection_name} Assets`}
                titleStyle={{
                    color: COLORS.black
                }}
                containerStyle={{
                    height: 50,
                    marginTop: 0,
                    alignItems: 'center',
                    paddingHorizontal: SIZES.base,
                    backgroundColor: COLORS.white
                }}
                leftComponent={
                    <IconButton
                        icon={icons.back}
                        containerStyle={{
                            width: 40,
                            height: 40,
                            justifyContent: 'center',
                            alignItems: 'center',
                            borderWidth: 1,
                            borderRadius: SIZES.radius,
                            borderColor: COLORS.black
                        }}
                        iconStyle={{
                            width: 30,
                            height: 20,
                            tintColor: COLORS.black,
                        }}
                        onPress={() => navigation.goBack()}
                    />
                }
                rightComponent={
                    <IconButton
                        containerStyle={{
                            width: 40,
                            height: 40
                        }}
                    />
                }
            />
        )
    }

    const handleImagePress = (val) => {
    
        let imgs = [];
        imgs.push({
            uri: val.startsWith("https://") ? `${val}` : `https://solidcircle.mypinata.cloud/ipfs/${val}`,
        });

        setImages(imgs);
        setIsVisible(true);
        // setImagesIndex(ind);
    }


    return (
        <View
            style={{
                flex: 1,
                backgroundColor: COLORS.white
            }}
        >
            <SafeAreaView>
                {renderHeader()}
            </SafeAreaView>

            <ImageView
                images={images}
                imageIndex={imagesIndex}
                visible={visible}
                onRequestClose={() => setIsVisible(false)}
            />

            <View
                style={{
                    marginVertical: SIZES.base,
                    paddingHorizontal: SIZES.radius,
                    overflow: 'hidden'
                }}
            >
                <TouchableWithoutFeedback
                    onPress={() => handleImagePress(route.params.data.immutable_data.image)}
                >
                    <View
                        style={{
                            alignItems: 'center',
                            overflow: 'hidden',
                            borderRadius: SIZES.radius,
                        }}
                    >
                        <FastImage
                            source={{  
                                uri: route.params.data.immutable_data.image.startsWith("https://") ? `${route.params.data.immutable_data.image}` : `https://solidcircle.mypinata.cloud/ipfs/${route.params.data.immutable_data.image}`,
                                priority: FastImage.priority.high 
                            }}
                            resizeMode={FastImage.resizeMode.contain}
                            style={{
                                height: Dimensions.get('screen').height - 250,
                                width: "100%",
                                aspectRatio: 1,
                                borderRadius: SIZES.radius
                            }}
                        />
                        <TouchableOpacity
                            style={{
                                position: 'absolute',
                                bottom: SIZES.radius,
                                flexDirection: 'row',
                                left: SIZES.radius,
                                zIndex: 3, // works on ios
                                elevation: 3,
                                paddingHorizontal: SIZES.radius,
                                paddingVertical: SIZES.base,
                                borderRadius: SIZES.radius,
                                backgroundColor: '#e8e8e8' 
                            }}
                        >
                            <IconF 
                                name={'video'} 
                                size={32} 
                                color={COLORS.black}
                            />
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={{
                                position: 'absolute',
                                bottom: SIZES.radius,
                                flexDirection: 'row',
                                right: SIZES.radius,
                                zIndex: 3, // works on ios
                                elevation: 3,
                                paddingHorizontal: SIZES.radius,
                                paddingVertical: SIZES.base,
                                borderRadius: SIZES.radius,
                                backgroundColor: '#e8e8e8' 
                            }}
                        >
                            <IconF 
                                name={'music'} 
                                size={32} 
                                color={COLORS.black}
                            />
                        </TouchableOpacity>
                    </View>
                </TouchableWithoutFeedback>
            </View>
            <View
                style={{
                    // flex: 1,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: SIZES.base,
                    backgroundColor: COLORS.lightGray2
                }}
            >   
                <TouchableOpacity
                    style={{
                        paddingHorizontal: SIZES.radius,
                        paddingVertical: SIZES.base,
                    }}
                >
                    <IconF 
                        name={'image'} 
                        size={32} 
                        color={COLORS.black}
                    />
                </TouchableOpacity>
                <TouchableOpacity
                    style={{
                        paddingHorizontal: SIZES.radius,
                        paddingVertical: SIZES.base,
                    }}
                >
                    <IconF 
                        name={'share-2'} 
                        size={32} 
                        color={COLORS.black}
                    />
                </TouchableOpacity>
            </View>
        </View>
    )
}


export default Asset;