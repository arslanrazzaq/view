import React, { useContext, useEffect, useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Platform,
    Dimensions,
    FlatList,
    ActivityIndicator,
    SafeAreaView
} from 'react-native';
import { COLORS, SIZES, FONTS, icons } from '../../constants';
import { IconButton, Header, TextButton, ExpandableView, PostCard } from '../../components';
import axios from 'axios';
import AnimatedLoader from "react-native-animated-loader";
import FastImage from 'react-native-fast-image';
import { BASE_URL } from '../../config';
import { AuthContext } from '../../Context/authContext';
import Icon from 'react-native-vector-icons/AntDesign';
import ImagePicker from 'react-native-image-crop-picker';
import Share from 'react-native-share';
import moment from 'moment';
import EditModal from './EditModal';
import { FlashList } from '@shopify/flash-list';


let selectedUser = null;
let selectedUserHeart = null;

const Profile = ({ navigation, route }) => {

    const [isLoading, setIsLoading] = useState(false);
    const [commonError, setCommonError] = useState("");
    const [description, setDescription] = useState("");
    const [timelineData, setTimelineData] = useState(null);
    const [followers, setFollowers] = useState([]);
    const [following, setFollowing] = useState([]);
    const [heart, setHearts] = useState([]);
    const [timelinePhotos, setTimelinePhotos] = useState([]);
    const { userInfo, login, setIsStatusBarHidden, interstitial } = useContext(AuthContext);
    const [photo, setPhoto] = useState([]);
    const [selectedTab, setSelectedTab] = useState('photo');
    const [username, setUsername] = useState('');
    const [accountDeletedError, setAccountDeletedError] = useState('');

    const [isLoadingPhotos, setIsLoadingPhotos] = useState(false);
    const [isLoadingHearts, setIsLoadingHearts] = useState(false);
    const [countPhotos, setCountPhotos] = useState(0);
    const [currentPagePhotos, setCurrentPagePhotos] = useState(1);
    const [pageSizePhotos, setPageSizePhotos] = useState(6);
    const [countHearts, setCountHearts] = useState(0);
    const [currentPageHearts, setCurrentPageHearts] = useState(1);
    const [pageSizeHearts, setPageSizeHearts] = useState(6);

    const [isLoadingFollowers, setIsLoadingFollowers] = useState(false);
    const [countFollowers, setCountFollowers] = useState(0);
    const [currentPageFollowers, setCurrentPageFollowers] = useState(1);
    const [pageSizeFollowers, setPageSizeFollowers] = useState(10);

    const [isLoadingFollowing, setIsLoadingFollowing] = useState(false);
    const [countFollowing, setCountFollowing] = useState(0);
    const [currentPageFollowing, setCurrentPageFollowing] = useState(1);
    const [pageSizeFollowing, setPageSizeFollowing] = useState(10);


    const [showHeader, setShowHeader] = useState(true);
    const [showFilterModal, setShowFilterModal] = useState(false);

    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        // navigation.addListener('focus', () => {
        //     getUserTimeline();
        // });
        getUserTimeline();
    }, []);


    function renderHeader() {
        return (
            <Header
                title="Profile"
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
                        onPress={() => navigation.goBack()}
                    />
                }
                rightComponent={
                    userInfo?.user?.id != route.params.user_id ?

                        followers.some(elem => elem.follower_id == userInfo?.user?.id) ?
                            <TextButton
                                buttonContainerStyle={{
                                    height: 40,
                                    width: 100,
                                    marginRight: SIZES.base,
                                    borderRadius: SIZES.radius,
                                    backgroundColor: COLORS.blue
                                }}
                                label={'Unfollow'}
                                labelStyle={{
                                    color: COLORS.white
                                }}
                                onPress={handleUnFollow}
                            /> :
                            <TextButton
                                buttonContainerStyle={{
                                    height: 40,
                                    width: 80,
                                    marginRight: SIZES.base,
                                    borderRadius: SIZES.radius,
                                    backgroundColor: COLORS.blue
                                }}
                                label={'Follow'}
                                labelStyle={{
                                    color: COLORS.white
                                }}
                                onPress={handleFollow}
                            />
                        : null
                }
            />
        )
    }

    const getUserTimeline = async () => {
        setCommonError('');
        setIsLoading(true);
        try {
            const response = await axios.get(`${BASE_URL}/user/timeline/${route.params.user_id}`);
            setTimelineData(response.data.data);
            let sortedPhotos = response.data.data.posts;
            sortedPhotos.sort((a,b) => {
                return new Date(b.createdAt) - new Date(a.createdAt);
            });
            setTimelinePhotos(sortedPhotos);
            setDescription(response.data.data.description || "");
            setUsername(response.data.data.username);
            setFollowers(response.data.followers);
            setFollowing(response.data.following);
            setHearts(response.data.heart);

            setCountHearts(response.data.heartCount);
            setCountPhotos(response.data.photosCount);
            setCountFollowers(response.data.countFollowers);
            setCountFollowing(response.data.countFollowing);

            setPageSizeHearts(6);
            setPageSizePhotos(6);
            setCurrentPageHearts(1);
            setCurrentPagePhotos(1);
            setPageSizeFollowers(10);
            setPageSizeFollowing(10);
            setCurrentPageFollowers(1);
            setCurrentPageFollowing(1);

            setIsLoadingFollowers(false);
            setIsLoadingFollowing(false);
            setIsLoadingHearts(false);
            setIsLoadingPhotos(false);
            setIsLoading(false);
        } catch (error) {
            if (error.response && error.response.status && (error.response.status === 404 || error.response.status === 400 || error.response.status === 401 || error.response.status === 500)) {
                if (error.response.status === 401) {
                    setAccountDeletedError(error.response.data.msg);
                } else {
                    setCommonError(error.response.data.msg);
                }
                setIsLoading(false);
            } else {
                setCommonError('Unknown Error, Try again later');
                setIsLoading(false);
            }
        }
    }

    const getExtraPhotos = async (page, current) => {
        setCommonError('');
        setIsLoadingPhotos(true);
        try {
            const response = await axios.get(`${BASE_URL}/timeline/photos/${route.params.user_id}/${page}/${current}`);
            let sortedPhotos = [...timelinePhotos, ...response.data.data]; 
            sortedPhotos.sort((a,b) => {
                return new Date(b.createdAt) - new Date(a.createdAt);
            });
            setTimelinePhotos(sortedPhotos);
            if (response.data.data.length <= 0) {
                setCountPhotos(timelinePhotos.length);
            } else {
                setCountPhotos(response.data.count);
            }
            setPageSizePhotos(page);
            setCurrentPagePhotos(current);
            setIsLoadingPhotos(false);
        } catch (error) {
            if (error.response && error.response.status && (error.response.status === 404 || error.response.status === 400 || error.response.status === 401 || error.response.status === 500)) {
                if (error.response.status === 401) {
                    setAccountDeletedError(error.response.data.msg);
                } else {
                    setCommonError(error.response.data.msg);
                }
                setIsLoadingPhotos(false);
            } else {
                setCommonError('Unknown Error, Try again later');
                setIsLoadingPhotos(false);
            }
        }
    }

    const getExtraFollwers = async (page, current) => {
        setCommonError('');
        setIsLoadingFollowers(true);
        try {
            const response = await axios.get(`${BASE_URL}/timeline/followers/${route.params.user_id}/${page}/${current}`);
            setFollowers([...followers, ...response.data.data]);
            if (response.data.data.length <= 0) {
                setCountFollowers(followers.length);
            } else {
                setCountFollowers(response.data.count);
            }
            setPageSizeFollowers(page);
            setCurrentPageFollowers(current);
            setIsLoadingFollowers(false);
        } catch (error) {
            if (error.response && error.response.status && (error.response.status === 404 || error.response.status === 400 || error.response.status === 401 || error.response.status === 500)) {
                if (error.response.status === 401) {
                    setAccountDeletedError(error.response.data.msg);
                } else {
                    setCommonError(error.response.data.msg);
                }
                setIsLoadingFollowers(false);
            } else {
                setCommonError('Unknown Error, Try again later');
                setIsLoadingFollowers(false);
            }
        }
    }

    const getExtraFollwing = async (page, current) => {
        setCommonError('');
        setIsLoadingFollowing(true);
        try {
            const response = await axios.get(`${BASE_URL}/timeline/following/${route.params.user_id}/${page}/${current}`);
            setFollowing([...following, ...response.data.data]);
            if (response.data.data.length <= 0) {
                setCountFollowing(following.length);
            } else {
                setCountFollowing(response.data.count);
            }
            setPageSizeFollowing(page);
            setCurrentPageFollowing(current);
            setIsLoadingFollowing(false);
        } catch (error) {
            if (error.response && error.response.status && (error.response.status === 404 || error.response.status === 400 || error.response.status === 401 || error.response.status === 500)) {
                if (error.response.status === 401) {
                    setAccountDeletedError(error.response.data.msg);
                } else {
                    setCommonError(error.response.data.msg);
                }
                setIsLoadingFollowing(false);
            } else {
                setCommonError('Unknown Error, Try again later');
                setIsLoadingFollowing(false);
            }
        }
    }

    const getExtraHearts = async (page, current) => {
        setCommonError('');
        setIsLoadingHearts(true);
        try {
            const response = await axios.get(`${BASE_URL}/timeline/hearts/${route.params.user_id}/${page}/${current}`);
            let sortedHearts = [...heart, ...response.data.data]; 
            // sortedHearts.sort((a,b) => {
            //     return new Date(b.post_votes[0].updatedAt) - new Date(a.post_votes[0].updatedAt);
            // });
            setHearts(sortedHearts);
            if (response.data.data.length <= 0) {
                setCountHearts(heart.length);
            } else {
                setCountHearts(response.data.count);
            }
            setPageSizeHearts(page);
            setCurrentPageHearts(current);
            setIsLoadingHearts(false);
        } catch (error) {
            console.log(error.response.data);
            if (error.response && error.response.status && (error.response.status === 404 || error.response.status === 400 || error.response.status === 401 || error.response.status === 500)) {
                if (error.response.status === 401) {
                    setAccountDeletedError(error.response.data.msg);
                } else {
                    setCommonError(error.response.data.msg);
                }
                setIsLoadingHearts(false);
            } else {
                setCommonError('Unknown Error, Try again later');
                setIsLoadingHearts(false);
            }
        }
    }

    const handleFollow = async () => {

        if (!userInfo?.user?.id) {
            navigation.navigate('SignInInit', { navigateTo: { screen: 'Profile', data: { user_id: route.params.user_id }}});
            return;
        }

        setIsLoading(true);
        try {
            const response = await axios.post(`${BASE_URL}/follow/create`, { follower_id: userInfo.user.id, followed_id: route.params.user_id });
            getUserTimeline();
        } catch (error) {
            if (error.response && error.response.status && (error.response.status === 404 || error.response.status === 400 || error.response.status === 401 || error.response.status === 500)) {
                setCommonError(error.response.data.msg);
                setIsLoading(false);
            } else {
                setCommonError('Unknown Error, Try again later');
                setIsLoading(false);
            }
        }
    }

    const handleUnFollow = async () => {

        if (!userInfo?.user?.id) {
            navigation.navigate('SignInInit', { navigateTo: { screen: 'Profile', data: { user_id: route.params.user_id }}});
            return;
        }

        setIsLoading(true);
        try {
            const response = await axios.post(`${BASE_URL}/unfollow/create`, { follower_id: userInfo.user.id, followed_id: route.params.user_id });
            getUserTimeline();
        } catch (error) {
            if (error.response && error.response.status && (error.response.status === 404 || error.response.status === 400 || error.response.status === 401 || error.response.status === 500)) {
                setCommonError(error.response.data.msg);
                setIsLoading(false);
            } else {
                setCommonError('Unknown Error, Try again later');
                setIsLoading(false);
            }
        }
    }

    const createFormData = (photo, body = {}) => {
        const data = new FormData();
        photo.forEach(elem => {
            data.append('photo', {
                name: 'profile-image',
                type: elem.mime,
                uri: elem.path
            });
        });

        Object.keys(body).forEach((key) => {
            data.append(key, body[key]);
        });

        return data;
    };

    const abbreviateNumber = (value) => {
        let newValue = value;
        if (value >= 1 && value <= 10) {
            return `${value}`;
        } else if (value > 10 && value <= 19) {
            return `10+`;
        } else if (value > 19 && value <= 29) {
            return `20+`;
        } else if (value > 29 && value <= 39) {
            return `30+`;
        } else if (value > 39 && value <= 49) {
            return `40+`;
        } else if (value > 49 && value <= 59) {
            return `50+`;
        } else if (value > 59 && value <= 69) {
            return `60+`;
        } else if (value > 69 && value <= 79) {
            return `70+`;
        } else if (value > 79 && value <= 89) {
            return `80+`;
        } else if (value > 89 && value <= 99) {
            return `90+`;
        } else if (value > 99 && value <= 199) {
            return `100+`;
        } else if (value > 199 && value <= 299) {
            return `200+`;
        } else if (value > 299 && value <= 399) {
            return `300+`;
        } else if (value > 399 && value <= 499) {
            return `400+`;
        } else if (value > 499 && value <= 599) {
            return `500+`;
        } else if (value > 599 && value <= 699) {
            return `600+`;
        } else if (value > 699 && value <= 799) {
            return `700+`;
        } else if (value > 799 && value <= 899) {
            return `800+`;
        } else if (value > 899 && value <= 999) {
            return `900+`;
        } else if (value >= 1000) {
            let suffixes = ["", "K+", "M+", "B+","T+"];
            let suffixNum = Math.floor( (""+value).length/3 );
            let shortValue = '';
            for (let precision = 2; precision >= 1; precision--) {
                shortValue = parseFloat( (suffixNum != 0 ? (value / Math.pow(1000,suffixNum) ) : value).toPrecision(precision));
                let dotLessShortValue = (shortValue + '').replace(/[^a-zA-Z 0-9]+/g,'');
                if (dotLessShortValue.length <= 2) { break; }
            }
            if (shortValue % 1 != 0) { 
                shortValue = shortValue.toFixed(1);
            }
            newValue = shortValue+suffixes[suffixNum];
        } else {
            return newValue;
        }
    }

    const handleChoosePhoto = async () => {
        setCommonError("");
        if (userInfo?.user?.id === route.params.user_id) {
            ImagePicker.openPicker({
                width: 500,
                height: 500,
                writeTempFile: false,
                cropping: true,
                cropperCircleOverlay: true
            }).then(image => {
                let check = (image.size / 1048576).toFixed(2);
                if (check > 20) {
                    setCommonError(`Your photo size can't exceed 20MB`);
                } else {
                    setPhoto([image]);
                    handleUploadPhoto([image]);
                }
            }).catch(error => {
                console.log(`Error occurs while opening croper`);
            });
        } else {
            return;
        }
    };

    const handleUploadPhoto = (photoUp) => {
        setCommonError("");
        setIsLoading(true);
        let data = createFormData(photoUp, { id: userInfo.user.id });
        const config = {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Accept': "application/x-www-form-urlencoded",
                'Accept': 'application/json'
            },
        };
        axios.put(`${BASE_URL}/user/image/update`, data, config)
            .then(response => {
                login(response.data.token, response.data.user);
                setPhoto([]);
                getUserTimeline();
            })
            .catch(error => {
                console.log(error.response.data);
                setIsLoading(false);
                if (error.response && error.response.status && (error.response.status === 404 || error.response.status === 400 || error.response.status === 401 || error.response.status === 500)) {
                    setCommonError(error.response.data.msg);
                    setIsLoading(false);
                } else {
                    setCommonError('Unknown Error, Try again later');
                    setIsLoading(false);
                }
            });
    };

    const getAge = (val) => {
        let now = moment(new Date()); //todays date
        let end = moment(val); // another date
        let duration = moment.duration(now.diff(end));
        let years = duration.years();
        return years;
    }

    function profileHeader () {
        return (
            <View style={{ marginBottom: SIZES.padding, backgroundColor: COLORS.white }}>
                {   showHeader ? 
                        <View
                            style={{
                                flexDirection: 'row',
                                paddingVertical: SIZES.base,
                                paddingHorizontal: SIZES.base,
                            }}
                        >
                            <TouchableOpacity
                                onPress={handleChoosePhoto}
                                style={{
                                    borderWidth: 1,
                                    borderColor: COLORS.gray2,
                                    borderRadius: 50,
                                    height: 70,
                                    width: 70,
                                    overflow: 'hidden',
                                }}
                            >
                                <FastImage
                                    source={{
                                        priority: FastImage.priority.high,
                                        uri: timelineData.profile_pic ? timelineData.profile_pic.startsWith("https://") ? `${timelineData.profile_pic}` : `https://${timelineData.profile_pic}` : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460__340.png"
                                    }}
                                    style={{
                                        height: 70,
                                        width: 70
                                    }}
                                />
                            </TouchableOpacity>
                            <View
                                style={{
                                    // paddingVertical: SIZES.radius
                                }}
                            >
                                <Text
                                    style={{
                                        color: COLORS.black,
                                        ...FONTS.h3,
                                        paddingHorizontal: SIZES.radius
                                    }}
                                >
                                    {timelineData.username}
                                </Text>
                                {   timelineData.dob && timelineData.gender ? 
                                        <Text
                                            style={{
                                                color: COLORS.black,
                                                ...FONTS.body3,
                                                paddingHorizontal: SIZES.radius
                                            }}
                                        >
                                            {getAge(timelineData.dob)} / {timelineData.gender == 'male' ? 'Male' : 'Female'}
                                        </Text> 
                                    :   
                                        null
                                }
                                {   timelineData.nationality ? 
                                        <Text
                                            style={{
                                                color: COLORS.black,
                                                ...FONTS.body3,
                                                paddingHorizontal: SIZES.radius
                                            }}
                                        >
                                            {timelineData.nationality}
                                        </Text> 
                                    :   
                                        null
                                }
                                <Text
                                    style={{
                                        color: COLORS.black,
                                        ...FONTS.body3,
                                        paddingHorizontal: SIZES.radius
                                    }}
                                >
                                    <Icon name={'heart'} size={16} color={COLORS.red} />  received: {abbreviateNumber(timelineData.totalVoteCount)}
                                </Text>
                            </View>
                        </View>
                    :   null 
                }
                { 
                    showHeader ?
                        <View>
                            <ExpandableView
                                label={`About Me`}
                                label2={`${description}`}
                                isOpen={false}
                                label2Style={{
                                    color: COLORS.black
                                }}
                                isLinkify={true}
                            />
                            {userInfo?.user?.id === route.params.user_id ?
                                <View
                                    style={{
                                        marginTop: SIZES.radius,
                                        marginBottom: SIZES.radius,
                                        height: 40,
                                    }}
                                >
                                    <TextButton
                                        buttonContainerStyle={{
                                            height: 40,
                                            flex: 1,
                                            marginRight: SIZES.base,
                                            borderRadius: SIZES.radius,
                                            backgroundColor: COLORS.primary
                                        }}
                                        label={'Edit your profile'}
                                        labelStyle={{
                                            color: COLORS.white
                                        }}
                                        onPress={() => setShowFilterModal(true)}
                                       // onPress={() => { navigation.navigate('EditProfile', { user_id: route.params.user_id, description: description, username: username, profile_pic: timelineData.profile_pic }) }}
                                    />
                                </View> : null
                            }
                        </View>
                    :   null
                }
                {commonError ? <Text
                    style={{
                        color: COLORS.red,
                        ...FONTS.body4,
                        textAlign: 'center'
                    }}
                >
                    {commonError}
                </Text> : null
                }
                <View
                    style={{
                        flexDirection: 'row',
                        paddingVertical: SIZES.base,
                        paddingHorizontal: SIZES.base,
                        borderBottomColor: COLORS.gray2,
                        borderBottomWidth: 1,
                        justifyContent: 'space-between'
                    }}
                >
                    <TouchableOpacity
                        style={{
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                        onPress={() => setSelectedTab('photo')}
                    >
                        <Text
                            style={selectedTab == 'photo' ? {
                                color: COLORS.black,
                                ...FONTS.h3
                            } : {
                                color: COLORS.black,
                                ...FONTS.body3
                            }}
                        >
                            Photo
                        </Text>
                        { showHeader ? <Text
                            style={{
                                color: COLORS.black,
                                ...FONTS.h3
                            }}
                        >
                            {countPhotos}
                        </Text> : null
                        }
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={{
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: 75
                        }}
                        onPress={() => setSelectedTab('heart')}
                    >
                        <Icon
                            name={selectedTab == 'heart' ? 'heart' : 'hearto'}
                            size={22}
                            color={selectedTab == 'heart' ? COLORS.red : COLORS.black}
                        />
                        { showHeader ? <Text
                            style={{
                                color: COLORS.black,
                                ...FONTS.h3
                            }}
                        >
                            {countHearts}
                        </Text> : null 
                        }
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={{
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                        onPress={() => setSelectedTab('following')}
                    >
                        <Text
                            style={selectedTab == 'following' ? {
                                color: COLORS.black,
                                ...FONTS.h3
                            } : {
                                color: COLORS.black,
                                ...FONTS.body3
                            }}
                        >
                            Following
                        </Text>
                        {showHeader ? <Text
                            style={{
                                color: COLORS.black,
                                ...FONTS.h3
                            }}
                        >
                            {countFollowing}
                        </Text> : null 
                        }
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={{
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                        onPress={() => setSelectedTab('followers')}
                    >
                        <Text
                            style={selectedTab == 'followers' ? {
                                color: COLORS.black,
                                ...FONTS.h3
                            } : {
                                color: COLORS.black,
                                ...FONTS.body3
                            }}
                        >
                            Followers
                        </Text>
                        { showHeader ? <Text
                            style={{
                                color: COLORS.black,
                                ...FONTS.h3
                            }}
                        >
                            {countFollowers}
                        </Text> : null 
                        }
                    </TouchableOpacity>
                </View>
            </View>
        )
    }


    const handleVotePressedWithAds = async () => {
        try {
            // setIsLoading(true);
            const response = await axios.post(`${BASE_URL}/post/vote`, { post_id: selectedUser.post, user_id: selectedUser.user });
            if (response.data.data) {
                for (let index = 0; index < selectedUser.timelinePhotos.length; index++) {
                    const elem = selectedUser.timelinePhotos[index];
                    if (elem.id == selectedUser.post) {
                        selectedUser.timelinePhotos[index] = response.data.data;
                        setTimelinePhotos(selectedUser.timelinePhotos.slice(0, selectedUser.timelinePhotos.length));
                        break;
                    }
                }
            } else {
                navigation.push('post', { post_id: response.data.post_id });
            }
            // setIsLoading(false);
        } catch (error) {
            if (error.response && error.response.status && (error.response.status === 404 || error.response.status === 400 || error.response.status === 401 || error.response.status === 500)) {
                setCommonError(error.response.data.msg);
                // setIsLoading(false);
                Alert.alert('Vote', error.response.data.msg);
            } else {
                setCommonError('Unknown Error, Try again later');
                // setIsLoading(false);
                Alert.alert('Vote', 'Unknown Error, Try again later');
            }
        }
    }

    const handleVotePressedWithAdsHeart = async () => {
        try {
            // setIsLoading(true);
            const response = await axios.post(`${BASE_URL}/post/vote`, { post_id: selectedUserHeart.post, user_id: selectedUserHeart.user });
            if (response.data.data) {
                for (let index = 0; index < selectedUserHeart.heart.length; index++) {
                    const elem = selectedUserHeart.heart[index];
                    if (elem.post_id == selectedUserHeart.post) {
                        selectedUserHeart.heart[index].post = response.data.data;
                        setHearts(selectedUserHeart.heart.slice(0, selectedUserHeart.heart.length));
                        break;
                    }
                }
            } else {
                navigation.push('post', { post_id: response.data.post_id });
            }
            // setIsLoading(false);
        } catch (error) {
            if (error.response && error.response.status && (error.response.status === 404 || error.response.status === 400 || error.response.status === 401 || error.response.status === 500)) {
                setCommonError(error.response.data.msg);
                // setIsLoading(false);
                Alert.alert('Vote', error.response.data.msg);
            } else {
                setCommonError('Unknown Error, Try again later');
                // setIsLoading(false);
                Alert.alert('Vote', 'Unknown Error, Try again later');
            }
        }
    }

    const handleVotePressed = async (post_id, type) => {
        if (!userInfo?.user?.id) {
            navigation.navigate('SignInInit', { navigateTo: { screen: 'Profile', data: { user_id: route.params.user_id }}});
            return;
        }
        if (type == 'photo') {
            selectedUser = { user: userInfo.user.id, post: post_id, timelinePhotos: timelinePhotos };
            handleVotePressedWithAds();
            // if (loaded) {
            //     interstitial.show();
            // } else {
            //     interstitial.load();
            // }

        } else if (type == 'heart') {
            selectedUserHeart = { user: userInfo.user.id, post: post_id, heart: heart };
            handleVotePressedWithAdsHeart();
            // if (loaded) {
            //     interstitial.show();
            // } else {
            //     interstitial.load();
            // }
        }
    }

    const handleSharePress = (post) => {
        const options = {
            title: `${post.post_title}`,
            url: `lhunt://post/${post.id}`,
        };

        Share.open(options)
            .then((res) => {
                console.log(res);
            })
            .catch((err) => {
                err && console.log(err);
            });
    }

    const handleReportPress = (id, username) => {
        if (userInfo && userInfo.user && userInfo.user.id) {
            navigation.push("PostReport", { post_id: id, user_id: userInfo.user.id, reported_username: `${username}@` });
        } else {
            navigation.push('SignInInit', { navigateTo: { screen: 'PostReport', data: { post_id: id, reported_username: `${username}@` } } });
        }
    }

    const handleImagePress = (id) => {
        if (interstitial.loaded) {
            setIsStatusBarHidden(true);
            interstitial.show();
            navigation.push("post", { post_id: id });
        } else {
            setIsStatusBarHidden(false);
            interstitial.load();
            navigation.push("post", { post_id: id });
        }
    }

    const _onScroll = (event) => {
        if (event > 20) {
            if (showHeader) {
                setShowHeader(false);
            }
        } else {
            setShowHeader(true);
        }
    }

    const handleEditScreen = (val) => {
        setShowFilterModal(false);
        if (val == 'AboutMe') {
            navigation.push('EditProfile', { isEdit: true, user_id: route.params.user_id, description: description, username: username, profile_pic: timelineData.profile_pic }); 
        } else if (val == 'Gender') {
            navigation.push('SelectGender', { isEdit: true, user_id: route.params.user_id, gender: timelineData.gender });
        }  else if (val == 'Birthday') {
            navigation.push('SelectDOB', { isEdit: true, user_id: route.params.user_id, dob: timelineData.dob });
        }  else if (val == 'Nationality') {
            navigation.push('SelectNationality', { isEdit: true, user_id: route.params.user_id, nationality: timelineData.nationality });
        } 
    }

    return (
        <View
            style={{
                flex: 1,
                backgroundColor: COLORS.white
            }}
        >
            <AnimatedLoader
                visible={isLoading}
                overlayColor="rgba(255,255,255,0.75)"
                source={require("../../constants/loader.json")}
                animationStyle={{
                    width: 300,
                    height: 300
                }}
                speed={1}
            />
            <SafeAreaView style={{ backgroundColor: COLORS.white }}>
                { renderHeader() }
            </SafeAreaView>
            { showFilterModal ? <EditModal handleEditScreen={handleEditScreen} isVisible={showFilterModal} onClose={() => setShowFilterModal(false)}/> : null }
            {!isLoading && timelineData && !accountDeletedError ? 
            <View
                style={{
                    marginHorizontal: SIZES.base,
                    borderRadius: SIZES.radius,
                    flex: 1
                }}
            >
                {
                    selectedTab === 'photo' ?
                        <FlashList
                            data={timelinePhotos}
                            keyExtractor={x => `${x.id}`}
                            //onScroll={e => _onScroll(e.nativeEvent.contentOffset.y)}
                            showsVerticalScrollIndicator={false}
                            //stickyHeaderIndices={[0]}
                            ListHeaderComponent={
                                profileHeader()
                            }
                            onEndReachedThreshold={0.2}
                            disableAutoLayout={true}
                            estimatedItemSize={672}
                            onEndReached={() => { 
                                if (countPhotos > 0 && countPhotos > timelinePhotos.length) {
                                    getExtraPhotos(pageSizePhotos, currentPagePhotos + 1);
                                }
                            }}
                            renderItem={({ item, index }) => (
                                <View>
                                    <PostCard
                                        key={item.id}
                                        containerStyle={{
                                            alignItems: 'center',
                                            marginBottom: SIZES.radius
                                        }}
                                        imageStyle={{
                                            height: 495,
                                            width: Dimensions.get('window').width - (SIZES.base * 2),
                                        }}
                                        userImageStyle={{
                                            height: 40,
                                            width: 40
                                        }}
                                        post={item}
                                        is_voted={userInfo && userInfo.user && userInfo.user.id && item.post_votes.some(x => x.user_id == userInfo?.user?.id) ? true : false}
                                        onPress={() => navigation.push("Profile", { user_id: item.user_id })}
                                        onPressVote={() => handleVotePressed(item.id, 'photo')}
                                        onSharePress={() => handleSharePress(item)}
                                        onReportPress={() => handleReportPress(item.id, item.user.username)}
                                        onImagePress={() => handleImagePress(item.id)}
                                        onTitlePress={() => handleImagePress(item.id)}
                                        childern={null}
                                        numberOfLines={3}
                                    />
                                    {/* {
                                        (index+1) % 6 == 0 ?
                                            <View
                                                style={{
                                                    marginTop: SIZES.base,
                                                    marginBottom: SIZES.padding,
                                                    justifyContent: 'center',
                                                    alignItems: 'center'
                                                }}
                                            >
                                                <BannerAd
                                                    unitId={adUnitIdB}
                                                    size={BannerAdSize.MEDIUM_RECTANGLE}
                                                    requestOptions={{
                                                        requestNonPersonalizedAdsOnly: true,
                                                    }}
                                                />
                                            </View> 
                                        : 
                                            null
                                    } */}
                                </View>
                            )}
                            ListFooterComponent={
                                <View style={{ alignItems: 'center', marginTop: 20 }}>
                                    { isLoadingPhotos ? <ActivityIndicator /> : null }
                                    { countPhotos == timelinePhotos.length ? <Text>No more posts at the moment</Text> : null }
                                    <View style={{ height: 100 }} />
                                </View>
                            }
                        />
                        : null
                }
                {
                    selectedTab === 'following' ?
                        <FlatList
                            data={following}
                            keyExtractor={x => `${x.id}`}
                            vertical
                            horizontal={false}
                            // stickyHeaderIndices={[0]}
                            // onScroll={e => _onScroll(e.nativeEvent.contentOffset.y)}
                            showsVerticalScrollIndicator={false}
                            onEndReachedThreshold={0.2}
                            onEndReached={() => { 
                                if (countFollowing > 0 && countFollowing > following.length) {
                                    getExtraFollwing(pageSizeFollowing, currentPageFollowing + 1);
                                }
                            }}
                            ListHeaderComponent={
                                profileHeader()
                            }
                            renderItem={({ item, index }) => (
                                <TouchableOpacity
                                    onPress={() => navigation.push('Profile', { user_id: item.following_user.id })}
                                    style={{
                                        marginTop: SIZES.base,
                                        marginLeft: SIZES.base,
                                        flex: 1,
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        // justifyContent: 'center',
                                        overflow: 'hidden',
                                        borderBottomWidth: 1,
                                        borderBottomColor: COLORS.lightGray2,
                                        paddingVertical: SIZES.base
                                    }}
                                >
                                    <View
                                        style={{
                                            height: 61,
                                            width: 61,
                                            borderWidth: 1,
                                            borderColor: COLORS.gray2,
                                            borderRadius: 50,
                                            overflow: 'hidden'
                                        }}
                                    >
                                        <FastImage
                                            source={{ uri: item.following_user.profile_pic ? item.following_user.profile_pic.startsWith("https://") ? `${item.following_user.profile_pic}` : `https://${item.following_user.profile_pic}` : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460__340.png" }}
                                            style={{
                                                height: 60,
                                                width: 60,
                                                aspectRatio: 1,
                                            }}
                                        />
                                    </View>
                                    <Text
                                        style={{
                                            color: COLORS.black,
                                            ...FONTS.h2,
                                            paddingHorizontal: SIZES.radius
                                        }}
                                    >
                                        {`${item.following_user.username}`}
                                    </Text>
                                </TouchableOpacity>
                            )}
                            ListFooterComponent={
                                <View style={{ alignItems: 'center', marginTop: 20 }}>
                                    { isLoadingFollowing ? <ActivityIndicator /> : null }
                                    { countFollowing == following.length ? <Text>No more following</Text> : null }
                                    <View style={{ height: 100 }} />
                                </View>
                            }
                        /> : null
                }
                {
                    selectedTab === 'followers' ?
                        <FlatList
                            data={followers}
                            keyExtractor={x => `${x.id}`}
                            vertical
                            horizontal={false}
                            showsVerticalScrollIndicator={false}
                            onEndReachedThreshold={0.2}
                            // stickyHeaderIndices={[0]}
                            // onScroll={e => _onScroll(e.nativeEvent.contentOffset.y)}
                            onEndReached={() => { 
                                if (countFollowers > 0 && countFollowers > followers.length) {
                                    getExtraFollwers(pageSizeFollowers, currentPageFollowers + 1);
                                }
                            }}
                            ListHeaderComponent={
                                profileHeader()
                            }
                            renderItem={({ item, index }) => (
                                <TouchableOpacity
                                    onPress={() => navigation.push('Profile', { user_id: item.follower_user.id })}
                                    style={{
                                        borderRadius: SIZES.radius,
                                        marginTop: SIZES.base,
                                        marginLeft: SIZES.base,
                                        flex: 1,
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        // justifyContent: 'center',
                                        overflow: 'hidden',
                                        borderBottomWidth: 1,
                                        borderBottomColor: COLORS.lightGray2,
                                        paddingVertical: SIZES.base
                                    }}
                                >
                                    <View
                                        style={{
                                            height: 61,
                                            width: 61,
                                            borderWidth: 1,
                                            borderColor: COLORS.gray2,
                                            borderRadius: 50,
                                            overflow: 'hidden'
                                        }}
                                    >
                                        <FastImage
                                            source={{ uri: item.follower_user.profile_pic ? item.follower_user.profile_pic.startsWith("https://") ? `${item.follower_user.profile_pic}` : `https://${item.follower_user.profile_pic}` : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460__340.png" }}
                                            style={{
                                                height: 60,
                                                width: 60
                                            }}
                                        />
                                    </View>
                                    <Text
                                        style={{
                                            color: COLORS.black,
                                            ...FONTS.h2,
                                            paddingHorizontal: SIZES.radius
                                        }}
                                    >
                                        {`${item.follower_user.username}`}
                                    </Text>
                                </TouchableOpacity>
                            )}
                            ListFooterComponent={
                                <View style={{ alignItems: 'center', marginTop: 20 }}>
                                    { isLoadingFollowers ? <ActivityIndicator /> : null }
                                    { countFollowers == followers.length ? <Text>No more followers</Text> : null }
                                    <View style={{ height: 100 }} />
                                </View>
                            }
                        /> : null
                }
                {
                    selectedTab === 'heart' ?
                        <FlashList
                            data={heart}
                            keyExtractor={x => `${x.id}`}
                            disableAutoLayout={true}
                            showsVerticalScrollIndicator={false}
                            onEndReachedThreshold={0.2}
                            // onScroll={e => _onScroll(e.nativeEvent.contentOffset.y)}
                            // stickyHeaderIndices={[0]}
                            onEndReached={() => { 
                                if (countHearts > 0 && countHearts > heart.length) {
                                    getExtraHearts(pageSizeHearts, currentPageHearts + 1);
                                }
                            }}
                            estimatedItemSize={672}
                            ListHeaderComponent={
                                profileHeader()
                            }
                            renderItem={({ item, index }) => {
                                return (
                                    <View>
                                        <PostCard
                                            key={item.post.id}
                                            containerStyle={{
                                                alignItems: 'center',
                                                marginBottom: SIZES.radius
                                            }}
                                            imageStyle={{
                                                height: 495,
                                                width: Dimensions.get('window').width - (SIZES.base * 2),
                                            }}
                                            userImageStyle={{
                                                height: 40,
                                                width: 40
                                            }}
                                            post={item.post}
                                            is_voted={userInfo && userInfo.user && userInfo.user.id && item.post.post_votes.some(x => x.user_id == userInfo?.user?.id) ? true : false}
                                            onPress={() => navigation.push("Profile", { user_id: item.post.user_id })}
                                            onPressVote={() => handleVotePressed(item.post.id, 'heart')}
                                            onSharePress={() => handleSharePress(item)}
                                            onReportPress={() => handleReportPress(item.post.id, item.post.user.username)}
                                            onImagePress={() => handleImagePress(item.post.id)}
                                            onTitlePress={() => handleImagePress(item.post.id)}
                                            childern={null}
                                            numberOfLines={3}
                                        />
                                        {/* {
                                            (index+1) % 6 == 0 ?
                                                <View
                                                    style={{
                                                        marginTop: SIZES.base,
                                                        marginBottom: SIZES.padding,
                                                        justifyContent: 'center',
                                                        alignItems: 'center'
                                                    }}
                                                >
                                                    <BannerAd
                                                        unitId={adUnitIdB}
                                                        size={BannerAdSize.MEDIUM_RECTANGLE}
                                                        requestOptions={{
                                                            requestNonPersonalizedAdsOnly: true,
                                                        }}
                                                    />
                                                </View> 
                                            : 
                                                null
                                        } */}
                                    </View>
                                )
                            }}
                            ListFooterComponent={
                                <View style={{ alignItems: 'center', marginTop: 20 }}>
                                    { isLoadingHearts ? <ActivityIndicator /> : null }
                                    { countHearts == heart.length ? <Text>No more posts at the moment</Text> : null }
                                    <View style={{ height: 100 }} />
                                </View>
                            }
                        />
                        : null
                }
            </View> 
            : !isLoading && accountDeletedError ? 
                <View
                    style={{
                        marginHorizontal: SIZES.base,
                        borderRadius: SIZES.radius,
                        flex: 1
                    }}
                >
                    {accountDeletedError ? <Text
                        style={{
                            color: COLORS.red,
                            ...FONTS.h3,
                            textAlign: 'center'
                        }}
                    >
                        {accountDeletedError}
                    </Text> : null
                    }
                </View>
            : null
            }
        </View>
    )
}

export default Profile