// Function to fetch courts from the API
function fetchCourts(filters = {}) {
  // Build query string from filters
  const queryString = new URLSearchParams(filters).toString();
  const apiUrl = `/api/court/courtsList${queryString ? `?${queryString}` : ""}`;

  // Fetch data from the API
  fetch(apiUrl)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      console.log("Fetched data:", data);
    })
    .catch((error) => console.error("Error fetching courts:", error));
}

// Fetch courts when the page loads
document.addEventListener("DOMContentLoaded", () => {
  fetchCourts(); 
});


document.querySelector('.apply-button').addEventListener('click', () => {
  // Gather selected filters
  const selectedSports = Array.from(
    document.querySelectorAll('input[name="sport"]:checked'))
    .map((checkbox) => checkbox.value);

  const selectedFieldTypes = Array.from(
    document.querySelectorAll('input[name="field-type"]:checked')
  ).map((checkbox) => checkbox.value);

  const selectedPartner = Array.from(
    document.querySelectorAll('input[name="partner"]:checked'))
    .map((checkbox) => checkbox.value);

  const selectedAmenities = Array.from(
    document.querySelectorAll('input[name="amenities"]:checked')
  ).map((checkbox) => checkbox.value);

  // Convert filters to query string
  const queryString = new URLSearchParams({
    sport: selectedSports.join(','),
    fieldType: selectedFieldTypes.join(','),
    amenities: selectedAmenities.join(','),
  }).toString();

  console.log('Query String:', queryString);

  fetchCourts(queryString);
});
