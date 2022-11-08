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
        window.location.href="newEventHome.html"
      }).catch((error) => {
        // An error happened.
      });
}

const app = Vue.createApp({
    data(){
        return{
            events: [],

            filtered: [],

            emergencyFilter: true,

            driveFilter: false,

            fundFilter: false,

            volunteerFilter: false,

            emergency: "Emergency",

            drive: "Adoption Drive",

            fund: "Fundraiser",

            volunteer: "Volunteering",

            hid: [],

            count: 0,
        }
    },

    methods: {
        filter(criteria){
            console.log("--- Start Filter ---")
            console.log(criteria)
            this.filtered = []
            for (key in this.events){
                if (this.events[key].category == criteria){
                    this.filtered.push(this.events[key])
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

        url(email,eventName){
            let url = "../eventInfo/newEventInfo.html?name=" + email + "-" + eventName
            return url
        },

        addcounter() {
            newid = 'heart'+ this.count;
            this.count += 1;
            console.log(newid);
            return newid;
        },

        checklogin() {
            firebase.auth().onAuthStateChanged((user) => {
                if (user) {
                    window.location.href='../forms/eventForms.html'
                }
                else{
                    window.location.href='../login/newLogin.html?page=../forms/eventForms.html'
                }
            })
        }
        

    },

    mounted() {
        console.log("--- Initialise Firebase ---")
        let eventArray = firebase.database().ref('events').orderByChild("timestamp")
        eventArray.once('value').then((snapshot) => {
        if(snapshot.exists()) {
            console.log("Found")
            console.log(snapshot.val())
            this.events = snapshot.val()
            for(key in this.events){
                if (this.events[key].category == "Emergency"){
                    this.filtered.push(this.events[key])
                }
            }
            if (this.filtered.length == 0){
                this.filtered = "not found"
            }
        }
        else {
            console.log("Not Found")
        }
        });

        Window.addEventListener('load', () => {
            // run after everything is in-place
            let hearts = document.getElementsByClassName("heart");
            for(heart of hearts) {
                // let hid = `hid${count}`;
                console.log(heart);
                let hid = heart.getAttribute('id'); 
                // console.log(heart.getAttribute('id'));
                $(document).ready(function(){
                    $(`#${hid}`).click(function(){
                        if($(`#${hid}`).hasClass("liked")){
                        $(`#${hid}`).html('<i class="fa fa-heart-o" aria-hidden="true"></i>');
                        $(`#${hid}`).removeClass("liked");
                        }else{
                        $(`#${hid}`).html('<i class="fa fa-heart" aria-hidden="true"></i>');
                        $(`#${hid}`).addClass("liked");
                        }
                    });
                });
                
            }
       })


        // console.log(document.readyState);
        //Setting specific hearts for each post
        
        // for(heart of hearts){
        //     heart.setAttribute('id',`heart${count}`);
        //     count += 1;
        // }

    },
    // updated() {
    //     if (document.readyState == "complete") {
    //         console.log('Page completed with image and files!')
    //         // fetch to next page or some code
    //     }
    // }
})

const vm2 = app.mount("#container")



