import React, { useState } from "react";
import { 
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
    Text,
    Image,
    FlatList
} from 'react-native';
import { FONTS, COLORS, SIZES, icons } from "../constants";
import Icon from 'react-native-vector-icons/AntDesign';
import Icon1 from 'react-native-vector-icons/Entypo';
import FastImage from 'react-native-fast-image';
import moment from 'moment';


moment.updateLocale('en', {
    relativeTime : {
        s  : 'just now',
        ss : '%d s',
        m:  "%dm",
        mm: "%dm",
        h:  "%dh",
        hh: "%dh",
        d:  "%dd",
        dd: "%dd",
        M:  "%dmo",
        MM: "%dmo",
        y:  "%dy",
        yy: "%dy"
    }
});

const PostCard = ({ 
    containerStyle, 
    imageStyle, 
    userImageStyle, 
    post, 
    onPress, 
    onPressVote, 
    onSharePress, 
    onReportPress, 
    onImagePress,
    childern,
    isShowDelete,
    onDeletePress,
    is_voted,
    onTitlePress,
    isLightBoxEnabled,
    numberOfLines,
    titleHome
}) => {
    const [postImages, setPostImages] = useState(post.post_images.slice(0,1));

    const abbreviateNumber = (value) => {
        let newValue = value;
        if (value >= 1 && value < 1000) {
            return `${value}`;
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
            return newValue;
        } else {
            return newValue;
        }
    }

    const handleDateFormat = (time) => {
        let output = moment(time).fromNow(true);
        return output;
    }

    return (
        <View
            style={{
                // flexDirection: 'row',
                borderRadius: SIZES.radius,
                backgroundColor: COLORS.lightGray2,
                ...containerStyle
            }}
        >
            <View
                style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingVertical: SIZES.base,
                    paddingHorizontal: SIZES.base,
                    borderBottomColor: COLORS.gray2,
                    borderBottomWidth: 1
                }}
            >
                <TouchableOpacity 
                    style={{
                        borderWidth: 1,
                        borderColor: COLORS.black,
                        borderRadius: 50,
                        overflow: 'hidden',
                    }}
                    onPress={onPress}
                >
                    <FastImage 
                        source={{ priority: FastImage.priority.high, uri: post?.user?.profile_pic ? post?.user?.profile_pic.startsWith('https://') ? post?.user?.profile_pic : `https://${post?.user?.profile_pic}` : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460__340.png" }}
                        style={userImageStyle}
                        resizeMode={FastImage.resizeMode.contain}
                    />
                </TouchableOpacity>
                <View 
                    style={{
                        flex: 1,
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        paddingHorizontal: SIZES.base
                    }}
                >
                    <TouchableOpacity
                        style={{
                            flex: 1,
                            flexDirection: "row",
                            alignItems: 'center',
                        }}
                        onPress={onPress}
                    >
                        <Text
                            style={{...FONTS.h3, fontSize: 17, flex: 1, color: COLORS.gray }}
                            numberOfLines={1}
                        >
                            {post.user.username}
                        </Text>
                        <View
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                marginHorizontal: SIZES.base
                            }}
                        >
                            <Icon1
                                name={'controller-record'} 
                                size={10} 
                                color={COLORS.black}
                            />
                            <Text
                                style={{
                                    ...FONTS.h3, fontSize: 17, 
                                    marginLeft: SIZES.base,
                                    color: COLORS.gray 
                                }}
                            >
                                {`${handleDateFormat(post.createdAt)}`}
                            </Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={{
                            width: 40,
                            alignItems: 'center',
                        }}
                        onPress={onReportPress}
                    >
                        <Icon 
                            name={'exclamationcircleo'} 
                            size={30} 
                            color={COLORS.black}
                        />
                    </TouchableOpacity>
                </View>
            </View>
            <TouchableOpacity
                style={{
                    paddingVertical: SIZES.base,
                    paddingHorizontal: SIZES.base,
                    borderBottomColor: COLORS.gray2,
                    borderBottomWidth: 1,
                    flex: 1,
                    width: '100%',
                    // alignItems: "center"
                }}
                onPress={onTitlePress}
            >
                <Text 
                    style={{ 
                        ...FONTS.body4, 
                        fontSize: 17,
                        color: COLORS.black
                    }}
                    numberOfLines={numberOfLines ? numberOfLines : null} 
                >
                    {post.post_title}
                </Text>
            </TouchableOpacity>
            <FlatList
                data={postImages}
                keyExtractor={x => `${x.id}`}
                horizontal
                initialNumToRender={1}
                maxToRenderPerBatch={1}
                pagingEnabled
                removeClippedSubviews={true}
                onEndReachedThreshold={0.2}
                onEndReached={() => {
                    if (post.post_images.length != postImages.length) {
                        setPostImages(post.post_images.slice(0, (postImages.length+1)));
                    }
                }}
                showsHorizontalScrollIndicator={false}
                renderItem={({ item, index }) => {
                    return (
                        <View>
                            <View
                                style={{
                                    flexDirection: 'row',
                                    top: 10,
                                    position: 'absolute',
                                    right: SIZES.radius,
                                    zIndex: 3, // works on ios
                                    elevation: 3,
                                    paddingHorizontal: SIZES.radius,
                                    paddingVertical: SIZES.base,
                                    borderRadius: SIZES.radius,
                                    backgroundColor: '#e8e8e8'
                                }}
                            >
                                <Text 
                                    style={{
                                        ...FONTS.body4, 
                                        fontSize: 17,
                                        color: COLORS.black
                                    }}
                                >
                                    {`${index+1}/${post.post_images.length}`}
                                </Text>
                            </View>
                            <TouchableWithoutFeedback
                                onPress={() => onImagePress(index)}
                            >
                                <FastImage 
                                    source={{ priority: FastImage.priority.high, uri: item.url.startsWith("https://") ? `${item.url}` : `https://${item.url}` }}
                                    style={imageStyle}
                                    resizeMode={FastImage.resizeMode.contain}
                                />
                            </TouchableWithoutFeedback>
                            {
                                isShowDelete ? <TouchableOpacity
                                    onPress={onDeletePress}
                                    style={{
                                        flexDirection: 'row',
                                        bottom: 10,
                                        position: 'absolute',
                                        right: SIZES.radius,
                                        zIndex: 3, // works on ios
                                        elevation: 3,
                                        paddingHorizontal: SIZES.radius,
                                        paddingVertical: SIZES.base,
                                        borderRadius: SIZES.radius,
                                        backgroundColor: '#e8e8e8'
                                    }}
                                >
                                    <Icon 
                                        name={'delete'} 
                                        size={30} 
                                        color={COLORS.red}
                                    />
                                </TouchableOpacity> : null
                            }      
                        </View>
                    )
                }}
            />
            <View
                style={{
                    flex: 1,
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingVertical: SIZES.radius,
                    width: '100%',
                    paddingHorizontal: SIZES.base,
                    justifyContent: 'space-between'
                }}
            >   
                <TouchableOpacity
                    style={{
                        // backgroundColor: COLORS.red,
                        borderRadius: SIZES.radius,
                        padding: SIZES.base,
                        flexDirection: 'row'
                    }}
                    onPress={onPressVote}
                >
                    <Text 
                        style={{ 
                            ...FONTS.body4, 
                            fontSize: 17,
                            color: COLORS.black, 
                            marginRight: SIZES.base,
                        }}
                    >
                        {`Vote`}
                    </Text>
                    {   is_voted ? 
                        <Icon 
                            name={'heart'}
                            size={24} 
                            color={COLORS.red}
                        /> :
                        <Icon 
                            name={'hearto'}
                            size={24} 
                            color={COLORS.black}
                        /> 
                    }
                    <Text 
                        style={{ 
                            ...FONTS.body4, 
                            fontSize: 17,
                            color: COLORS.black, 
                            marginHorizontal: SIZES.base,
                        }}
                    >
                        {`${abbreviateNumber(post.PostVoteCount)}`}
                    </Text>
                </TouchableOpacity>
                <View
                    style={{
                        flexDirection: 'row'
                    }}
                >
                    <Text
                        style={{
                            marginHorizontal: SIZES.base,
                            color: COLORS.black,
                            ...FONTS.body4,
                            fontSize: 17
                        }}
                    >
                        Feedback
                    </Text>
                    <Icon 
                        name={'message1'} 
                        size={24} 
                        color={COLORS.black}
                    />
                    <Text
                        style={{
                            marginHorizontal: SIZES.base,
                            color: COLORS.black,
                            ...FONTS.body4,
                            fontSize: 17,
                        }}
                    >
                        {`${abbreviateNumber(post.PostCommentCount)}`}
                    </Text>
                </View>
                {/* <TouchableOpacity
                    style={{
                        flexDirection: 'row'
                    }}
                    onPress={onSharePress}
                >
                    <Icon 
                        name={'sharealt'} 
                        size={24} 
                        color={COLORS.black}
                    />
                    <Text 
                        style={{
                            marginHorizontal: SIZES.base,
                            color: COLORS.black,
                            ...FONTS.body4,
                            fontSize: 17,
                        }}
                    >
                        Share
                    </Text>
                </TouchableOpacity> */}
            </View>
            { childern }
        </View>
    )
} 

export default PostCard;