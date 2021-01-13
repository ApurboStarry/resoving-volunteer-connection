const csv = require("csv-parser");
const fs = require("fs");
const results = [];

// used to sort input data based on "shift"
function compareShift(a, b) {
  if(a.shift > b.shift) {
    return 1;
  }
  if(a.shift < b.shift) {
    return -1;
  }
  return 0;
}

// used to sort input data based on "date"
function compareDate(a, b) {
  if(a.date > b.date) {
    return 1;
  }
  if(a.date < b.date) {
    return -1;
  }
  return compareShift(a, b);
}

// returns the unique names of the input data
getUniqueNames = (data) => {
  let set = new Set();
  for(let i = 0; i < data.length; i++) {
    set.add(data[i].volunteerName);
  }

  return set;
}

getNumberOfVolunteers = (data) => {
  let set = new Set();
  for (let i = 0; i < data.length; i++) {
    set.add(data[i].volunteerName);
  }

  return Array.from(set).length;
}

// forms a map by associating each unique volunteer's name with an integer
// ranging from 0 to total number of unique volunteers to be used 
// as index of the adjacency matrix and returns the formed map.
formMap = (data) => {
  uniqueNames = Array.from(getUniqueNames(data));
  let map = new Map();
  for(let i = 0; i < uniqueNames.length; i++) {
    map.set(uniqueNames[i], i);
  }

  return map;
}

// 1. the parameter "connectedVolunteers" contains the objects of volunteers 
// who have worked on the same shift in a particular day
// 2. map<String, int> maps each volunteers name to a integer to used as an index
// in the adjacency matrix, "graph"
// This function increments the corresponding entry in the adjacency matrix(graph)
// of the volunteers who are present in "connectedVolunteers".
updateGraph = (graph, connectedVolunteers, map) => {
  for(let i = 0; i < connectedVolunteers.length; i++) {
    for(let j = 0; j < connectedVolunteers.length; j++) {
      if(i !== j) {
        graph[map.get(connectedVolunteers[i].volunteerName)][map.get(connectedVolunteers[j].volunteerName)]++;
      }
    }
  }

  // console.log(graph);
}

// outputs the result stored in "graph" in a csv file called "output.csv"
writeToCSV = (graph, volunteers) => {
  const createCsvWriter = require("csv-writer").createObjectCsvWriter;
  const csvWriter = createCsvWriter({
    path: "output.csv",
    header: [
      { id: "node1", title: "Node1" },
      { id: "node2", title: "Node2" },
      { id: "weight", title: "Weight" },
    ],
  });

  const result = [];

  for(let i = 0; i < graph.length; i++) {
    for(let j = i+1; j < graph.length; j++) {
      if(graph[i][j] > 0) {
        // console.log(volunteers[i] + " " + volunteers[j] + " " + graph[i][j]);
        const relation = {node1: volunteers[i], node2: volunteers[j], weight: graph[i][j]};
        result.push(relation);
      }
    }
  }

  csvWriter
    .writeRecords(result)
    .then(() => console.log("Successfully calculated and written into 'output.csv' file"));
}

solve = (inputData) => {
  inputData.sort(compareDate);

  const numberOfVolunteers = getNumberOfVolunteers(inputData);
  
  let map = formMap(inputData);
  // console.log(map);

  var graph = Array(numberOfVolunteers)
              .fill()
              .map(() => Array(numberOfVolunteers).fill(0));

  // volunteers who worked on the same shift on the same day
  let connectedVolunteers = [];
  connectedVolunteers.push(inputData[0]);

  for(let i = 1; i < inputData.length; i++) {
    if(inputData[i].date == inputData[i-1].date && inputData[i].shift == inputData[i-1].shift) {
      connectedVolunteers.push(inputData[i]);
    } else {
      updateGraph(graph, connectedVolunteers, map);
      connectedVolunteers = [];
      connectedVolunteers.push(inputData[i]);
    }
  }

  updateGraph(graph, connectedVolunteers, map);

  // write the result to output.csv file
  let volunteers = Array.from(getUniqueNames(inputData));
  writeToCSV(graph, volunteers);
}

fs.createReadStream("volunteer_attendance_data.csv")
  .pipe(csv())
  .on("data", (data) => results.push(data))
  .on("end", () => {
    solve(results);
  });