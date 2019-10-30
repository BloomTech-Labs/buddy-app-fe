import React, { useState, useEffect } from "react";
import { StyleSheet, TouchableOpacity, Text, View } from "react-native";

import { getToken } from "../utils/authHelper";
import axiosWithAuth from "../utils/axiosWithAuth";
// styles
import Buttons from "../styles/Buttons";
import Global from "../styles/Global";
import Colors from "../styles/Colors";

export default function ActivityCard(props) {
  const [activity] = useState(props.activity);
  return (
    <View style={styles.activityCard}>
      <View style={styles.activityView}>
        <Text style={styles.activityText}>
          {activity.organizer_id} is {activity.name} at {activity.time} on{" "}
          {activity.date}
        </Text>
      </View>
      <View style={styles.joinBtn}>
        <TouchableOpacity>
          <Text style={Buttons.text}>Ask to Join</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  activityCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGray,
    width: "95%",
    marginTop: 20,
    paddingBottom: 20,
    height: 60
  },

  joinBtn: {
    width: "33%",
    borderWidth: 1,
    borderColor: "black",
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
    height: 40
  },

  activityView: {
    width: "60%",
    height: "150%"
  },

  activityText: {
    fontSize: 16,
    color: Colors.darkGray,
    fontFamily: "Nunito-Bold"
  }
});
