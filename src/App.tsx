// import {Image} from './image/Image';
import React from 'react';
import {
  Image,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';

function App() {
  const backgroundStyle = {
    backgroundColor: '#FFFFFF',
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle={'dark-content'}
        backgroundColor={'transparent'}
        // translucent={true}
      />
      <View style={styles.header}>
        <Text>CHAT</Text>
      </View>
      <View style={styles.image}>
        <Image source={require('./kiwes.png')} resizeMode="center" />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 75,
  },
  header: {
    color: '#303030',
  },
  image: {
    width: 100,
    height: 150,
    resizeMode: 'cover',
  },
});

export default App;
