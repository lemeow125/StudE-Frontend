import * as React from "react";
import { ActivityIndicator, Image } from "react-native";
import styles from "../../styles";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  NativeSyntheticEvent,
  TextInputChangeEventData,
} from "react-native";
import { colors } from "../../styles";
import { useRef, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  GetStudentStatus,
  GetStudyGroup,
  GetStudyGroupMemberAvatars,
  GetStudyGroupMessages,
  PostMessage,
} from "../../components/Api/Api";
import {
  StudentStatusType,
  StudentStatusReturnType,
  StudyGroupType,
  StudyGroupDetailReturnType,
  MessageType,
  MessageReturnType,
  MessagePostType,
  GroupMessageAvatarType,
  GroupMessageAvatarReturnType,
} from "../../interfaces/Interfaces";
import { useToast } from "react-native-toast-notifications";
import { useQueryClient } from "@tanstack/react-query";
import AnimatedContainer from "../../components/AnimatedContainer/AnimatedContainer";

type ConversationType = {
  id: number;
  user: string;
  message_content: string;
  study_group: string;
  color: string;
};

export default function ConversationPage() {
  const toast = useToast();
  // Student Status
  const [student_status, setStudentStatus] = useState<StudentStatusType>();
  const StudentStatusQuery = useQuery({
    queryKey: ["user_status"],
    queryFn: async () => {
      const data = await GetStudentStatus();
      if (data[0] == false) {
        return Promise.reject(new Error(JSON.stringify(data[1])));
      }
      return data;
    },
    onSuccess: (data: StudentStatusReturnType) => {
      setStudentStatus(data[1]);
    },
    onError: (error: Error) => {
      toast.show(String(error), {
        type: "warning",
        placement: "top",
        duration: 2000,
        animationType: "slide-in",
      });
    },
  });

  // Study Group Detail
  const [studygroup, setStudyGroup] = useState<StudyGroupType>();
  const StudyGroupQuery = useQuery({
    enabled:
      student_status?.study_group != "" && student_status?.study_group != null,
    queryKey: ["study_group"],
    queryFn: async () => {
      const data = await GetStudyGroup(student_status?.study_group || "");
      if (data[0] == false) {
        return Promise.reject(new Error(JSON.stringify(data[1])));
      }
      return data;
    },
    onSuccess: (data: StudyGroupDetailReturnType) => {
      if (data[1]) {
        setStudyGroup(data[1]);
      }
    },
    onError: (error: Error) => {
      toast.show(String(error), {
        type: "warning",
        placement: "top",
        duration: 2000,
        animationType: "slide-in",
      });
    },
  });

  // Study Group Messages
  const [messages, setMessages] = useState<MessageType[]>([]);
  const MessageQuery = useQuery({
    refetchInterval: 3000,
    enabled:
      !StudentStatusQuery.isLoading &&
      (student_status?.study_group != null ||
        student_status?.study_group != ""),
    queryKey: ["study_group_messages"],
    queryFn: async () => {
      const data = await GetStudyGroupMessages();
      if (data[0] == false) {
        return Promise.reject(new Error(JSON.stringify(data[1])));
      }
      return data;
    },
    onSuccess: (data: MessageReturnType) => {
      if (data[1]) {
        setMessages(data[1]);
      }
    },
    onError: (error: Error) => {
      toast.show(String(error), {
        type: "warning",
        placement: "top",
        duration: 2000,
        animationType: "slide-in",
      });
    },
  });

  // Avatar List
  const [users, setUsers] = useState<GroupMessageAvatarType[]>([]);
  const AvatarsQuery = useQuery({
    refetchInterval: 3000,
    enabled:
      student_status?.study_group != null ||
      (student_status?.study_group != "" &&
        studygroup != null &&
        studygroup.students != null),
    queryKey: ["study_group_avatars"],
    queryFn: async () => {
      const data = await GetStudyGroupMemberAvatars();
      if (data[0] == false) {
        return Promise.reject(new Error(JSON.stringify(data[1])));
      }
      return data;
    },
    onSuccess: (data: GroupMessageAvatarReturnType) => {
      if (data[1]) {
        setUsers(data[1]);
      }
    },
    onError: (error: Error) => {
      toast.show(String(error), {
        type: "warning",
        placement: "top",
        duration: 2000,
        animationType: "slide-in",
      });
    },
  });
  const scrollViewRef = useRef<ScrollView>(null);
  const queryClient = useQueryClient();
  const [message, setMessage] = useState("");
  const send_message = useMutation({
    mutationFn: async (info: MessagePostType) => {
      const data = await PostMessage(info);
      if (data[0] != true) {
        return Promise.reject(new Error());
      }
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["study_group_messages"] });
    },
    onError: (error: Error) => {
      toast.show(String(error), {
        type: "warning",
        placement: "top",
        duration: 2000,
        animationType: "slide-in",
      });
    },
  });

  if (
    !StudyGroupQuery.isLoading &&
    !AvatarsQuery.isLoading &&
    !MessageQuery.isLoading &&
    student_status &&
    studygroup &&
    studygroup.students
  ) {
    return (
      <View style={styles.background}>
        <AnimatedContainer>
          <View
            style={{
              padding: 15,
              alignSelf: "flex-start",
            }}
          >
            <View style={styles.flex_row}>
              <Text style={{ ...styles.text_white_medium }}>
                {`Group: ${studygroup?.name ? studygroup.name : ""}`}
              </Text>
            </View>
            <View style={{ ...styles.flex_row }}>
              <Text
                style={{
                  ...styles.text_white_small,
                  textAlign: "left",
                  paddingRight: 4,
                }}
              >
                {studygroup.students.length} studying
              </Text>
              {users.map((user: GroupMessageAvatarType, index: number) => {
                if (index > 6) {
                  return <React.Fragment key={index} />;
                }
                return (
                  <React.Fragment key={index}>
                    {user.avatar != null && user.avatar != "" ? (
                      <Image
                        source={{ uri: user.avatar }}
                        style={styles.profile_mini}
                      />
                    ) : (
                      <Image
                        source={require("../../img/user_profile_placeholder.png")}
                        style={styles.profile_mini}
                      />
                    )}
                  </React.Fragment>
                );
              })}
            </View>
          </View>
          <ScrollView
            style={{ width: 320 }}
            onContentSizeChange={() => scrollViewRef.current?.scrollToEnd()}
            ref={scrollViewRef}
          >
            {messages.length > 0 ? (
              messages.map((message: MessageType, index: number) => {
                let avatar = "";
                users.filter((user: GroupMessageAvatarType) => {
                  if (user.username == message.user) {
                    avatar = user.avatar;
                  }
                });
                return (
                  <View
                    key={message.id}
                    style={{
                      ...styles.message_contentContainer,
                      alignItems: index % 2 == 0 ? "flex-end" : "flex-start",
                    }}
                  >
                    <View style={styles.flex_row}>
                      {avatar != null && avatar != "" ? (
                        <Image
                          source={{ uri: avatar }}
                          style={styles.profile_mini}
                        />
                      ) : (
                        <Image
                          source={require("../../img/user_profile_placeholder.png")}
                          style={styles.profile_mini}
                        />
                      )}

                      <Text style={styles.text_white_small}>
                        {message.user}
                      </Text>
                      <Text
                        style={{
                          ...styles.text_white_tiny,
                          ...{ marginLeft: 4, alignContent: "center" },
                        }}
                      >
                        {message.timestamp}
                      </Text>
                    </View>

                    <Text style={styles.text_white_small}>
                      {message.message_content}
                    </Text>
                  </View>
                );
              })
            ) : (
              <Text style={styles.text_white_small}>There are no messages</Text>
            )}
          </ScrollView>
          <TextInput
            style={styles.chatbox}
            placeholder="Send a message..."
            placeholderTextColor="white"
            value={message}
            onChange={(
              e: NativeSyntheticEvent<TextInputChangeEventData>
            ): void => {
              setMessage(e.nativeEvent.text);
            }}
            onSubmitEditing={() => {
              send_message.mutate({
                message_content: message,
              });
              setMessage("");
            }}
          />
        </AnimatedContainer>
      </View>
    );
  } else if (!student_status?.study_group) {
    return (
      <View style={styles.background}>
        <AnimatedContainer>
          <Text style={styles.text_white_medium}>
            You are not in a study group. Join one to start a conversation!
          </Text>
        </AnimatedContainer>
      </View>
    );
  }
  return (
    <View style={styles.background}>
      <AnimatedContainer>
        <ActivityIndicator size={96} color={colors.secondary_1} />
        <Text style={styles.text_white_medium}>Loading...</Text>
      </AnimatedContainer>
    </View>
  );
}
