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
    window.location.href = "../homepage/newHomepage.html"
  }).catch((error) => {
    // An error happened.
  });
}

const app = Vue.createApp({
  data() {
    return {
      email: "",

      key: '',

      profile: [],

      pic: '',

      name: '',

      username: '',

      region: '',

      bio: '',

      pets: '',

      posts: '',

      likes: '',

      listings: '',

      likeslist: [],

      events: [],

      eventslist: [],
    }
  },

  methods: {
    url() {
      var url = "newProfileEdit.html?email=" + this.email
      return url
    },

    neweventurl() {
      var url = "forms/eventForms.html"
      return url
    },

    eventurl(eventname) {
      var eventurl = '../forms/eventEditForms.html?name=' + eventname
      return eventurl
    },

    peturl(petname) {
      var peturl = '../forms/adoptionEditForm.html?name=' + petname
      return peturl
    }
  },

  mounted() {
    console.log("--- Initialise Firebase ---")
    this.email = window.location.search;
    console.log(this.email)
    this.email = this.email.replace("?email=", '');
    this.key = this.email.replace("@", '-');
    this.key = this.key.replace(".", '-');
    console.log(this.key)
    var user = firebase.database().ref('profile/' + this.key);
    user.once('value').then((snapshot) => {
      if (snapshot.exists()) {
        this.profile = snapshot.val()
        this.pic = this.profile.pic
        this.email = this.profile.email
        this.name = this.profile.name
        this.username = this.profile.username
        this.region = this.profile.region
        this.bio = this.profile.bio
        this.pets = this.profile.pets
        this.likes = this.profile.likes
      }
      var posts = user.child('posts')
      posts.once('value').then((snapshot) => {
        if (snapshot.exists()) {
          this.posts = snapshot.val()
        }
      })
      var listings = user.child('listings')
      listings.once('value').then((snapshot) => {
        if (snapshot.exists()) {
          this.listings = snapshot.val()
        }
      })
      var likes = user.child('likes')
      likes.once('value').then((snapshot) => {
        if (snapshot.exists()) {
          this.likes = snapshot.val()
          console.log(this.likes)
          let events = firebase.database().ref('events').orderByChild("pid")
            events.once('value').then((snapshot) => {
              if (snapshot.exists()) {
                this.events = snapshot.val()
                console.log(this.events)
                for (key in this.events){
                  for (like in this.likes){
                    if (parseInt(this.likes[like]) == parseInt(this.events[key]['pid'])){
                      this.likeslist.push(this.events[key])
                    }  
                  }         
                }
              }
            })
        }
      })
    });
  }
})

const vm2 = app.mount("#content")