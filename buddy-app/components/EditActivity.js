import React, { useState } from "react";
import { connect } from "react-redux";
import DatePicker from "react-native-datepicker";
import moment from "moment";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Modal,
  Image
} from "react-native";
import InterestPicker from "./InterestPicker";

import axiosWithAuth from "../utils/axiosWithAuth";
import { getToken } from "../utils/authHelper";
//icons
import addButton from "../assets/icons/add_button.png";
import calendar from "../assets/icons/calendar.png";
import x from "../assets/icons/x.png";

//styles
import Global from "../styles/Global";
import Colors from "../styles/Colors";
import Buttons from "../styles/Buttons";

function EditActivity(props) {
  const today = moment(Date.now()).format("MM/D/YY"); // set today
  const {
    id,
    name,
    notes,
    date,
    time,
    organizer_id,
    interest_id,
    location
  } = props.activity;

  const [newActivity, setNewActivity] = useState({
    id: id,
    name: name,
    notes: notes,
    date: date,
    time: time,
    interest_id: interest_id,
    location: location,
    organizer_id: organizer_id // technically also props.user.id
  }); // set initial state as the activity to be edited

  const [interests, setInterests] = useState([...props.interests]); // GET all interests, mapped to props from redux store
  const [activityInterest, setActivityInterest] = useState(
    interests[interest_id - 1].name
  ); // set activityInterest (name string) in the InterestPicker component based on the ID number

  const saveActivity = () => {
    const interestId = interests.filter(
      interest => interest.name === activityInterest
    )[0].id; // match picker string to the list of interests and return ID
    const submitted = {
      ...newActivity,
      interest_id: interestId
    }; // final update of non-input form components? */
    console.log("submitted", submitted);
    console.log(newActivity);
    getToken()
      .then(token => {
        axiosWithAuth(token)
          .put(`https://buddy-app-be.herokuapp.com/activities/${id}`, submitted)
          .then(res => {
            props.toggleModal();
            console.log(res, "res");
          })
          .catch(err => {
            console.log(err);
          });
      })
      .catch(err => {
        console.log(err);
      });
  };

  const activityChangeHandler = (value, name) => {
    const interestId = interests.filter(
      interest => interest.name === activityInterest
    )[0].id; // match picker string to the list of interests and return ID

    setNewActivity({
      ...newActivity,
      [name]: value,
      /* date: activityDate,
      time: activityTime, */
      interest_id: interestId
    });
    // this reliably handles changes in text inputs ONLY.
    // it doesn't update properly if the pickers are the last object touched before submitting form.
  };

  const cancelHandler = () => {
    setNewActivity({
      id,
      name,
      notes,
      date,
      time,
      organizer_id,
      interest_id,
      location
    });
    props.toggleModal();
    // resets values to the initial activity, closes the modal using toggle function passed through ActivityCard
  };

  return (
    <Modal
      animationType="slide"
      transparent={false}
      visible={props.isModalVisible}
    >
      <View style={styles.viewContainer}>
        <View style={styles.addView}>
          <View style={{ alignSelf: "flex-end" }}>
            <TouchableOpacity onPress={props.toggleModal}>
              <Image source={x} />
            </TouchableOpacity>
          </View>
          <View>
            <Text style={styles.addHeader}>Edit an Activity</Text>
          </View>
          <View style={styles.addInputContainer}>
            <Text style={styles.addText}>What Do You Want To Do?</Text>
            <TextInput
              style={[Global.input, styles.addInput]}
              placeholder="Activity"
              onChangeText={e => activityChangeHandler(e, "name")}
              value={newActivity.name}
            ></TextInput>

            <Text style={styles.addText}>Select A Category</Text>
            <InterestPicker
              activityInterest={activityInterest}
              setActivityInterest={setActivityInterest}
              //activityInterest={interests[interest_id - 1].name}
              //setNewActivity={setNewActivity}
              interests={interests}
            />

            <Text style={styles.addText}>When Do You Want To Go?</Text>
            <View style={[styles.datePicker, styles.addInput]}>
              <Image source={calendar} />
              <DatePicker
                placeholder="Select Date"
                date={newActivity.date}
                mode="date"
                format="MM/DD/YY"
                minDate={today}
                confirmBtnText="Confirm"
                cancelBtnText="Cancel"
                showIcon={false}
                onDateChange={date => {
                  setNewActivity({
                    ...newActivity,
                    date: date
                  });
                }}
                style={styles.date}
                customStyles={{ dateInput: { borderRadius: 5 } }}
              />

              <DatePicker
                mode="time"
                placeholder="Select Time"
                date={newActivity.time}
                showIcon={false}
                confirmBtnText="Confirm"
                cancelBtnText="Cancel"
                is24Hour={false} // only works for Android view
                onDateChange={date => {
                  setNewActivity({
                    ...newActivity,
                    time: date
                  });
                }}
                style={styles.time}
                customStyles={{ dateInput: { borderRadius: 5 } }}
              />
            </View>
            <Text style={styles.addText}>Where?</Text>
            <TextInput
              style={[Global.input, styles.addInput]}
              placeholder="Add Location"
              onChangeText={e => activityChangeHandler(e, "location")}
              value={newActivity.location}
            ></TextInput>

            <Text style={styles.addText}>Don't Forget A Note!</Text>
            <TextInput
              style={[Global.input, { height: 77 }, styles.addInput]}
              multiline={true} // moves placeholder text to top for iOS
              textAlignVertical={"top"} // for Android
              placeholder="This lets people know what to look out for!"
              value={newActivity.notes}
              onChangeText={e => activityChangeHandler(e, "notes")}
            ></TextInput>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                onPress={cancelHandler}
                style={[Buttons.btn, Buttons.secondary]}
              >
                <Text style={[Buttons.textAuth]}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={saveActivity}
                style={[Buttons.btn, Buttons.primary]}
              >
                <Text style={[Buttons.textAuth, Buttons.textPrimary]}>
                  Save
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  viewContainer: {
    width: "100%",
    alignItems: "center"
  },
  addView: {
    width: "75%",
    marginTop: 55
  },
  addHeader: {
    fontSize: 25,
    fontFamily: "Nunito-Bold",
    marginBottom: 30
  },
  addText: {
    fontSize: 18,
    color: Colors.darkGray,
    fontFamily: "Nunito-Regular",
    marginBottom: -15
  },

  addInputContainer: {
    height: "80%"
  },

  addInput: {
    marginBottom: 25
  },

  addBtn: {
    alignSelf: "flex-end"
  },
  datePicker: {
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "space-between"
  },

  date: {
    width: "45%"
  },
  time: {
    width: "35%"
  },
  buttonContainer: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
    alignItems: "center"
  }
});

const mapStateToProps = state => {
  return {
    ...state,
    interests: state.interests,
    user: state.user
  };
};

export default connect(
  mapStateToProps,
  {}
)(EditActivity);