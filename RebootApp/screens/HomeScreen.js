//HomeScreen.js
import React, { useEffect, useState, useCallback, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Button, Image, Modal } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../api/api';
import { updateMissionStatus, fetchTodayMissions } from '../services/missionService';
import { fetchLatestAction } from '../services/aiService';   // ✅ AI 연동 추가
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import ConfirmLogoutModal from "../components/ConfirmLogoutModal";
import { Animated } from "react-native";

const API_BASE = "http://13.239.31.20:3000";

// ✅ 미션 정보 매핑 (AI 코드 + 라벨 + 설명)
const randomMissionPool = [
  { icon: '🍽️', code:'C001', label: '음식을 먹는다', desc: '제시간에 식사를 챙겨 드셔보세요.' },
  { icon: '🥤', code:'C002', label: '음료를 마신다', desc: '물이나 따뜻한 음료를 한 잔 마셔보세요.' },
  { icon: '🦷', code:'C007', label: '이를 닦는다', desc: '양치로 상쾌한 하루를 시작하거나 마무리해요.' },
  { icon: '🤲', code:'C009', label: '손을 씻는다', desc: '외출 후나 식사 전, 손을 깨끗이 씻어보세요.' },
  { icon: '💇‍♀️', code:'C028', label: '머리를 손질하다', desc: '거울 앞에서 단정하게 머리를 정돈해보세요.' },
  { icon: '🧢', code:'C033', label: '모자를 쓴다', desc: '오늘은 좋아하는 모자를 써보는 건 어때요?' },
  { icon: '👟', code:'C035', label: '신발을 신는다', desc: '밖에 나갈 준비, 신발을 단단히 신어봐요.' },
  { icon: '🗑️', code:'C038', label: '쓰레기를 버린다', desc: '작은 정리로도 개운해질 수 있어요.' },
  { icon: '📚', code:'C046', label: '공부하다', desc: '짧게라도 집중해서 학습해보는 시간을 가져봐요.' },
  { icon: '🃏', code:'C050', label: '카드게임을 하다', desc: '간단한 카드게임으로 머리를 식혀보세요.' },
  { icon: '🍽️', code:'C061', label: '그릇을 정리하다', desc: '식사 후 그릇을 깨끗이 정리해보세요.' },
  { icon: '📄', code:'C063', label: '책(서류)를 본다', desc: '짧은 글이나 자료를 차분히 읽어봐요.' },
  { icon: '📞', code:'C069', label: '전화통화를 하다', desc: '지인에게 안부 인사를 전해보는 건 어때요?' },
  { icon: '💻', code:'C073', label: '컴퓨터를 한다', desc: '컴퓨터 작업을 잠깐 정리해보는 시간을 가져요.' },
  { icon: '📱', code:'C074', label: '휴대폰을 조작한다', desc: '필요한 앱이나 연락을 확인해보세요.' },
  { icon: '🧹', code:'C079', label: '청소를 하다', desc: '주변을 정리해보면 기분이 새로워질 거예요.' },
  { icon: '🎸', code:'C084', label: '기타를 친다', desc: '좋아하는 곡을 가볍게 연주해보는 건 어때요?' },
  { icon: '🐕', code:'C090', label: '반려동물과 논다', desc: '잠깐이라도 반려동물과 교감해보세요.' },
  { icon: '🌱', code:'C093', label: '식물에 물을 준다', desc: '화분의 상태를 살펴보고 물을 주세요.' },
  { icon: '🏋️‍♀️', code:'C098', label: '스쿼트를 하다', desc: '가볍게 몸을 움직이며 스트레칭해봐요.' },
  { icon: '⚽', code:'C101', label: '공놀이를 하다', desc: '몸을 쓰는 활동으로 기분 전환해봐요.' },
  { icon: '💃', code:'C112', label: '춤을 춘다', desc: '신나는 음악과 함께 가볍게 춤을 춰봐요.' },
];

const missionIconMap = {
  '음식을 먹는다': require('../assets/mission-eat.png'),
  '음료를 마신다': require('../assets/mission-drink.png'),
  '이를 닦는다': require('../assets/mission-teeth.png'),
  '손을 씻는다': require('../assets/mission-wash-hands.png'),
  '머리를 손질하다': require('../assets/mission-hair.png'),
  '모자를 쓴다': require('../assets/mission-hat.png'),
  '신발을 신는다': require('../assets/mission-shoes.png'),
  '쓰레기를 버린다': require('../assets/mission-trash.png'),
  '공부하다': require('../assets/mission-study.png'),
  '카드게임을 하다': require('../assets/mission-cardgame.png'),
  '그릇을 정리하다': require('../assets/mission-dishes.png'),
  '책(서류)를 본다': require('../assets/mission-read.png'),
  '전화통화를 하다': require('../assets/mission-call.png'),
  '컴퓨터를 한다': require('../assets/mission-computer.png'),
  '휴대폰을 조작한다': require('../assets/mission-phone.png'),
  '청소를 하다': require('../assets/mission-clean.png'),
  '기타를 친다': require('../assets/mission-guitar.png'),
  '반려동물과 논다': require('../assets/mission-pet.png'),
  '식물에 물을 준다': require('../assets/mission-plant.png'),
  '스쿼트를 하다': require('../assets/mission-squat.png'),
  '공놀이를 하다': require('../assets/mission-ball.png'),
  '춤을 춘다': require('../assets/mission-dance.png'),
  
  // '이를 닦는다': require('../assets/mission-teeth.png'),
  // 이런 식으로 늘려가면 됨
};

// "🍽️ 음식을 먹는다" → "음식을 먹는다" 로 정리
const emojiRegex = /[\p{Emoji_Presentation}\p{Extended_Pictographic}]/u;

const getPlainLabel = (text) => {
  if (!text) return '';

  const trimmed = text.trim();      // 앞뒤 공백 제거
  const parts = trimmed.split(' ');

  if (parts.length <= 1) return trimmed;

  // 첫 토큰이 이모지면 떼고 나머지 / 아니면 그냥 전체
  if (emojiRegex.test(parts[0])) {
    return parts.slice(1).join(' ').trim();
  }
  return trimmed;
};

// 점점점(...) 애니메이션
function useDotsAnimation() {
  const [dots, setDots] = useState("");
  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length < 3 ? prev + "." : ""));
    }, 500);
    return () => clearInterval(interval);
  }, []);
  return dots;
}

// 초록불 깜빡임
function useBlinkingLight(isActive) {
  const [light, setLight] = useState(true);
  useEffect(() => {
    if (!isActive) return;
    const interval = setInterval(() => {
      setLight((prev) => !prev);
    }, 600);
    return () => clearInterval(interval);
  }, [isActive]);
  return light;
}

export default function HomeScreen() {
const [showPrivacyModal, setShowPrivacyModal] = useState(false);

const [isCompleting, setIsCompleting] = useState(false);
const [lastDetectedLabel, setLastDetectedLabel] = useState(null);

const scaleAnim = useRef(new Animated.Value(1)).current;
const opacityAnim = useRef(new Animated.Value(1)).current;

const [trackingMission, setTrackingMission] = useState(null);

const [progress, setProgress] = useState(0); // 0~100
const [progressText, setProgressText] = useState("");

const runCheckAnim = () => {
  scaleAnim.setValue(0.6);
  opacityAnim.setValue(0);

  Animated.parallel([
    Animated.timing(scaleAnim, {
      toValue: 1.2,
      duration: 160,
      useNativeDriver: true,
    }),
    Animated.timing(opacityAnim, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }),
  ]).start(() => {
    Animated.timing(scaleAnim, {
      toValue: 1,
      duration: 120,
      useNativeDriver: true,
    }).start();
  });
};

const getProgressColor = () => {
  if (progress < 40) return '#9EC5FF';
  if (progress < 80) return '#4F8EF7';
  return '#4CAF50';
};
  
  const [latestAction, setLatestAction] = useState(null);  // 최근 인식된 행동 저장
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [missions, setMissions] = useState([]);
  
  const [recentlyCompleted, setRecentlyCompleted] = useState(null);

  const dots = useDotsAnimation();
  const aiLight = useBlinkingLight(!!latestAction);
  const navigation = useNavigation();
  

React.useLayoutEffect(() => {
  navigation.setOptions({
    headerRight: () => (
      <TouchableOpacity 
        style={{ marginRight: 16 }}   // 👉 오른쪽 여백 추가!
        onPress={() => setShowLogoutModal(true)}
      >
        <Ionicons name="log-out-outline" size={24} color="#333" />
      </TouchableOpacity>
    ),
  });
}, [navigation]);

  // ✅ 오늘의 미션 불러오기
  const loadMissions = async () => {
    try {
      const res = await fetchTodayMissions(1);
      setMissions(res.data.missions || []);
    } catch (error) {
      console.error('🚨 미션 불러오기 실패:', error);
    }
  };

  const getBatteryColor = () => {
  if (progress < 20) return '#b1cffcff';
  if (progress < 40) return '#89b5f7ff';
  if (progress < 60) return '#3f8afaff';
  if (progress < 80) return '#367efaff';
  return '#0050dbff';
};

  useFocusEffect(
    useCallback(() => {
      loadMissions();
    }, [])
  );

const TRACK_DURATION = 5000; // 15초

useEffect(() => {
  const interval = setInterval(async () => {
    const latest = await fetchLatestAction();
    if (!latest) return;

    setLatestAction(latest);

    const clean = (text) =>
      text.replace(/[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu, "").trim();

    const target = missions.find(
      (m) => clean(m.mission_description) === latest.label
    );

    if (!target || target.status === "completed") return;

    if (trackingMission && latest.label !== trackingMission.label) {
  setTrackingMission(null);
  setProgress(0);
  setProgressText("");
  return;
}

    // 🔵 tracking 시작
    if (!trackingMission || trackingMission.mission_id !== target.mission_id) {
  setTrackingMission({
    mission_id: target.mission_id,
    label: latest.label,
    startTime: Date.now(),
  });
  setProgress(0);
  setProgressText("인식 중이에요…");
  return;
}

    // 🔵 tracking 중
    const elapsed = Date.now() - trackingMission.startTime;
    const percent = Math.min((elapsed / TRACK_DURATION) * 100, 100);
    setProgress(percent);

    // 🔵 단계별 문구
    if (percent >= 10 && percent < 40) {
    setProgressText("지금처럼 한 발자국 더 나아가봐요");
  } else if (percent >= 60 && percent < 90) {
    setProgressText("이 흐름을 조금만 더 이어가볼까요");
  } else if (percent >= 100 && !isCompleting) {
    setIsCompleting(true);
    setProgressText("이제 다 왔어요");

          await axios.post(`${API_BASE}/missions/increment-completed`, {
            user_id: 1,
            mission_id: target.mission_id,
          });

          setTrackingMission(null);
          setProgress(100);

          navigation.navigate("Success");
          loadMissions();

          setIsCompleting(false);         // 🔓 다음 미션을 위해 해제
        }
  }, 1000);

  return () => clearInterval(interval);
}, [missions, trackingMission]);

  // ✅ 수동 완료 버튼
  const handleMissionPress = async (missionId, currentStatus) => {
    const newStatus = currentStatus === 'completed' ? 'pending' : 'completed';
    try {
      await updateMissionStatus(1, missionId, newStatus);
      if (newStatus === "completed") {
  runCheckAnim();
}
      await loadMissions();
    } catch (error) {
      console.error('🚨 미션 상태 변경 실패:', error);
    }
  };

  return (
    <>
    <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.title}>Re:Boot 홈 화면</Text>
    <TouchableOpacity
      style={styles.privacyBadge}
      onPress={() => setShowPrivacyModal(true)}
    >
      <Ionicons name="lock-closed-outline" size={14} color="#5A7FDB" />
      <Text style={styles.privacyBadgeText}>안심 사용 중</Text>
    </TouchableOpacity>
     {latestAction && (
  <View style={styles.actionBox}>
    {trackingMission && (
  <View style={{ marginBottom: 20, alignItems: 'center' }}>

  <Text style={styles.coachMessage}>
    {progressText}
  </Text>

  {/* 🔋 메인 배터리 UI */}
  <View style={styles.batteryWrapper}>
    <View style={styles.batteryBody}>
      <View
        style={[
          styles.batteryFill,
          {
            width: `${progress}%`,
            backgroundColor: getBatteryColor(),
          }
        ]}
      />

      {/* 퍼센트 텍스트 (배터리 안) */}
      <Text style={styles.batteryInnerText}>
        {Math.round(progress)}%
      </Text>
    </View>

    <View style={styles.batteryCap} />
  </View>
</View>
)}

    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
 
 <View style={styles.aiStatusRow}>
  <View
    style={[
      styles.aiDot,
      { backgroundColor: aiLight ? '#4CAF50' : '#A5D6A7' }
    ]}
  />
  <Text style={styles.aiStatusText}>
    실시간 인식중{dots}
  </Text>
</View>
</View>

    {/* 🔵 인식된 행동 내용 */}
<View style={{
  flexDirection: 'row',
  alignItems: 'center',
  marginTop: 16,
  backgroundColor: '#ffffff',
  padding: 14,
  borderRadius: 14,
}}>
  <Image
    source={missionIconMap[latestAction.label]}
    style={{ width: 36, height: 36, marginRight: 12 }}
  />
  <Text style={{
    fontSize: 17,
    fontWeight: '700',
    color: '#194ea0',
  }}>
    {latestAction.label}
  </Text>
</View>
  </View>
)}

      

      {/* ✅ 카메라 화면 이동 버튼 */}
            <TouchableOpacity style={styles.addMissionBtn}
        onPress={() => navigation.navigate("Mission")}>
        <Text style={styles.addMissionText}>오늘의 미션 선택</Text>
      </TouchableOpacity>

      {/* ✅ 오늘의 미션 */}
      <View style={styles.missionContainer}>
        <Text style={styles.missionTitle}>오늘의 미션</Text>
        {missions.length === 0 ? (
          <View style={styles.card}>
            <Text style={styles.noMissionText}>
              아직 선택한 미션이 없습니다.{'\n'}미션 선택 화면에서 미션을 추가해보세요!
            </Text>
          </View>
        ) : (
          missions.map((m) => {
  const rawLabel = m.mission_description || '';
  const label = getPlainLabel(rawLabel); // 이모지 제거된 순수 라벨
  const match = randomMissionPool.find(item => item.label === label);

  return (
    <TouchableOpacity
      key={m.mission_id}
      style={[styles.card, m.status === 'completed' && styles.cardDone]}
      onPress={() => handleMissionPress(m.mission_id, m.status)}
      activeOpacity={0.7}
    >
      <View style={styles.cardHeader}>
        {/* ✅ PNG 아이콘 우선, 없으면 이모지 fallback */}
        {missionIconMap[label] ? (
          <Image
            source={missionIconMap[label]}
            style={styles.missionIcon}
          />
        ) : (
          <Text style={styles.icon}>{match?.icon || '📝'}</Text>
        )}

        <Text style={styles.label}>{label}</Text>

        {m.status === 'completed' && (
          <Animated.Text
            style={[
              styles.check,
              {
                transform: [{ scale: scaleAnim }],
                opacity: opacityAnim,
              },
            ]}
          >
            ✓
          </Animated.Text>
        )}
      </View>

      <Text style={styles.message}>{match?.desc || '설명이 없습니다.'}</Text>
      <Text style={styles.timeSlotText}>{m.mission_time_period}</Text>
    </TouchableOpacity>
  );
})

        )}
      </View>
      <ConfirmLogoutModal
  visible={showLogoutModal}
  onCancel={() => setShowLogoutModal(false)}
  onConfirm={async () => {
    await AsyncStorage.removeItem("user");
    setShowLogoutModal(false);
    navigation.replace("Login");
  }}
/>
    </ScrollView>

    <Modal
  visible={showPrivacyModal}
  transparent
  animationType="fade"
>
  <View style={styles.privacyModalOverlay}>
    <View style={styles.privacyModalBox}>
      
      <Ionicons
        name="lock-closed"
        size={28}
        color="#4F8EF7"
        style={{ marginBottom: 12 }}
      />

      <Text style={styles.privacyModalText}>
        동작 인식은 기기 내에서만 처리되며,{"\n"}
        영상은 저장되거나 외부로 전송되지 않습니다.
      </Text>

      <TouchableOpacity
        style={styles.privacyModalBtn}
        onPress={() => setShowPrivacyModal(false)}
      >
        <Text style={styles.privacyModalBtnText}>확인</Text>
      </TouchableOpacity>

    </View>
  </View>
</Modal>
</>
    
  );
  
}

const styles = StyleSheet.create({
  scrollContainer: { flex: 1, backgroundColor: '#fff' },
  container: {
    paddingTop: 40,
    paddingHorizontal: 20,
    alignItems: 'center',
    paddingBottom: 40,
  },
  title: { fontSize: 27, fontWeight: 'bold', marginBottom: 40, textAlign: 'center' },
actionBox: {
  backgroundColor: '#E6F0FF',
  paddingVertical: 20,
  paddingHorizontal: 18,
  borderRadius: 18,
  marginBottom: 24,
  width: '100%',
  minHeight: 150,

  shadowColor: '#4F8EF7',
  shadowOpacity: 0.15,
  shadowRadius: 10,
  elevation: 4,
},
  actionText: { fontSize: 15, fontWeight: '600', color: '#194ea0' },
  addMissionBtn: {
    backgroundColor: '#4F8EF7',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 30,
    marginTop: 15,
    marginBottom: 20,
    shadowColor: '#4F8EF7',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.19,
    shadowRadius: 8,
    elevation: 4,
  },
  addMissionText: { color: '#fff', fontSize: 17, fontWeight: 'bold', letterSpacing: 1, textAlign: 'center' },
  missionContainer: { width: '100%', alignItems: 'center', marginTop: 20 },
  missionTitle: { fontSize: 19, fontWeight: 'bold', marginBottom: 20, textAlign: 'center', color: '#222' },
card: {
  width: '95%',
  backgroundColor: '#ffffff',
  padding: 18,
  marginBottom: 15,
  borderRadius: 14,
  borderLeftWidth: 6,
  borderLeftColor: '#4F8EF7',
  shadowColor: '#000',
  shadowOpacity: 0.05,
  shadowRadius: 3,
  elevation: 2,
},
cardDone: {
  backgroundColor: '#e7f2ff',
  borderLeftColor: '#2a6fe8'
},
icon: { fontSize: 22, marginRight: 10 },
  cardDone: { backgroundColor: '#d2eaff', borderColor: '#4F8EF7', borderWidth: 1 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 7 },
  icon: { fontSize: 18, marginRight: 8 },
  label: { fontSize: 15, fontWeight: '700', color: '#194ea0', marginRight: 6 },
  check: { fontSize: 17, color: '#4F8EF7', fontWeight: 'bold', marginLeft: 6 },
  message: { fontSize: 15, color: '#444', lineHeight: 22, marginLeft: 2 },
  noMissionText: { fontSize: 15, color: '#666', textAlign: 'center', lineHeight: 22 },
  timeSlotText: { fontSize: 12, color: '#888', marginTop: 4, marginLeft: 2 },
  actionDetected: {
  fontSize: 15,
  fontWeight: "600",
  color: "#194ea0",
  marginTop: 8,
},

missionIcon: {
  width: 28,
  height: 28,
  marginRight: 2,
  resizeMode: 'contain',
},

actionDetectedRow: {
  flexDirection: 'row',
  alignItems: 'center',
  marginTop: 8,
},

actionDetectedLabel: {
  fontSize: 15,
  fontWeight: '600',
  color: '#194ea0',
  marginLeft: 6,
},

coachMessage: {
  fontSize: 18,
  fontWeight: '800',
  color: '#194ea0',
  marginBottom: 14,
},
progressTrack: {
  height: 14,
  backgroundColor: '#CFE0FF',
  borderRadius: 8,
  overflow: 'hidden',
  marginBottom: 10,
},

progressFill: {
  height: '100%',
  backgroundColor: '#4F8EF7',
  borderRadius: 8,
},
aiStatusRow: {
  flexDirection: 'row',
  alignItems: 'center',
  marginBottom: 12,
},

aiDot: {
  width: 8,
  height: 8,
  borderRadius: 4,
  marginRight: 6,
},

aiStatusText: {
  fontSize: 12,
  fontWeight: '500',
  color: '#5A7FDB',
},

batteryWrapper: {
  flexDirection: 'row',
  alignItems: 'center',
  marginTop: 10,
},

batteryBody: {
  width: 300,
  height:90,
  borderWidth: 2.5,
  borderColor: '#4F8EF7',
  borderRadius: 12,
  padding: 5,
  backgroundColor: '#EAF2FF',
  justifyContent: 'center',
  overflow: 'hidden',
},

batteryFill: {
  position: 'absolute',
  left: 5,
  top: 5,
  bottom: 5,
  backgroundColor: '#4F8EF7',
  borderRadius: 8,
},

batteryCap: {
  width: 10,
  height: 28,
  backgroundColor: '#4F8EF7',
  marginLeft: 4,
  borderRadius: 3,
},

batteryInnerText: {
  alignSelf: 'center',
  fontSize: 17,
  fontWeight: '700',
  color: '#ffffffff',
},

privacyBadge: {
  flexDirection: 'row',
  alignItems: 'center',
  backgroundColor: '#EEF4FF',
  paddingHorizontal: 10,
  paddingVertical: 6,
  borderRadius: 20,
  marginBottom: 16,
},

privacyBadgeText: {
  fontSize: 12,
  fontWeight: '600',
  color: '#5A7FDB',
  marginLeft: 6,
},

privacyModalOverlay: {
  flex: 1,
  backgroundColor: 'rgba(0,0,0,0.35)',
  justifyContent: 'center',
  alignItems: 'center',
},

privacyModalBox: {
  width: 320,
  backgroundColor: '#fff',
  borderRadius: 16,
  paddingVertical: 24,
  paddingHorizontal: 20,
  alignItems: 'center',
},

privacyModalText: {
  fontSize: 15,
  lineHeight: 20,
  color: '#333',
  textAlign: 'center',
  marginBottom: 20,
},

privacyModalBtn: {
  backgroundColor: '#4F8EF7',
  paddingVertical: 10,
  paddingHorizontal: 40,
  borderRadius: 20,
},

privacyModalBtnText: {
  color: '#fff',
  fontSize: 14,
  fontWeight: '700',
},

});
  