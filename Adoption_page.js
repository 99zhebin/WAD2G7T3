const firebaseConfig = {
    apiKey: "AIzaSyAWvVP_h1HKDOSqjp9BFZ1ttifg_UhC0eQ",
    authDomain: "is216-webapp.firebaseapp.com",
    databaseURL: "https://is216-webapp-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "is216-webapp",
    storageBucket: "is216-webapp.appspot.com",
    messagingSenderId: "113592009297",
    appId: "1:113592009297:web:fd8286678c0c18abc3ee70"
    };

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
          let url = "Login.html?page=Adoption_page.html"
          document.getElementById("login").innerText = "Log In"
          document.getElementById("login").setAttribute("href", url)
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

const app = Vue.createApp({
    data(){
        return{
            pets: [],

            speciesFilter: "",

            hdbFilter: "",

            vaccinationFilter: "",

            healthFilter: "",

            filtered: [],
        }
    },

    methods: {
        filter(){
            console.log("--- Start Filter ---")
            this.filtered = []
            for (pet of this.pets){
                let species = pet.species
                let vacStatus = pet.vaccination
                let hdbStatus = pet.hdb
                let healthStatus = pet.health
                if (species == this.speciesFilter){
                    if ((this.vaccinationFilter == true && vacStatus == "true") || (this.vaccinationFilter == false)){
                        if ((this.hdbFilter == true && hdbStatus == "true") || (this.hdbFilter == false)){
                            if ((this.healthFilter == true && healthStatus == "") || (this.healthFilter == false)){
                                this.filtered.push(pet)
                            }
                        }
                    }
                }
            }
            if (this.filtered.length == 0){
                this.filtered = "not found"
            }
        },

        url(email,petName){
            let url = "Adopt_page.html?name=" + email + "-" + petName
            return url
        },
    },

    mounted() {
        console.log("--- Initialise Firebase ---")
        firebase.initializeApp(firebaseConfig);
        let petArray = firebase.database().ref('adoption').orderByChild("timestamp")
        petArray.once('value').then((snapshot) => {
        if(snapshot.exists()) {
            console.log("Found")
            console.log(snapshot.val())
            this.pets = snapshot.val()
        }
        else {
            console.log("Not Found")
        }
        })
    }
})

const vm2 = app.mount("#content")
