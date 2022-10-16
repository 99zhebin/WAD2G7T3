// Your web app's Firebase configuration
// You can find yours at Firebase -> Project Overview -> Project Settings
// -> SDK setup and configuration -> CDN
const firebaseConfig = {
    apiKey: "AIzaSyAWvVP_h1HKDOSqjp9BFZ1ttifg_UhC0eQ",
    authDomain: "is216-webapp.firebaseapp.com",
    databaseURL: "https://is216-webapp-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "is216-webapp",
    storageBucket: "is216-webapp.appspot.com",
    messagingSenderId: "113592009297",
    appId: "1:113592009297:web:fd8286678c0c18abc3ee70"
    };
    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);

function logout() {
    firebase.auth().signOut().then(() => {
        // Sign-out successful.
        alert("Signed out")
        let query = window.location.search
        console.log(query)
        let url = "Adopt_page.html" + query
        window.location.href=url
        }).catch((error) => {
        // An error happened.
        });
}

function getPet() {
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      // User is signed in, see docs for a list of available properties
      // https://firebase.google.com/docs/reference/js/firebase.User
      let url = "profile.html?email=" + user.email
      document.getElementById("login").innerText = user.email
      document.getElementById("login").setAttribute("href", url)
      let ul = document.getElementById("navbar")
      let li = document.createElement("li")
      li.innerHTML = '<button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#logout">Logout</button>'
      ul.appendChild(li)
      console.log(li)
      // ...
    } else {
      // User is signed out
      // ...
      let query = window.location.search
      let url = "Login.html?page=Adopt_page.html" + query
      console.log(url)
      document.getElementById("login").innerText = "Log In"
      document.getElementById("login").setAttribute("href", url)
    }
  });
      console.log("Hello")
      var url = window.location.search;
      url = url.replace("?name=", '');
      url = url.split("-")
      let email = url[0]
      let petName = url[1].slice(0,-5)
      let petArray = firebase.database().ref('adoption').orderByChild("email").equalTo(email)
      let pets = []
      petArray.once('value').then((snapshot) => {
        if(snapshot.exists()) {
            console.log("Found")
            console.log(snapshot.val())
            pets = snapshot.val()
            for (pet of pets){
              if (pet.animalname == petName){
                var age = pet.age
                var description = pet.description
                var hdb = pet.hdb
                var health = pet.health
                var species = pet.species
                var vaccination = pet.vaccination
                var images = pet.image
              }
            }
            document.getElementById("petname").innerText = petName
            document.getElementById("petdesc").innerText = description
            if (health != ""){
              document.getElementById("pethealth").innerText = health
            }
            else {
              document.getElementById("pethealth").innerText = "No Problems!"
            }
            if (hdb == "true"){
              document.getElementById("hdb").checked = true
            }
            if (vaccination == "true"){
              document.getElementById("vaccination").checked = true
            }
            for (image of images){
              
            }
        }
      else {
        console.log("Not Found")
      }
    })
  }
