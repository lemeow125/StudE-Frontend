import * as React from "react";
import styles, { Viewport } from "../../styles";
import {
  View,
  Text,
  TextInput,
  NativeSyntheticEvent,
  TextInputChangeEventData,
  Pressable,
} from "react-native";
import { useState } from "react";
import {
  RootDrawerParamList,
  StudentStatusPatchType,
  StudyGroupCreateType,
} from "../../interfaces/Interfaces";
import Button from "../../components/Button/Button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { PatchStudentStatus, CreateStudyGroup } from "../../components/Api/Api";
import { colors } from "../../styles";
import AnimatedContainerNoScroll from "../../components/AnimatedContainer/AnimatedContainerNoScroll";
import { urlProvider } from "../../components/Api/Api";
import MapView, { UrlTile, Marker } from "react-native-maps";
import { useNavigation } from "@react-navigation/native";
import { useToast } from "react-native-toast-notifications";
import CaretLeftIcon from "../../icons/CaretLeftIcon/CaretLeftIcon";

export default function CreateGroup({ route }: any) {
  const { location, subject } = route.params;
  const queryClient = useQueryClient();
  const navigation = useNavigation<RootDrawerParamList>();
  const toast = useToast();

  const [name, setName] = useState("");
  const study_group_create = useMutation({
    mutationFn: async (info: StudyGroupCreateType) => {
      const data = await CreateStudyGroup(info);
      if (data[0] != true) {
        return Promise.reject(new Error());
      }
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
      queryClient.invalidateQueries({ queryKey: ["user_status"] });
      student_status_patch.mutate({
        study_group: name,
      });
      toast.show("Created successfully", {
        type: "success",
        placement: "top",
        duration: 2000,
        animationType: "slide-in",
      });
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

  const student_status_patch = useMutation({
    mutationFn: async (info: StudentStatusPatchType) => {
      const data = await PatchStudentStatus(info);
      if (data[0] != true) {
        return Promise.reject(new Error());
      }
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
      queryClient.invalidateQueries({ queryKey: ["user_status"] });
      queryClient.invalidateQueries({ queryKey: ["user_status_list"] });
      queryClient.invalidateQueries({ queryKey: ["study_group_list"] });
      toast.show(`Joined group ${name} successfully`, {
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

  if (location) {
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
                  latitude: location.latitude,
                  longitude: location.longitude,
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
                    latitude: location.latitude,
                    longitude: location.longitude,
                  }}
                  pinColor={colors.primary_1}
                />
              </MapView>
            </View>
            <View style={styles.padding} />
          </View>
          <TextInput
            style={styles.text_input}
            placeholder="Group Name"
            placeholderTextColor="white"
            autoCapitalize="none"
            value={name}
            onChange={(
              e: NativeSyntheticEvent<TextInputChangeEventData>
            ): void => {
              setName(e.nativeEvent.text);
            }}
          />
          <View style={styles.padding} />
          <View style={styles.flex_row}>
            <Pressable onPress={() => navigation.navigate("Home")}>
              <CaretLeftIcon size={32} />
            </Pressable>
            <Button
              onPress={() => {
                study_group_create.mutate({
                  name: name,
                  location: location,
                  subject: subject,
                });
              }}
            >
              <Text style={styles.text_white_small}>Start Studying</Text>
            </Button>
          </View>

          <View style={styles.padding} />
        </AnimatedContainerNoScroll>
      </View>
    );
  }
  return <View />;
}
