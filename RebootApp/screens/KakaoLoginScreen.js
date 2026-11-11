// screens/KakaoLoginScreen.js
// import "react-native-url-polyfill/auto"; // 필요하면 주석 해제

import React, { useEffect, useState } from "react";
import {
  View, Text, Alert, StyleSheet, Pressable, ActivityIndicator, Platform
} from "react-native";
import * as AuthSession from "expo-auth-session";
import { Feather, FontAwesome } from "@expo/vector-icons";
import api from '../api/api'; 
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from "@react-navigation/native";


/* ===== Kakao OAuth config ===== */
const discovery = {
  authorizationEndpoint: "https://kauth.kakao.com/oauth/authorize",
  tokenEndpoint: "https://kauth.kakao.com/oauth/token",
};

const KAKAO_REST_API_KEY =
  process.env.EXPO_PUBLIC_KAKAO_REST_API_KEY || "5e8b5a8b17e5a409f1fd5ac7d29577d0";

const REDIRECT_URI = "https://auth.expo.dev/@yejee/RebootApp";
const SCOPES = ["profile_nickname"]; // 필요시 "account_email", "profile_image" 추가

// ✅ 콜백 props로 Email/SignUp 화면으로 전환하도록 받는다
export default function KakaoLoginScreen({ onGoEmail, onGoSignUp }) {
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId: KAKAO_REST_API_KEY,
      redirectUri: REDIRECT_URI,
      responseType: AuthSession.ResponseType.Code,
      scopes: SCOPES,
      usePKCE: true,
    },
    discovery
  );

  useEffect(() => {
    if (!response) return;

    if (response.type !== "success") {
      const p = response.params || {};
      if (response.type !== "dismiss") {
        Alert.alert("로그인 중단", `type=${response.type}\n${p.error || ""} ${p.error_description || ""}`);
      }
      return;
    }

    (async () => {
      try {
        setLoading(true);
        const code = (response.params || {}).code;
        if (!code) throw new Error("인가 코드가 비어 있습니다.");

        // ✅ 우리 서버로 전달해서 JWT 발급 받기
        const { data } = await api.post("/auth/kakao", {
          code,
          redirectUri: REDIRECT_URI,
        });

        const { token, user } = data;

        // ✅ 토큰 로컬 저장
        await AsyncStorage.setItem("token", token);

        // ✅ axios 인스턴스에 토큰 붙이기
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

        // const form = new URLSearchParams();
        // form.append("grant_type", "authorization_code");
        // form.append("client_id", KAKAO_REST_API_KEY);
        // form.append("redirect_uri", REDIRECT_URI);
        // form.append("code", code);
        // if (request && request.codeVerifier) form.append("code_verifier", request.codeVerifier);

        // const tokenRes = await fetch("https://kauth.kakao.com/oauth/token", {
        //   method: "POST",
        //   headers: { "Content-Type": "application/x-www-form-urlencoded" },
        //   body: form.toString(),
        // });
        // if (!tokenRes.ok) throw new Error(await tokenRes.text());

        // 여기서는 데모로 성공 안내만. 이후에 원하는 화면으로 넘기고 싶다면
        // App.js에서 current를 바꾸는 콜백을 추가로 전달하면 됨.
        //Alert.alert("로그인 성공", "리부트에 오신 것을 환영합니다!");
        Alert.alert("로그인 성공", `${users.users_nickname}님 환영합니다!`);
        navigation.replace("Main");
      } catch (e) {
        Alert.alert("오류", String((e && e.message) || e));
      } finally {
        setLoading(false);
      }
    })();
  }, [response]);

  return (
    <View style={styles.root}>
      {/* 위: 노란 히어로 */}
      <View style={styles.hero}>
        <View style={styles.heroBadge}>
          <Feather name="zap" size={16} color="#111" />
          <Text style={styles.heroBadgeText}>AI 모션 트래킹</Text>
        </View>

        <Text style={styles.brand}>리부트</Text>
        <Text style={styles.subtitle}>
          AI 동작감지 모니터링 시스템 기반{"\n"}생활 습관 개선 서비스
        </Text>

        <View style={[styles.dot, { top: 14, right: 18, opacity: 0.25 }]} />
        <View style={[styles.dot, { bottom: 16, left: 14, opacity: 0.12 }]} />
      </View>

      {/* 아래: 버튼 블록을 화면 하단으로 */}
      <View style={styles.body}>
        {loading ? (
          <ActivityIndicator size="large" />
        ) : (
          <Pressable
            style={({ pressed }) => [styles.kakaoBtn, pressed && { opacity: 0.92 }]}
            onPress={() => promptAsync({ useProxy: true, preferEphemeralSession: true })}
            disabled={!request}
            accessibilityLabel="카카오 로그인"
          >
            <FontAwesome name="comment" size={16} color="#000" style={{ marginRight: 8 }} />
            <Text style={styles.kakaoText}>카카오 로그인</Text>
          </Pressable>
        )}

        {/* 구분선 */}
        <View style={styles.dividerWrap}>
          <View style={styles.divider} />
          <Text style={styles.dividerText}>또는</Text>
          <View style={styles.divider} />
        </View>

        {/* ✅ 리부트 자체 로그인 / 회원가입: 콜백으로 이동 */}
        <Pressable
          style={({ pressed }) => [styles.outlineBtn, pressed && { opacity: 0.95 }]}
          onPress={onGoEmail}
        >
          <Text style={styles.outlineText}>리부트 아이디로 로그인</Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [styles.linkBtn, pressed && { opacity: 0.7 }]}
          onPress={onGoSignUp}
        >
          <Text style={styles.linkText}>리부트 회원가입</Text>
        </Pressable>

        <Text style={styles.legal}>
          로그인 시 서비스 이용약관 및 개인정보 처리방침에 동의하게 됩니다.
        </Text>
      </View>
    </View>
  );
}

/* ----- 스타일 ----- */
const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#fff" },

  /* 위(히어로) */
  hero: {
    paddingTop: Platform.select({ ios: 72, android: 52 }),
    paddingBottom: 28,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    backgroundColor: "#FFF6B0",
    overflow: "hidden",
  },
  heroBadge: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.75)",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    marginBottom: 10,
  },
  heroBadgeText: { fontSize: 12, fontWeight: "700", color: "#111", marginLeft: 6 },
  brand: { fontSize: 32, fontWeight: "900", letterSpacing: 0.5, color: "#111" },
  subtitle: { marginTop: 6, fontSize: 14, lineHeight: 20, color: "#444" },
  dot: { position: "absolute", width: 88, height: 88, borderRadius: 44, backgroundColor: "#FEE500" },

  /* 아래(본문) — 하단 정렬 */
  body: {
    flex: 1,                      // 남은 영역을 모두 차지
    paddingHorizontal: 24,
    paddingBottom: 280,            // ↓ 더 내리고 싶으면 64~80으로 키우기
    alignItems: "center",
    justifyContent: "flex-end",   // ✅ 콘텐츠를 아래로 밀어내기
  },

  kakaoBtn: {
    flexDirection: "row",
    alignItems: "center", justifyContent: "center",
    height: 46, paddingHorizontal: 16,
    borderRadius: 10, backgroundColor: "#FEE500",
    alignSelf: "stretch",
  },
  kakaoText: { fontSize: 15, fontWeight: "800", color: "#111" },

  dividerWrap: {
    flexDirection: "row", alignItems: "center",
    marginTop: 16, marginBottom: 8, alignSelf: "stretch"
  },
  divider: { flex: 1, height: StyleSheet.hairlineWidth, backgroundColor: "#e5e5e5" },
  dividerText: { marginHorizontal: 8, color: "#777", fontSize: 12 },

  outlineBtn: {
    height: 46, borderRadius: 10, alignSelf: "stretch",
    borderWidth: 1, borderColor: "#111",
    alignItems: "center", justifyContent: "center",
    backgroundColor: "#fff",
  },
  outlineText: { fontSize: 15, fontWeight: "800", color: "#111" },

  linkBtn: { paddingVertical: 12, alignSelf: "center" },
  linkText: { fontSize: 14, fontWeight: "700", color: "#111", textDecorationLine: "underline" },

  legal: { fontSize: 11, color: "#777", textAlign: "center", marginTop: 6, marginBottom: 8 },
});
