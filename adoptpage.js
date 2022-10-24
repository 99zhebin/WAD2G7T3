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

firebase.initializeApp(firebaseConfig);

function loadDisplay() {
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
    let url = "Login.html?page=adoptpage.html" + query
    console.log(url)
    document.getElementById("login").innerText = "Log In"
    document.getElementById("login").setAttribute("href", url)
  }
});
}

function logout() {
  firebase.auth().signOut().then(() => {
      // Sign-out successful.
      alert("Signed out")
      let query = window.location.search
      console.log(query)
      let url = "adoptpage.html" + query
      window.location.href=url
      }).catch((error) => {
      // An error happened.
      });
}

const app = Vue.createApp({
  data(){
      return{
          email: "",

          petName: "",

          pet: [],

          vaccination: false,

          hdb: false,
          
          images: [],
      }
  },

  methods: {

      url(email,petName){
          let url = "adoptpage.html?name=" + email + "-" + petName
          return url
      },

  },

  mounted() {
      console.log("--- Initialise Firebase ---")
      console.log("Hello")
      var url = window.location.search;
      url = url.replace("?name=", '');
      url = url.split("-")
      this.email = url[0]
      this.petName = url[1]
      let petArray = firebase.database().ref('adoption').orderByChild("timestamp")
      petArray.once('value').then((snapshot) => {
      if(snapshot.exists()) {
          console.log("Found")
          console.log(snapshot.val())
          pets = snapshot.val()
          for (pet of pets){
            if(pet.email == this.email && pet.animalname == this.petName){
              this.pet = pet
              if (pet.vaccination == "true"){
                this.vaccination = "checked"
              }
              else {
                this.vaccination = false
              }
              if (pet.hdb == "true"){
                this.hdb = "checked"
              }
              else {
                this.hdb = false
              }
              this.images = pet.image
            }
          }
      }
      else {
          console.log("Not Found")
      }
      })
  }
})

const vm2 = app.mount("#content")
