// MissionRecommend.js
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Image } from 'react-native';
import { useMission } from '../contexts/MissionContext';
import { postNewMission } from '../services/missionService';

const missionPool = [
  {
    icon: '🍽️',
    baseLabel: '음식을 먹는다',
    label: '식사를 한 번 해 볼까요?',
    desc: '지금 식사를 한 번 챙겨서 천천히 드셔 주세요!',
    image: require('../assets/mission-eat.png'),
  },
  {
    icon: '🥤',
    baseLabel: '음료를 마신다',
    label: '음료를 한 잔 마셔 볼까요?',
    desc: '물이나 따뜻한 음료를 한 잔 마셔 주세요!',
    image: require('../assets/mission-drink.png'),
  },
  {
    icon: '🦷',
    baseLabel: '이를 닦는다',
    label: '이를 한 번 닦아 볼까요?',
    desc: '상쾌한 기분을 위해 이를 한 번 닦아 주세요!',
    image: require('../assets/mission-teeth.png'),
  },
  {
    icon: '🤲',
    baseLabel: '손을 씻는다',
    label: '손을 깨끗이 씻어 볼까요?',
    desc: '외출 전·후에 손을 깨끗하게 씻어 주세요!',
    image: require('../assets/mission-wash-hands.png'),
  },
  {
    icon: '💇‍♀️',
    baseLabel: '머리를 손질하다',
    label: '머리를 살짝 손질해 볼까요?',
    desc: '거울 앞에서 머리를 살짝 정돈해 주세요!',
    image: require('../assets/mission-hair.png'),
  },
  {
    icon: '🧢',
    baseLabel: '모자를 쓴다',
    label: '좋아하는 모자를 써 볼까요?',
    desc: '오늘 기분에 어울리는 모자를 써 주세요!',
    image: require('../assets/mission-hat.png'),
  },
  {
    icon: '👟',
    baseLabel: '신발을 신는다',
    label: '신발을 신어 볼까요?',
    desc: '밖으로 나갈 준비로 신발을 단단히 신어 주세요!',
    image: require('../assets/mission-shoes.png'),
  },
  {
    icon: '🗑️',
    baseLabel: '쓰레기를 버린다',
    label: '쓰레기를 한 번 버려 볼까요?',
    desc: '눈에 보이는 쓰레기를 하나만이라도 버려 주세요!',
    image: require('../assets/mission-trash.png'),
  },
  {
    icon: '📚',
    baseLabel: '공부하다',
    label: '공부를 잠깐 해 볼까요?',
    desc: '짧은 시간이라도 집중해서 공부해 주세요!',
    image: require('../assets/mission-study.png'),
  },
  {
    icon: '🃏',
    baseLabel: '카드게임을 하다',
    label: '카드게임을 가볍게 해 볼까요?',
    desc: '간단한 카드게임으로 머리를 잠깐 식혀 주세요!',
    image: require('../assets/mission-cardgame.png'),
  },
  {
    icon: '🍽️',
    baseLabel: '그릇을 정리하다',
    label: '그릇을 정리해 볼까요?',
    desc: '사용한 그릇을 싱크대에 모아 정리해 주세요!',
    image: require('../assets/mission-dishes.png'),
  },
  {
    icon: '📄',
    baseLabel: '책(서류)를 본다',
    label: '책이나 서류를 읽어 볼까요?',
    desc: '책이나 서류를 조금만 펼쳐서 읽어 주세요!',
    image: require('../assets/mission-read.png'),
  },
  {
    icon: '📞',
    baseLabel: '전화통화를 하다',
    label: '전화 통화를 해 볼까요?',
    desc: '떠오르는 사람에게 짧게 안부 전화를 해 주세요!',
    image: require('../assets/mission-call.png'),
  },
  {
    icon: '💻',
    baseLabel: '컴퓨터를 한다',
    label: '컴퓨터 작업을 정리해 볼까요?',
    desc: '미뤄 둔 컴퓨터 작업을 조금만 정리해 주세요!',
    image: require('../assets/mission-computer.png'),
  },
  {
    icon: '📱',
    baseLabel: '휴대폰을 조작한다',
    label: '휴대폰을 잠깐 확인해 볼까요?',
    desc: '필요한 메시지와 알림만 골라 확인해 주세요!',
    image: require('../assets/mission-phone.png'),
  },
  {
    icon: '🧹',
    baseLabel: '청소를 하다',
    label: '주변을 살짝 청소해 볼까요?',
    desc: '주변에서 눈에 띄는 곳 한 군데만 정리해 주세요!',
    image: require('../assets/mission-clean.png'),
  },
  {
    icon: '🎸',
    baseLabel: '기타를 친다',
    label: '기타를 살짝 쳐 볼까요?',
    desc: '좋아하는 곡을 떠올리며 기타를 조금만 쳐 주세요!',
    image: require('../assets/mission-guitar.png'),
  },
  {
    icon: '🐕',
    baseLabel: '반려동물과 논다',
    label: '반려동물과 잠깐 놀아 볼까요?',
    desc: '반려동물의 눈을 보며 잠깐 함께 놀아 주세요!',
    image: require('../assets/mission-pet.png'),
  },
  {
    icon: '🌱',
    baseLabel: '식물에 물을 준다',
    label: '식물에 물을 한 번 줘 볼까요?',
    desc: '화분 상태를 살펴보고 물을 적당히 줘 주세요!',
    image: require('../assets/mission-plant.png'),
  },
  {
    icon: '🏋️‍♀️',
    baseLabel: '스쿼트를 하다',
    label: '스쿼트를 몇 번 해 볼까요?',
    desc: '무리하지 않는 선에서 스쿼트를 몇 번만 해 주세요!',
    image: require('../assets/mission-squat.png'),
  },
  {
    icon: '⚽',
    baseLabel: '공놀이를 하다',
    label: '공놀이를 해 볼까요?',
    desc: '가볍게 공을 던져보며 몸을 풀어 주세요!',
    image: require('../assets/mission-ball.png'),
  },
  {
    icon: '💃',
    baseLabel: '춤을 춘다',
    label: '가볍게 춤을 춰 볼까요?',
    desc: '좋아하는 음악에 맞춰 가볍게 춤을 춰 주세요!',
    image: require('../assets/mission-dance.png'),
  },
];

export default function MissionRecommendScreen({ navigation }) {
  const [mission, setMission] = useState(
    missionPool[Math.floor(Math.random() * missionPool.length)]
  );

  const { todayMissions, setTodayMissions } = useMission();

  const recommendAnother = () => {
    let another;
    do {
      another = missionPool[Math.floor(Math.random() * missionPool.length)];
    } while (another.label === mission.label);
    setMission(another);
  };

  const addToTodayMissions = () => {
    // ✅ 오늘의 미션/DB에는 "🍽️ 음식을 먹는다" 처럼 저장
    const label = `${mission.icon} ${mission.baseLabel}`;

    setTodayMissions((prev) => {
      const existing = prev['랜덤'] || [];
      if (existing.includes(label)) {
        Alert.alert('이미 추가된 미션입니다.');
        return prev;
      }

      postNewMission({
        user_id: 1,
        mission_description: label,
        mission_type: 'manual',
        mission_time_period: '랜덤',
        created_at: new Date().toISOString().slice(0, 10),
      })
        .then(() => {
          console.log('✅ 서버에 저장됨');
          Alert.alert('✅ 미션이 추가되었습니다!');
        })
        .catch((err) => {
          console.error('서버 저장 실패:', err);
          Alert.alert('저장 실패', '서버에 저장하지 못했습니다.');
        });

      return { ...prev, 랜덤: [...existing, label] };
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>추천 미션</Text>
      <View style={styles.card}>
        {mission.image ? (
          <Image source={mission.image} style={styles.iconImage} />
        ) : (
          <Text style={styles.icon}>{mission.icon}</Text>
        )}

        {/* 화면에는 질문형 label만 보여줌 */}
        <Text style={styles.label}>{mission.label}</Text>
        <Text style={styles.desc}>{mission.desc}</Text>
      </View>

      <TouchableOpacity style={styles.button} onPress={recommendAnother}>
        <Text style={styles.buttonText}>다른 미션 추천</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.button, styles.goButton]} onPress={addToTodayMissions}>
        <Text style={styles.buttonText}>미션 추가하기</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.backButton]}
        onPress={() => navigation.navigate('Drawer', { screen: 'Main' })}
      >
        <Text style={styles.buttonText}>메인으로</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 28,
    color: '#2356a6',
  },
  card: {
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 18,
    paddingVertical: 32,
    paddingHorizontal: 38,
    marginBottom: 34,
    width: '100%',
    shadowColor: '#4F8EF7',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.09,
    shadowRadius: 7,
    elevation: 3,
  },
  icon: { fontSize: 44, marginBottom: 8 },
  label: {
    fontSize: 22,
    fontWeight: '700',
    color: '#2356a6',
    marginBottom: 10,
  },
  desc: {
    fontSize: 17,
    color: '#555',
    textAlign: 'center',
    marginBottom: 5,
  },
  button: {
    backgroundColor: '#4F8EF7',
    paddingVertical: 14,
    paddingHorizontal: 36,
    borderRadius: 28,
    marginBottom: 16,
    shadowColor: '#4F8EF7',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 2,
  },
  goButton: {
    backgroundColor: '#F361DC',
  },
  backButton: {
    backgroundColor: '#aaa',
  },
  buttonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  iconImage: {
    width: 70,
    height: 70,
    marginBottom: 10,
    resizeMode: 'contain',
  },
});
