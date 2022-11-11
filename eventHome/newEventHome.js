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

            email: '',

            userlikes: [],

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
            // console.log(newid);
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
        },
        checkheart(hid, instance) {
            let disheart = document.getElementById(hid.currentTarget.id);

            curclass = disheart.getAttribute('class');
            var curemail = this.email
            curemail = curemail.replace("@",'-');
            curemail = curemail.replaceAll(".",'-');
            // console.log(curemail)
            var postid = this.pid
            // console.log(instance.pid)
            // console.log(curemail);
            database = firebase.database();
            var ref = database.ref('profile/' + curemail);
            ref.once("value", function(snapshot){
                ulikes = snapshot.val().likes
                console.log(ulikes);
                valid = true;
                for(key in ulikes){
                    if(ulikes[key] == instance.pid){
                        valid = false;
                    }
                }
                if(valid == true) {
                    ref.child('likes').push(instance.pid);
                }
                // console.log(snapshot.val().email)
                // this.userlikes = snapshot.val().likes;
                // console.log(this.userlikes.push(instance.pid))
                // var data = snapshot.val();
                // for(dat in data){
                //     // console.log(dat)
                //     // console.log(data[dat].likes);
                //     // console.log(curemail)
                //     if(data[dat].email == curemail) {
                //         data[dat].likes.set(instance.pid);
                //         console.log(data[dat].likes);
                //         // data[dat].likes.push(this.pid);
                //         // console.log(instance.pid)
                //     }
                // }
            })

            // console.log(this.email);

            // console.log(instance.pid);
            
            if(curclass.includes('liked')) {
                disheart.innerHTML='<i class="fa fa-heart-o" aria-hidden="true"></i>';
                disheart.setAttribute('class', 'heart'); 
            }
            else{
                disheart.innerHTML='<i class="fa fa-heart" aria-hidden="true"></i>';
                disheart.setAttribute('class', 'heart liked'); 
            }
        },
        getData(data){
            console.log(data.value());
        }
        

    },

    mounted() {
        console.log("--- Initialise Firebase ---")
        firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                this.email = user.email
            }
            else {
                
            }
        })
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



