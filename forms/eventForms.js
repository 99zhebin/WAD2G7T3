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

eventDate.min = new Date().toISOString().split("T")[0]

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
        window.location.href="../homepage/newHomepage.html"
        }).catch((error) => {
        // An error happened.
        });
}

function preview() { 
    console.log(document.getElementById('pic').files[0])
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
        img.setAttribute("id", 'uploadPic');
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

        username: '',

        profile: [],

        pics: [],

        category: '',

        eventDescription: '',

        eventName: '',

        eventDate: '',

        startTime: '',

        endTime: '',

        eventLocation: '',

        url: '',

        email: ''
      }
  },

  methods: {

    validate(){

      var name = this.eventName
      var category = this.category
      var description = this.eventDescription
      var date = this.eventDate
      var startTime = this.startTime
      var endTime = this.endTime 
      var location = this.eventLocation
      files = document.getElementById('pic').files
      
      if(!name || !category || !description || !date || !startTime || !endTime || !location || files.length == 0){
          console.log(name, category, description, date, startTime, endTime, location, files)
          alert("Please fill up ALL fields\n" + "Do not leave any blanks")
      }
      else{
          this.post()
      }
  },

    post(){
        console.log(this.email)
        var uid = Date.now()
        this.email = this.email.replace("?email=", '');
        this.key = this.email.replace("@", '-');
        this.key = this.key.replace(".", '-');
        console.log(this.key)
        var user = firebase.database().ref().child('profile/' + this.key).child('posts')
        var postref = user.push()
        files = document.getElementById('pic').files
          for (file of files){
            if(typeof file != 'undefined'){
              var storage = firebase.storage().ref()
              var thisRef = storage.child(file.name)
              thisRef.put(file).then(function(snapshot) {
                console.log('Image updated');
            })
              firebase.storage().ref(file.name).getDownloadURL()
              .then((url) => {
                this.pics.push(url)
                if (this.pics.length == files.length){
                  postref.set({
                      type : 'event',
                      username: this.email,
                      eventname: this.eventName,
                      eventdate: this.eventDate,
                      category: this.category,
                      time: this.startTime + ' - ' + this.endTime,
                      location: this.eventLocation,
                      url: this.url,
                      pics: this.pics,
                      description: this.eventDescription
                })
                    var event = firebase.database().ref().child('events/' + this.eventName)
                    event.set({
                      pid: uid,
                    username: this.email,
                      eventname: this.eventName,
                    eventdate: this.eventDate,
                    category: this.category,
                    time: this.startTime + ' - ' + this.endTime,
                    location: this.eventLocation,
                    url: this.url,
                    pics: this.pics,
                    description: this.eventDescription
              })
                }
                if(this.pics.length == files.length){
                  window.location.href= "../eventInfo/newEventInfo.html?name=" + this.email + '-' + this.eventName
                }
              })
            }
          }
  },
},

  mounted() {
      console.log("--- Initialise Firebase ---")
      firebase.auth().onAuthStateChanged((user) => {
        if (user) {
          this.email = user.email
          console.log(this.email)
        }})
      }
})

const vm2 = app.mount("#content")