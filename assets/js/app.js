//Initialize Firebase
var config = {
  apiKey: "AIzaSyARuySG6TQvPX-wd5L1UnzE6m3hlggzIxk",
  authDomain: "trainscheduler-732e1.firebaseapp.com",
  databaseURL: "https://trainscheduler-732e1.firebaseio.com",
  projectId: "trainscheduler-732e1",
  storageBucket: "trainscheduler-732e1.appspot.com",
  messagingSenderId: "437731024867"
};
firebase.initializeApp(config);

var database = firebase.database();

// Button adds train to schedule
$("#add-train-button").on("click", function(event) {
  event.preventDefault();

  //Grabs user input
  var trainName = $("#name-input")
    .val()
    .trim();
  var destination = $("#destination-input")
    .val()
    .trim();
  var firstTrain = moment(
    $("#start-time")
      .val()
      .trim(),
    "HH:mm"
  ).format("HH:mm");
  var frequency = $("#frequency")
    .val()
    .trim();

  //Creates local object for train data
  var newTrain = {
    trainName: trainName,
    destination: destination,
    firstTrain: firstTrain,
    frequency: frequency
  };

  if (
    trainName === "" ||
    destination === "" ||
    firstTrain === "" ||
    frequency === ""
  ) {
    alert("Train NOT added. Make sure to choo-choose all train details");
  } else {
    alert("Train successfully added");

    // Uploads train data to the database
    database.ref().push(newTrain);

    //Logs everything to console
    console.log(newTrain.trainName);
    console.log(newTrain.destination);
    console.log(newTrain.firstTrain);
    console.log(newTrain.frequency);
  }

  //Clears all of the text-boxes
  $("name-input").val("");
  $("#destination-input").val("");
  $("#start-time").val("");
  $("#frequency").val("");
});

//Creates Firebase event for adding train to the database and html row element when a user adds an entry
database.ref().on("child_added", function(childSnapshot) {
  console.log(childSnapshot.val());

  //Stores everything in a variable.
  var trainName = childSnapshot.val().trainName;
  var destination = childSnapshot.val().destination;
  var firstTrain = childSnapshot.val().firstTrain;
  var frequency = childSnapshot.val().frequency;

  //Logs train Info
  console.log(trainName);
  console.log(destination);
  console.log(firstTrain);
  console.log(frequency);

  var firstTimeConverted = moment(firstTrain, "HH:mm");
  console.log(firstTimeConverted);

  var currentTime = moment().format("HH:mm");
  console.log("CURRENT TIME: " + currentTime);

  // Calculates the next train arrival
  var timeDiff = moment().diff(moment(firstTimeConverted), "minutes");
  console.log("Difference in Time: " + timeDiff);

  var timeRemainder = timeDiff % frequency;
  console.log(timeRemainder);

  var minToTrain = frequency - timeRemainder;
  console.log(minToTrain);

  var nextTrain = moment()
    .add(minToTrain, "minutes")
    .format("HH:mm");

  console.log(nextTrain);

  //Conditional to see if train has run yet
  if (timeRemainder < 0) {
    nextTrain = firstTrain;
    console.log(nextTrain);

    minToTrain = -timeDiff;
    console.log(minToTrain);
  }

  //Creates a new row for new train info
  var newRow = $("<tr>").append(
    $("<td>").text(trainName),
    $("<td>").text(destination),
    $("<td>").text(frequency),
    $("<td>").text(nextTrain),
    $("<td>").text(minToTrain)
  );

  //Appends the new row
  $("#train-table > tbody").append(newRow);
});
