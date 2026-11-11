//App.js
import React, { useEffect, useState, useRef } from 'react';
import { View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';

import { navigationRef } from './utils/RootNavigation';
import { MissionProvider } from './contexts/MissionContext';

import LoginScreen from './screens/LoginScreen';
import EmailLogin from './screens/EmailLogin';
import SignUp from './screens/SignUp';
import SettingScreen from './screens/SettingScreen';
import NicknameScreen from './screens/NicknameScreen';
import AgreementScreen from './screens/AgreementScreen';
import MainTabNavigator from './screens/MainTabNavigator';
import AuthCameraScreen from './screens/AuthCameraScreen';
import CameraLiveScreen from './screens/CameraLiveScreen';
import SuccessScreen from './screens/SuccessScreen';
import MissionRecommend from './screens/MissionRecommend';
import CustomerDrawer from './screens/CustomerDrawer';

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

/** ✅ Drawer Navigator 정의 */
function DrawerNavigator() {
  return (
    <Drawer.Navigator
      initialRouteName="Main"
      drawerContent={() => <CustomerDrawer />} 
      screenOptions={{
        headerShown: false,
        drawerActiveTintColor: "#4F8EF7",
        drawerLabelStyle: { fontSize: 16 },
      }}
    >
      <Drawer.Screen name="Main" component={MainTabNavigator} options={{ title: "홈" }} />
      <Drawer.Screen name="Settings" component={SettingScreen} options={{ title: "설정" }} />
    </Drawer.Navigator>
  );
}

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const successTimerRef = useRef(null);

  // ✅ 로그인 유지 체크
  useEffect(() => {
    const checkToken = async () => {
      try {
        const user = await AsyncStorage.getItem('user');
        if (user) {
          console.log('✅ 저장된 사용자 확인됨');
          setIsLoggedIn(true);
        } else {
          console.log('❌ 저장된 사용자 없음');
        }
      } catch (e) {
        console.log('저장된 사용자 확인 중 오류:', e);
      } finally {
        setIsLoading(false);
      }
    };
    checkToken();
  }, []);

  // ✅ 알림 권한 요청
  useEffect(() => {
    registerForPushNotificationsAsync();
    return () => {
      if (successTimerRef.current) {
        clearTimeout(successTimerRef.current);
      }
    };
  }, []);

  if (isLoading) {
    return (
      <View>
        <Text>로딩 중...</Text>
      </View>
    );
  }

  return (
    <MissionProvider>
      <NavigationContainer
        ref={navigationRef}>
        <Stack.Navigator
          initialRouteName={isLoggedIn ? 'Drawer' : 'Login'}
          screenOptions={{ headerShown: false }}
        >
          {/* ✅ 로그인 / 회원가입 루트 */}
          <Stack.Screen name="Login">
            {props => (
              <LoginScreen
                onGoEmail={() => props.navigation.navigate('EmailLogin')}
                onGoSignUp={() => props.navigation.navigate('SignUp')}
              />
            )}
          </Stack.Screen>
          <Stack.Screen name="EmailLogin" component={EmailLogin} />
          <Stack.Screen name="SignUp" component={SignUp} />

          {/* ✅ Drawer 포함 메인 */}
          <Stack.Screen name="Drawer" component={DrawerNavigator} />

          {/* ✅ 기타 페이지 (헤더 표시) */}
          <Stack.Group screenOptions={{ headerShown: true, headerTitleAlign: 'center' }}>
            <Stack.Screen name="Nickname" component={NicknameScreen} options={{ title: '닉네임 설정' }} />
            <Stack.Screen name="Agreement" component={AgreementScreen} options={{ title: '약관 동의' }} />
            <Stack.Screen name="AuthCamera" component={AuthCameraScreen} options={{ title: '인증하기' }} />
            <Stack.Screen name="CameraLive" component={CameraLiveScreen} options={{ title: '나의 모습 관찰하기' }} />
            <Stack.Screen name="Success" component={SuccessScreen} options={{ title: '미션 성공' }} />
            <Stack.Screen name="Recommend" component={MissionRecommend} options={{ title: '미션 추천받기' }} />
          </Stack.Group>
        </Stack.Navigator>
      </NavigationContainer>
    </MissionProvider>
  );
}

/** ✅ 알림 권한 함수 */
async function registerForPushNotificationsAsync() {
  if (!Device.isDevice) {
    alert('실제 기기에서만 알림이 작동합니다!');
    return;
  }
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  if (finalStatus !== 'granted') {
    alert('알림 권한이 필요합니다!');
    return;
  }
  console.log('✅ 알림 권한 허용됨');
}
