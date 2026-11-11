//RoutineReportScreen.js
import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import axios from 'axios';
import { BarChart } from 'react-native-chart-kit';
import { useFocusEffect } from '@react-navigation/native';

export default function RoutineReportScreen() {
  const [loading, setLoading] = useState(true);
  const [report, setReport] = useState(null);
  

  const API_BASE = "http://13.239.31.20:3000";
  const daysKor = ['월', '화', '수', '목', '금', '토', '일'];

  useFocusEffect(
    useCallback(() => {
      fetchWeeklyReport();
      return () => {};
    }, [])
  );

  const fetchWeeklyReport = async () => {
    try {
      const res = await axios.get(`${API_BASE}/reports/weekly?user_id=1`);
      setReport(res.data);
    } catch (err) {
      console.error("리포트 조회 실패:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" style={{ marginTop: 120 }} />;
  }

  if (!report) {
    return (
      <View style={{ marginTop: 120, alignItems: 'center' }}>
        <Text>주간 리포트가 없습니다.</Text>
      </View>
    );
  }

  /* ===============================
     차트 데이터 (파랑 톤 통일)
  ================================ */

  const successRates = [
  Number(report.successByDay['월'] ?? 0),
  Number(report.successByDay['화'] ?? 0),
  Number(report.successByDay['수'] ?? 0),
  Number(report.successByDay['목'] ?? 0),
  Number(report.successByDay['금'] ?? 0),
  Number(report.successByDay['토'] ?? 0),
  Number(report.successByDay['일'] ?? 0),
];

const bestDayIndex = daysKor.includes(report.bestDay)
  ? daysKor.indexOf(report.bestDay)
  : -1;

const data = {
  labels: daysKor,
  datasets: [
    {
      data: successRates,
      colors: successRates.map((_, index) => () =>
        index === bestDayIndex
          ? 'rgba(78, 134, 255, 1)'      // BEST DAY
          : 'rgba(147, 181, 255, 0.35)' // 나머지
      ),
    },
  ],
};

console.log('[weekly] successByDay', report.successByDay);
console.log('[weekly] successRates', successRates);
console.log('[weekly] bestDay', report.bestDay);
console.log('[weekly] bestDayIndex', bestDayIndex);

  /* ===============================
     이번 주 한 줄 코멘트
  ================================ */

  const getWeeklyComment = () => {
    const avg = report.weeklyAverage;

    if (avg >= 70) {
      return `이번 주는 전반적으로 루틴이 잘 유지되었어요. ${report.bestDay}의 흐름이 특히 인상적이에요.`;
    }
    if (avg >= 40) {
      return `${report.bestDay}에 가장 잘 해냈어요. 그날의 루틴을 힌트로 삼아보세요.`;
    }
    return `${report.bestDay}에 작은 성공이 있었어요. 그 하루가 다음 변화를 시작할 수 있어요.`;
  };
const chartWidth = Dimensions.get('window').width - 32;
  return (
    <ScrollView contentContainerStyle={[styles.container, { paddingBottom: 120 }]}>
      <Text style={styles.title}>나의 성취 리포트</Text>

      {/* 📊 요일별 달성률 */}
      <View style={styles.section}>
        <Text style={styles.label}>요일별 달성률</Text>
        <View style={styles.chartWrapper}>
              <BarChart
                data={data}
                width={chartWidth}
                height={300}
                fromZero
                chartConfig={{
                  backgroundColor: '#fff',
                  backgroundGradientFrom: '#fff',
                  backgroundGradientTo: '#fff',
                  decimalPlaces: 0,
                  // ✅ 반드시 있어야 함 (하지만 실제 색은 안 씀)
                  color: () => 'rgba(0,0,0,0.2)',
                  
                  labelColor: () => '#6b7280',
                }}
                withCustomBarColorFromData
                flatColor
                withInnerLines={false}
                barPercentage={0.65}
              />
        </View>
      </View>

      {/* 📌 평균 달성률 카드 */}
      <View style={styles.infoCard}>
        <Text style={styles.infoLabel}>평균 달성률</Text>
        <Text style={styles.infoValue}>{report.weeklyAverage}%</Text>
      </View>

      {/* 🏅 이번 주 BEST 카드 */}
      <View style={styles.infoCard}>
        <Text style={styles.infoLabel}>주간 BEST</Text>
        <Text style={styles.infoValue}>{report.bestDay}요일</Text>
      </View>

      {/* ✨ 이번 주 한 줄 코멘트 */}
      <View style={styles.commentCard}>
        <Text style={styles.commentTitle}>이번 주 한 줄 코멘트</Text>
        <Text style={styles.commentText}>{getWeeklyComment()}</Text>
      </View>

      {/* 🧸 AI 추천 */}
      <View style={styles.recommendWrapper}>
  <Text style={styles.recommendHeader}>이번 주 분석 기반 제안</Text>
  <Text style={styles.recommendSub}>
    이번 주 기록을 바탕으로, 다음을 제안해요.
  </Text>

  {report.recommendedMissions?.map((item, index) => (
    <View key={index} style={styles.recommendCard}>
      <Text style={styles.recommendLabel}>
        {item.icon} {item.title}
      </Text>
      <Text style={styles.recommendReason}>→ {item.reason}</Text>
    </View>
  ))}
</View>
    </ScrollView>
  );
}

/* ===============================
   Styles
================================ */

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 10,
    backgroundColor: '#fff',
  },

  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },

  section: {
    marginBottom: 24,
    backgroundColor: '#f5f5f5',
    padding: 16,
    borderRadius: 12,
  },

  label: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },

  chartWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingRight: 25
  },

  /* 🔹 정보 카드 (평균 / BEST) */
  infoCard: {
    backgroundColor: '#f7f9fc',
    borderRadius: 12,
    paddingVertical: 25,
    paddingHorizontal: 30,
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  infoLabel: {
    fontSize: 15,
    color: '#6b7280',
    fontWeight: '500',
  },

  infoValue: {
    fontSize: 18,
    fontWeight: '600',
    color: '#444444ff',
  },

  /* 🔹 한 줄 코멘트 */
  commentCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },

  commentTitle: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 6,
    color: '#374151',
  },

  commentText: {
    fontSize: 14,
    color: '#4b5563',
    lineHeight: 20,
  },

  /* 🔹 추천 영역 */
  recommendWrapper: {
  marginBottom: 30,
  padding: 16,
  backgroundColor: '#f8fafc',   // 더 연한 톤
  borderRadius: 12,
},

recommendHeader: {
  fontSize: 16,
  fontWeight: '700',
  color: '#1f2937',
  marginBottom: 4,
},

recommendSub: {
  fontSize: 13,
  color: '#6b7280',
  marginBottom: 12,
},

recommendCard: {
  backgroundColor: '#ffffff',
  padding: 12,
  marginBottom: 12,
  borderRadius: 10,
  borderWidth: 1,
  borderColor: '#e5e7eb',
},

  coachTitle: {
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 8,
    color: '#2563eb',
  },

  bubbleBox: {
    backgroundColor: '#ffffff',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#d0e2ff',
    marginBottom: 14,
  },

  bubbleText: {
    fontSize: 14,
    color: '#444',
    lineHeight: 20,
  },

  recommendTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 10,
    color: '#333',
  },

  recommendCard: {
    backgroundColor: '#ffffff',
    padding: 12,
    marginBottom: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#dbeafe',
  },

  recommendLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1e4fa3',
  },

  recommendReason: {
    fontSize: 13,
    color: '#555',
    marginTop: 4,
  },
});
