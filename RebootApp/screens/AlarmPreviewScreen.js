import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function AlarmPreviewScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>하루 알림 미리보기</Text>

      <View style={styles.card}>
        <Text style={styles.label}>☀️ 오전 알림</Text>
        <Text style={styles.message}>오늘의 미션: “10시에 기상해보기 어때요?”</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>🌤 오후 알림</Text>
        <Text style={styles.message}>지금 할 수 있는 행동: “가볍게 스트레칭 해보기”</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>🌙 저녁 알림</Text>
        <Text style={styles.message}>하루 회고: “수고 많았어요. 내일도 기대해요 :)”</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, paddingTop: 40, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 24, textAlign: 'center' },
  card: {
    backgroundColor: '#f5f5f5',
    padding: 16,
    marginBottom: 16,
    borderRadius: 8,
  },
  label: { fontSize: 16, fontWeight: '600', marginBottom: 6 },
  message: { fontSize: 15, color: '#444' },
});
