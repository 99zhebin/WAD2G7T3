const firebaseConfig = {
    apiKey: "AIzaSyAWvVP_h1HKDOSqjp9BFZ1ttifg_UhC0eQ",
    authDomain: "is216-webapp.firebaseapp.com",
    databaseURL: "https://is216-webapp-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "is216-webapp",
    storageBucket: "is216-webapp.appspot.com",
    messagingSenderId: "113592009297",
    appId: "1:113592009297:web:fd8286678c0c18abc3ee70"
    };

firebase.initializeApp(firebaseConfig);

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
          let url = "../login/newLogin.html?page=../adoptionHome/newAdoptionHome.html"
          document.getElementById("login").innerText = "Log In"
          document.getElementById("login").setAttribute("href", url)
        }
      });
}

function logout() {
    firebase.auth().signOut().then(() => {
        // Sign-out successful.
        alert("Signed out")
        window.location.href="newAdoptionHome.html"
      }).catch((error) => {
        // An error happened.
      });
}

const app = Vue.createApp({
    data(){
        return{
            pets: [],

            filtered: [],

            hdb: [],

            vaccination: [],

            species: [],
        }
    },

    methods: {
        filter(criteria){
            console.log("--- Start Filter ---")
            console.log(criteria)
            this.filtered = []
            for (instance of this.events){
                if (instance.category == criteria){
                    this.filtered.push(instance)
                }
            }
            if (this.filtered.length == 0){
                this.filtered = "not found"
            }
            this.emergencyFilter = false
            this.driveFilter = false
            this.fundFilter = false
            this.volunteerFilter = false
            if (criteria == 'Emergency'){
                this.emergencyFilter = true
            }
            else if (criteria == 'Adoption Drive'){
                this.driveFilter = true
            }
            else if (criteria == 'Fundraiser'){
                this.fundFilter = true
            }
            else if (criteria == 'Volunteering'){
                this.volunteerFilter = true
            }
        },

        url(email,petName){
            let url = "../adoptionInfo/newadoptionInfo.html?name=" + email + "-" + petName
            return url
        },

        follow_display(follows){
            firebase.auth().onAuthStateChanged((user) => {
                if (user) {
                    if(follows.includes(user)){
                        return "Unlike"
                    }
                    else{
                        return "Like"
                    }
                }
                else {
                    "Followed By"
                }
            })
        },
    },

    mounted() {
        console.log("--- Initialise Firebase ---")
        let eventArray = firebase.database().ref('adoption').orderByChild("timestamp")
        eventArray.once('value').then((snapshot) => {
        if(snapshot.exists()) {
            console.log("Found")
            console.log(snapshot.val())
            this.events = snapshot.val()
            for(instance of this.events){
                if (instance.category == "Emergency"){
                    this.filtered.push(instance)
                }
            }
            if (this.filtered.length == 0){
                this.filtered = "not found"
            }
        }
        else {
            console.log("Not Found")
        }
        })
    }
    
})

const vm2 = app.mount("#content")

