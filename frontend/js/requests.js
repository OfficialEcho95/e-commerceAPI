const loginForm = document.querySelector("#login_form");

loginForm.addEventListener(
  "submit",
  function (e) {
    e.preventDefault();
  },
  true
);

const login = () => {
  const email = document.querySelector("#email").value;
  const password = document.querySelector("#password").value;

  // Create the Basic Authentication header
  const authHeader = `Basic ${btoa(`${email}:${password}`)}`;

  // Prepare the data to be sent to the server
  const data = {
    email,
    password,
  };

  axios
    .post("http://localhost:3000/login", data, {
      headers: {
        // Include the Basic Authentication header
        Authorization: authHeader, 
      },
    })
    .then((res) => {
      // display data gotten from the API
      console.log(res.data);

      if (res.status === 200) {
        // Redirect to the index page on successful login
        window.location.replace("index.html");
      } else {
        console.error("Login failed");
      }
    })
    .catch((err) => {
      console.log(err.message);
    });
};
