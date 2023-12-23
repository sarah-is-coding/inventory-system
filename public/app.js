// This line attaches an event listener to the form with the ID 'addItemForm'.
// When the form is submitted, the specified function is called.
document.getElementById('addItemForm').addEventListener('submit', function(e) {
    e.preventDefault(); // Prevents the default form submission action.

    // Retrieves the values entered into the input fields with IDs 'itemName' and 'itemQuantity'.
    const itemName = document.getElementById('itemName').value;
    const itemQuantity = document.getElementById('itemQuantity').value;

    // Makes an HTTP POST request to the '/addItem' route on the server.
    fetch('/addItem', {
        method: 'POST', // Specifies the method as POST.
        headers: {
            'Content-Type': 'application/json', // Sets the content type of the request to JSON.
        },
        body: JSON.stringify({ name: itemName, quantity: itemQuantity }), // Sends the item name and quantity as JSON in the request body.
    })
    .then(response => response.json()) // Parses the JSON response from the server.
    .then(data => {
        loadInventory(); // Calls the function to reload and display the updated inventory.
    });
});

// Similar to above, this attaches an event listener to the form for removing items.
document.getElementById('removeItemForm').addEventListener('submit', function(e) {
    e.preventDefault(); // Prevents the default form submission action.
    const itemName = document.getElementById('removeItemName').value; // Retrieves the value of the item name to be removed.

    // Makes an HTTP POST request to the '/removeItem' route on the server.
    fetch('/removeItem', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: itemName }), // Sends the name of the item to be removed in the request body.
    })
    .then(response => response.json())
    .then(data => {
        alert('Item removed!'); // Alerts the user that the item was removed.
        loadInventory(); // Reloads and displays the updated inventory.
    });
});

// Function to load and display the current inventory.
function loadInventory() {
    fetch('/getInventory') // Makes a GET request to the '/getInventory' route on the server.
    .then(response => response.json()) // Parses the JSON response.
    .then(data => {
        const itemList = document.getElementById('itemList'); // Gets the element where items will be displayed.
        itemList.innerHTML = ''; // Clears the current list.

        // Loops through each item in the data and creates a list item for each one.
        data.forEach(item => {
            let li = document.createElement('li'); // Creates a new list item element.
            li.textContent = `${item.name}: ${item.quantity}`; // Sets the text content of the list item.
            itemList.appendChild(li); // Adds the list item to the itemList element.
        });
    });
}

loadInventory(); // Calls the loadInventory function when the script is first executed.
