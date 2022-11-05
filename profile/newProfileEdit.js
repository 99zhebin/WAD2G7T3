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

function preview() { 
  fileInput = document.getElementById('pic')
  imageContainer = document.getElementById('result')
  for (i of fileInput.files) {
    let reader = new FileReader();
    let figure = document.createElement("figure");
    let figCap = document.createElement("figcaption");
    figCap.innerText = i.name;
    figure.appendChild(figCap);
    reader.onload = () => {
      let img = document.createElement("img");
      img.setAttribute("src", reader.result);
      figure.insertBefore(img, figCap);
    };
    imageContainer.appendChild(figure);
    reader.readAsDataURL(i);
  }
};

const app = Vue.createApp({
  data(){
      return{
        email: "",

        key: '',

        profile: [],

        name: '',

        username: '',

        region: '',

        bio: '',

        pets: '',

        posts: '',

        likes: '',

        image: ''
      }
  },

  methods: {
    update() {
        var user = firebase.database().ref('profile/' + this.key)
        user.child('name').set(this.name)
        user.child('username').set(this.username)
        user.child('region').set(this.region)
        user.child('bio').set(this.bio)
        user.child('pets').set(this.pets)
        window.location.href="newProfile.html?email=" + this.email
    },

    loadFile(){
      
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
      var user = firebase.database().ref('profile/' + this.key);
      user.once('value').then((snapshot) => {
        if(snapshot.exists()) {
          this.profile = snapshot.val()
          this.email = this.profile.email
          this.name = this.profile.name
          this.username = this.profile.username
          this.region = this.profile.region
          this.bio = this.profile.bio
          this.pets = this.profile.pets
          this.posts = this.profile.posts
          this.likes = this.profile.likes
          this.image = this.profile.image
        }
        else {
          firebase.database().ref('profile/' + this.key).set({
            pic: '',
            name: '',
            username: '',
            email: this.email,
            region: '',
            bio: '',
            pets: '',
            posts: '',
            likes: '',
            image: ''
          })
            var user = firebase.database().ref('profile/' + this.key);
            user.once('value').then((snapshot) => {
                if(snapshot.exists()) {
                this.profile = snapshot.val()
                this.email = this.profile.email
                this.name = this.profile.name
                this.username = this.profile.username
                this.region = this.profile.region
                this.bio = this.profile.bio
                this.pets = this.profile.pets
                this.posts = this.profile.posts
                this.likes = this.profile.likes
                this.image = this.profile.image
            }
        })
        }
      });
      }
})

const vm2 = app.mount("#content")