import React, {useEffect, useLayoutEffect, useRef, useState} from 'react';
import {FlatList, Pressable, View, Animated} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import ChatRoomCell from '../Components/ChatRoomCell';
import {RootState} from '../Redux/store';
import Icon from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/core';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../Navigation';
import {styles} from '../Styles/ScreenStyle/ChatRoomStyles';
import {
  useAddChatRoomMutation,
  useGetAllChatRoomsQuery,
  useEditChatRoomMutation,
} from '../API/ChatRoomAPISlice';
import {BASE_URL} from '../Constants';
import io from 'socket.io-client';
import {Swipeable, GestureHandlerRootView} from 'react-native-gesture-handler';
import {ScreenEnums as screens} from '../Models/ScreenEnums';
import {useDeleteChatRoomMutation} from '../API/ChatRoomAPISlice';
import {useGetAllReadDatesQuery} from '../API/readDatesAPISlice';
import chatRoomSlice from '../Redux/ChatRoomSlice';
import ChatRoomPasswordModal from '../Components/ChatRoomPasswordModal';

export function ChatRoomScreen() {
  //MARK: - Properties

  const user = useSelector<RootState, User>(state => state.login.user);
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [addChatRoom] = useAddChatRoomMutation();
  const {data: allChatRooms} = useGetAllChatRoomsQuery('');
  const webSocket = useRef(null);
  const [editChatRoom] = useEditChatRoomMutation();
  const [deleteChatRoom] = useDeleteChatRoomMutation();
  const allReadDates = useGetAllReadDatesQuery(user.id).currentData;
  const [readDatesMap, setReadDatesMap] = useState<{}>();
  const dispatch = useDispatch();
  const chatRoomState = useSelector<RootState, ChatRoomState>(
    state => state.chatRoom,
  );
  const actions = chatRoomSlice.actions;

  //MARK: - Life Cycle

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Pressable
          onPress={() => {
            handleCreateChatRoom();
          }}>
          <Icon style={styles.plus} name="add"></Icon>
        </Pressable>
      ),
    });
  }, [navigation]);

  useEffect(() => {
    if (allReadDates !== undefined) {
      const map = Object.fromEntries(
        allReadDates.map(r => [r.chatRoomId, r.readDate]),
      );
      setReadDatesMap(map);
    }
  }, [allReadDates]);

  useEffect(() => {
    webSocket.current = io(BASE_URL + '/chatRoom');

    webSocket.current.on('lastChat', e => {
      if (allChatRooms !== undefined) {
        let payload: ChatRoomPayload = {
          id: e.chatRoomId,
          title: '',
          lastChatContent: e.lastChatContent,
          lastChatDate: new Date(),
          isPrivate: true,
        };
        editChatRoom(payload);
      } else {
        console.log('ChatRooms is Empty');
      }
    });

    return () => {
      webSocket.current.disconnect();
    };
  }, []);

  //MARK: - Functions

  const handleCreateChatRoom = async () => {
    try {
      const payload: ChatRoomPayload = {
        id: '',
        title: user.name + "'s Room",
        lastChatContent: '',
        lastChatDate: new Date(),
        isPrivate: true,
      };
      const chatRoom = await addChatRoom(payload).unwrap();
      if (chatRoom !== null || chatRoom !== undefined) {
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handlePressChatRoom = (item: ChatRoom) => {
    navigation.navigate(screens.Chat, {room: item.id});
  };

  const renderRightActions = (dragX, id) => {
    const trans = dragX.interpolate({
      inputRange: [0, 50, 100, 101],
      outputRange: [-20, 0, 0, 1],
    });
    return (
      <Pressable onPress={() => deleteChatRoom(id)}>
        <Animated.Text
          style={[
            styles.delete,
            {
              transform: [{translateX: trans}],
            },
          ]}>
          Delete
        </Animated.Text>
      </Pressable>
    );
  };

  //MARK: - View

  return (
    <View>
      <ChatRoomPasswordModal></ChatRoomPasswordModal>
      <FlatList
        contentContainerStyle={{paddingBottom: 50}}
        data={allChatRooms}
        keyExtractor={item => item.id}
        renderItem={({item}) => (
          <GestureHandlerRootView>
            <Swipeable
              key={item.id}
              renderRightActions={dragx => renderRightActions(dragx, item.id)}>
              <Pressable
                onPress={() => {
                  handlePressChatRoom(item);
                }}>
                {readDatesMap == undefined ? (
                  <></>
                ) : (
                  <ChatRoomCell
                    chatRoom={item}
                    readDate={readDatesMap[item.id]}></ChatRoomCell>
                )}
              </Pressable>
            </Swipeable>
          </GestureHandlerRootView>
        )}
      />
    </View>
  );
}
