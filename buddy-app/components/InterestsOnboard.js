import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Button,
  TouchableOpacity
} from "react-native";
import axios from "axios";
import Global from "../styles/Global";
import Buttons from "../styles/Buttons";
import { setRecoveryProps } from "expo/build/ErrorRecovery/ErrorRecovery";
const InterestsOnboard = props => {
  const [interests, setInterests] = useState([]);
  const [userInterest, setUserInterest] = useState([]);

  useEffect(() => {
    axios
      .get("https://buddy-app-be.herokuapp.com/interests")
      .then(res => {
        setInterests(res.data);
      })
      .catch(err => {
        console.log("Error Message", error);
      });
  }, []);

  const toggleInterest = interest => {
    if (userInterest.includes(interest)) {
      setUserInterest(
        userInterest.filter(item => {
          return item != interest;
        })
      );
      //console.log("filter", userInterest);
    } else {
      setUserInterest([...userInterest, interest]);
      //console.log("adding", userInterest);
    }
    console.log(userInterest);
  };

  const backButton = () => {
    props.navigation.navigate("Landing");
  };
  return (
    <View style={Global.container}>
      <View style={Global.logoContainer}>
        <Text style={Global.logo}>BUDDY</Text>
      </View>
      <View style={styles.backButton}>
        <TouchableOpacity onPress={() => backButton()}>
          <Text style={Buttons.backButton}>&larr; Back</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.headerText}>Tell us more about yourself!</Text>

      <Text style={styles.titleText}>
        What are some of your interests or activites you like to do?
      </Text>

      <View style={styles.interests}>
        {interests.map(item => (
          <TouchableOpacity
            key={item.id}
            style={styles.interestBtn}
            onPress={() => {
              toggleInterest(item.id);
            }}
          >
            <Text>{item.name}</Text>
          </TouchableOpacity>
        ))}
      </View>
      {/* test toggle */}
      <Text style={styles.normalText}>
        Your selected interests:
        <Text style={styles.textStyle}>{userInterest}</Text>
      </Text>

      <View style={Buttons.container}>
        <TouchableOpacity
          style={[Buttons.btn, Buttons.secondary, { width: 130 }]}
        >
          <Text style={[Buttons.text]}>Cancel</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[Buttons.btn, Buttons.primary, { width: 130 }]}
        >
          <Text style={[Buttons.text, Buttons.textPrimary]}>Finish</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.bottomNav}></View>
    </View>
  );
};

const styles = StyleSheet.create({
  backButton: {
    marginTop: 20,
    marginBottom: 20
  },
  headerText: {
    fontSize: 25,
    fontWeight: "bold",
    width: 300
  },
  normalText: {
    fontSize: 20
  },
  titleText: {
    fontSize: 18,
    marginVertical: 20
  },
  bottomNav: {
    backgroundColor: "#6d6dff",
    height: 96,
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0
  },
  finishButton: {
    color: "white",
    width: 130,
    height: 40,
    fontSize: 18,
    backgroundColor: "#6D6DFF"
  },
  interestBtn: {
    marginVertical: 10,
    marginHorizontal: 10,
    borderColor: "black",
    borderWidth: 1,
    padding: 10,
    borderRadius: 5
  },
  interests: {
    flexDirection: "row",
    flexWrap: "wrap"
  }
});

export default InterestsOnboard;
