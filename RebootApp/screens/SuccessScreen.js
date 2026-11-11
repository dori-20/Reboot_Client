import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import ConfettiCannon from "react-native-confetti-cannon";

// 폭죽 아이콘 (파일명은 너가 올린 PNG 파일 이름으로 맞춰줘!)
import FireworkIcon from '../assets/success-firework.png';

export default function SuccessScreen({ navigation }) {
  const [showConfetti, setShowConfetti] = useState(true);

  return (
    <View style={styles.container}>
      {showConfetti && (
        <ConfettiCannon
          count={40}
          origin={{ x: -10, y: 0 }}
          fadeOut={true}
          autoStart={true}
          explosionSpeed={250}
        />
      )}

      {/* 🎉 이모지 대신 아이콘 이미지 */}
      <Image source={FireworkIcon} style={styles.fireworkIcon} />

      <Text style={styles.title}>미션 성공!</Text>

      <Text style={styles.message}>
        오늘도 잘 해냈어요!{'\n'}
        인증샷을 남기거나 다음 미션을 추천받아보세요
      </Text>

      {/* 인증하러 가기 버튼 */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('AuthCamera')}
        activeOpacity={0.85}
      >
        <Text style={styles.buttonText}>카메라로 인증하러 가기</Text>
      </TouchableOpacity>

      {/* 다음 미션 추천받기 버튼 */}
      <TouchableOpacity
        style={[styles.button, styles.recommendButton]}
        onPress={() => navigation.navigate('Recommend')}
        activeOpacity={0.85}
      >
        <Text style={styles.buttonText}>다음 미션 추천받기</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#d2eaff',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },

  fireworkIcon: {
    width: 110,
    height: 110,
    marginBottom: 24,
    resizeMode: 'contain',
  },

  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#115db4',
    marginBottom: 16,
    textAlign: 'center',
  },

  message: {
    fontSize: 17,
    color: '#222',
    marginBottom: 40,
    textAlign: 'center',
  },

  button: {
    backgroundColor: '#4F8EF7',
    paddingVertical: 14,
    paddingHorizontal: 36,
    borderRadius: 26,
    marginBottom: 14,
    shadowColor: "#4F8EF7",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 3,
  },

  recommendButton: {
    backgroundColor: '#F361DC',
  },

  buttonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
