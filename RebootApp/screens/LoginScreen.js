import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Modal,
  TextInput,
  ActivityIndicator,
  Platform,
  Alert
} from "react-native";
import { Feather } from "@expo/vector-icons";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import CustomerDrawer from './CustomerDrawer';
import { Image } from "react-native";

export default function LoginScreen({ onGoEmail, onGoSignUp }) {
  const [loading, setLoading] = useState(false);
  const [showGuestModal, setShowGuestModal] = useState(false);
  const [nickname, setNickname] = useState("");
  const navigation = useNavigation();

  // ✅ 게스트 로그인 요청
  const handleGuestLogin = async () => {
    if (!nickname.trim()) {
      Alert.alert("닉네임을 입력해주세요!");
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post(`${process.env.EXPO_PUBLIC_API_BASE_URL}/auth/guest-login`, {
        nickname,
      });

      const { user_id, users_nickname } = res.data;

      // ✅ AsyncStorage에 사용자 정보 저장
      await AsyncStorage.setItem(
        "user",
        JSON.stringify({
          user_id,
          users_nickname,
          is_guest: true,
        })
      );

      Alert.alert("환영합니다!", `${users_nickname}님, 리부트에 오신 것을 환영합니다!`);
      setShowGuestModal(false);
      navigation.replace("Drawer");
    } catch (err) {
      console.error("게스트 로그인 실패:", err);
      Alert.alert("오류", "서버 연결에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.root}>
      {/* 위쪽 히어로 영역 */}
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

      {/* 아래쪽 버튼 영역 */}
      <View style={styles.body}>
        {loading ? (
          <ActivityIndicator size="large" color="#111" />
        ) : (
          <>
            {/* ✅ 게스트 로그인 버튼 */}
            <Pressable
              style={({ pressed }) => [styles.guestBtn, pressed && { opacity: 0.9 }]}
              onPress={() => setShowGuestModal(true)}
            >
              <Text style={styles.guestText}>게스트로 시작하기</Text>
            </Pressable>

            {/* 구분선 */}
            <View style={styles.dividerWrap}>
              <View style={styles.divider} />
              <Text style={styles.dividerText}>또는</Text>
              <View style={styles.divider} />
            </View>

            {/* 이메일 로그인 / 회원가입 */}
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
                        <View style={styles.motionPrivacyWrap}>
                <Image
                  source={require("../assets/secret.png")}
                  style={styles.motionPrivacyIcon}
                  resizeMode="contain"
                />
                <Text style={styles.motionPrivacyText}>
                  이 앱의 동작 인식은 기기 내에서만 처리되며,{"\n"}
                  영상은 저장되거나 외부로 전송되지 않습니다.
                </Text>
              </View>

            
          </>
        )}
      </View>

      {/* ✅ 닉네임 입력 모달 */}
      <Modal visible={showGuestModal} transparent animationType="fade">
        <View style={styles.modalContainer}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>닉네임을 입력해주세요</Text>
            <TextInput
              style={styles.input}
              placeholder="예: 리부트"
              value={nickname}
              onChangeText={setNickname}
            />
            <Pressable style={styles.modalBtn} onPress={handleGuestLogin}>
              <Text style={styles.modalBtnText}>시작하기</Text>
            </Pressable>
            <Pressable onPress={() => setShowGuestModal(false)}>
              <Text style={styles.cancelText}>취소</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

/* ----- 스타일 ----- */
const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#fff" },
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
  body: {
    flex: 1,
    paddingHorizontal: 24,
    paddingBottom: 280,
    alignItems: "center",
    justifyContent: "flex-end",
  },
  guestBtn: {
    height: 46,
    borderRadius: 10,
    backgroundColor: "#FFE156",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "stretch",
  },
  guestText: { fontSize: 15, fontWeight: "800", color: "#111" },
  dividerWrap: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 16,
    marginBottom: 8,
    alignSelf: "stretch",
  },
  divider: { flex: 1, height: StyleSheet.hairlineWidth, backgroundColor: "#e5e5e5" },
  dividerText: { marginHorizontal: 8, color: "#777", fontSize: 12 },
  outlineBtn: {
    height: 46,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#111",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    alignSelf: "stretch",
  },
  outlineText: { fontSize: 15, fontWeight: "800", color: "#111" },
  linkBtn: { paddingVertical: 12, alignSelf: "center" },
  linkText: { fontSize: 14, fontWeight: "700", color: "#111", textDecorationLine: "underline" },
  legal: { fontSize: 12, color: "#777", textAlign: "center", marginTop: 6, marginBottom: 8 },
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
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    width: "100%",
    marginBottom: 10,
  },
  modalBtn: {
    backgroundColor: "#FFE156",
    padding: 10,
    borderRadius: 8,
    width: "100%",
  },
  modalBtnText: { textAlign: "center", fontWeight: "bold", fontSize: 16 },
  cancelText: { marginTop: 10, color: "#888" },
  motionPrivacy: {
  fontSize: 15,
  lineHeight: 16,
  color: "#555",
  textAlign: "center",
  marginTop: 12,
  marginBottom: 6,
},
motionPrivacyWrap: {
  flexDirection: "row",
  alignItems: "flex-start",
  justifyContent: "center",
  marginTop: 12,
  marginBottom: 6,
  paddingHorizontal: 8,
  maxWidth: 300,          // ✅ 핵심
},

motionPrivacyIcon: {
  width: 14,
  height: 14,
  marginRight: 10,
  marginTop: 2, // 첫 줄 기준 살짝 아래로
  opacity: 0.85,
},
motionPrivacyText: {
  fontSize: 12,
  lineHeight: 16,
  color: "#555",
  textAlign: "center",    // ✅ 핵심
},

});
