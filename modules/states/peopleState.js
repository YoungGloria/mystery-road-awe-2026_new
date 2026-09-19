import {evidenceMentionsPerson, allEvidence} from './evidenceState.js';

let allPeople = [];


//originally no catch for loading locations - intentional?
// DEMO 3: added catch to handle errors when loading people.json
// function loadPeople(){
//     return fetch("data/people.json")
//             .then(function (peopleRes) {
//                 return peopleRes.json();
//                  })
//             .then(function (peopleJson) {
//               return allPeople = peopleJson;
//           })
//           .catch
//           (function (err) {
//             console.error("Failed to load people.json", err);
//             alert("People could not be loaded. Some views may be incomplete.");
//           });
//   }

// DEMO 9: async/await version of loadPeople with try/catch for error handling and network error handling
async function loadPeople() {
  try {
    const peopleRes = await fetch("data/people.json");  

    if (!peopleRes.ok) {
      throw new Error("Error fetching people.json: " + peopleRes.statusText);
    }

    allPeople = await peopleRes.json();
    return allPeople;
  } catch (err) {
    console.error("Failed to load people.json", err);
    alert("People could not be loaded. Some views may be incomplete.");
  }
}

function countEvidenceForPerson(person) {
  let count = 0;
  for (let i = 0; i < allEvidence.length; i++) {
    if (evidenceMentionsPerson(allEvidence[i], person)) count++;
  }
  return count;
}

function findPersonById(id) {
  for (let i = 0; i < allPeople.length; i++) {
    if (allPeople[i].id === id) return allPeople[i];
  }
  return null;
}

export { allPeople, loadPeople, findPersonById, countEvidenceForPerson };