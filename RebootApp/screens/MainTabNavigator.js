//MainTabNavigator.jsimport React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';

import HomeScreen from './HomeScreen';
import MissionScreen from './MissionScreen';
//import AlarmPreviewScreen from './AlarmPreviewScreen';
import CommunityScreen from './CommunityScreen';
import RoutineReportScreen from './RoutineReportScreen';
import WritePostScreen from "./WritePostScreen";
import PostDetailScreen from './PostDetailScreen';
import CommunityTabContainer from "./CommunityTabContainer";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

/* ✅ 커뮤니티 전용 Stack Navigator */
function CommunityStack() {
  return (
    <Stack.Navigator>
      {/* 커뮤니티 + 생각일기 탭 */}
      <Stack.Screen
        name="CommunityTabs"
        component={CommunityTabContainer}
        options={{ title: '커뮤니티', headerShown: false }}
      />
      {/* 새 글 작성 */}
      <Stack.Screen
        name="WritePost"
        component={WritePostScreen}
        options={{ title: '새 글 작성' }}
      />
      {/* 게시글 상세 */}
      <Stack.Screen
        name="PostDetail"
        component={PostDetailScreen}
        options={{ title: '게시글 상세' }}
      />
    </Stack.Navigator>
  );
}

export default function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: {
          height: 80,          // ★★★ 탭바 높이 크게
          paddingBottom: 10,    // ★★★ 여백 추가
          paddingTop: 10,
        },
        tabBarLabelStyle: {
          fontSize: 14,         // ★★★ 글자 크기 키움
        },
      }}
    >
      <Tab.Screen 
  name="Home" 
  component={HomeScreen}
  options={{
    tabBarIcon: ({ color, size }) => (
      <Ionicons name="home-outline" size={size} color={color} />
    )
  }}
/>

<Tab.Screen 
  name="Mission" 
  component={MissionScreen}
  options={{
    tabBarIcon: ({ color, size }) => (
      <Ionicons name="list-outline" size={size} color={color} />
    )
  }}
/>

{/* ✅ 커뮤니티 Stack 연결 */}
      <Tab.Screen
        name="Community"
        component={CommunityStack}
        options={{
          title: 'Community',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="people-outline" size={size} color={color} />
          ),
        }}
      />

<Tab.Screen 
  name="RoutineReport" 
  component={RoutineReportScreen}
  options={{
    tabBarIcon: ({ color, size }) => (
      <Ionicons name="bar-chart-outline" size={size} color={color} />
    )
  }}
/>

    </Tab.Navigator>
  );
}

