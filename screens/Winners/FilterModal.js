import React, { useState, useRef } from "react";
import {
    View,
    Text,
    Animated,
    TouchableWithoutFeedback,
    Modal,
    Platform
} from 'react-native';
import { FONTS, COLORS, SIZES } from "../../constants";
import { TextButton, TwoPointSlider } from "../../components";
import DropDownPicker from 'react-native-dropdown-picker';
import countries from "../../utils/countries";
import CheckBox from '@react-native-community/checkbox';
import Icon1 from 'react-native-vector-icons/FontAwesome';

const Section = ({containerStyle, title, subtitle, children}) => {
    return (
        <View
            style={{
                marginTop: SIZES.padding,
                ...containerStyle
            }}
        >
            <View 
                style={{
                    flexDirection: 'row'
                }}
            >
                <Text style={{ ...FONTS.h3, color: COLORS.black, flex: 1 }}>{title}</Text>
                {
                    subtitle ? 
                        <Text style={{ ...FONTS.body3, color: COLORS.black, }}>{subtitle}</Text>
                    : 
                        null
                }
            </View>
            {children}
        </View>
    )
}

const FilterModal = ({ 
    isVisible, 
    onClose, 
    ageValues, 
    ageValuesFinish,
    nationality,
    setNationality,
    onApplyFilters,
    isMale,
    isFemale,
    handleGender,
}) => {

    const modalAnimatedValue = useRef(new Animated.Value(0)).current;
    const [showFilter, setShowFilter] = useState(isVisible);
    const [open, setOpen] = useState(false);
    const [items, setItems] = useState([{ "name": "ALL", "code": "ALL" },...countries.countries]);
   
    React.useEffect(() => {        
        if (showFilter) {
            Animated.timing(modalAnimatedValue, {
                toValue: 1,
                duration: 100,
                useNativeDriver: false
            }).start();
        } else {
            Animated.timing(modalAnimatedValue, {
                toValue: 0,
                duration: 100,
                useNativeDriver: false
            }).start(() => onClose());
        }
    }, [showFilter])

    const modalY = modalAnimatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: [SIZES.height, SIZES.height - 680]
    })
    
    function renderAge() {
        return (
            <Section
                title="Age"
                subtitle={`${ageValues[0]} - ${ageValues[1]}`}
                containerStyle={{
                    marginTop: SIZES.padding * 3
                }}
            >
                <View
                    style={{
                        alignItems: 'center'
                    }}
                >
                    <TwoPointSlider 
                        values={ageValues}
                        min={0}
                        max={100}
                        postfix=""
                        onValuesChange={ageValuesFinish}
                    />
                </View>
            </Section>
        )
    }

    function renderNationality() {
        return (
            <Section 
                title="Nationality"
                containerStyle={{
                    marginTop: 40
                }}
            >
                <View
                    style={{
                        flexDirection: 'row',
                        flexWrap: 'wrap',
                        marginTop: SIZES.radius
                    }}
                >
                    <DropDownPicker
                        schema={{
                            label: 'name',
                            value: 'name'
                        }}
                        searchable={true}
                        searchPlaceholder="Search..."
                        dropDownDirection="BOTTOM"
                        listMode="MODAL"
                        itemSeparator={true}
                        closeOnBackPressed={true}
                        open={open}
                        value={nationality}
                        items={items}
                        setOpen={setOpen}
                        setValue={setNationality}
                        setItems={setItems}
                        multiple={false}
                        searchTextInputStyle={{
                            height: 50,
                            fontSize: 20
                        }}
                    />
                </View>
            </Section>
        )
    }

    function renderGender() {
        return (
            <Section 
                title="Gender"
                containerStyle={{
                    marginTop: SIZES.padding * 3
                }}
            >
                <View
                    style={{
                        flexDirection: 'row',
                        flexWrap: 'wrap',
                        marginTop: SIZES.radius
                    }}
                >   
                    <View
                        style={{
                            flex: 1,
                            justifyContent: 'flex-start',
                            flexDirection: 'row',
                            alignItems: 'center'
                        }}
                    >
                        <CheckBox
                            value={isMale}
                            onValueChange={() => handleGender('male', isMale)}
                            boxType={'square'}
                        />
                        <TouchableWithoutFeedback
                            onPress={() => handleGender('male', isMale)}
                        >
                            <Text
                                style={{
                                    color: COLORS.black,
                                    ...FONTS.body3,
                                    paddingHorizontal: SIZES.radius
                                }}
                            >
                                Male
                            </Text>
                        </TouchableWithoutFeedback>
                    </View>
                    <View
                        style={{
                            flex: 1,
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'flex-end'
                        }}
                    >
                        <CheckBox
                            value={isFemale}
                            onValueChange={() => handleGender('female', isFemale)}
                            boxType={'square'}
                        />
                        <TouchableWithoutFeedback
                            onPress={() => handleGender('female', isFemale)}
                        >
                            <Text
                                style={{
                                    color: COLORS.black,
                                    ...FONTS.body3,
                                    paddingHorizontal: SIZES.radius
                                }}
                            >
                                Female
                            </Text>
                        </TouchableWithoutFeedback>
                    </View>
                </View>
            </Section>
        )
    }

    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={isVisible}
        >
            <View
                style={{
                    flex: 1,
                    backgroundColor: COLORS.transparentBlack7,

                }}
            >
                <TouchableWithoutFeedback
                    onPress={() => setShowFilter(false)}
                >
                    <View
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,  
                            bottom: 0
                        }}
                    />
                </TouchableWithoutFeedback>
                <Animated.View
                    style={{
                        position: 'absolute',
                        left: 0,
                        top: modalY,
                        width: '100%',
                        height: '100%',
                        padding: SIZES.padding,
                        borderTopLeftRadius: SIZES.padding,
                        borderTopRightRadius: SIZES.padding,
                        backgroundColor: COLORS.white
                    }}
                >
                    <View
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                        }}
                    >
                        <Text 
                            style={{
                                ...FONTS.h3,
                                fontSize: 18,
                                color: COLORS.black,
                                marginTop: SIZES.radius,
                                marginRight: SIZES.radius
                            }}
                        >
                            Filter 
                        </Text>
                        <Icon1 name={'sliders'} size={24} color={COLORS.black} /> 
                    </View>
                    <View>
                        {renderNationality()}
                        {renderAge()}
                        {renderGender()}
                    </View>
                </Animated.View>
                <View
                    style={{
                        position: 'absolute',
                        bottom: Platform.OS == 'ios' ? 30 : 15,
                        left: 0,
                        right: 0,
                        height: 50,
                        paddingHorizontal: SIZES.padding,
                        paddingVertical: SIZES.radius,
                        backgroundColor: COLORS.white,
                        flexDirection: "row"
                    }}
                >
                    <TextButton 
                        label="Cancel"
                        buttonContainerStyle={{
                            height: 50,
                            flex: 1,
                            marginRight: SIZES.radius,
                            borderRadius: SIZES.base,
                            backgroundColor: COLORS.blue
                        }}
                        onPress={() => setShowFilter(false)}
                    />
                    <TextButton 
                        label="Apply"
                        buttonContainerStyle={{
                            height: 50,
                            flex: 1,
                            borderRadius: SIZES.base,
                            backgroundColor: COLORS.blue
                        }}
                        onPress={onApplyFilters}
                    />
                </View>
            </View>
        </Modal>
    )
}

export default FilterModal;