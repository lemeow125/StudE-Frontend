import * as React from "react";
import styles, { Viewport } from "../../styles";
import { View, Text } from "react-native";
import { useState } from "react";
import { UserInfoParams, OptionType } from "../../interfaces/Interfaces";
import Button from "../../components/Button/Button";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { UserInfo } from "../../components/Api/Api";
import { colors } from "../../styles";
import DropDownPicker from "react-native-dropdown-picker";
import AnimatedContainerNoScroll from "../../components/AnimatedContainer/AnimatedContainerNoScroll";
import { urlProvider } from "../../components/Api/Api";
import MapView, { UrlTile, Marker } from "react-native-maps";

export default function StartStudying({ route }: any) {
  const { location } = route.params;
  const queryClient = useQueryClient();
  const [feedback, setFeedback] = useState("");

  // Subject choices
  const [selected_subject, setSelectedSubject] = useState("");
  const [subjectsOpen, setSubjectsOpen] = useState(false);
  const [subjects, setSubjects] = useState<OptionType[]>([]);
  const StudentInfo = useQuery({
    queryKey: ["user"],
    queryFn: UserInfo,
    onSuccess: (data: UserInfoParams) => {
      let subjects = data[1].subjects.map((subject: string) => ({
        label: subject,
        value: subject,
      }));
      setSubjects(subjects);
    },
    onError: () => {
      setFeedback("Unable to query available subjects");
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

            <Text style={styles.text_white_small}>{feedback}</Text>
          </View>
          <View style={styles.flex_row}>
            <View style={{ flex: 1 }}>
              <Text style={styles.text_white_small_bold}>Start Studying</Text>
            </View>
            <View style={{ flex: 3 }}>
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
            </View>
          </View>
          <View style={styles.padding} />
          <Button onPress={() => {}}>
            <Text style={styles.text_white_small}>Start Studying</Text>
          </Button>
        </AnimatedContainerNoScroll>
      </View>
    );
  }
  return <View />;
}
