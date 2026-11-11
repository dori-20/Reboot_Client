import React from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

export default function ConfirmLogoutModal({ visible, onCancel, onConfirm }) {
  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.overlay} />

      <View style={styles.modalBox}>
        <Text style={styles.title}>정말 로그아웃하시겠어요?</Text>

        <Text style={styles.subText}>
          저장되지 않은 정보는 잃을 수 있습니다.
        </Text>

        <View style={styles.btnRow}>
          <TouchableOpacity style={styles.cancelBtn} onPress={onCancel}>
            <Text style={styles.cancelText}>아니요</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.okBtn} onPress={onConfirm}>
            <Text style={styles.okText}>네</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    backgroundColor: "rgba(0,0,0,0.4)",
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  modalBox: {
    position: "absolute",
    top: "35%",
    left: "7%",
    right: "7%",
    backgroundColor: "#fff",
    paddingVertical: 25,
    paddingHorizontal: 20,
    borderRadius: 18,
    elevation: 5,
  },
  title: {
    fontSize: 17,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 10,
  },
  subText: {
    fontSize: 13,
    color: "#999",
    textAlign: "center",
    marginBottom: 20,
  },
  btnRow: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  cancelBtn: {
    flex: 1,
    marginRight: 8,
    paddingVertical: 12,
    backgroundColor: "#F5F5F5",
    borderRadius: 10,
  },
  okBtn: {
    flex: 1,
    marginLeft: 8,
    paddingVertical: 12,
    backgroundColor: "#5D7BFF",
    borderRadius: 10,
  },
  cancelText: {
    textAlign: "center",
    fontWeight: "600",
    color: "#333",
  },
  okText: {
    textAlign: "center",
    fontWeight: "700",
    color: "#fff",
  },
});
