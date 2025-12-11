import { useAppTheme } from "@/src/constants/themeHelper";
import { DEFAULT_LAST_UPDATED, getPrivacyPolicySections } from "@/src/dumyData/privacy-policy-content";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import {
  Linking,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View
} from "react-native";

const PrivacyPolicyScreen: React.FC = () => {
  const theme = useAppTheme();
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const toggle = (id: string) => {
    setExpanded((s) => ({ ...s, [id]: !s[id] }));
  };

  const openEmail = (email: string) => {
    Linking.openURL(`mailto:${email}`);
  };

  const sections = getPrivacyPolicySections(theme);

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: theme.background,
      }}
    >
      <ScrollView>
        {/* HEADER */}
        <View
          style={{
            backgroundColor: theme.buttonBg,
            paddingHorizontal: 24,
            paddingVertical: 32,
            alignItems: "center",
          }}
        >
          <Text
            style={{
              fontSize: 32,
              fontWeight: "bold",
              color: theme.buttonText,
            }}
          >
            Privacy Policy
          </Text>
          <Text
            style={{
              marginTop: 6,
              color: theme.buttonText,
              opacity: 0.85,
            }}
          >
            Last updated: {DEFAULT_LAST_UPDATED}
          </Text>
        </View>

        {/* SECTIONS */}
        <View style={{ padding: 16 }}>
          {sections.map((s) => {
            const isOpen = !!expanded[s.id];
            return (
              <View
                key={s.id}
                style={{
                  backgroundColor: theme.inputBg,
                  borderRadius: 12,
                  marginBottom: 12,
                  padding: 14,
                  borderColor: theme.searchBg,
                  borderWidth: 1,
                }}
              >
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => toggle(s.id)}
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: "600",
                      color: theme.text,
                      flex: 1,
                    }}
                  >
                    {s.title}
                  </Text>
                  <Ionicons
                    name={isOpen ? "chevron-up" : "chevron-down"}
                    size={20}
                    color={theme.subtitle}
                  />
                </TouchableOpacity>

                {isOpen && (
                  <View
                    style={{
                      borderTopWidth: 1,
                      borderTopColor: theme.searchBg,
                      marginTop: 12,
                      paddingTop: 12,
                    }}
                  >
                    {typeof s.body === "string" ? (
                      s.body.split("\n").map((line, i) => (
                        <Text
                          key={i}
                          style={{
                            fontSize: 14,
                            color: theme.subtitle,
                            marginBottom: 6,
                            lineHeight: 22,
                          }}
                        >
                          • {line}
                        </Text>
                      ))
                    ) : (
                      s.body
                    )}
                  </View>
                )}
              </View>
            );
          })}
        </View>

        {/* BUTTONS */}
        <View style={{ padding: 16 }}>
          <TouchableOpacity
            onPress={() => router.push("/terms-&-conditions")}
            style={{ marginBottom: 12 }}
          >
            <Text
              style={{
                fontSize: 15,
                color: theme.link,
                textAlign: "center",
              }}
            >
              View Terms & Conditions
            </Text>
          </TouchableOpacity>

          {/* <TouchableOpacity
            onPress={() =>
              Linking.openURL(
                `mailto:support@yourapp.com?subject=Privacy Policy Acknowledgement`
              )
            }
            style={{
              backgroundColor: theme.googleBg,
              borderRadius: 10,
              paddingVertical: 14,
              alignItems: "center",
            }}
          >
            <Text
              style={{
                color: theme.buttonText,
                fontSize: 16,
                fontWeight: "600",
              }}
            >
              Acknowledge
            </Text>
          </TouchableOpacity> */}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default PrivacyPolicyScreen;
