import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Alert,
  ScrollView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../api/api";
import { useRoute, useNavigation } from "@react-navigation/native";

/* ===============================
   감정 반응 정의 (톤별 분리)
================================ */

const PRIMARY_REACTIONS = [
  { type: "CHEER", label: "💛 응원해요" },
  { type: "HUG", label: "🤗 안아줄게요" },
  { type: "SAME", label: "🌿 나도 그래요" },
];

const SECONDARY_REACTIONS = [
  { type: "LOVE", label: "💕 고마워요" },
  { type: "BRAVE", label: "💪 잘 버텼어요" },
  { type: "HOPE", label: "🌈 희망이 느껴져요" },
  { type: "PROUD", label: "🌻 자랑스러워요" },
  { type: "RELAX", label: "☁️ 편안해요" },
  { type: "THANKS", label: "🙏 감사해요" },
];

const ALL_REACTIONS = [...PRIMARY_REACTIONS, ...SECONDARY_REACTIONS];

export default function PostDetailScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { post } = route.params;

  const [userId, setUserId] = useState(null);
  const [reactions, setReactions] = useState({});

  /* ===============================
     애니메이션 상태
  ================================ */

  const scaleAnim = useRef(
    ALL_REACTIONS.reduce((acc, r) => {
      acc[r.type] = new Animated.Value(1);
      return acc;
    }, {})
  ).current;

  const colorAnim = useRef(
    ALL_REACTIONS.reduce((acc, r) => {
      acc[r.type] = new Animated.Value(0);
      return acc;
    }, {})
  ).current;

  /* ===============================
     초기 데이터 로드
  ================================ */

  useEffect(() => {
    (async () => {
      const userData = await AsyncStorage.getItem("user");
      const user = JSON.parse(userData);
      setUserId(user?.user_id);
      fetchReactions(post.id);
    })();
  }, []);

  const fetchReactions = async (postId) => {
    try {
      const { data } = await api.get(`/posts/${postId}/reactions`);
      const map = {};
      data.forEach((r) => (map[r.reaction_type] = r.count));
      setReactions(map);
    } catch (e) {
      console.error("❌ 반응 불러오기 실패:", e.message);
    }
  };

  /* ===============================
     반응 클릭 처리
  ================================ */

  const toggleReaction = async (type) => {
    if (!userId) {
      Alert.alert("로그인 후 이용해주세요.");
      return;
    }

    Animated.parallel([
      Animated.sequence([
        Animated.spring(scaleAnim[type], {
          toValue: 1.15,
          useNativeDriver: false,
        }),
        Animated.spring(scaleAnim[type], {
          toValue: 1,
          friction: 4,
          useNativeDriver: false,
        }),
      ]),
      Animated.sequence([
        Animated.timing(colorAnim[type], {
          toValue: 1,
          duration: 120,
          useNativeDriver: false,
        }),
        Animated.timing(colorAnim[type], {
          toValue: 0,
          duration: 400,
          useNativeDriver: false,
        }),
      ]),
    ]).start();

    try {
      await api.post(`/posts/${post.id}/reactions`, {
        user_id: userId,
        reaction_type: type,
      });
      fetchReactions(post.id);
    } catch (e) {
      console.error("❌ 반응 처리 실패:", e.message);
    }
  };

  /* ===============================
     게시글 삭제
  ================================ */

  const handleDelete = () => {
    Alert.alert("삭제 확인", "게시글을 삭제할까요?", [
      { text: "취소", style: "cancel" },
      {
        text: "삭제",
        style: "destructive",
        onPress: async () => {
          try {
            await api.delete(`/posts/${post.id}`);
            navigation.goBack();
          } catch (e) {
            console.error("❌ 삭제 실패:", e.message);
          }
        },
      },
    ]);
  };

  /* ===============================
     반응 버튼 렌더 함수
  ================================ */

  const renderReaction = (r) => {
    const bgColor = colorAnim[r.type].interpolate({
      inputRange: [0, 1],
      outputRange: ["#f7f9fc", "#FFF9D7"],
    });

    return (
      <TouchableOpacity
        key={r.type}
        style={{ width: "31%" }}
        onPress={() => toggleReaction(r.type)}
      >
        <Animated.View
          style={[
            styles.reactionBtn,
            {
              transform: [{ scale: scaleAnim[r.type] }],
              backgroundColor: bgColor,
            },
          ]}
        >
          <Text style={styles.reactionText}>
            {r.label} {reactions[r.type] || 0}
          </Text>
        </Animated.View>
      </TouchableOpacity>
    );
  };

  /* ===============================
     렌더링
  ================================ */

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      {/* 게시글 카드 */}
      <View style={styles.postBox}>
        {post.title && <Text style={styles.title}>{post.title}</Text>}
        <Text style={styles.content}>{post.content}</Text>
        <Text style={styles.date}>
          {new Date(post.created_at).toLocaleString()}
        </Text>
      </View>

      {/* 주요 공감 */}
      <Text style={styles.sectionTitle}>공감 보내기</Text>
      <View style={styles.reactionRow}>
        {PRIMARY_REACTIONS.map(renderReaction)}
      </View>

      {/* 기타 감정 */}
    
      <View style={styles.reactionRow}>
        {SECONDARY_REACTIONS.map(renderReaction)}
      </View>

      {/* 삭제 버튼 (작성자만) */}
      {userId && (
        <TouchableOpacity onPress={handleDelete}>
          <Text style={styles.deleteText}>게시글 삭제</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
}

/* ===============================
   스타일
================================ */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },

  postBox: {
    backgroundColor: "#EAF3FF",
    borderRadius: 16,
    padding: 18,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },

  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#0A3D62",
    marginBottom: 6,
  },

  content: {
    fontSize: 17,
    color: "#333",
    lineHeight: 24,
    marginBottom: 10,
  },

  date: {
    fontSize: 13,
    color: "#7F8C8D",
    textAlign: "right",
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#333",
    marginBottom: 10,
  },

  sectionSubTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#777",
    marginTop: 18,
    marginBottom: 10,
  },

  reactionRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },

  reactionBtn: {
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginBottom: 12,
    alignItems: "center",
  },

  reactionText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#333",
    textAlign: "center",
  },

  deleteText: {
    marginTop: 20,
    textAlign: "center",
    color: "#999",
    fontSize: 13,
  },
});
