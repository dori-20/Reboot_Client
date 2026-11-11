import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";

export default function CustomDrawer() {
  const navigation = useNavigation();

  const handleLogout = () => {
    Alert.alert("로그아웃", "정말 로그아웃하시겠어요?", [
      { text: "취소", style: "cancel" },
      {
        text: "로그아웃",
        style: "destructive",
        onPress: async () => {
          await AsyncStorage.removeItem("user");
          navigation.replace("Login");
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      
      {/* 🌿 따뜻한 한 줄 메시지 */}
      <View style={styles.header}>
        <Text style={styles.greeting}>오늘도 고생했어요 💛</Text>
      </View>

      <View style={styles.divider} />

      {/* 🚪 로그아웃 버튼 */}
      <View style={styles.footer}>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutBtn}>
          <Text style={styles.logoutText}>🚪 로그아웃</Text>
        </TouchableOpacity>

        <Text style={styles.version}>Re:Boot v1.0.0</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingTop: 70,
    paddingHorizontal: 25,
  },

  header: {
    alignItems: "center",
    marginBottom: 20,
  },

  greeting: {
    fontSize: 16,
    fontWeight: "600",
    color: "#4F8EF7",
  },

  divider: {
    height: 1,
    backgroundColor: "#E2E8F0",
    marginVertical: 20,
  },

  footer: {
    alignItems: "center",
    marginTop: "auto",
    marginBottom: 40,
  },

  logoutBtn: {
    backgroundColor: "#FFE5E5",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
    marginBottom: 10,
  },

  logoutText: {
    color: "#D9534F",
    fontWeight: "700",
    fontSize: 15,
  },

  version: {
    fontSize: 12,
    color: "#9CA3AF",
  },
});
