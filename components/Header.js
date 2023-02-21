import React from "react";
import { View, Text } from 'react-native';
import { FONTS } from "../constants";


const Header = ({ containerStyle, title, titleStyle, leftComponent, rightComponent }) => {
    return (
        <View 
            style={{ 
                flexDirection: 'row',
                ...containerStyle
            }}
        >
            {leftComponent}
            <View
                style={{
                    flex: 1, 
                    alignItems: "center",
                    justifyContent: 'center'
                }}
            >
                <Text
                    style={{
                        ...FONTS.h3,
                        fontSize: 20,
                        ...titleStyle
                    }}
                >
                    {title}
                </Text>
            </View>
            {rightComponent}
        </View>
    )
}

export default Header;