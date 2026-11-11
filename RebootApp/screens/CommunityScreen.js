import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { Alert } from 'react-native';

import api from '../api/api';

const PROMPT_BG     = '#E1ECFF'; // #4F8EF7 톤을 연하게(파스텔)
const PROMPT_BORDER = '#C7DAFF';
const PROMPT_ACCENT = '#4F8EF7';
const PROMPT_DARK   = '#183A8A';

export default function CommunityScreen() {
  const [posts, setPosts] = useState([]);
  const [topic, setTopic] = useState(null);
  const navigation = useNavigation();
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) { fetchTopic(); fetchPosts(); }
  }, [isFocused]);

  const fetchTopic = async () => {
    try {
      const { data } = await api.get('/topics/today');
      setTopic(data);
    } catch (e) {
      console.log('❌ 오늘의 질문 불러오기 실패:', e.message);
    }
  };

  const fetchPosts = async () => {
    try {
      const res = await api.get('/posts');
      setPosts(res.data.items);
    } catch (err) {
      console.error('❌ 게시물 불러오기 실패:', err.message);
    }
  };

  const handleLongPress = (item) => {
    Alert.alert(
      "게시물 옵션",
      "이 글을 어떻게 할까요?",
      [
        { text: "수정", onPress: () => navigation.navigate("WritePost", { post: item }) },
        { text: "삭제", onPress: () => handleDelete(item.id), style: "destructive" },
        { text: "취소", style: "cancel" }
      ]
    );
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/posts/${id}`);
      fetchPosts(); // 새로고침
    } catch (err) {
      console.error("❌ 삭제 실패:", err.message);
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate("PostDetail", { post: item })}
      onLongPress={() => handleLongPress(item)}
      activeOpacity={0.9}
    >
      {/* 화이트 카드 + 좌측 기분색 막대 */}
      <View style={styles.postBox}>
        <View style={[styles.colorBar, { backgroundColor: item.mood_color || '#B3E5FC' }]} />
        <View style={{ flex: 1 }}>
          {/* 제목 */}
          {item.title ? (
            <Text style={styles.postTitle} numberOfLines={1} ellipsizeMode="tail">
              {item.title}
            </Text>
          ) : null}
          {/* 본문 */}
          <Text style={styles.content} numberOfLines={3} ellipsizeMode="tail">
            {item.content}
          </Text>
          <Text style={styles.date}>{new Date(item.created_at).toLocaleString()}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* 오늘의 질문 카드 */}
      {topic && (
        <TouchableOpacity
          style={styles.promptCard}
          onPress={() => navigation.navigate("WritePost", { prefillTitle: topic.title })}
          activeOpacity={0.9}
        >
          <Text style={styles.promptBadge}>오늘의 질문</Text>
          <Text style={styles.promptTitle} numberOfLines={2}>{topic.title}</Text>
          {topic.body ? (
            <Text style={styles.promptBody} numberOfLines={2}>{topic.body}</Text>
          ) : null}
          {/* 링크형 CTA로 더 가볍게 */}
          <View style={styles.promptCtaRow}>
            <Text style={styles.promptCtaText}>이 주제로 글쓰기</Text>
            <Text style={styles.promptCtaArrow}>→</Text>
          </View>
        </TouchableOpacity>
      )}

      {/* 섹션 타이틀로 가독성 분리 */}
      <Text style={styles.sectionTitle}>오늘의 글</Text>

      <FlatList
        data={posts}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 96 }}
      />

      {/* 👉 플로팅 버튼 (색상 랜덤) */}
      <TouchableOpacity
        style={[styles.fab, { backgroundColor: '#66B2FF' }]}
        onPress={() => navigation.navigate("WritePost")}
      >
        <Text style={styles.fabText}>＋</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },

  // 오늘의 질문 카드: 더 작고, 파스텔 블루 톤
  promptCard: {
    backgroundColor: PROMPT_BG,
    borderRadius: 12,
    padding: 12,          // ⬅ 작게
    marginBottom: 12,
    borderWidth: 1.2,
    borderColor: PROMPT_BORDER,
  },
  promptBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#EEF4FF',
    color: PROMPT_ACCENT,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
    fontSize: 11,         // ⬅ 작게
    fontWeight: '700',
    marginBottom: 6,
  },
  promptTitle: { fontSize: 15, fontWeight: '800', color: PROMPT_DARK, marginBottom: 4 }, // ⬅ 작게
  promptBody:  { fontSize: 13, color: '#2b2b2b', marginBottom: 4 },                       // ⬅ 작게
  promptCtaRow: {
  flexDirection: 'row',
  alignItems: 'center',
  marginTop: 4,
  alignSelf: 'flex-start',
},
promptCtaText: {
  // 👉 배경 제거(없었어도 명시적으로 투명 처리)
  backgroundColor: 'transparent',
  color: PROMPT_ACCENT,   // 파란색 글씨
  fontWeight: '700',
  fontSize: 13,
  paddingHorizontal: 0,
  paddingVertical: 0,
},
promptCtaArrow: {
  color: PROMPT_ACCENT,
  marginLeft: 6,
  fontSize: 13,
},

  // 섹션 타이틀
  sectionTitle: { fontSize: 13, fontWeight: '700', color: '#6B7280', marginBottom: 8, marginTop: 6 },

  // 일반 글 카드: 화이트 + 파란 테두리, 좌측 색 막대
  postBox: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    borderWidth: 1.2,
    borderColor: '#E2EEFF',
    borderRadius: 14,
    padding: 12,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  colorBar: { width: 6, borderRadius: 3, marginRight: 12 },
  postTitle: { fontSize: 16, fontWeight: '700', color: '#111827', marginBottom: 4 },
  content: { fontSize: 15, color: '#333', marginBottom: 6 },
  date: { fontSize: 12, color: '#6B7280' },

  // ✅ 플로팅 버튼 스타일
  fab: {
    position: "absolute",
    bottom: 24,
    right: 24,
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 2 },
  },
  fabText: { color: "#fff", fontSize: 28, fontWeight: "bold" },
});