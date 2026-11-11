// SignUp.js
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../api/api';

const emailOk = (s) => /\S+@\S+\.\S+/.test(s);

export default function SignUp() {
  const [nickname, setNickname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  const handleSignUp = async () => {
    if (!nickname.trim()) return Alert.alert('알림', '닉네임을 입력해주세요.');
    if (!emailOk(email)) return Alert.alert('알림', '올바른 이메일 형식을 입력해 주세요.');
    if (password.length < 6) return Alert.alert('알림', '비밀번호는 6자 이상으로 입력해 주세요.');
    if (!agreed) return Alert.alert('알림', '약관에 동의해야 합니다.');

    try {
      setLoading(true);
      const { data } = await api.post('/auth/signup', {
        email,
        password,
        nickname,
      });
      const { user, token } = data;

      // 토큰 저장
      await AsyncStorage.setItem('token', token);

      // (선택) 인터셉터가 있다면 아래 한 줄은 생략 가능
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      Alert.alert('회원가입 성공', `${user.users_nickname}님 환영합니다!`);
      navigation.replace('Main', { user });
    } catch (e) {
      Alert.alert('회원가입 실패', e?.response?.data?.message || e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>리부트 회원가입</Text>

      <TextInput
        placeholder="닉네임"
        value={nickname}
        onChangeText={setNickname}
        style={styles.input}
      />
      <TextInput
        placeholder="이메일"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        style={styles.input}
      />
      <TextInput
        placeholder="비밀번호"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />

      {/* 약관 동의 */}
      <Pressable
        style={[styles.checkbox, agreed && styles.checkboxChecked]}
        onPress={() => setAgreed(!agreed)}
      >
        <Text style={styles.checkboxText}>
          {agreed ? '✔ ' : ''} 서비스 이용약관 및 개인정보 처리방침 동의
        </Text>
      </Pressable>

      {/* 회원가입 버튼 */}
      <Pressable
        style={({ pressed }) => [
          styles.button,
          pressed && styles.pressed,
          (!agreed || loading) && styles.disabled,
        ]}
        onPress={handleSignUp}
        disabled={!agreed || loading}
      >
        {loading ? (
          <ActivityIndicator />
        ) : (
          <Text style={styles.buttonText}>회원가입</Text>
        )}
      </Pressable>

      {/* 뒤로가기 */}
      <Pressable
        style={({ pressed }) => [styles.backButton, pressed && styles.pressed]}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.backButtonText}>뒤로가기</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    marginBottom: 16,
    borderRadius: 12,
    fontSize: 16,
  },
  checkbox: {
    paddingVertical: 10,
    marginBottom: 16,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
  },
  checkboxChecked: { backgroundColor: '#d1f7d1' },
  checkboxText: { fontSize: 14, color: '#333' },
  button: {
    backgroundColor: '#87CEFA',
    paddingVertical: 14,
    borderRadius: 24,
    alignItems: 'center',
    marginBottom: 12,
  },
  disabled: { backgroundColor: '#bbb' },
  buttonText: { fontSize: 16, fontWeight: '700', color: '#fff' },
  backButton: {
    backgroundColor: '#eee',
    paddingVertical: 12,
    borderRadius: 24,
    alignItems: 'center',
  },
  backButtonText: { fontSize: 15, fontWeight: '600', color: '#444' },
  pressed: { opacity: 0.85 },
});