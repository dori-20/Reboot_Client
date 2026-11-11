// services/missionService.js
import axios from 'axios';
import api from '../api/api'; 

const BASE_URL = 'http://172.20.20.61:3000'; 

export const fetchTodayMissions = async (user_id) => {
  console.log('🛰️ 요청 URL:', `/missions/today?user_id=${user_id}`);
  return await api.get('/missions/today', { params: { user_id } });
};

// 주간 리포트 가져오기 
export const fetchWeeklyReport = async (user_id) => {
  return await api.get(`/reports/weekly?user_id=${user_id}`);
};

export const postNewMission = async (data) => {
  return await api.post('/missions', data);
};

// 필요한 기능 추가 가능 
export const updateMissionStatus = async (user_id, mission_id, status) => {
  return await api.post('/missions/update-status', {
    user_id,
    mission_id,
    status,
  });
};

//삭제
export const deleteTodayMission = async (user_id, mission_time_period, mission_description) => {
  return await api.post('/missions/delete', {
    user_id,
    mission_time_period,
    mission_description,
  });
};

export const deleteMissionById = async (mission_id) => {
  return await api.delete(`/missions/${mission_id}`);
};