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

    // Load all Adoption Listings on first load


    
function loadDisplay() {
    console.log("--- loadDisplay() start ---")
    console.log("--- logInCheck() Start  ---")
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
          let url = "Login.html?page=Adoption_page"
          document.getElementById("login").innerText = "Log In"
          document.getElementById("login").setAttribute("href", url)
        }
      });
    var petArray = firebase.database().ref('adoption').orderByChild("timestamp")
    var pets = []
    var content = ""
    petArray.once('value').then((snapshot) => {
    if(snapshot.exists()) {
        console.log("Found")
        console.log(snapshot.val())
        pets = snapshot.val()
        for (pet of pets){
            let image = pet.image
            let petName = pet.animalname
            let species = pet.species
            let age = pet.age
            content += `
            <div class="col-xl-3 col-lg-4 col-md-6 col-sm-12 my-3">
                <div class="card" style="width: 18rem;">
                    <img src="${image}" class="card-img-top" alt="...">
                    <div class="card-body">
                        <h3 class="card-title">${petName}</h3>
                        <h5 class="card-title">${species}</h5>
                        <p class="card-text">Age: ${age}</a><br><br>
                        <a href="#" class="btn btn-primary">Details</a>
                    </div>
                </div>
            </div>
            `   
        }
        if (content == ""){
            content = "<h1 style='text-align:center;margin: 80px 0px'>There is currently nothing here</h1>"
        }
        document.getElementById("pets").innerHTML = content
    }
    else {
        console.log("Not Found")
    }
    });
}

// Function to filter through adoption listings on button press

function filter(){
    var petArray = firebase.database().ref('adoption').orderByChild("timestamp")
    var pets = []
    var content = ""
    var speciesFilter = document.getElementById("species").options[document.getElementById("species").selectedIndex].text
    console.log(speciesFilter)
    petArray.once('value').then((snapshot) => {
    if(snapshot.exists()) {
        console.log("Found")
        console.log(snapshot.val())
        pets = snapshot.val()
        for (pet of pets){
            let image = pet.image
            let petName = pet.animalname
            let species = pet.species
            console.log(species)
            let age = pet.age
            if (species == speciesFilter){
                content += `
                <div class="col-xl-3 col-lg-4 col-md-6 col-sm-12 my-3">
                    <div class="card" style="width: 18rem;">
                        <img src="${image}" class="card-img-top" alt="...">
                        <div class="card-body">
                            <h3 class="card-title">${petName}</h3>
                            <h5 class="card-title">${species}</h5>
                            <p class="card-text">Age: ${age}</a><br><br>
                            <a href="#" class="btn btn-primary">Details</a>
                        </div>
                    </div>
                </div>
                `   
            }
        }
        if (content == ""){
            content = "<h1 style='text-align:center;margin: 80px 0px'>No Matches Found</h1>"
        }
        document.getElementById("pets").innerHTML = content
    }
    else {
        console.log("Not Found")
    }
    });
}

function logout() {
    firebase.auth().signOut().then(() => {
        // Sign-out successful.
        alert("Signed out")
        window.location.href="Adoption_page.html"
      }).catch((error) => {
        // An error happened.
      });
}
