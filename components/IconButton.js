import React from "react";
import { Image, TouchableOpacity } from "react-native";
import { COLORS } from "../constants";

const IconButton = ({ containerStyle, icon, iconStyle, onPress }) => {
    return (
        <TouchableOpacity
            style={{ ...containerStyle }}
            onPress={onPress}
        >
            {   
                icon ?  
                    <Image 
                        source={icon}
                        style={{
                            width: 30,
                            height: 30,
                            tintColor: COLORS.white,
                            ...iconStyle
                        }}
                    /> 
                : 
                    null
            }
        </TouchableOpacity>
    )
}

export default IconButton