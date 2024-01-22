document.getElementById('itemBarcode').addEventListener('change', function(e) {
    const barcode = e.target.value;
    fetch(`/lookupItem?barcode=${barcode}`)
    .then(response => response.json())
    .then(data => {
        if(data.name) {
            document.getElementById('itemName').value = data.name;
        }
    });
});

document.getElementById('addItemForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const itemName = document.getElementById('itemName').value;
    const itemBarcode = document.getElementById('itemBarcode').value;
    const itemQuantity = parseInt(document.getElementById('itemQuantity').value);

    fetch('/addItem', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ barcode: itemBarcode, name: itemName, quantity: itemQuantity }),
    })
    .then(response => response.json())
    .then(data => {
        openModal(`Item added successfully! Location: ${data.location}`);
        loadInventory();
    });
});

document.getElementById('itemBarcode').addEventListener('change', function(e) {
    const barcode = e.target.value;
    
    fetch(`/lookupItem?barcode=${barcode}`)
    .then(response => response.json())
    .then(data => {
        if(data.success) {
            document.getElementById('itemName').value = data.name;
        } else {
            // Handle the case where no item is found or clear the field
            document.getElementById('itemName').value = '';
        }
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

document.getElementById("addItemForm").onsubmit = function() {
    openModal('Item added successfully!');
    return false;
};

document.getElementById("removeItemForm").onsubmit = function() {
    openModal('Item removed successfully!');
    return false;
};

var modal = document.getElementById("customModal");
var closeButton = document.getElementsByClassName("close-button")[0];

function openModal(message) {
    document.getElementById("modalMessage").innerText = message;
    modal.style.display = "block";
}

closeButton.onclick = function() {
    modal.style.display = "none";
}

window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}



