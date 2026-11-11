// EmailLogin.js
import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Pressable, Alert, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../api/api';

const emailOk = (s) => /\S+@\S+\.\S+/.test(s);

export default function EmailLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

const handleLogin = async () => {
  if (!emailOk(email)) return Alert.alert('알림', '올바른 이메일 형식을 입력해 주세요.');
  if (!password) return Alert.alert('알림', '비밀번호를 입력해 주세요.');

  try {
    setLoading(true);
    
    const { data } = await api.post('/auth/login', { email, password });
    const { user, token } = data;

    // 🔥 로그인한 사람의 정보를 저장
    await AsyncStorage.setItem(
      "user",
      JSON.stringify({
        user_id: user.user_id,
        users_nickname: user.users_nickname,
        is_guest: false,
      })
    );

    // JWT 저장
    await AsyncStorage.setItem("token", token);
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

    Alert.alert("로그인 성공", `${user.users_nickname}님 환영합니다!`);

    navigation.replace("Drawer", {
      screen: "Main",
      params: { user }
    });

  } catch (e) {
    Alert.alert(
      "로그인 실패",
      e?.response?.data?.message || "이메일 또는 비밀번호를 확인하세요."
    );
  } finally {
    setLoading(false);
  }
};

  return (
    <View style={styles.container}>
      <Text style={styles.title}>리부트 로그인</Text>

      <TextInput placeholder="이메일" style={styles.input} autoCapitalize="none" keyboardType="email-address" value={email} onChangeText={setEmail} />
      <TextInput placeholder="비밀번호" secureTextEntry style={styles.input} value={password} onChangeText={setPassword} />

      <Pressable style={({ pressed }) => [styles.button, pressed && styles.pressed, loading && styles.disabled]} onPress={handleLogin} disabled={loading}>
        {loading ? <ActivityIndicator /> : <Text style={styles.buttonText}>로그인</Text>}
      </Pressable>

      <Pressable style={({ pressed }) => [styles.backButton, pressed && styles.pressed]} onPress={() => navigation.goBack()}>
        <Text style={styles.backButtonText}>뒤로가기</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 30, textAlign: 'center' },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 12, marginBottom: 16, borderRadius: 12, fontSize: 16 },
  button: { backgroundColor: '#87CEFA', paddingVertical: 14, borderRadius: 24, alignItems: 'center', marginBottom: 12 },
  buttonText: { fontSize: 16, fontWeight: '700', color: '#fff' },
  backButton: { backgroundColor: '#eee', paddingVertical: 12, borderRadius: 24, alignItems: 'center' },
  backButtonText: { fontSize: 15, fontWeight: '600', color: '#444' },
  pressed: { opacity: 0.85 },
  disabled: { opacity: 0.6 },
});

