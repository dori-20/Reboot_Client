// services/aiService.js
import axios from "axios";

const AI_BASE_URL = "http://15.134.31.40:8000";


// ✅ AI 서버에서 최신 행동 가져오기 함수
export async function fetchLatestAction() {
  try {
    const res = await fetch("http://15.134.31.40:8000/data/");
    const text = await res.text();

    // ✅ 문자열만 오는 경우 예외 처리
    let classCode = text.replace(/[^A-Z0-9]/g, "").trim();

    // ✅ JSON 형태로 오는 경우
    try {
      const json = JSON.parse(text);
      if (json.class) classCode = json.class;
      else if (typeof json === "string") classCode = json;
      else if (Object.keys(json)[0]) classCode = Object.keys(json)[0];
    } catch {}

    if (!classCode) return null;

    // ✅ 코드 → 행동 매핑
    const ACTION_MAP = {
      C001: { label: "음식을 먹는다", icon: "🍽️" },
      C002: { label: "음료를 마신다", icon: "🥤" },
      C007: { label: "이를 닦는다", icon: "🦷" },
      C009: { label: "손을 씻는다", icon: "🤲" },
      C028: { label: "머리를 손질하다", icon: "💇‍♀️" },
      C033: { label: "모자를 쓴다", icon: "🧢" },
      C035: { label: "신발을 신는다", icon: "👟" },
      C038: { label: "쓰레기를 버린다", icon: "🗑️" },
      C046: { label: "공부하다", icon: "📚" },
      C050: { label: "카드게임을 하다", icon: "🃏" },
      C061: { label: "그릇을 정리하다", icon: "🍽️" },
      C063: { label: "책(서류)를 본다", icon: "📄" },
      C069: { label: "전화통화를 하다", icon: "📞" },
      C073: { label: "컴퓨터를 한다", icon: "💻" },
      C074: { label: "휴대폰을 조작한다", icon: "📱" },
      C079: { label: "청소를 하다", icon: "🧹" },
      C084: { label: "기타를 친다", icon: "🎸" },
      C090: { label: "반려동물과 논다", icon: "🐕" },
      C093: { label: "식물에 물을 준다", icon: "🌱" },
      C098: { label: "스쿼트를 하다", icon: "🏋️‍♀️" },
      C101: { label: "공놀이를 하다", icon: "⚽" },
      C112: { label: "춤을 춘다", icon: "💃" },
    };

    const mapped = ACTION_MAP[classCode];
    if (!mapped) {
      console.log("❌ 알 수 없는 코드:", classCode);
      return null;
    }

    return { classCode, ...mapped };
  } catch (err) {
    console.error("🚨 AI 데이터 불러오기 오류:", err);
    return null;
  }
}