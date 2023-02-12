import React from "react";
import {
    TouchableOpacity,
    Text,
    Image,
    StyleSheet
} from 'react-native';

import { FONTS, COLORS } from "../constants";

const TextIconButton = ({
    containerStyle,
    label,
    labelStyle,
    icon,
    iconPosition,
    iconStyle,
    onPress,
    disabled
}) => {
    return (
        <TouchableOpacity
            style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                ...containerStyle
            }}
            onPress={onPress}
            disabled={disabled}
        >
            {
                iconPosition == "LEFT" ? icon : null
            }
            <Text
                style={{
                    ...FONTS.body3,
                    ...labelStyle
                }}
            >
                {label}
            </Text>
            {
                iconPosition == "RIGHT" ? icon : null
            }
        </TouchableOpacity>
    )
}

const styles =  StyleSheet.create({
    image: {
        marginLeft: 5,
        width: 20,
        height: 20,
        tintColor: COLORS.black
    }
});

export default TextIconButton;