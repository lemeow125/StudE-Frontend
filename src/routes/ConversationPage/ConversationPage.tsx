import * as React from "react";
import styles from "../../styles";
import { View, Text, TextInput, ScrollView, StyleSheet } from "react-native";
import { colors } from "../../styles";
import { useState } from "react";

const convStyles = StyleSheet.create({});

type ConversationType = {
  id: number;
  user: string;
  message_content: string;
  study_group: string;
  color: string;
};

export default function ConversationPage() {
  const [conversation, setConversation] = useState<ConversationType[]>([
    {
      user: "You",
      message_content: "Hello World naa ko diri canteen gutom sh*t.",
      id: Math.floor(Math.random() * 1000),
      color: Math.floor(Math.random() * 16777215).toString(16),
      study_group: "Heh group",
    },
    {
      user: "User 2",
      message_content: "Hahahah shor oy.",
      id: Math.floor(Math.random() * 1000),
      color: Math.floor(Math.random() * 16777215).toString(16),
      study_group: "Heh group",
    },
  ]);

  return (
    <ScrollView style={styles.messageScrollViewContainer}>
      <View
        style={{
          display: "flex",
          backgroundColor: colors.secondary_2,
          borderRadius: 20,
        }}
      >
        <View style={{ padding: 15 }}>
          <View style={{ flexDirection: "row" }}>
            <Text style={{ ...styles.text_white_medium }}>Group#57605</Text>
          </View>
          <Text>
            3 students
            <View style={{ ...styles.badge, backgroundColor: "blue" }}></View>
            <View style={{ ...styles.badge, backgroundColor: `green` }}></View>
            <View style={{ ...styles.badge, backgroundColor: `red` }}></View>
          </Text>
        </View>
        <View>
          {conversation.map((item: ConversationType, index: number) => {
            const color = `rgba(${Math.floor(
              Math.random() * 256
            )}, ${Math.floor(Math.random() * 256)}, ${Math.floor(
              Math.random() * 256
            )}, 0.7)`;
            return (
              <View
                key={item.id}
                style={{
                  ...styles.message_contentContainer,
                  alignItems: index % 2 == 0 ? "flex-end" : "flex-start",
                }}
              >
                <View style={styles.flex_row}>
                  {index % 2 == 0 ? (
                    <View
                      style={{
                        ...styles.badge,
                        ...{ paddingRight: 2, backgroundColor: color },
                      }}
                    />
                  ) : (
                    <View
                      style={{
                        ...styles.badge,
                        ...{ paddingLeft: 2, backgroundColor: color },
                      }}
                    />
                  )}
                  <Text style={styles.text_white_small}>{item.user}</Text>
                </View>

                <Text style={styles.text_white_small}>
                  {item.message_content}
                </Text>
              </View>
            );
          })}
        </View>
      </View>
      <TextInput
        style={styles.chatbox}
        placeholder="type here...."
        placeholderTextColor="white"
        autoCapitalize="none"
      />
    </ScrollView>
  );
}
