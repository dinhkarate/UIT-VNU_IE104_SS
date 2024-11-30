//fetch API request
function fetchCourtDetails(fieldId) {
    const apiUrl = `/api/court/courtDetails?${fieldId}`;

    fetch(apiUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json(); 
      })
      .then((data) => {
        console.log("Court Details:", data);
  
        // Handle the combined response
        const { courtDetails, feedbacks, centreDetails } = data;
  
        console.log("Court Details:", courtDetails);
        console.log("Feedbacks:", feedbacks);
        console.log("Centre Details:", centreDetails);
        }
    )   
    .catch((error) => {
        console.error("Error fetching court details:", error);
      });
};

document.addEventListener('DOMContentLoaded', () => {
    console.log("Document loaded, fetching courts...");
    //Example
    fetchCourtDetails("BD002");
})