import React, {useEffect, useLayoutEffect, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../Navigation';
import {View, Text, Pressable} from 'react-native';
import {styles} from '../Styles/ScreenStyle/InvitationScreenStyles';
import {FlatList, GestureHandlerRootView} from 'react-native-gesture-handler';
import InvitationSentComponent from '../Components/InvitationSentComponent';
import InvitationReceivedComponent from '../Components/InvitationReceivedComponent';
import Colors from '../Styles/Common/Colors';
import {useSelector} from 'react-redux';
import {RootState} from '../Redux/store';
import {useGetAllInvitationsQuery} from '../API/InvitationAPISlice';

export default function InvitationScreen() {
  //MARK: - Properties

  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [selectedTab, setSelectedTab] = useState('received');
  const user = useSelector<RootState, User>(state => state.login.user);
  const invitations = useGetAllInvitationsQuery(user.id).data;
  const [sentUsers, setSentUsers] = useState<User[]>([]);
  const [receivedUsers, setReceivedUsers] = useState<User[]>([]);

  //MARK: - Life Cycle

  useEffect(() => {
    if (invitations !== undefined) {
      const sent = invitations
        .filter(inv => !inv.isReceived)
        .map(inv => inv.fromUser);
      const received = invitations
        .filter(inv => inv.isReceived)
        .map(inv => inv.fromUser);
      setSentUsers(sent);
      setReceivedUsers(received);
    }
  }, [invitations]);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'Invitation Management',
      headerTitleAlign: 'center',
      headerStyle: {
        backgroundColor: Colors.white,
      },
      headerTintColor: Colors.black,
    });
  }, [navigation]);

  //MARK: - Functions

  const tabButtonStyle = (current: string) => {
    if (current == selectedTab) {
      return styles.selectedButton;
    } else {
      return styles.deselectedButton;
    }
  };

  const tabButtonTextStyle = (current: string) => {
    if (current == selectedTab) {
      return styles.selectedButtonText;
    } else {
      return styles.deselectedButtonText;
    }
  };

  //MARK: - View

  return (
    <GestureHandlerRootView>
      <View>
        <View style={styles.tabView}>
          <Pressable
            onPress={() => {
              setSelectedTab('received');
            }}
            style={tabButtonStyle('received')}>
            <Text style={tabButtonTextStyle('received')}>Received</Text>
          </Pressable>
          <Pressable
            onPress={() => {
              setSelectedTab('sent');
            }}
            style={tabButtonStyle('sent')}>
            <Text style={tabButtonTextStyle('sent')}>Sent</Text>
          </Pressable>
        </View>
        {selectedTab == 'received' ? (
          <FlatList
            contentContainerStyle={{paddingBottom: 100}}
            data={receivedUsers}
            keyExtractor={item => item.id}
            renderItem={({item}) => (
              <InvitationReceivedComponent
                user={item}></InvitationReceivedComponent>
            )}
          />
        ) : (
          <FlatList
            contentContainerStyle={{paddingBottom: 100}}
            data={sentUsers}
            keyExtractor={item => item.id}
            renderItem={({item}) => (
              <InvitationSentComponent user={item}></InvitationSentComponent>
            )}
          />
        )}
      </View>
    </GestureHandlerRootView>
  );
}
