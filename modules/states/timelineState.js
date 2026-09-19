let allTimeline = [];

//originally no catch for loading timeline data - intentional?
// DEMO 3: added catch to handle errors when loading timeline.json
function loadTimelineData() {
  return fetch('data/timeline.json')
    .then(function (locationRes) {
      return locationRes.json();
    })
    .then(function (timelineJson) {
      return (allTimeline = timelineJson);
    })
    .catch(function (err) {
      console.error('Failed to load timeline.json', err);
      alert('Timeline could not be loaded. Some views may be incomplete.');
    });
}

export { allTimeline, loadTimelineData };
