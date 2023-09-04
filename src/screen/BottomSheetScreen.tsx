import {View, Pressable, Text, Dimensions, Platform} from 'react-native';
import React, {useLayoutEffect, useState} from 'react';
import {FlatList, GestureHandlerRootView} from 'react-native-gesture-handler';
import UserComponent from '../Components/UserComponent';
import {MOCK_USER_DATA} from '../Constants';
import Colors from '../Styles/Common/Colors';
import {styles} from '../Styles/ScreenStyle/DropdownStyles';
import Icon from 'react-native-vector-icons/Ionicons';
// Icon.loadFont();
import Spinner from 'react-native-loading-spinner-overlay';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../Navigation';

export default function BottomSheetScreen() {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [filteredData, setFilteredData] = useState(MOCK_USER_DATA);
  const categories = [
    {id: '1', category: 'All'},
    {id: '2', category: 'Engineer'},
    {id: '3', category: 'Manager'},
    {id: '4', category: 'Designer'},
    {id: '5', category: 'Community Ourreach'},
  ];
  const [opacity, setOpacity] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState('Categories');
  const [loadingVisible, setLoadingVisible] = useState(false);
  const [filterIconOpacity, setFilterIconOpacity] = useState(1);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  const changeCategory = item => {
    setLoadingVisible(true);

    setTimeout(() => {
      setLoadingVisible(false);
      if (item.category === 'All') {
        setFilteredData(MOCK_USER_DATA);
      } else {
        setFilteredData(
          MOCK_USER_DATA.filter(data => data.type == item.category),
        );
      }
      setSelectedCategory(item.category);
      setOpacity(0);
      setFilterIconOpacity(1);
    }, 100);
  };

  return (
    <GestureHandlerRootView>
      <View>
        <View
          style={{
            marginHorizontal: 100,
            marginVertical: 20,
            padding: 10,
            borderRadius: 20,
            backgroundColor: '#002C5F',
            shadowColor: '#000',
            shadowOffset: {width: 1, height: 1},
            shadowOpacity: 1,
            shadowRadius: 1,
            elevation: 10,
            zIndex: 10,
          }}>
          <Text
            style={{
              textAlign: 'center',
              fontSize: 16,
              fontWeight: 'bold',
              color: 'white',
            }}>
            {selectedCategory}
          </Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'flex-end',
            height: '100%',
          }}>
          {/* <Spinner visible={loadingVisible} textStyle={{color: Colors.white}} /> */}
          <FlatList
            contentContainerStyle={{paddingBottom: 100}}
            data={filteredData}
            keyExtractor={item => item.name}
            renderItem={({item}) => (
              <UserComponent
                name={item.name}
                imageURI={item.profileImage}
                position={item.role}></UserComponent>
            )}
          />
          <View
            style={{
              height: '100%',
              position: 'absolute',
              top: 0,
              right: 0,
              bottom: 0,
              left: 0,
              backgroundColor: 'rgba(0,0,0,0.5)',
              opacity: opacity,
            }}>
            <FlatList
              style={{
                width: '100%',
                flexDirection: 'column',
                height: '100%',
                marginTop: Platform.OS == 'ios' ? 250 : 180,
              }}
              data={categories}
              contentContainerStyle={{paddingBottom: 150}}
              keyExtractor={item => item.id}
              renderItem={({item}) => (
                <Pressable
                  onPress={() => {
                    changeCategory(item);
                  }}
                  style={styles.dropdownComponent}>
                  <Text style={styles.categoryText}>{item.category}</Text>
                </Pressable>
              )}
            />
          </View>
          <View
            style={{
              marginTop: Platform.OS == 'ios' ? 620 - 130 : 620 - 200,
              position: 'absolute',
              padding: 25,
            }}>
            <Pressable
              onPress={() => {
                setOpacity(1);
                setFilterIconOpacity(0);
              }}
              style={{
                backgroundColor: '#002C5F',
                padding: 15,
                borderRadius: 30,
                elevation: 20,
                zIndex: 20,
                shadowColor: 'black',
                shadowOffset: {width: 1, height: 1},
                shadowOpacity: 1,
                shadowRadius: 1,
                opacity: filterIconOpacity,
              }}>
              <Icon
                name="funnel-outline"
                style={{
                  fontSize: 30,
                  fontWeight: 'bold',
                  color: 'white',
                }}></Icon>
            </Pressable>
          </View>
        </View>
      </View>
    </GestureHandlerRootView>
  );
}
