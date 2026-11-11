// MissionContext.js - 미션 데이터를 관리하는 Context
import React, { createContext, useContext, useState } from 'react';

const MissionContext = createContext();

export const useMission = () => {
  const context = useContext(MissionContext);
  if (!context) {
    throw new Error('useMission must be used within a MissionProvider');
  }
  return context;
};

export const MissionProvider = ({ children }) => {
  const [todayMissions, setTodayMissions] = useState({});
  const [completedMissions, setCompletedMissions] = useState({});

  // 미션별 설명
  const missionDescriptions = {
    '음식을 먹는다': '건강하게 식사하고 식단을 기록해보세요.',
    '음료를 마신다': '따뜻한 차나 물 한 잔, 잊지 마세요!',
    '이를 닦는다': '아침/저녁으로 꼼꼼히 양치했나요?',
    '손을 씻는다': '외출 후 손씻기, 깔끔한 습관입니다.',
    '머리를 손질하다': '거울 앞에서 단정하게 머리를 정돈해보세요.',
    '모자를 쓴다': '좋아하는 모자, 오늘 기분을 표현해보세요!',
    '신발을 신는다': '외출 준비 완료! 신발 신고 가볍게 산책 어때요?',
    '쓰레기를 버린다': '작은 정리도 일상을 상쾌하게 바꿔요.',
    '공부하다': '조금씩이라도 집중하는 시간을 가져보세요.',
    '카드게임을 하다': '짧은 게임으로 두뇌에 리프레시 타임!',
    '그릇을 정리하다': '식사 후 그릇을 깨끗이 정리해보세요.',
    '책(서류)를 본다': '오늘은 한 쪽이라도 읽어볼까요?',
    '전화통화를 하다': '누군가에게 안부를 전해보세요.',
    '컴퓨터를 한다': '필요한 작업만 딱 정리해보는 건 어때요?',
    '휴대폰을 조작한다': '중요한 알림 확인하고 디지털 디톡스도 생각해보세요.',
    '청소를 하다': '주변을 정리하면 마음도 정리돼요.',
    '기타를 친다': '오늘의 감정을 음악으로 표현해보세요.',
    '반려동물과 논다': '잠깐의 교감도 큰 행복이 될 수 있어요.',
    '식물에 물을 준다': '화분도 오늘의 너를 기다리고 있어요.',
    '스쿼트를 하다': '가볍게 몸을 움직여볼까요?',
    '공놀이를 하다': '몸을 움직이면 기분도 달라져요!',
    '춤을 춘다': '마음 가는 대로 몸을 움직여봐요.',
  };

  // ✅ 미션 완료 상태 토글
  const toggleMissionComplete = (missionKey) => {
    setCompletedMissions((prev) => ({
      ...prev,
      [missionKey]: !prev[missionKey],
    }));
  };

  // ✅ 홈화면 미션 생성 함수 (랜덤 미션 포함)
  const getHomeMissions = () => {
    const homeMissions = [];

    Object.entries(todayMissions).forEach(([timeSlot, missions]) => {
      missions.forEach((mission, index) => {
        const missionKey = `${timeSlot}_${index}`;
        const isCompleted = completedMissions[missionKey] || false;

        const parts = mission.split(' ');
        const icon = parts[0] || '📝';
        const label = parts.slice(1).join(' ') || mission;

        // desc 우선순위: 직접 설정 > 기본 문구
        const desc = missionDescriptions[label] || `${label}를 해보는 건 어때요?`;

        homeMissions.push({
          key: missionKey,
          icon,
          label,
          desc,
          done: isCompleted,
          timeSlot,
        });
      });
    });

    return homeMissions;
  };

  const value = {
    todayMissions,
    setTodayMissions,
    completedMissions,
    toggleMissionComplete,
    getHomeMissions,
  };

  return (
    <MissionContext.Provider value={value}>
      {children}
    </MissionContext.Provider>
  );
};
