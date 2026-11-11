// screens/EmotionDiaryScreen.js
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
  FlatList,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const EMOJIS = ["😢", "😐", "🙂", "😊", "😆"];
const EMOTION_MESSAGES = {
  "😢": "오늘 많이 힘들었죠? 그래도 여기까지 와준 당신이 정말 대단해요.",
  "😐": "차분한 하루였네요. 천천히 균형을 잡아가고 있어요.",
  "🙂": "잔잔한 하루였어요. 오늘도 작은 성장을 만들어가고 있어요.",
  "😊": "좋은 에너지가 느껴지는 하루였어요! 이 기분을 이어가봐요.",
  "😆": "오늘 정말 즐거운 일이 있었나봐요! 활기가 가득해 보여요!",
};

export default function EmotionDiaryScreen() {
  const [selectedEmoji, setSelectedEmoji] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [thought, setThought] = useState("");
  const [diaries, setDiaries] = useState([]);
  const [message, setMessage] = useState("");

  // 상세보기 모달
  const [viewModal, setViewModal] = useState(false);
  const [selectedDiary, setSelectedDiary] = useState(null);

  // 선택 삭제 모드
  const [selectedIds, setSelectedIds] = useState([]);
  const [isSelecting, setIsSelecting] = useState(false);

  useEffect(() => {
    loadDiaries();
  }, []);
  useEffect(() => {
  if (selectedEmoji) {
    setMessage(EMOTION_MESSAGES[selectedEmoji] || "");
  }
}, [selectedEmoji]);

  const loadDiaries = async () => {
  try {
    const userData = await AsyncStorage.getItem("user");

    // 🔥 user가 없으면 그냥 나가기 (로그아웃 상태 등)
    if (!userData) {
      console.log("❌ EmotionDiary: user 정보 없음 (로그인 필요)");
      return;
    }

    const user = JSON.parse(userData);

    const { data } = await axios.get(
      `${process.env.EXPO_PUBLIC_API_BASE_URL}/emotion-diary/${user.user_id}`
    );
    setDiaries(data.items || []);
  } catch (e) {
    console.error("❌ 감정 일기 불러오기 실패:", e);
  }
};


const handleSave = async () => {
  if (!selectedEmoji || !thought.trim()) {
    Alert.alert("⚠️ 감정과 생각을 입력해주세요!");
    return;
  }

  try {
    const userData = await AsyncStorage.getItem("user");

    // 🔥 user가 없으면 저장도 막기
    if (!userData) {
      Alert.alert("로그인이 필요해요", "다시 로그인 후 감정일기를 기록해 주세요.");
      return;
    }

    const user = JSON.parse(userData);

    await axios.post(
      `${process.env.EXPO_PUBLIC_API_BASE_URL}/emotion-diary`,
      {
        user_id: user.user_id,
        emotion: selectedEmoji,
        content: thought,
      }
    );

    setShowModal(false);
    setThought("");
    setSelectedEmoji(null);
    Alert.alert("🧡 저장 완료", "오늘의 생각이 기록되었습니다.");
    loadDiaries();
  } catch (e) {
    console.error("감정 일기 저장 오류:", e);
    Alert.alert("오류", "서버 연결에 실패했습니다.");
  }
};


  const handleDeleteSelected = async () => {
    try {
      for (const id of selectedIds) {
        await axios.delete(`${process.env.EXPO_PUBLIC_API_BASE_URL}/emotion-diary/${id}`);
      }
      Alert.alert("🗑️ 감정이 비워졌어요", "선택한 감정 일기가 삭제되었습니다.");
      setSelectedIds([]);
      setIsSelecting(false);
      loadDiaries();
    } catch (err) {
      console.error(err);
      Alert.alert("오류", "감정 삭제 실패");
    }
  };

  const handleLongPress = (id) => {
    setIsSelecting(true);
    setSelectedIds([id]);
  };

  const handlePress = (item) => {
    if (isSelecting) {
      if (selectedIds.includes(item.id)) {
        setSelectedIds(selectedIds.filter((i) => i !== item.id));
      } else {
        setSelectedIds([...selectedIds, item.id]);
      }
    } else {
      setSelectedDiary(item);
      setViewModal(true);
    }
  };

  const renderDiary = ({ item }) => {
    const selected = selectedIds.includes(item.id);
    return (
      <TouchableOpacity
        onPress={() => handlePress(item)}
        onLongPress={() => handleLongPress(item.id)}
        activeOpacity={0.8}
      >
        <View
          style={[
            styles.diaryBox,
            selected && { backgroundColor: "#FFF6B0", borderColor: "#FFD966" },
          ]}
        >
          <Text style={styles.diaryEmoji}>{item.emotion}</Text>
          <View style={{ flex: 1 }}>
            <Text
              style={styles.diaryContent}
              numberOfLines={3}
              ellipsizeMode="tail"
            >
              {item.content}
            </Text>
            <Text style={styles.diaryDate}>
              {new Date(item.created_at).toLocaleString()}
            </Text>
          </View>
          {selected && <Text style={styles.checkMark}>✅</Text>}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>오늘 하루, 기분은 어땠나요?</Text>

      {/* 😊 감정 선택 */}
      <View style={styles.emojiRow}>
        {EMOJIS.map((emoji) => (
          <TouchableOpacity
            key={emoji}
            onPress={() => setSelectedEmoji(emoji)}
            style={[
              styles.emojiButton,
              selectedEmoji === emoji && styles.selectedEmoji,
            ]}
          >
            <Text style={styles.emoji}>{emoji}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* 카드 */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>이번 주 나의 감정 한줄평</Text>
      <Text style={styles.cardText}>
        {selectedEmoji ? message : "감정을 선택하면 한줄평이 보여요!"}
      </Text>
      </View>

      {/* 기록 버튼 */}
      <TouchableOpacity
        style={styles.writeButton}
        onPress={() => setShowModal(true)}
      >
        <Text style={styles.writeText}>📝 오늘의 생각 기록하기</Text>
      </TouchableOpacity>

      {/* 선택 모드 시 삭제 버튼 */}
      {isSelecting && (
        <TouchableOpacity
          style={styles.trashButton}
          onPress={handleDeleteSelected}
        >
          <Text style={styles.trashText}>🗑️ 선택한 감정 비우기</Text>
        </TouchableOpacity>
      )}

      {/* 리스트 */}
      <FlatList
        data={diaries}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderDiary}
        style={{ marginTop: 20 }}
        contentContainerStyle={{ paddingBottom: 100 }}
      />

      {/* 작성 모달 */}
      <Modal visible={showModal} transparent animationType="fade">
        <View style={styles.modalContainer}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>오늘의 생각을 기록해보세요</Text>
            <TextInput
              style={styles.input}
              placeholder="오늘은 어떤 하루였나요?"
              multiline
              value={thought}
              onChangeText={setThought}
            />
            <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
              <Text style={styles.saveText}>저장하기</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setShowModal(false)}>
              <Text style={styles.cancelText}>취소</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* 상세보기 모달 */}
      <Modal visible={viewModal} transparent animationType="fade">
        <View style={styles.modalContainer}>
          <View style={styles.modalBox}>
            {selectedDiary && (
              <>
                <Text style={styles.modalEmoji}>{selectedDiary.emotion}</Text>
                <Text style={styles.modalContent}>{selectedDiary.content}</Text>
                <Text style={styles.modalDate}>
                  {new Date(selectedDiary.created_at).toLocaleString()}
                </Text>
              </>
            )}
            <TouchableOpacity onPress={() => setViewModal(false)}>
              <Text style={styles.closeText}>닫기</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 16 },
  title: { fontSize: 18, fontWeight: "700", marginBottom: 12, color: "#222" },
  emojiRow: { flexDirection: "row", justifyContent: "space-around", marginBottom: 20 },
  emojiButton: { padding: 10 },
  selectedEmoji: { backgroundColor: "#FFF6B0", borderRadius: 8 },
  emoji: { fontSize: 28 },
  card: {
    backgroundColor: "#F4F8FF",
    borderRadius: 10,
    padding: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#DCE6FF",
  },
  cardTitle: { fontSize: 15, fontWeight: "700", color: "#333", marginBottom: 4 },
  cardText: { fontSize: 14, color: "#444" },
  writeButton: {
    backgroundColor: "#FFE156",
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
    marginTop: 10,
  },
  writeText: { fontSize: 15, fontWeight: "700", color: "#111" },
  trashButton: {
    backgroundColor: "#fff0f0",
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: "center",
    marginTop: 10,
    borderWidth: 1,
    borderColor: "#ffc2c2",
  },
  trashText: { fontSize: 14, color: "#b50000", fontWeight: "600" },
  diaryBox: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#eee",
  },
  diaryEmoji: { fontSize: 24, marginRight: 10 },
  diaryContent: { fontSize: 14, color: "#333", marginBottom: 4 },
  diaryDate: { fontSize: 11, color: "#888" },
  checkMark: { fontSize: 16, marginLeft: 6 },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  modalBox: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    width: 280,
    alignItems: "center",
  },
  modalTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
  modalEmoji: { fontSize: 36, marginBottom: 12 },
  modalContent: { fontSize: 15, color: "#333", marginBottom: 10, textAlign: "center" },
  modalDate: { fontSize: 12, color: "#777", marginBottom: 12 },
  closeText: { color: "#007AFF", fontWeight: "600" },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    width: "100%",
    height: 100,
    marginBottom: 10,
    textAlignVertical: "top",
  },
  saveBtn: {
    backgroundColor: "#FFE156",
    padding: 10,
    borderRadius: 8,
    width: "100%",
  },
  saveText: { textAlign: "center", fontWeight: "bold", fontSize: 16 },
  cancelText: { marginTop: 10, color: "#888" },
});
