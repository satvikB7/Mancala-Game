document.getElementById("signup-form").addEventListener("submit", async function (event) {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    try {
        
        const response = await fetch("http://localhost:8080/api/signup", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email, password })
        });

        const result = await response.json();

        if (response.ok) {
            // Assuming backend returns a success message
            alert("Sign Up successful!");
            window.location.href = "login.html";  // Redirect to login page after successful signup
        } else {
            alert(result.message || "Signup failed! Please try again.");
        }
    } catch (error) {
        alert("Error: " + error.message);
    }
});
