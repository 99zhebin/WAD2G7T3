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
// console.log(new Date().toISOString().split("T")[0].split("-"))
month = Number(new Date().toISOString().split("T")[0].split("-")[1]);
day = Number(new Date().toISOString().split("T")[0].split("-")[2]);
year = Number(new Date().toISOString().split("T")[0].split("-")[0]);
monthswith31days = [01,03,05,07,08,10,12];
monthswith30days = [04,06,09,11];
if(monthswith31days.includes(month)){
  if(day + 1 <= 31) {
    day += 1; 
    eventDate.min = year + '-' + month + '-' + day
  }
  else if(month != 12) {
    month += 1;
    day = 01;
    eventDate.min = year + '-' + month + '-' + day
  }
  else{
    year += 1
    month = 01;
    day = 01;
    eventDate.min = year + '-' + month + '-' + day
  }
}
else if(monthswith30days.includes(month)){
  if(day+1 <= 30){
    day += 1; 
    eventDate.min = year + '-' + month + '-' + day
  }
  else{
    month += 1;
    day = 01;
    eventDate.min = year + '-' + month + '-' + day
  }
}
else {
  if(day + 1 <= 28){
    day += 1; 
    eventDate.min = year + '-' + month + '-' + day;
  }
  else {
    month += 1;
    day = 01;
    eventDate.min = year + '-' + month + '-' + day
  }
}
// eventDate.min = new Date().toISOString().split("T")[0]
console.log(eventDate.min);

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
        window.location.href="../index.html"
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

        event: '',

        profile: [],

        pics: [],

        category: '',

        eventDescription: '',

        name: '',

        eventDate: '',

        startTime: '',

        endTime: '',

        eventLocation: '',

        url: '',

        pid: ''
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
      
      if(!category || !description || !date || !startTime || !endTime || !location){
          console.log(name, category, description, date, startTime, endTime, location)
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
        var user = firebase.database().ref().child('profile/' + this.key + '/posts').orderByChild('pid').equalTo(this.pid)
        user.once('value').then((snapshot) => {
          if (snapshot.exists()){
              files = document.getElementById('pic').files
              if (files.length == 0){
                  var user = firebase.database().ref().child('profile/' + this.key + '/posts').orderByChild('pid').equalTo(this.pid)
                  user.once('value').then((snapshot) => {
                      for (key in snapshot.val()){
                          user = firebase.database().ref().child('profile/' + this.key + '/posts/' + key)
                          user.child('category').set(this.category)
                          user.child('pics').set(this.pics)
                          user.child('eventDescription').set(this.eventDescription)
                          user.child('eventDate').set(this.eventDate)
                          user.child('time').set(this.startTime + ' - ' + this.endTime)
                          user.child('location').set(this.eventLocation)
                          user.child('url').set(this.url)
                      }
                  })
                  var eventInstance = firebase.database().ref().child('events').orderByChild('pid').equalTo(this.pid)
                  eventInstance.once('value').then((snapshot) => {
                      for (key in snapshot.val()){
                        eventInstance = firebase.database().ref().child('events/' + key)
                        eventInstance.child('category').set(this.category)
                        eventInstance.child('pics').set(this.pics)
                        eventInstance.child('eventDescription').set(this.eventDescription)
                        eventInstance.child('eventDate').set(this.eventDate)
                        eventInstance.child('time').set(this.startTime + ' - ' + this.endTime)
                        eventInstance.child('location').set(this.eventLocation)
                        eventInstance.child('url').set(this.url)
                      }
                      window.location.href = "../eventInfo/newEventInfo.html?name=" + this.email + '-' + this.name
                  })
              }
              else {
                  this.pics = []
                  for (file of files) {
                      if (typeof file != 'undefined') {
                          var storage = firebase.storage().ref()
                          var thisRef = storage.child(file.name)
                          thisRef.put(file).then(function (snapshot) {
                              console.log('Image updated');
                          })
                          firebase.storage().ref(file.name).getDownloadURL()
                              .then((url) => {
                                  this.pics.push(url)
                                  if (this.pics.length == files.length){
                                    var user = firebase.database().ref().child('profile/' + this.key + '/posts').orderByChild('pid').equalTo(this.pid)
                                    user.once('value').then((snapshot) => {
                                        for (key in snapshot.val()){
                                            user = firebase.database().ref().child('profile/' + this.key + '/posts/' + key)
                                            user.child('category').set(this.category)
                                            user.child('pics').set(this.pics)
                                            user.child('eventDescription').set(this.eventDescription)
                                            user.child('eventDate').set(this.eventDate)
                                            user.child('time').set(this.startTime + ' - ' + this.endTime)
                                            user.child('location').set(this.eventLocation)
                                            user.child('url').set(this.url)
                                        }
                                    })
                                    var eventInstance = firebase.database().ref().child('events').orderByChild('pid').equalTo(this.pid)
                                    eventInstance.once('value').then((snapshot) => {
                                        for (key in snapshot.val()){
                                          eventInstance = firebase.database().ref().child('profile/' + this.key + '/posts/' + key)
                                          eventInstance.child('category').set(this.category)
                                          eventInstance.child('pics').set(this.pics)
                                          eventInstance.child('eventDescription').set(this.eventDescription)
                                          eventInstance.child('eventDate').set(this.eventDate)
                                          eventInstance.child('time').set(this.startTime + ' - ' + this.endTime)
                                          eventInstance.child('location').set(this.eventLocation)
                                          eventInstance.child('url').set(this.url)
                                        }
                                        window.location.href = "../eventInfo/newEventInfo.html?name=" + this.email + '-' + this.name
                                    })
                                  }
                              })
                          }
                      }
                  }
          }
      })
  },
},

  mounted() {
      console.log("--- Initialise Firebase ---")
      var url = window.location.search;
        this.name = url.replace("?name=", '');
        this.name = this.name.split('%20')
        this.name = this.name.join(' ')
        console.log(this.name)
      firebase.auth().onAuthStateChanged((user) => {
        if (user) {
          this.email = user.email
          console.log(this.email)
          let eventArray = firebase.database().ref('events/' + this.name)
          eventArray.once('value').then((snapshot) => {
            if (snapshot.exists()) {
              console.log('Found')
              this.event = snapshot.val()
              console.log(this.event)
              this.pics = this.event.pics
              this.eventDescription = this.event.description
              this.eventDate = this.event.eventdate
              time = this.event.time
              time = time.split(' - ')
              this.startTime = time[0]
              this.endTime = time[1]
              this.eventLocation = this.event.location
              this.url = this.event.url
              this.category = this.event.category
              this.pid = this.event.pid
            }
          })
        }})
      }
})

const vm2 = app.mount("#content")