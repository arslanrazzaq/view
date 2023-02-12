import React, { useState, useRef } from "react";
import {
    View,
    Text,
    TouchableWithoutFeedback,
    Modal
} from 'react-native';
import { FONTS, COLORS, SIZES, icons } from "../../constants";
import { IconButton } from "../../components";

const EditModal = ({ 
    isVisible, 
    onClose,
    handleEditScreen
}) => {
    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={isVisible}
        >
            <TouchableWithoutFeedback
                onPress={() => onClose(false)}
            >
                <View
                    style={{
                        flex: 1,
                        backgroundColor: COLORS.transparentBlack7,
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <View
                        style={{
                            width: SIZES.width * 0.8,
                            backgroundColor: COLORS.white,
                            borderRadius: SIZES.radius,
                            paddingBottom: SIZES.padding,
                            paddingHorizontal: SIZES.radius
                        }}
                    >
                        <View
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                paddingVertical: SIZES.radius
                            }}
                        >
                            <Text 
                                style={{
                                    fontFamily: "Roboto-Bold", 
                                    fontSize: 20, 
                                    lineHeight: 30,
                                    color: COLORS.black,
                                    marginRight: SIZES.radius,
                                    flex: 1
                                }}
                            >
                                Edit 
                            </Text>
                            <IconButton 
                                containerStyle={{
                                    borderWidth: 2,
                                    borderRadius: 10,
                                    borderColor: COLORS.gray2
                                }}
                                icon={icons.cross}
                                iconStyle={{
                                    tintColor: COLORS.gray2
                                }}
                                onPress={() => onClose(false)}
                            />
                        </View>
                        <TouchableWithoutFeedback
                            onPress={() => handleEditScreen('AboutMe')}
                        >
                            <Text 
                                style={{ 
                                    fontFamily: "Roboto-Bold", 
                                    fontSize: 20, 
                                    lineHeight: 30, 
                                    color: COLORS.black, 
                                    marginTop: SIZES.padding,
                                    // alignSelf: "center"
                                }}
                            >
                                About Me
                            </Text>
                        </TouchableWithoutFeedback>
                        <TouchableWithoutFeedback
                            onPress={() => handleEditScreen('Gender')}
                        >
                            <Text 
                                style={{ 
                                    fontFamily: "Roboto-Bold", 
                                    fontSize: 20, 
                                    lineHeight: 30, 
                                    color: COLORS.black, 
                                    marginTop: SIZES.radius,
                                    // alignSelf: "center"
                                }}
                            >
                                Gender
                            </Text>
                        </TouchableWithoutFeedback>
                        <TouchableWithoutFeedback
                            onPress={() => handleEditScreen('Birthday')}
                        >
                            <Text 
                                style={{ 
                                    fontFamily: "Roboto-Bold", 
                                    fontSize: 20, 
                                    lineHeight: 30, 
                                    color: COLORS.black, 
                                    marginTop: SIZES.radius,
                                    // alignSelf: "center"
                                }}
                            >
                                Birthday
                            </Text>
                        </TouchableWithoutFeedback>
                        <TouchableWithoutFeedback
                            onPress={() => handleEditScreen('Nationality')}
                        >
                            <Text 
                                style={{ 
                                    fontFamily: "Roboto-Bold", 
                                    fontSize: 20, 
                                    lineHeight: 30,
                                    color: COLORS.black, 
                                    marginTop: SIZES.radius,
                                    // alignSelf: "center"
                                }}
                            >
                                Nationality
                            </Text>
                        </TouchableWithoutFeedback>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    )
}

export default EditModal;