import React from "react";
import { Linking, Text, TouchableOpacity, View } from "react-native";
import { useAppTheme } from "../constants/themeHelper";
// import { useAppTheme } from "./themeHelper";

export type Section = {
  id: string;
  title: string;
  body: string | React.ReactNode;
};

export const DEFAULT_LAST_UPDATED = "December 9, 2025";

export const getPrivacyPolicySections = (theme: ReturnType<typeof useAppTheme>): Section[] => [
  {
    id: "info",
    title: "1. Information We Collect",
    body:
      "Name, username, email\nProfile photo and content you upload (photos, videos, audio)\nDevice information and usage data\nMessages and interaction data (likes, comments, follows)",
  },
  {
    id: "use",
    title: "2. How We Use Your Information",
    body:
      "Provide and improve our services\nPersonalize user experience\nMaintain security and prevent misuse\nAnalyze app performance",
  },
  {
    id: "content",
    title: "3. User Content",
    body:
      "Any content you upload is your responsibility. You retain ownership of all uploaded content.",
  },
  {
    id: "copyright",
    title: "4. Copyright & Audio Content",
    body:
      "Users are responsible for any copyrighted audio or media uploaded. We may remove such content upon valid complaint.",
  },
  {
    id: "sharing",
    title: "5. Data Sharing",
    body:
      "We do not sell your personal data. Some data may be shared only as required legally or for service functionality.",
  },
  {
    id: "security",
    title: "6. Data Security",
    body:
      "We use reasonable security measures, but no system is 100% secure.",
  },
  {
    id: "rights",
    title: "7. Your Rights",
    body:
      "Edit or delete your account\nRequest full data removal\nContact support anytime",
  },
  {
    id: "changes",
    title: "8. Changes to Policy",
    body:
      "We may update this policy anytime. Continued app usage means you accept the updated terms.",
  },
  {
    id: "contact",
    title: "9. Contact Us",
    body: (
      <View>
        <Text style={{ fontSize: 14, color: theme.subtitle, marginBottom: 5 }}>
          For privacy concerns, contact us at:
        </Text>
        <TouchableOpacity
          onPress={() => {
            // mailto link
            Linking.openURL(`mailto:support@yourapp.com`);
          }}
        >
          <Text style={{ color: theme.link, textDecorationLine: "underline" }}>
            support@yourapp.com
          </Text>
        </TouchableOpacity>
      </View>
    ),
  },
];
