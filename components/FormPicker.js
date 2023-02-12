import React from "react";
import {
    View,
    Text,
    TextInput,
    Modal,
    TouchableWithoutFeedback,
    TouchableOpacity,
    FlatList
} from 'react-native';
import { FONTS, SIZES, COLORS } from "../constants";
import { LineDivider } from ".";

const FormPicker = ({
    containerStyle,
    label,
    inputStyle,
    onChange,
    value="",
    errorMsg = "",
    items=[],
    inputContainerStyle,
    modalVisible,
    setModalVisible,
    appendComponent,
    prependComponent
}) => {

    function renderSelectModal() {

        const renderItem = ({ item }) => {
            return (
                <TouchableOpacity
                    style={{
                        padding: SIZES.radius,
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                    onPress={() => {
                        onChange(item.value)
                        setModalVisible(false)
                    }}
                >
                    <Text 
                        style={{
                            ...FONTS.h3,
                            color: COLORS.black
                        }}
                    >
                        {item.label}
                    </Text>
                </TouchableOpacity>
            )
        }

        return (
            <Modal
                animationType="fade"
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
                            backgroundColor: 'rgba(0,0,0,0.5)'
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
                                data={items}
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
        <View style={{...containerStyle}}>
            { modalVisible ? renderSelectModal() : null }
            {label ? <View
                style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between'
                }}
            >
                <Text 
                    style={{
                        color: COLORS.black, 
                        ...FONTS.body4
                    }}
                >
                    {label}
                </Text>
                <Text 
                    style={{
                        color: COLORS.red,
                        ...FONTS.body4
                    }}
                >
                    {errorMsg}
                </Text>
            </View> : null }
            <TouchableOpacity
                style={{
                    flexDirection: 'row',
                    height: label ? SIZES.height > 800 ? 55 : 45 : 'auto',
                    paddingHorizontal: SIZES.base,
                    marginTop: label ? SIZES.height > 800 ? SIZES.base : 0 : 0,
                    borderRadius: SIZES.radius,
                    backgroundColor: COLORS.lightGray2,
                    alignItems: 'center',
                    ...inputContainerStyle
                }}
                onPress={() => setModalVisible(true)}
            >
                {prependComponent}
                <Text
                    style={{
                        flex: 1,
                        color: value ? COLORS.black : COLORS.gray3,
                        ...FONTS.h3
                    }}
                >
                    { value ? value : `Select gender` }
                </Text>
                {appendComponent}
            </TouchableOpacity>
        </View>
    )
}

export default FormPicker