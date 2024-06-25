const API_KEY = "UdZthWrVL1DX7SbCdAiHnBqoXEA"
const API_URL = "https://ci-jshint.herokuapp.com/api";
const resultsModal = new bootstrap.Modal(document.getElementById("resultsModal"));

document.getElementById("status").addEventListener("click", e => getStatus(e)); /**this is our button we are adding a click event listener to it then calling the get status function */

document.getElementById("submit").addEventListener("click", e => postForm(e)); // This wires up our checks button

function processOptions(form) {
    let optArray = [];

    for (let e of form.entries()) {
        if (e[0] === "options") {
            optArray.push(e[1]);
        }
    }

    form.delete("options");

    form.append("options", optArray.join());

    return form;
}

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
        displayStatus(data);  // the data.expiry shows just the expiry date 
    } else {
        displayException(data);
        throw new Error(data.error); //data.error is the discriptive method from the json returned
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
function displayErrors(data) {

        let results = "";
    
        let heading = `JSHint Results for ${data.file}`;
        if (data.total_errors === 0) {
            results = `<div class="no_errors">No errors reported!</div>`;
        } else {
            results = `<div>Total Errors: <span class="error_count">${data.total_errors}</span></div>`;
            for (let error of data.error_list) {
                results += `<div>At line <span class="line">${error.line}</span>, `;
                results += `column <span class="column">${error.col}:</span></div>`;
                results += `<div class="error">${error.error}</div>`;
            }
        }

    
        document.getElementById("resultsModalTitle").innerHTML = heading;
        document.getElementById("results-content").innerHTML = results;
        resultsModal.show();
    }

function displayStatus(data) {

        let heading = "API Key Status";
        let results = `<div>Your key is valid until</div>`;
        results += `<div class="key-status">${data.expiry}</div>`;
    
        document.getElementById("resultsModalTitle").innerHTML = heading;
        document.getElementById("results-content").innerHTML = results;
        resultsModal.show();
    
    }

    /** POST method
     * We need two functions:
     * Function to make request
     * Function to display the data
     * 
     * So we need to get the form data and post it to api first
     */

/**Async so we can await the results of our promise */


async function postForm(e) {

        /** FormData captures all the fields in a form and return it as an object, we can test this using the following: 
        const form = new FormData(document.getElementById("checksform"));// checksform is the form id
        for (let e of form.entries()){
            console.log(e);
        }
            */
        const form = processOptions(new FormData(document.getElementById("checksform")));
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Authorization": API_KEY,
            },
            body: form,
        });
        const data =await response.json();
        if (response.ok){
            displayErrors(data)
        }
        else
        {   
            displayException(data);
            throw new Error(data.error);
        }
        
    }

    // this function needs to be called before places we have throw new Error
    function displayException(data) {

        let heading = `<div class="error-heading">An Exception Occurred</div>`;
    
        results = `<div>The API returned status code ${data.status_code}</div>`;
        results += `<div>Error number: <strong>${data.error_no}</strong></div>`;
        results += `<div>Error text: <strong>${data.error}</strong></div>`;
    
        document.getElementById("resultsModalTitle").innerHTML = heading;
        document.getElementById("results-content").innerHTML = results;
        resultsModal.show();
    }