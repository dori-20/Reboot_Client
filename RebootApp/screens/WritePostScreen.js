import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import api from '../api/api';

export default function WritePostScreen({ navigation, route }) {
    const editingPost = route?.params?.post;
    const prefillTitle = route?.params?.prefillTitle || '';
    const moodColor = '#d2eaff';
    const oneColor='#4F8EF7'
    //const colors = ['#B3E5FC', '#F8BBD0', '#FFF9C4'];
    const [title, setTitle] = useState(editingPost ? editingPost.title : prefillTitle);
    const [content, setContent] = useState(editingPost ? editingPost.content : '');
//const [moodColor, setMoodColor] = useState(editingPost?.mood_color ?? colors[0]); // 기본 블루
    

  // 글 저장 요청
  const handleSubmit = async () => {
    if (!content.trim()) {
      alert('내용을 입력하세요!');
      return;
    }

     try {
    if (editingPost) {
      // ✏️ 수정 모드
      await api.put(`/posts/${editingPost.id}`, {
  title,
  content,
  mood_color: moodColor,
  visibility: editingPost.visibility || 'ANON',
});
      console.log("✅ 수정 완료");
    } else {
      // 🆕 새 글 작성
      const res = await api.post('/posts', {
        title,
        content,
        mood_color: oneColor,
        visibility: 'ANON'
      });
      console.log("✅ 저장 완료:", res.data);
    }

    navigation.goBack();
  } catch (err) {
    console.error("❌ 저장 실패:", err.message);
    alert('저장 실패: ' + err.message);
  }
};
  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: oneColor }]}>
  {editingPost ? "✏️ 글 수정" : "✏️ 새 글 작성"}
</Text>
      <TextInput
        style={[styles.titleInput, { borderColor: moodColor }]}
        placeholder="오늘의 하루를 요약해보자면?"
        placeholderTextColor="#999"
        maxLength={50}
        value={title}
        onChangeText={setTitle}
      />

      {/* 입력창 */}
      <TextInput
        style={[styles.input, { borderColor: moodColor }]}
        placeholder="무슨 생각을 하고 있나요?"
        placeholderTextColor="#999"
        maxLength={140}
        value={content}
        onChangeText={setContent}
        multiline
      />

      {/* 버튼 */}
      <TouchableOpacity 
        style={[styles.button, { backgroundColor: oneColor }]} 
        onPress={handleSubmit}
      >
        <Text style={styles.buttonText}>
        {editingPost ? "수정하기" : "게시하기"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#FAFAFA' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20, color: '#333' },
  titleInput: {
  borderWidth: 2,
  borderRadius: 10,
  padding: 10,
  marginBottom: 12,
  backgroundColor: '#fff',
  fontSize: 18,
  fontWeight: '600',
  color: '#333'
},
  input: {
    height: 140,
    borderWidth: 2,
    borderRadius: 12,
    padding: 12,
    backgroundColor: '#fff',
    textAlignVertical: 'top',
    fontSize: 16,
    color: '#333'
  },
  subTitle: { marginTop: 16, marginBottom: 10, fontSize: 16, fontWeight: '500', color: '#444' },
  colorRow: { flexDirection: 'row', gap: 16, marginBottom: 20 },
  colorCircle: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
  },
  button: {
    marginTop: 10,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 3, // 안드로이드 그림자
    shadowColor: "#000", // iOS 그림자
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 }
});