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
          document.getElementById("login").innerText = "Profile"
          document.getElementById("login").setAttribute("href", url)
          let ul = document.getElementById("navbar")
          let li = document.createElement("li")
          li.innerHTML = '<a class="nav-link" href="#" data-bs-toggle="modal" data-bs-target="#logout">Logout</a>'
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

            health: [],

            pageCount: 1,

            pageLimit: 2,

            query: '',

            gender: []
        }
    },

    methods: {
        filter(){
            console.log("--- Start Filter ---")
            this.filtered = []
            for (key in this.pets){
                correct = true
                console.log(this.pets[key].name.match(this.query))
                if (this.hdb == 'eligible' && this.pets[key].HDB != 'eligible'){
                    correct = false
                }
                if (this.vaccination == 'vaccinated' && this.pets[key].vaccinated != 'vaccinated'){
                    correct = false
                }
                if (this.health == 'none' && this.pets[key].health != 'no'){
                    correct = false
                }
                if(this.species.length != 0 && this.species.includes(this.pets[key].species) == false){
                    correct = false
                }
                if(this.query != '' && this.pets[key].name.toLowerCase().match(this.query.toLowerCase()) == null){
                    correct = false
                }
                if(this.gender.length != 0 && this.gender.includes(this.pets[key].gender) == false){
                    correct = false
                }
                if (correct == true){
                    console.log(this.pets[key])
                    this.filtered.push(this.pets[key])
                }
            }
        },

        url(email,petName){
            let url = "../adoptioninfo/newadoptionInfo.html?name=" + email + "-" + petName
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

        checklogin() {
            firebase.auth().onAuthStateChanged((user) => {
                if (user) {
                    window.location.href='../forms/adoptionForm.html'
                }
                else{
                    window.location.href='../login/newLogin.html?page=../forms/adoptionForm.html'
                }
            })
        },

        prevPage(){
            this.pageCount -= 1
        },

        nextPage(){
            this.pageCount += 1
        },
    },

    mounted() {
        console.log("--- Initialise Firebase ---")
        let adoptionArray = firebase.database().ref('adoption')
        adoptionArray.once('value').then((snapshot) => {
        if(snapshot.exists()) {
            console.log("Found")
            console.log(snapshot.val())
            this.pets = snapshot.val()
            // console.log(this.pets)
            this.filtered = this.pets
            
            // here onwards idk whats goin on 
            // for(instance of this.pets){
            //     if (instance.category == "Emergency"){
            //         this.filtered.push(instance)
            //     }
            // }

        }
        else {
            console.log("Not Found")
        }
        })
    }
    
})

const vm2 = app.mount("#content")

