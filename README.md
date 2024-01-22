# inventory-system

Start your server by running node server.js.
Open a browser and go to http://localhost:3000 to see your UI.


<body>
    <h1>Inventory Management</h1>
    <button id="logoutButton" onclick="window.location.href='/logout'">Logout</button>

    <div class="grid-container">
        <div class="grid-item">
            <form id="addItemForm">
                <label for="itemName">Item Name</label>
                <input type="text" id="itemName" required>
                <label for="itemQuantity">Quantity</label>
                <input type="number" id="itemQuantity" value=1 min="1" required>
                <button type="submit">Add Item</button>
            </form>
        </div>
        <button type="button" class="grid-button" onclick="window.location.href='/scanQrCode'">Scan QR Code</button>
        <div class="grid-item">
            <form id="removeItemForm">
                <label for="removeItemName">Item Name</label>
                <input type="text" id="removeItemName" required>
                <button type="submit">Remove Item</button>
            </form>
        </div>
        <button type="button" class="grid-button" onclick="window.location.href='/printQrCode'">Print QR Code</button>
    </div>

    <div id="inventoryList">
        <h2>Inventory List</h2>
        <ul id="itemList"></ul>
    </div>

    <!-- Modal -->
    <div id="customModal" class="modal">
        <div class="modal-content">
            <span class="close-button">&times;</span>
            <p id="modalMessage">Your message here.</p>
        </div>
    </div>

    <script src="app.js"></script>
</body>