import * as React from "react";
import styles, { Viewport } from "../../styles";
import { View, Text, ToastAndroid } from "react-native";
import { useState } from "react";
import {
  UserInfoReturnType,
  OptionType,
  RootDrawerParamList,
  StudentStatusType,
  StudentStatusReturnType,
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
    mutationFn: async (info: StudentStatusType) => {
      const data = await PatchStudentStatus(info);
      if (data[0] == false) {
        return Promise.reject(new Error(JSON.stringify(data[1])));
      }
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
      queryClient.invalidateQueries({ queryKey: ["user_status"] });
      toast.show("You are now studying  \n" + selected_subject, {
        type: "success",
        placement: "top",
        duration: 2000,
        animationType: "slide-in",
      });
      navigation.navigate("Home");
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

  if (location && location.coords) {
    return (
      <View style={styles.background}>
        <AnimatedContainerNoScroll>
          <View style={{ zIndex: -1 }}>
            <View style={styles.padding} />
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
          <View style={styles.padding} />
        </AnimatedContainerNoScroll>
      </View>
    );
  }
  return <View />;
}
