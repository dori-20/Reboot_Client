import { View, Text, Button, StyleSheet } from 'react-native';
import { useState } from 'react';

export default function AgreementScreen({ navigation }) {
  const [agreed, setAgreed] = useState(false);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>약관에 동의해주세요</Text>
      <Button
        title={agreed ? '시작하기' : '동의하고 시작하기'}
        onPress={() => navigation.navigate('Main')} // 여기 수정!!
        disabled={!agreed}
      />
      <Button
        title={agreed ? '동의 취소' : '동의하기'}
        onPress={() => setAgreed(!agreed)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 20, marginBottom: 16 },
});
