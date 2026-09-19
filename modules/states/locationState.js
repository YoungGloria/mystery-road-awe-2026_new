let allLocations = [];

//originally no catch for loading locations - intentional?
//DEMO 3: added catch to handle errors when loading locations.json
// function loadLocations(){
//     return fetch("data/locations.json")
//             .then(function (locationsRes) {
//                 return locationsRes.json();
//                  })
//             .then(function (locationsJson) {
//               return allLocations = locationsJson;
//           })
//           .catch
//           (function (err) {
//             console.error("Failed to load locations.json", err);
//             alert("Locations could not be loaded. Some views may be incomplete.");
//           });
//   }

// DEMO 9: async/await version of loadLocations with try/catch for error handling and network error handling
async function loadLocations() {
  try {
    const locationsRes = await fetch('data/locations.json');

    if (!locationsRes.ok) {
      throw new Error(
        'Error fetching locations.json: ' + locationsRes.statusText
      );
    }

    allLocations = await locationsRes.json();
    return allLocations;
  } catch (err) {
    console.error('Failed to load locations.json', err);
    alert('Locations could not be loaded. Some views may be incomplete.');
  }
}

function findLocationById(id) {
  for (let i = 0; i < allLocations.length; i++) {
    if (allLocations[i].id === id) return allLocations[i];
  }
  return null;
}

export { allLocations, loadLocations, findLocationById };
