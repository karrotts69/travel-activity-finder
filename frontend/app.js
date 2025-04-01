document.getElementById('findActivities').addEventListener('click', () => {
    const location = document.getElementById('location').value;
    if (location) {
        findActivities(location);
    } else {
        alert('Please enter a location');
    }
});

async function findActivities(location) {
    try {
        const response = await fetch(`/api/activities?location=${location}`);
        const data = await response.json();
        displayMap(data.map);
        displayEvents(data.events);
    } catch (error) {
        console.error('Error:', error);
    }
}

function displayMap(mapData) {
    // Display map using Geoapify API
}

function displayEvents(events) {
    const eventsContainer = document.getElementById('events');
    eventsContainer.innerHTML = '';
    events.forEach(event => {
        const eventElement = document.createElement('div');
        eventElement.textContent = event.name;
        eventsContainer.appendChild(eventElement);
    });
}