import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet,
    TouchableOpacity,
    SafeAreaView,
    Platform
} from 'react-native';
import { COLORS, SIZES, FONTS, icons } from '../../constants';
import { IconButton, Header } from '../../components';
import axios from 'axios';
import { BASE_URL } from '../../config';
import Autocomplete from 'react-native-autocomplete-input';

const Search = ({ navigation }) => {
    
    const [commonError, setCommonError] = useState("");
    const [users, setUsers] = useState([]);
    const [search, setSearch] = useState('');
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [isLoadingSearch, setIsLoadingSearch] = useState(false);

    function renderHeader() {
        return (
            <Header 
                title={'Search username'}
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
        getUsers();
    },[]);


    const findUser = (query) => {
        setSearch(query);
        if (query) {
            const regex = new RegExp(`${query.trim()}`, 'i');
            let filtered = users.filter((elem) => elem.username.search(regex) >= 0);
            setFilteredUsers(filtered);
        } else {
            setFilteredUsers([]);
        }
    };

    const getUsers = async () => {
        setIsLoadingSearch(true);
        try {
            const response = await axios.get(`${BASE_URL}/user/list`);
            setUsers(response.data.data);
            setIsLoadingSearch(false);
        } catch (error) {
            if (error.response && error.response.status && (error.response.status === 404 || error.response.status === 400 || error.response.status === 401 || error.response.status === 500)) {
                setCommonError(error.response.data.msg);
                setIsLoadingSearch(false);
            } else {
                setCommonError('Unknown Error, Try again later');
                setIsLoadingSearch(false);
            }
        }
    }

    function renderSearch() {
        return (
            <View
                style={{
                    flexDirection: 'row',
                    height: Platform.OS == 'ios' ? 43 : 50,
                    alignItems: 'center',
                    marginHorizontal: SIZES.padding,
                    paddingHorizontal: SIZES.radius,
                    borderRadius: SIZES.radius,
                    borderColor: COLORS.lightGray2,
                    borderWidth: 2
                }}
            >
                <Image
                    source={icons.search}
                    style={{
                        height: Platform.OS == 'ios' ? 20 : 25,
                        width: Platform.OS == 'ios' ? 20 : 25,
                        tintColor: COLORS.black
                    }}
                />
                <View style={styles.container}>
                    <View style={styles.autocompleteContainer}>
                        <Autocomplete
                            listContainerStyle={{ borderWidth: 2, borderColor: COLORS.lightGray2, zIndex: 10 }}
                            listStyle={{ zIndex: 10 }}
                            inputContainerStyle={{ borderWidth: 0, borderColor: COLORS.lightGray2, backgroundColor: 'transparent' }}
                            autoCorrect={false}
                            data={filteredUsers}
                            value={search}
                            onChangeText={(text) => findUser(text)}
                            placeholder={'Search username...'}
                            flatListProps={{
                                keyboardShouldPersistTaps: 'always',
                                keyExtractor: (x) => x.id,
                                renderItem: ({ item: { username, id } }) => (
                                    <TouchableOpacity style={{ zIndex: 10 }}  onPress={() => navigation.navigate("Profile", { user_id: id })}>
                                        <Text 
                                            style={{
                                                paddingHorizontal: SIZES.radius,
                                                paddingVertical: SIZES.base,
                                                color: COLORS.black,
                                                ...FONTS.body3,
                                                borderWidth: 1,
                                                borderColor: COLORS.lightGray2
                                            }}
                                        >
                                            { username }
                                        </Text>
                                    </TouchableOpacity>
                                ),
                            }}
                        />
                    </View>
                </View>
            </View>
        )
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
            { renderSearch() }
        </View>
    )
}


const styles = StyleSheet.create({
    container: {
      position: 'relative',
      flex: 1,
      paddingTop: 50,
      zIndex: 10,
      backgroundColor: 'transparent'
    },
    autocompleteContainer: {
      flex: 1,
      left: 0,
      position: 'absolute',
      right: 0,
      top: 0,
      zIndex: 10,
      padding: 5,
      backgroundColor: 'transparent'
    },
});

export default Search;