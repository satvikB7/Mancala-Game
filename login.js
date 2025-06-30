document.getElementById("login-form").addEventListener("submit", async function (event) {
    event.preventDefault();
    
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
        const response = await fetch("http://localhost:8080/api/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email, password })
        });

        const result = await response.json();

        if (response.ok) {
            // Assuming backend returns a success message
            alert("Login successful!");
            window.location.href = "open_game.html";  // Redirect to home page or dashboard
        } else {
            alert(result.message || "Login failed! Please check your credentials.");
        }
    } catch (error) {
        alert("Error: " + error.message);
    }
});
