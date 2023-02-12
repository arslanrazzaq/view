import React, { useContext, useState, useEffect } from 'react';
import {
    View,
    Text,
    Platform,
    ScrollView,
    SafeAreaView,
    TouchableOpacity,
    Modal,
    FlatList,
    TouchableWithoutFeedback,
    TextInput,
    Dimensions
} from 'react-native';
import { COLORS, SIZES, FONTS, icons } from '../../constants';
import { Header, IconButton } from '../../components';
import { launchImageLibrary } from 'react-native-image-picker';
import { AuthContext } from '../../Context/authContext';
import Icon from 'react-native-vector-icons/AntDesign';
import FastImage from 'react-native-fast-image';
import mime from "mime";
import ImagePicker from 'react-native-image-crop-picker';

const DailyContestChoosePhotos = ({ navigation, route }) => {

    const { userInfo } = useContext(AuthContext);

    const [photo, setPhoto] = useState([]);
    const [photo2, setPhoto2] = useState([]);
    const [photo3, setPhoto3] = useState([]);
    const [photo4, setPhoto4] = useState([]);
    const [photo5, setPhoto5] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [commonError, setCommonError] = useState("");
    const [selectedPhotoChoice, setSelectedPhotoChoice] = useState(null);

    useEffect(() => {
        if (route.params && route.params.data && route.params.data.photo) {
            if (route.params.data.photo.length >= 1) {
                setPhoto([route.params.data.photo[0]]);
            }
            if (route.params.data.photo.length >= 2) {
                setPhoto2([route.params.data.photo[1]]);
            }
            if (route.params.data.photo.length >= 3) {
                setPhoto3([route.params.data.photo[2]]);
            }
            if (route.params.data.photo.length >= 4) {
                setPhoto4([route.params.data.photo[3]]);
            }
            if (route.params.data.photo.length >= 5) {
                setPhoto5([route.params.data.photo[4]]);
            }
        }
    }, []);

    
    const handleChoosePhoto = async () => {
        ImagePicker.openPicker({
            width: 830,
            height: 1130,
            writeTempFile: false,
            cropping: true
        }).then(image => {
            setModalVisible(false);
            let check = (image.size / 1048576).toFixed(2);
            if (check > 20) {
                setCommonError(`Your photo size can't exceed 20MB`);
            } else {
                setPhoto([image]);
            }
        }).catch(error => {
            setModalVisible(false);
            console.log(`Error occurs while opening croper`);
        });
    };

    const handleChoosePhoto2 = async () => {
        ImagePicker.openPicker({
            width: 830,
            height: 1130,
            writeTempFile: false,
            cropping: true
        }).then(image => {
            setModalVisible(false);
            let check = (image.size / 1048576).toFixed(2);
            if (check > 20) {
                setCommonError(`Your photo size can't exceed 20MB`);
            } else {
                setPhoto2([image]);
            }
        }).catch(error => {
            setModalVisible(false);
            console.log(`Error occurs while opening croper`);
        });
    };

    const handleChoosePhoto3 = async () => {
        ImagePicker.openPicker({
            width: 830,
            height: 1130,
            writeTempFile: false,
            cropping: true
        }).then(image => {
            setModalVisible(false);
            let check = (image.size / 1048576).toFixed(2);
            if (check > 20) {
                setCommonError(`Your photo size can't exceed 20MB`);
            } else {
                setPhoto3([image]);
            }
        }).catch(error => {
            setModalVisible(false);
            console.log(`Error occurs while opening croper`);
        });
    };

    const handleChoosePhoto4 = async () => {
        ImagePicker.openPicker({
            width: 830,
            height: 1130,
            writeTempFile: false,
            cropping: true
        }).then(image => {
            setModalVisible(false);
            let check = (image.size / 1048576).toFixed(2);
            if (check > 20) {
                setCommonError(`Your photo size can't exceed 20MB`);
            } else {
                setPhoto4([image]);
            }
        }).catch(error => {
            setModalVisible(false);
            console.log(`Error occurs while opening croper`);
        });
    };

    const handleChoosePhoto5 = async () => {
        ImagePicker.openPicker({
            width: 830,
            height: 1130,
            writeTempFile: false,
            cropping: true
        }).then(image => {
            setModalVisible(false);
            let check = (image.size / 1048576).toFixed(2);
            if (check > 20) {
                setCommonError(`Your photo size can't exceed 20MB`);
            } else {
                setPhoto5([image]);
            }
        }).catch(error => {
            setModalVisible(false);
            console.log(`Error occurs while opening croper`);
        });
    };

    const handleUploadPhoto = () => {
        setCommonError("");
        let photoToSend = [];
        if (photo.length) {
            photoToSend.push(photo[0]);
        }
        if (photo2.length) {
            photoToSend.push(photo2[0]);
        }
        if (photo3.length) {
            photoToSend.push(photo3[0]);
        }
        if (photo4.length) {
            photoToSend.push(photo4[0]);
        }
        if (photo5.length) {
            photoToSend.push(photo5[0]);
        }

        let data = { ...route.params?.data, photo: photoToSend };
        navigation.push('DailyContestStep1', { data: data });
    };

    const handleUploadPhotoBack = () => {
        setCommonError("");
        let data = { ...route.params?.data };
        navigation.push('DailyContestStep1', { data: data });
    };

    function renderHeader() {
        return (
            <Header
                title="Choose My Photos"
                containerStyle={{
                    height: 50,
                    marginHorizontal: SIZES.base,
                    marginTop: 0,
                }}
                leftComponent={
                    <IconButton
                        icon={icons.back}
                        containerStyle={{
                            width: 50,
                            height: 40,
                            justifyContent: 'center',
                            alignItems: 'center',
                            borderWidth: 1,
                            borderRadius: SIZES.radius,
                            borderColor: COLORS.gray2
                        }}
                        iconStyle={{
                            width: 30,
                            height: 20,
                            tintColor: COLORS.gray,
                        }}
                        onPress={() => handleUploadPhotoBack()}
                    />
                }
                rightComponent={
                    <TouchableOpacity
                        style={{
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: SIZES.radius,
                        }}
                        onPress={() => handleUploadPhoto()}
                        //disabled={isEnabledSignIn() ? false : true}
                    >
                        <View
                            style={{
                                alignItems: "center",
                                justifyContent: 'center',
                                width: 60,
                                height: 40,
                                borderRadius: SIZES.radius,
                                backgroundColor: COLORS.blue
                            }}
                        >
                            <Text
                                style={{
                                    borderRadius: SIZES.radius,
                                    ...FONTS.body4,
                                    fontSize: 17,
                                    color: COLORS.white,
                                }}
                            >
                               Save
                            </Text>
                        </View>
                    </TouchableOpacity> 
                }
            />
        )
    }


    const handleSelectedChoice = (selectedValue) => {
        if (selectedValue == 'Cancel') {
            setSelectedPhotoChoice(null);
            setModalVisible(false);
        } else if (selectedValue == 'Delete') {
            if (selectedPhotoChoice == 1) {
                setPhoto([]);
                setModalVisible(false);
            } else if (selectedPhotoChoice == 2) {
                setPhoto2([]);
                setModalVisible(false);
            } else if (selectedPhotoChoice == 3) {
                setPhoto3([]);
                setModalVisible(false);
            } else if (selectedPhotoChoice == 4) {
                setPhoto4([]);
                setModalVisible(false);
            } else if (selectedPhotoChoice == 5) {
                setPhoto5([]);
                setModalVisible(false);
            }
        } else if (selectedValue == 'Change') {
            if (selectedPhotoChoice == 1) {
                handleChoosePhoto();
            } else if (selectedPhotoChoice == 2) {
                handleChoosePhoto2();
            } else if (selectedPhotoChoice == 3) {
                handleChoosePhoto3();
            } else if (selectedPhotoChoice == 4) {
                handleChoosePhoto4();
            } else if (selectedPhotoChoice == 5) {
                handleChoosePhoto5();
            }
        }
        setSelectedPhotoChoice(null);
    }

    const handleSelectedPhoto = (val) => {
        setSelectedPhotoChoice(val);
        setModalVisible(true);
    }

    const renderItem = ({ item }) => {
        return (
            <TouchableOpacity
                style={{
                    padding: SIZES.radius,
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
                onPress={() => {
                    handleSelectedChoice(item.value);
                }}
            >
                <Text 
                    style={{
                        ...FONTS.body3
                    }}
                >
                    {item.label}
                </Text>
            </TouchableOpacity>
        )
    }

    const renderChoiceModal = () => {
        return (
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
            >
                <TouchableWithoutFeedback
                    onPress={() => setModalVisible(false)}
                >
                    <View
                        style={{
                            flex: 1,
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor:  'rgba(0,0,0,0.5)'
                        }}
                    >
                        <View
                            style={{
                                // height: 400,
                                width: SIZES.width * 0.8,
                                backgroundColor: COLORS.white,
                                borderRadius: SIZES.radius
                            }}
                        >
                            <FlatList 
                                data={[
                                    { label: 'Change', value: 'Change' },
                                    { label: 'Delete', value: 'Delete' },
                                    { label: 'Cancel', value: 'Cancel' },
                                ]}
                                renderItem={renderItem}
                                keyExtractor={x => `${x.value}`}
                                showsVerticalScrollIndicator={false}
                                style={{
                                    padding: SIZES.radius,
                                    marginBottom: SIZES.radius
                                }}
                            />
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
        )
    }

    return (
        <View
            style={{
                flex: 1,
                backgroundColor: COLORS.white
            }}
        >
            <SafeAreaView style={{ backgroundColor: COLORS.white }}>
                {renderHeader()}
            </SafeAreaView>
            {renderChoiceModal()}
            <View
                style={{
                    marginHorizontal: SIZES.padding,
                    marginTop: SIZES.radius,
                    borderRadius: SIZES.radius,
                    flex: 1
                }}
            >
                <ScrollView
                    style={{
                        flexGrow: 1,
                    }}
                >
                    <View
                        style={{
                            marginTop: SIZES.radius
                        }}
                    >
                        {commonError ? <Text
                            style={{
                                color: COLORS.red,
                                ...FONTS.h3,
                                textAlign: 'center'
                            }}
                        >
                            {commonError}
                        </Text> : null
                        }
                    </View>
                    <View
                        style={{
                            flex: 1,
                            flexDirection: 'row',
                            marginTop: SIZES.padding
                        }}
                    >
                        <TouchableOpacity
                            style={{
                                flex: 1,
                                backgroundColor: COLORS.lightGray2,
                                borderRadius: SIZES.radius,
                                height: 250,
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginRight: SIZES.base
                            }}
                            onPress={() => { if (photo.length <= 0) { handleChoosePhoto(); } else { handleSelectedPhoto(1); } }}
                        >
                            {
                                photo.length <= 0 ?
                                    <Icon name={'plus'} size={34} color={COLORS.black} />
                                    :
                                    <FastImage
                                        style={{ height: 250, width: '100%', borderRadius: SIZES.radius }}
                                        source={{
                                            priority: FastImage.priority.high,
                                            uri: photo[0].path
                                        }}
                                        resizeMode={FastImage.resizeMode.contain}
                                    />
                            }
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={{
                                flex: 1,
                                backgroundColor: COLORS.lightGray2,
                                borderRadius: SIZES.radius,
                                height: 200,
                                alignItems: 'center',
                                justifyContent: 'center',
                                alignSelf: 'flex-end',
                                marginLeft: SIZES.base
                            }}
                            onPress={() => { if (photo2.length <= 0) { handleChoosePhoto2(); } else { handleSelectedPhoto(2) } }}
                        >
                            {
                                photo2.length <= 0 ?
                                    <Icon name={'plus'} size={30} color={COLORS.black} />
                                    :
                                    <FastImage
                                        style={{ height: 200, width: '100%', borderRadius: SIZES.radius }}
                                        source={{
                                            priority: FastImage.priority.high,
                                            uri: photo2[0].path
                                        }}
                                        resizeMode={FastImage.resizeMode.contain}
                                    />
                            }
                        </TouchableOpacity>
                    </View>
                    <View
                        style={{
                            flex: 1,
                            flexDirection: 'row',
                            marginTop: SIZES.padding
                        }}
                    >
                        <TouchableOpacity
                            style={{
                                flex: 1,
                                backgroundColor: COLORS.lightGray2,
                                borderRadius: SIZES.radius,
                                height: 200,
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                            onPress={() => { if (photo3.length <= 0) { handleChoosePhoto3(); } else { handleSelectedPhoto(3) }}}
                        >
                            {
                                photo3.length <= 0 ?
                                    <Icon name={'plus'} size={24} color={COLORS.black} />
                                    :
                                    <FastImage
                                        style={{ height: 200, width: '100%', borderRadius: SIZES.radius }}
                                        source={{
                                            priority: FastImage.priority.high,
                                            uri: photo3[0].path
                                        }}
                                        resizeMode={FastImage.resizeMode.contain}
                                    />
                            }
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={{
                                flex: 1,
                                backgroundColor: COLORS.lightGray2,
                                borderRadius: SIZES.radius,
                                height: 200,
                                alignItems: 'center',
                                justifyContent: 'center',
                                alignSelf: 'flex-end',
                                marginLeft: SIZES.base,
                                marginRight: SIZES.base
                            }}
                            onPress={() => { if (photo4.length <= 0) { handleChoosePhoto4(); } else { handleSelectedPhoto(4) }}}
                        >
                            {
                                photo4.length <= 0 ?
                                    <Icon name={'plus'} size={24} color={COLORS.black} />
                                    :
                                    <FastImage
                                        style={{ height: 200, width: '100%', borderRadius: SIZES.radius }}
                                        source={{
                                            priority: FastImage.priority.high,
                                            uri: photo4[0].path
                                        }}
                                        resizeMode={FastImage.resizeMode.contain}
                                    />
                            }
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={{
                                flex: 1,
                                backgroundColor: COLORS.lightGray2,
                                borderRadius: SIZES.radius,
                                height: 200,
                                alignItems: 'center',
                                justifyContent: 'center',
                                alignSelf: 'flex-end'
                            }}
                            onPress={() => { if (photo5.length <= 0) { handleChoosePhoto5(); } else { handleSelectedPhoto(5) }}}
                        >
                            {
                                photo5.length <= 0 ?
                                    <Icon name={'plus'} size={24} color={COLORS.black} />
                                    :
                                    <FastImage
                                        style={{ height: 200, width: '100%', borderRadius: SIZES.radius }}
                                        source={{
                                            priority: FastImage.priority.high,
                                            uri: photo5[0].path
                                        }}
                                        resizeMode={FastImage.resizeMode.contain}
                                    />
                            }
                        </TouchableOpacity>
                    </View>
                    <View style={{ height: 50 }} />
                </ScrollView>
            </View>
        </View>
    )
}

export default DailyContestChoosePhotos