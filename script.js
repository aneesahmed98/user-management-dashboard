// Fetch user data from the API
const API_URL = "https://jsonplaceholder.typicode.com/users"; // The API endpoint

// Function to fetch and display users
async function fetchUsers() {
  try {
    const response = await fetch(API_URL); // Fetch data from the API
    const users = await response.json(); // Convert the response to JSON

    // Populate the table with user data
    const userTableBody = document.getElementById("user-table-body");
    userTableBody.innerHTML = ""; // Clear existing rows

    users.forEach((user) => {
      const row = document.createElement("tr"); // Create a new row
      row.innerHTML = `
        <td>${user.id}</td>
        <td>${user.name.split(" ")[0]}</td>
        <td>${user.name.split(" ")[1]}</td>
        <td>${user.email}</td>
        <td>${user.company.name}</td>
        <td>
          <button class="edit-btn" data-id="${user.id}">Edit</button>
          <button class="delete-btn" data-id="${user.id}">Delete</button>
        </td>
      `;
      userTableBody.appendChild(row); // Add the row to the table
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    alert("Failed to load users. Please try again later.");
  }
}

// Call the function to load users when the page loads
fetchUsers();
// Function to add a new user
// Function to add or update a user
async function addUser(event) {
    event.preventDefault(); // Prevent form from refreshing the page
  
    // Get form values
    const firstName = document.getElementById("first-name").value;
    const lastName = document.getElementById("last-name").value;
    const email = document.getElementById("email").value;
    const department = document.getElementById("department").value;
  
    // Create a new user object
    const newUser = {
      name: `${firstName} ${lastName}`,
      email: email,
      company: { name: department },
    };
  
    const editingId = document.getElementById("user-form").getAttribute("data-editing-id");
  
    let response;
    if (editingId) {
      // Update existing user (PUT request)
      response = await fetch(`${API_URL}/${editingId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newUser),
      });
    } else {
      // Add new user (POST request)
      response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newUser),
      });
    }
  
    const updatedUser = await response.json();
  
    // Update the user table
    const userTableBody = document.getElementById("user-table-body");
    if (editingId) {
      // Find the row for the user and update it
      const row = document.querySelector(`button[data-id='${editingId}']`).closest("tr");
      row.innerHTML = `
        <td>${updatedUser.id}</td>
        <td>${firstName}</td>
        <td>${lastName}</td>
        <td>${email}</td>
        <td>${department}</td>
        <td>
          <button class="edit-btn" data-id="${updatedUser.id}">Edit</button>
          <button class="delete-btn" data-id="${updatedUser.id}">Delete</button>
        </td>
      `;
    } else {
      // Add the new user to the table
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${updatedUser.id || "N/A"}</td>
        <td>${firstName}</td>
        <td>${lastName}</td>
        <td>${email}</td>
        <td>${department}</td>
        <td>
          <button class="edit-btn" data-id="${updatedUser.id || "N/A"}">Edit</button>
          <button class="delete-btn" data-id="${updatedUser.id || "N/A"}">Delete</button>
        </td>
      `;
      userTableBody.appendChild(row);
    }
  
    // Clear the form and remove the editing ID
    document.getElementById("user-form").reset();
    document.getElementById("user-form").removeAttribute("data-editing-id");
    alert(editingId ? "User updated successfully!" : "User added successfully!");
  }
  
function handleEditClick(event) {
    if (!event.target.classList.contains("edit-btn")) return; // Make sure the clicked element is an "edit" button
  
    const userId = event.target.getAttribute("data-id"); // Get the user ID from the button's data attribute
    const row = event.target.closest("tr"); // Find the row where the button was clicked
  
    // Get the data from the row and populate the form
    const firstName = row.children[1].textContent;
    const lastName = row.children[2].textContent;
    const email = row.children[3].textContent;
    const department = row.children[4].textContent;
  
    document.getElementById("first-name").value = firstName;
    document.getElementById("last-name").value = lastName;
    document.getElementById("email").value = email;
    document.getElementById("department").value = department;
  
    // Update the form to indicate this is an edit
    document.getElementById("user-form").setAttribute("data-editing-id", userId);
  }
  
  // Add event listener for Edit button
  document.getElementById("user-table-body").addEventListener("click", handleEditClick);
  
// Function to handle delete button click
async function handleDeleteClick(event) {
    if (!event.target.classList.contains("delete-btn")) return; // Make sure the clicked element is a "delete" button
  
    const userId = event.target.getAttribute("data-id"); // Get the user ID from the button's data attribute
    const row = event.target.closest("tr"); // Find the row where the button was clicked
  
    try {
      // Send DELETE request to the API to remove the user
      const response = await fetch(`${API_URL}/${userId}`, {
        method: "DELETE",
      });
  
      if (response.ok) {
        // Remove the user row from the table if the delete was successful
        row.remove();
        alert("User deleted successfully!");
      } else {
        alert("Failed to delete user. Please try again.");
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("Failed to delete user. Please try again.");
    }
  }
  
  // Add event listener for Delete button
  document.getElementById("user-table-body").addEventListener("click", handleDeleteClick);
    