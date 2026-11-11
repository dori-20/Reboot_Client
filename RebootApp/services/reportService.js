// services/reportService.js

export const fetchWeeklyReport = async () => {
  // 예시 더미 데이터 리턴
  return [
    { day: 'Mon', count: 2 },
    { day: 'Tue', count: 4 },
    { day: 'Wed', count: 3 },
    { day: 'Thu', count: 5 },
    { day: 'Fri', count: 1 },
    { day: 'Sat', count: 0 },
    { day: 'Sun', count: 3 },
  ];
};