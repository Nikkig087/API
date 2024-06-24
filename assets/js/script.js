const API_KEY = "UdZthWrVL1DX7SbCdAiHnBqoXEA"
const API_URL = "https://ci-jshint.herokuapp.com/api";
const resultsModal = new bootstrap.Modal(document.getElementById("resultsModal"));

document.getElementById("status").addEventListener("click", e => getStatus(e)); /**this is our button we are adding a click event listener to it then calling the get status function */


/** Tasks our get status needs to do
 * 1. It needs to make a  GET request to the API_URL with the API_KEY.
 * 2. It needs to pass this data to a function that will display it.
 *
 */
async function getStatus(e) {

    const queryString = `${API_URL}?api_key=${API_KEY}`; //url and parameters we need to send to our API

    const response = await fetch(queryString); //When the response comes back, we'll need to convert it to json.

    const data = await response.json(); //Remember that the json() method also returns a promise, so we need to await that too.

    /** If everything has gone well, a property is set on the response object.
        And this property is the “ok” property.
        If the server returns the HTTP status code of 200 then, then you’ll remember, our request
        has been successful and the “ok” property will be set to True.
        If it returns an error code, then the “ok” property will be set to false.
    */
    if (response.ok) {
        console.log(data);  // the data.expiry shows just the expiry date 
    } else {
        throw new Error(data.error);
    }

}


/**Note
 *  When we’re handling promises, we have two ways of doing it.
    We can chain “.then”s as we did before, 
    or we can wrap the promises in  an async function - like this -
    and then await the promise coming true.
 */


/**{
    "expiry": "24-06-2025",
    "status_code": 200
} */

    function displayStatus(data) {

        let heading = "API Key Status";
        let results = `<div>Your key is valid until</div>`;
        results += `<div class="key-status">${data.expiry}</div>`;
    
        document.getElementById("resultsModalTitle").innerText = heading;
        document.getElementById("results-content").innerHTML = results;
        resultsModal.show();
    
    }