import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import CommunityScreen from './CommunityScreen';
import EmotionDiaryScreen from './EmotionDiaryScreen';

const Tab = createMaterialTopTabNavigator();

export default function CommunityTabContainer() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#111',
        tabBarLabelStyle: { fontSize: 14, fontWeight: '700' },
        tabBarIndicatorStyle: { backgroundColor: '#FFE156', height: 3 },
      }}
    >
      <Tab.Screen name="커뮤니티" component={CommunityScreen} />
      <Tab.Screen name="생각 일기" component={EmotionDiaryScreen} />
    </Tab.Navigator>
  );
}
