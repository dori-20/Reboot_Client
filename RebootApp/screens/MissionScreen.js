// MissionScreen.js
import * as React from 'react';
import { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert, Image } from 'react-native';
import Checkbox from 'expo-checkbox';
import { useMission } from '../contexts/MissionContext';
import { postNewMission, deleteTodayMission, fetchTodayMissions } from '../services/missionService';
import * as Notifications from 'expo-notifications';

// 랜덤 미션 풀
const randomMissionPool = [
  { icon: '🍽️', code: 'C001', label: '음식을 먹는다', desc: '제시간에 식사를 챙겨 드셔보세요.' },
  { icon: '🥤', code: 'C002', label: '음료를 마신다', desc: '물이나 따뜻한 음료를 한 잔 마셔보세요.' },
  { icon: '🦷', code: 'C007', label: '이를 닦는다', desc: '양치로 상쾌한 하루를 시작하거나 마무리해요.' },
  { icon: '🤲', code: 'C009', label: '손을 씻는다', desc: '외출 후나 식사 전, 손을 깨끗이 씻어보세요.' },
  { icon: '💇‍♀️', code: 'C028', label: '머리를 손질하다', desc: '거울 앞에서 단정하게 머리를 정돈해보세요.' },
  { icon: '🧢', code: 'C033', label: '모자를 쓴다', desc: '오늘은 좋아하는 모자를 써보는 건 어때요?' },
  { icon: '👟', code: 'C035', label: '신발을 신는다', desc: '밖에 나갈 준비, 신발을 단단히 신어봐요.' },
  { icon: '🗑️', code: 'C038', label: '쓰레기를 버린다', desc: '작은 정리로도 개운해질 수 있어요.' },
  { icon: '📚', code: 'C046', label: '공부하다', desc: '짧게라도 집중해서 학습해보는 시간을 가져봐요.' },
  { icon: '🃏', code: 'C050', label: '카드게임을 하다', desc: '간단한 카드게임으로 머리를 식혀보세요.' },
  { icon: '🍽️', code: 'C061', label: '그릇을 정리하다', desc: '식사 후 그릇을 깨끗이 정리해보세요.' },
  { icon: '📄', code: 'C063', label: '책(서류)를 본다', desc: '짧은 글이나 자료를 차분히 읽어봐요.' },
  { icon: '📞', code: 'C069', label: '전화통화를 하다', desc: '지인에게 안부 인사를 전해보는 건 어때요?' },
  { icon: '💻', code: 'C073', label: '컴퓨터를 한다', desc: '컴퓨터 작업을 잠깐 정리해보는 시간을 가져요.' },
  { icon: '📱', code: 'C074', label: '휴대폰을 조작한다', desc: '필요한 앱이나 연락을 확인해보세요.' },
  { icon: '🧹', code: 'C079', label: '청소를 하다', desc: '주변을 정리해보면 기분이 새로워질 거예요.' },
  { icon: '🎸', code: 'C084', label: '기타를 친다', desc: '좋아하는 곡을 가볍게 연주해보는 건 어때요?' },
  { icon: '🐕', code: 'C090', label: '반려동물과 논다', desc: '잠깐이라도 반려동물과 교감해보세요.' },
  { icon: '🌱', code: 'C093', label: '식물에 물을 준다', desc: '화분의 상태를 살펴보고 물을 주세요.' },
  { icon: '🏋️‍♀️', code: 'C098', label: '스쿼트를 하다', desc: '가볍게 몸을 움직이며 스트레칭해봐요.' },
  { icon: '⚽', code: 'C101', label: '공놀이를 하다', desc: '몸을 쓰는 활동으로 기분 전환해봐요.' },
  { icon: '💃', code: 'C112', label: '춤을 춘다', desc: '신나는 음악과 함께 가볍게 춤을 춰봐요.' },
];

// 미션 선택 리스트 (이모지 없이 라벨만)
const missionSource = [
  '음식을 먹는다',
  '음료를 마신다',
  '이를 닦는다',
  '손을 씻는다',
  '머리를 손질하다',
  '모자를 쓴다',
  '신발을 신는다',
  '쓰레기를 버린다',
  '공부하다',
  '카드게임을 하다',
  '그릇을 정리하다',
  '책(서류)를 본다',
  '전화통화를 하다',
  '컴퓨터를 한다',
  '휴대폰을 조작한다',
  '청소를 하다',
  '기타를 친다',
  '반려동물과 논다',
  '식물에 물을 준다',
  '스쿼트를 하다',
  '공놀이를 하다',
  '춤을 춘다',
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
};

const timeIconMap = {
  새벽: require('../assets/time-dawn.png'),
  아침: require('../assets/time-morning.png'),
  점심: require('../assets/time-noon.png'),
  저녁: require('../assets/time-night.png'),
  랜덤: require('../assets/random-dice.png'),
};

const emojiRegex = /[\p{Emoji_Presentation}\p{Extended_Pictographic}]/u;

const getPlainLabel = (text) => {
  if (!text) return '';

  const parts = text.split(' ');
  if (parts.length <= 1) return text;

  if (emojiRegex.test(parts[0])) {
    return parts.slice(1).join(' ');
  }
  return text;
};

// 시간대
const timeSlots = ['새벽', '아침', '점심', '저녁'];
const timeIcons = { 새벽: '🕓', 아침: '🌅', 점심: '☀️', 저녁: '🌙', 랜덤: '🎲' };
const timeToHour = { 새벽: 5, 아침: 9, 점심: 13, 저녁: 18, 랜덤: 20 }; // 현재 사용 X

const timeOrder = ['아침', '점심', '새벽', '저녁', '랜덤'];

async function scheduleDebugNotification(label) {
  await Notifications.scheduleNotificationAsync({
    content: { title: '🧪 테스트 알림', body: `${label} (1분마다 울립니다)`, sound: 'default' },
    trigger: { seconds: 60, repeats: true },
  });
}

function getRandomSubset(array, size) {
  return [...array].sort(() => 0.5 - Math.random()).slice(0, size);
}

export default function MissionScreen() {
  const { todayMissions, setTodayMissions } = useMission();

  const [selectedTime, setSelectedTime] = useState(null);
  //const [missionsByTime, setMissionsByTime] = useState({});
  // key: `${time}__${label}` -> boolean
  const [checkedMissions, setCheckedMissions] = useState({});
  const [randomMission, setRandomMission] = useState(null);

  useEffect(() => {
    const requestPermission = async () => {
      const { status } = await Notifications.getPermissionsAsync();
      if (status !== 'granted') await Notifications.requestPermissionsAsync();
    };
    requestPermission();

    // 시간대별 랜덤 미션 목록 생성
    // const generated = {};
    // timeSlots.forEach((slot) => {
    //   generated[slot] = getRandomSubset(missionSource, 10);
    // });
    // setMissionsByTime(generated);

    // 서버에서 오늘의 미션 불러오기
    const fetchMissions = async () => {
      try {
        const res = await fetchTodayMissions(1);
        const grouped = {};
        res.data.missions.forEach((m) => {
          const t = m.mission_time_period;
          if (!grouped[t]) grouped[t] = [];
          grouped[t].push(m.mission_description);
        });
        setTodayMissions(grouped);
      } catch (err) {
        console.error('🔴 미션 불러오기 실패', err);
      }
    };
    fetchMissions();
  }, []);

  const handleSubmit = async () => {
    const user_id = 1;
    const today = new Date().toISOString().slice(0, 10);

    try {
      const totalMissions = [];
      const uniqueSet = new Set();

      Object.entries(todayMissions).forEach(([time, list]) => {
        list.forEach((label) => {
          const key = `${label}-${time}`;
          if (!uniqueSet.has(key)) {
            uniqueSet.add(key);
            totalMissions.push({
              user_id,
              mission_description: label,
              mission_type: 'manual',
              mission_time_period: time,
              created_at: today,
            });
          }
        });
      });

      if (totalMissions.length === 0) {
        Alert.alert('❗ 저장할 미션이 없습니다.');
        return;
      }

      for (const mission of totalMissions) {
        await postNewMission(mission);
        await scheduleDebugNotification(mission.mission_description);
      }

      Alert.alert('🎉 미션이 저장되었습니다!');
    } catch (err) {
      console.error('미션 저장 실패:', err);
      Alert.alert('저장 실패', '서버 저장 오류가 발생했습니다.');
    }
  };

  const toggleCheck = (label) => {
    if (!selectedTime) return;

    const key = `${selectedTime}__${label}`;
    const isChecked = !!checkedMissions[key];

    // 현재 선택된 시간대에서 체크된 개수 계산
    const currentCount = Object.entries(checkedMissions).filter(
      ([k, checked]) => checked && k.startsWith(`${selectedTime}__`)
    ).length;

    if (!isChecked && currentCount >= 20) {
      Alert.alert('제한 초과', '20개까지만 선택 가능합니다.');
      return;
    }

    setCheckedMissions((prev) => ({
      ...prev,
      [key]: !isChecked,
    }));

    setTodayMissions((prev) => {
      const updated = { ...prev };

      if (isChecked) {
        // 체크 해제 → 현재 선택된 시간대에서만 제거
        if (updated[selectedTime]) {
          updated[selectedTime] = updated[selectedTime].filter((m) => m !== label);
          if (updated[selectedTime].length === 0) {
            delete updated[selectedTime];
          }
        }
      } else {
        // 체크 → 현재 선택된 시간대에만 추가
        const slotList = updated[selectedTime] || [];
        if (!slotList.includes(label)) {
          updated[selectedTime] = [...slotList, label];
        }
      }

      return updated;
    });
  };

  const handleRandomPick = () => {
    setRandomMission(
      randomMissionPool[Math.floor(Math.random() * randomMissionPool.length)]
    );
  };

  const addRandomToToday = () => {
    if (!randomMission) return;

    const label = `${randomMission.icon} ${randomMission.label}`;

    setTodayMissions((prev) => {
      const current = prev['랜덤'] || [];
      if (current.includes(label)) {
        Alert.alert('이미 추가된 미션입니다.');
        return prev;
      }
      Alert.alert('추가 완료!', `${label} 미션이 추가되었습니다`);
      return { ...prev, 랜덤: [...current, label] };
    });
  };

  const handleRemoveTodayMission = async (time, label) => {
    try {
      await deleteTodayMission(1, time, label);

      setTodayMissions((prev) => {
        const updated = { ...prev };
        updated[time] = updated[time].filter((m) => m !== label);
        if (updated[time].length === 0) {
          delete updated[time];
        }
        return updated;
      });

      // 해당 시간대의 체크 상태만 해제
      setCheckedMissions((prev) => {
        const updated = { ...prev };
        const key = `${time}__${label}`;
        delete updated[key];
        return updated;
      });
    } catch (err) {
      console.error('삭제 실패:', err);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>시간대별 미션 선택</Text>

      {/* 시간대 선택 */}
      <View style={styles.timeRow}>
        {timeSlots.map((time) => (
          <TouchableOpacity
            key={time}
            onPress={() => setSelectedTime(time)}
            style={[styles.timeButton, selectedTime === time && styles.selectedTimeButton]}
          >
            <Text style={styles.timeText}>{time}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* 해당 시간대 미션 */}
      {selectedTime && (
  <View style={styles.section}>
    <Text style={styles.subTitle}>{selectedTime} 미션</Text>

    {missionSource.map((m) => {
      const key = `${selectedTime}__${m}`;
      const checked = !!checkedMissions[key];

      return (
        <View key={m} style={styles.checkboxRow}>
          <Checkbox
            value={checked}
            onValueChange={() => toggleCheck(m)}
            color={checked ? '#4F8EF7' : '#D6E2FF'}
            style={styles.checkbox}
          />

          {missionIconMap[m] && (
            <Image source={missionIconMap[m]} style={styles.missionIcon} />
          )}

          <Text style={styles.checkboxLabel}>{m}</Text>
        </View>
      );
    })}
  </View>
)}

      {/* 랜덤 미션 추천 */}
      <View style={styles.section}>
        <View style={styles.todayHeader}>
          {/* 왼쪽: 주사위 아이콘 + 텍스트 */}
          <View style={styles.randomHeaderLeft}>
            <Image
              source={require('../assets/random-dice.png')}
              style={styles.diceIcon}
            />
            <Text style={[styles.subTitle, styles.randomTitle]}>랜덤 미션 추천</Text>
          </View>

          {/* 오른쪽: 새로고침 버튼 */}
          <TouchableOpacity onPress={handleRandomPick}>
            <Image
              source={require('../assets/refresh.png')}
              style={styles.refreshIcon}
            />
          </TouchableOpacity>
        </View>

        {randomMission && (
          <View style={styles.card}>
            {missionIconMap[randomMission.label] ? (
              <Image
                source={missionIconMap[randomMission.label]}
                style={styles.randomIcon}
              />
            ) : (
              <Text style={styles.icon}>{randomMission.icon}</Text>
            )}
            <Text style={styles.label}>{randomMission.label}</Text>
            <Text style={styles.desc}>{randomMission.desc}</Text>

            <TouchableOpacity style={styles.addButton} onPress={addRandomToToday}>
              <Text style={styles.buttonText}>오늘의 미션에 추가</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* 오늘의 미션 리스트 */}
      <View style={styles.todayBox}>
        <Text style={styles.subTitle}>오늘의 미션 리스트</Text>

        {Object.entries(todayMissions)
  .sort(([a], [b]) => timeOrder.indexOf(a) - timeOrder.indexOf(b))
  .map(([time, missions]) => (
    <View key={time} style={{ marginBottom: 16 }}>
      {/* 시간대 제목 바 */}
      <View style={styles.timeHeaderBar}>
        <Image source={timeIconMap[time]} style={styles.timeIcon} />
        <Text style={styles.timeLabel}>{time}</Text>
      </View>

      {missions.map((m, i) => (
        <View key={i} style={styles.todayRow}>
          <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
            {missionIconMap[getPlainLabel(m)] && (
              <Image
                source={missionIconMap[getPlainLabel(m)]}
                style={styles.missionIcon}
              />
            )}

            <Text style={styles.todayItem}>{getPlainLabel(m)}</Text>
          </View>

          <TouchableOpacity onPress={() => handleRemoveTodayMission(time, m)}>
            <Text style={styles.removeText}>삭제</Text>
          </TouchableOpacity>
        </View>
      ))}
    </View>
  ))}

      </View>

      {/* 저장 버튼 */}
      <TouchableOpacity onPress={handleSubmit} style={styles.submitButton}>
        <Text style={styles.buttonText}>미션 저장</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

// 스타일
const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: '#f5f5f5' },
  title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 20, color: '#333' },

  timeRow: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 20 },
  timeButton: { padding: 10, backgroundColor: '#e0e0e0', borderRadius: 8 },
  selectedTimeButton: { backgroundColor: '#4F8EF7' },
  timeText: { fontSize: 16, color: '#333' },

  section: { marginBottom: 30, backgroundColor: 'white', padding: 15, borderRadius: 10 },
  subTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15 },

  checkboxRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  checkboxLabel: { marginLeft: 10, fontSize: 16 },

  todayHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  refreshText: { fontSize: 22 },

  card: { backgroundColor: '#f9f9f9', padding: 15, borderRadius: 10, alignItems: 'center' },
  icon: { fontSize: 40, marginBottom: 10 },
  label: { fontSize: 18, fontWeight: 'bold', marginBottom: 5 },
  desc: { fontSize: 14, color: '#666', textAlign: 'center', marginBottom: 15 },

  addButton: { backgroundColor: '#4F8EF7', paddingVertical: 10, paddingHorizontal: 20, borderRadius: 8 },
  buttonText: { color: 'white', fontSize: 16, fontWeight: 'bold', textAlign: 'center' },

  todayBox: { backgroundColor: 'white', padding: 15, borderRadius: 10, marginBottom: 20 },
  timeLabel: { fontSize: 16, fontWeight: 'bold', marginBottom: 5, color: '#4F8EF7' },

  todayRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 5,
  },
  todayItem: {
    fontSize: 16,
    flex: 1,
    marginLeft: 10,
  },
  removeText: { color: '#ff4444', fontSize: 14, fontWeight: 'bold' },

  submitButton: {
    backgroundColor: '#4F8EF7',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginTop: 20,
    marginBottom: 40,
    alignSelf: 'center',
  },

  missionIcon: {
    width: 30,
    height: 30,
    marginLeft: 10,
    marginRight: -10,
    resizeMode: 'contain',
  },

  randomIcon: {
    width: 70,
    height: 70,
    marginBottom: 10,
    resizeMode: 'contain',
  },

  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: '#AEC4FF',
    marginRight: 6,
  },

  diceIcon: {
    width: 35,
    height: 35,
    marginRight: 6,
    resizeMode: 'contain',
  },

  randomHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  randomTitle: {
    marginTop: 15, // 필요하면 숫자 조절
  },

  refreshIcon: {
    width: 35,
    height: 35,
    resizeMode: 'contain',
  },

  timeLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },

  timeIcon: {
    width: 27,
    height: 27,
    resizeMode: 'contain',
    marginRight: 6,
  },

  timeHeaderBar: {
  flexDirection: 'row',
  alignItems: 'center',
  backgroundColor: '#f0f2f8ff',   // 소제목 바 배경색 (파스텔 블루 느낌)
  paddingVertical: 5,
  paddingHorizontal: 14,
  borderRadius: 20,
  marginBottom: 10,
},

timeLabel: {
  fontSize: 16,
  fontWeight: 'bold',
  color: '#425bb3ff',             // 기존보다 조금 진한 파랑
  marginLeft: 4,
},

});
