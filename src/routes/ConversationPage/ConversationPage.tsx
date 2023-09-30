import * as React from "react";
import styles from "../../styles";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  StyleSheet
} from "react-native";
import { colors } from "../../styles";
import { useState } from "react";

const convStyles = StyleSheet.create({
  scrollViewContainer: {
    backgroundColor: colors.secondary_1,
    padding: 15,
  },
  messageContainer: {
    backgroundColor: '#00000038',
    margin: 5,
    padding: 10,
    borderRadius: 20,
  },
  badge: {
    height: 10,
    width: 10,
    borderRadius: 10,
  }
})

type ConversationType = {
  username: string;
  message: string;
  userId: number;
  type: string;
  color: string;
}


export default function ConversationPage() {
  const [conversation, setConversation] = useState<ConversationType[]>([{
    username: "You",
    message: "Hello World naa ko diri canteen gutom sh*t.",
    userId: Math.floor(Math.random() * 1000),
    type: "o",
    color: Math.floor(Math.random() * 16777215).toString(16)
  }, {
    username: "User 2",
    message: "Hahahah shor oy.",
    userId: Math.floor(Math.random() * 1000),
    type: "i",
    color: Math.floor(Math.random() * 16777215).toString(16)
  }, {
    username: "User 3",
    message: "AHAHAHHA BOBO!",
    userId: Math.floor(Math.random() * 1000),
    type: "i",
    color: Math.floor(Math.random() * 16777215).toString(16)
  },
  {
    username: "Vale",
    message: "tanga valir! bobo!",
    userId: Math.floor(Math.random() * 1000),
    type: "i",
    color: Math.floor(Math.random() * 16777215).toString(16)
  },
  {
    username: "You",
    message: "Hoyy bobo!!!",
    userId: Math.floor(Math.random() * 1000),
    type: "o",
    color: Math.floor(Math.random() * 16777215).toString(16)
  }, {
    username: "Valir",
    message: "Gago! 1v1 nalng?",
    userId: Math.floor(Math.random() * 1000),
    type: "o",
    color: Math.floor(Math.random() * 16777215).toString(16)
  }, {
    username: "User 2",
    message: "Hello World",
    userId: Math.floor(Math.random() * 1000),
    type: "i",
    color: Math.floor(Math.random() * 16777215).toString(16)
  }, {
    username: "User 3",
    message: "Hello World",
    userId: Math.floor(Math.random() * 1000),
    type: "i",
    color: Math.floor(Math.random() * 16777215).toString(16)
  },
  {
    username: "User 1",
    message: "Hello World",
    userId: Math.floor(Math.random() * 1000),
    type: "o",
    color: Math.floor(Math.random() * 16777215).toString(16)
  },
  {
    username: "User 1",
    message: "Hello World",
    userId: Math.floor(Math.random() * 1000),
    type: "o",
    color: Math.floor(Math.random() * 16777215).toString(16)
  },
  {
    username: "User 1",
    message: "Hello World",
    userId: Math.floor(Math.random() * 1000),
    type: "o",
    color: Math.floor(Math.random() * 16777215).toString(16)
  },
  {
    username: "User 1",
    message: "Hello World",
    userId: Math.floor(Math.random() * 1000),
    type: "o",
    color: Math.floor(Math.random() * 16777215).toString(16)
  }
  ]);

  return (
    <ScrollView style={convStyles.scrollViewContainer}>
      <View style={{
        display: "flex", backgroundColor: colors.secondary_2,
        borderRadius: 20,
      }}>
        <View style={{ padding: 15 }}>
          <View style={{flexDirection: "row"}}>
            <Text style={{ ...styles.text_white_medium }}>Group#57605</Text>
          </View>
          <Text>3 students
            <View style={{ ...convStyles.badge, backgroundColor: 'blue' }}></View>
            <View style={{ ...convStyles.badge, backgroundColor: `green` }}></View>
            <View style={{ ...convStyles.badge, backgroundColor: `red` }}></View>
          </Text>
        </View>
        <View>
          {
            conversation.map((item: ConversationType) => (
              <View key={item.userId} style={{
                ...convStyles.messageContainer,
                alignItems: item.type == 'o' ? "flex-end" : 'flex-start'
              }}>

                <Text style={styles.text_white_small}>
                  {
                    item.type == 'i' ? <View style={{ 
                      ...convStyles.badge, 
                      backgroundColor: `#${item.color}`, 
                      marginRight: 2 
                    }}></View> : null
                  }
                  {item.username}
                  {
                    item.type == 'o' ? <View style={{ 
                      ...convStyles.badge, 
                      backgroundColor: `#${item.color}`, 
                      marginLeft: 2 
                    }}></View> : null
                  }
                </Text>
                <Text style={styles.text_white_small}> 
                  {item.message}
                </Text>
              </View>
            ))
          }
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
