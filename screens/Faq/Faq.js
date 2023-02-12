import React, { useEffect, useState } from 'react';
import {
    View,
    ScrollView,
    SafeAreaView
} from 'react-native';
import { COLORS, SIZES, icons } from '../../constants';
import { IconButton, Header, ExpandableView } from '../../components';
import axios from 'axios';
import AnimatedLoader from "react-native-animated-loader";
import { BASE_URL } from '../../config';


const Faq = ({ navigation }) => {
    
    const [isLoading, setIsLoading] = useState(false);
    const [commonError, setCommonError] = useState("");
    const [faqList, setFaqList] = useState([]);

    function renderHeader() {
        return (
            <Header 
                title="How it works?"
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
            />
        )
    }

    useEffect(() => {
        getFaqs();
    },[]);

    const getFaqs = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get(`${BASE_URL}/faqs/list`);
            setFaqList(response.data.data);
            setIsLoading(false);
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

    return (
        <View
            style={{
                flex: 1,
                backgroundColor: COLORS.white
            }}
        >
            <SafeAreaView style={{ backgroundColor: COLORS.white }}>
                { renderHeader() }
            </SafeAreaView>
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
            <View
                style={{
                    marginHorizontal: SIZES.padding,
                    borderRadius: SIZES.radius,
                    flex: 1
                }}
            >
                <ScrollView
                    style={{
                        flexGrow: 1,
                    }}
                >
                    {
                        faqList.map((elem, index) => (
                            <ExpandableView 
                                label={`${elem.question}`}
                                label2={`${elem.answer}`}
                                isOpen={false}
                                key={elem.id}
                                label2Style={{
                                    color: COLORS.black
                                }}
                            />
                        ))
                    }
                   
                </ScrollView>
            </View>
            <View style={{ height: 50 }} />
        </View>
    )
}

export default Faq