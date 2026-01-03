import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert, Text, TouchableOpacity, View } from "react-native";
import { useAppTheme } from "../constants/themeHelper";

type DeleteAccountProps = {
  theme: ReturnType<typeof useAppTheme>;
};

export const DeleteAccountSection: React.FC<DeleteAccountProps> = ({ theme }) => {
  const [selectedReason, setSelectedReason] = useState("");
  const [showDeleteButton, setShowDeleteButton] = useState(false);
  const router = useRouter();
  const reasons = [
    "I am not using the app",
    "I have another account",
    "Too many notifications",
    "Privacy concerns",
    "Other reasons",
  ];

  const handleReason = (reason: any) => {
    setSelectedReason(reason);
    setShowDeleteButton(true);
  };

  const confirmDelete = () => {
    Alert.alert(
      "Delete Account",
      "Your request to delete your account has been received.\n\nYour account will be scheduled for deletion. You can recover your account within 30 days by logging back in.",

      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Yes, Delete", style: "destructive", onPress: () =>
            router.push("/")
        },
      ]
    );

  };

  return (
    <View>
      <Text style={{ color: theme.text, fontSize: 14, marginBottom: 10, lineHeight: 22 }}>
        Your account will be deleted by admin.
        After you request deletion, your account will be permanently removed within 15 days.
      </Text>

      {/* REASONS */}
      <Text style={{ color: theme.text, fontSize: 15, fontWeight: "600", marginBottom: 8 }}>
        Select a reason for deleting your account:
      </Text>

      {reasons.map((r) => (
        <TouchableOpacity
          key={r}
          onPress={() => handleReason(r)}
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 10,
          }}
        >
          <Ionicons
            name={selectedReason === r ? "radio-button-on" : "radio-button-off"}
            size={20}
            color={theme.link}
            style={{ marginRight: 8 }}
          />
          <Text style={{ color: theme.subtitle, fontSize: 14 }}>{r}</Text>
        </TouchableOpacity>
      ))}

      {/* DELETE BUTTON SHOW AFTER REASON SELECTED */}
      {showDeleteButton && (
        <TouchableOpacity
          onPress={confirmDelete}
          style={{
            backgroundColor: "#d9534f",
            paddingVertical: 12,
            borderRadius: 10,
            marginTop: 16,
            alignItems: "center",
          }}
        >
          <Text style={{ color: "white", fontSize: 16, fontWeight: "600" }}>
            Delete Account
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};
