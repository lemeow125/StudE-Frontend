import * as React from "react";
import styles, { Viewport } from "../../styles";
import {
  View,
  Text,
  ToastAndroid,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { useState } from "react";
import {
  UserInfoReturnType,
  OptionType,
  RootDrawerParamList,
  StudentStatusType,
  StudentStatusReturnType,
  StudentStatusPatchType,
} from "../../interfaces/Interfaces";
import Button from "../../components/Button/Button";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  PatchStudentStatus,
  GetUserInfo,
  ParseError,
} from "../../components/Api/Api";
import { colors } from "../../styles";
import DropDownPicker from "react-native-dropdown-picker";
import AnimatedContainerNoScroll from "../../components/AnimatedContainer/AnimatedContainerNoScroll";
import { urlProvider } from "../../components/Api/Api";
import MapView, { UrlTile, Marker } from "react-native-maps";
import { useNavigation } from "@react-navigation/native";
import { useToast } from "react-native-toast-notifications";
import CaretLeftIcon from "../../icons/CaretLeftIcon/CaretLeftIcon";
import AnimatedContainer from "../../components/AnimatedContainer/AnimatedContainer";

export default function StartStudying({ route }: any) {
  const { location } = route.params;
  const queryClient = useQueryClient();
  const navigation = useNavigation<RootDrawerParamList>();
  const toast = useToast();

  // Subject choices
  const [selected_subject, setSelectedSubject] = useState("");
  const [subjectsOpen, setSubjectsOpen] = useState(false);
  const [subjects, setSubjects] = useState<OptionType[]>([]);
  const StudentInfo = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const data = await GetUserInfo();
      if (data[0] == false) {
        return Promise.reject(new Error(data[1]));
      }
      return data;
    },
    onSuccess: (data: UserInfoReturnType) => {
      let subjects = data[1].subjects.map((subject: string) => ({
        label: subject,
        value: subject,
      }));
      setSubjects(subjects);
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

  const mutation = useMutation({
    mutationFn: async (info: StudentStatusPatchType) => {
      const data = await PatchStudentStatus(info);
      if (data[0] == false) {
        return Promise.reject(new Error(JSON.stringify(data[1])));
      }
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
      queryClient.invalidateQueries({ queryKey: ["user_status"] });
      queryClient.invalidateQueries({ queryKey: ["user_status_list"] });
      queryClient.invalidateQueries({ queryKey: ["study_group_list"] });
      toast.show("You are now studying  \n" + selected_subject, {
        type: "success",
        placement: "top",
        duration: 2000,
        animationType: "slide-in",
      });
      // Set a delay before going back to homepage to hopefully let the queries refresh in time
      setTimeout(() => {
        navigation.navigate("Home");
      }, 200);
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

  if (StudentInfo.isLoading) {
    return (
      <View style={styles.background}>
        <AnimatedContainer>
          <View style={{ paddingVertical: 8 }} />
          <ActivityIndicator size={96} color={colors.secondary_1} />
          <Text style={styles.text_white_medium}>Loading...</Text>
        </AnimatedContainer>
      </View>
    );
  }
  if (location && location.coords) {
    return (
      <View style={styles.background}>
        <AnimatedContainerNoScroll>
          <View style={{ zIndex: -1 }}>
            <View style={styles.padding} />
            <View style={{ borderRadius: 16, overflow: "hidden" }}>
              <MapView
                style={{
                  height: Viewport.height * 0.4,
                  width: Viewport.width * 0.8,
                  alignSelf: "center",
                }}
                customMapStyle={[
                  {
                    featureType: "poi",
                    stylers: [
                      {
                        visibility: "off",
                      },
                    ],
                  },
                ]}
                mapType="none"
                scrollEnabled={false}
                zoomEnabled={false}
                toolbarEnabled={false}
                rotateEnabled={false}
                minZoomLevel={18}
                initialRegion={{
                  latitude: location.coords.latitude,
                  longitude: location.coords.longitude,
                  latitudeDelta: 0.0922,
                  longitudeDelta: 0.0421,
                }}
                loadingBackgroundColor={colors.secondary_2}
              >
                <UrlTile
                  urlTemplate={urlProvider}
                  shouldReplaceMapContent={true}
                  maximumZ={19}
                  flipY={false}
                  zIndex={1}
                />
                <Marker
                  coordinate={{
                    latitude: location.coords.latitude,
                    longitude: location.coords.longitude,
                  }}
                  pinColor={colors.primary_1}
                />
              </MapView>
            </View>
            <View style={styles.padding} />
          </View>
          <DropDownPicker
            zIndex={1000}
            max={16}
            open={subjectsOpen}
            value={selected_subject}
            items={subjects}
            setOpen={(open) => {
              setSubjectsOpen(open);
            }}
            setValue={setSelectedSubject}
            placeholderStyle={{
              ...styles.text_white_tiny_bold,
              ...{ textAlign: "left" },
            }}
            placeholder="Select subject"
            multipleText="Select subject"
            style={styles.input}
            textStyle={{
              ...styles.text_white_tiny_bold,
              ...{ textAlign: "left" },
            }}
            modalContentContainerStyle={{
              backgroundColor: colors.primary_2,
              borderWidth: 0,
              zIndex: 1000,
            }}
            autoScroll
            dropDownDirection="BOTTOM"
            listMode="MODAL"
          />
          <View style={styles.padding} />
          <View style={styles.flex_row}>
            <Pressable onPress={() => navigation.navigate("Home")}>
              <CaretLeftIcon size={32} />
            </Pressable>
            <Button
              onPress={() => {
                console.log({
                  subject: selected_subject,
                  location: {
                    latitude: location.coords.latitude,
                    longitude: location.coords.longitude,
                  },
                });
                mutation.mutate({
                  active: true,
                  subject: selected_subject,
                  location: {
                    latitude: location.coords.latitude,
                    longitude: location.coords.longitude,
                  },
                });
              }}
            >
              <Text style={styles.text_white_small}>Start Studying</Text>
            </Button>
          </View>
        </AnimatedContainerNoScroll>
      </View>
    );
  }
  return <View />;
}
