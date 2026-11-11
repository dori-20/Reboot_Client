import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { useState } from 'react';

export default function NicknameScreen({ navigation }) {
  const [nickname, setNickname] = useState('');

  return (
    <View style={styles.container}>
      <Text style={styles.title}>닉네임을 입력해주세요</Text>
      <TextInput
        style={styles.input}
        placeholder="닉네임"
        value={nickname}
        onChangeText={setNickname}
      />
      <Button
        title="다음"
        onPress={() => navigation.navigate('Agreement')}
        disabled={!nickname}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 20, marginBottom: 16 },
  input: {
    borderWidth: 1, padding: 8, width: 200, marginBottom: 16, borderRadius: 4
  }
});
