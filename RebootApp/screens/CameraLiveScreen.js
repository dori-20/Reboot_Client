import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function CameraLiveScreen({navigation}) {
  return (
    
    <View style={styles.container}>
      

      { <Text style={styles.title}>나의 모습 관찰하기</Text> }


      {/* 첫 번째 카메라 박스 */}
      <View style={styles.cameraBox}>
        <Text style={styles.boxText}>카메라 라이브 뷰 1 (박스)</Text>
      </View>

      {/* 두 번째 카메라 박스 */}
      <View style={styles.cameraBox}>
        <Text style={styles.boxText}>카메라 라이브 뷰 2 (박스)</Text>
      </View>

      {/* 말풍선 메시지 */}
      <View style={styles.speechBubble}>
        <Text style={styles.speechText}>잘하고 있어요!</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center', // 수직 중앙정렬!
  },
  backButton: {
    position: 'absolute',
    top: 40,   // 화면 위에서 40px 떨어지게
    left: 20,  // 왼쪽에서 20px 떨어지게
    paddingVertical: 7,
    paddingTop: 50,
    paddingHorizontal: 16,
    borderRadius: 20,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 2 },
  },
  backButtonText: {
    fontSize: 17,
    color: '#000'
   ,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  cameraBox: {
    width: 250,   // 기존보다 살짝 작게 조정
    height: 140,
    backgroundColor: '#eee',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    marginVertical: 10, // 위아래 여백 추가
  },
  boxText: {
    fontSize: 16,
    color: '#333',
  },
  speechBubble: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#eee',
    borderRadius: 20,
    maxWidth: 250,
    alignItems: 'center',
  },
  speechText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
  },
});