import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity
} from 'react-native';
import { COLORS, FONTS, SIZES } from '../constants';
import Icon from 'react-native-vector-icons/AntDesign';
// import Hyperlink from 'react-native-hyperlink';

const ExpandableView = ({ label, label2, isOpen, isLinkify, label2Style }) => {

    const [isOpened, setIsOpened] = useState(null);

    useEffect(() => {
        setIsOpened(isOpen);
    }, []);

    return (
        <View 
            style={{
                paddingVertical: SIZES.base,
                backgroundColor: COLORS.lightGray2,
                borderRadius: SIZES.radius,
                marginVertical: SIZES.base
            }}
        >
            <View 
                style={{
                    flexDirection: 'row',
                    borderBottomColor: COLORS.gray2,
                    borderBottomWidth: isOpened ? 1 : 0,
                    paddingHorizontal: SIZES.radius,
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
            >
                <View
                    style={{
                        flex: 1,
                        justifyContent: 'center'
                    }}
                >
                    <Text
                        style={{
                            ...FONTS.h4,
                            color: COLORS.black
                        }}
                    >
                        {label}
                    </Text>
                </View>
                <TouchableOpacity
                    style={{
                        // paddingHorizontal: SIZES.base,
                        // alignItems: 'center',
                        justifyContent: 'center'
                    }}
                    onPress={() => { setIsOpened(!isOpened); }}
                >
                    {isOpened ? <Icon 
                        name={'minus'} 
                        size={30} 
                        color={COLORS.gray}
                    /> : <Icon 
                        name={'plus'} 
                        size={30} 
                        color={COLORS.gray}
                    /> 
                    }
                </TouchableOpacity>
            </View>
            {isOpened ? <View 
                style={{
                    marginTop: SIZES.base
                }}
            >
                {   isLinkify ? 
                        // <Hyperlink 
                        //     linkDefault={true}
                        //     linkStyle={{ color: COLORS.blue }}
                        // >
                            <Text  
                                style={{
                                    color: COLORS.gray,
                                    ...FONTS.body4,
                                    paddingHorizontal: SIZES.radius,
                                    ...label2Style
                                }}
                            >
                                {label2}
                            </Text>
                        // </Hyperlink>
                    :
                        <Text
                            style={{
                                color: COLORS.gray,
                                ...FONTS.body4,
                                paddingHorizontal: SIZES.radius,
                                ...label2Style
                            }}
                        >
                            {label2} 
                        </Text>
                }
            </View> : null 
            }
        </View>
    )
}

export default ExpandableView;