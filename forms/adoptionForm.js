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
            let url = "../profile/newProfile.html?email=" + user.email
            document.getElementById("login").innerText = user.email
            document.getElementById("login").setAttribute("href", url)
            let ul = document.getElementById("navbar")
            let li = document.createElement("li")
            li.innerHTML = '<button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#logout">Logout</button>'
            ul.appendChild(li)
            // ...
        } else {
            // User is signed out
            // ...
            let url = "../login/newLogin.html?page=../eventHome/newEventHome.html"
            document.getElementById("login").innerText = "Log In"
            document.getElementById("login").setAttribute("href", url)
        }
        });
}

function logout() {
    firebase.auth().signOut().then(() => {
        // Sign-out successful.
        alert("Signed out")
        window.location.href="../homepage/newHomepage.html"
        }).catch((error) => {
        // An error happened.
        });
}

const app = Vue.createApp({
  data(){
      return{
        animalName: "",

        animalAge: '',

        species: '',
        
        personality: '',

        hdbApproved: '',

        vaccinationStatus: '',

        health: ''
      }
  },

  methods: {

    // post(){
      
    // }

    all_inputs(){
        console.log("clicked")
        console.log(this.animalName)
        console.log(this.animalAge)
        console.log(this.species)
        console.log(this.vaccinationStatus)
        console.log(this.personality)

    }
  },

  mounted() {
      console.log("--- Initialise Firebase ---")
      firebase.initializeApp(firebaseConfig);
      this.email = window.location.search;
      console.log(this.email)
      this.email = this.email.replace("?email=", '');
      this.key = this.email.replace("@", '-');
      this.key = this.key.replace(".", '-');
      console.log(this.key)
      }
})

const vm2 = app.mount("#content")