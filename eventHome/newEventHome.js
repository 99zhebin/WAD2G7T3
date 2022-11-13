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

            emergencyFilter: false,

            driveFilter: false,

            fundFilter: false,

            volunteerFilter: false,

            emergency: "Emergency",

            drive: "Adoption Drive",

            fund: "Fundraiser",

            volunteer: "Volunteering",

            email: '',

            userlikes: [],

            pageCount: 1,

            pageLimit: 1,

            query: '',

            currentfilter: [],

            valid: false,

            count: 0,

        }
    },

    methods: {
        filter(criteria){
            console.log("--- Start Filter ---")
            this.valid = true;
            console.log(this.valid);
            console.log(criteria)
            this.currentfilter = []
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

        search(){
            if (this.currentfilter.length == 0){
                this.currentfilter = this.filtered
            }
            this.filtered = []
            for (instance of this.currentfilter){
                if ((this.query.length != 0 && instance.eventname.match(this.query) != null) || this.query.length == 0){
                    this.filtered.push(instance)
                } 
            }
            if (this.filtered.length == 0){
                this.filtered = 'not found'
            }
            console.log(this.filtered)
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
        },
        checkheart(hid, instance) {
            console.log(this.userlikes)
            let disheart = document.getElementById(hid.currentTarget.id);

            curclass = disheart.getAttribute('class');




            //Changing heart icon to red or not
            if(curclass.includes('liked')) {
                disheart.innerHTML='<i class="fa fa-heart-o" aria-hidden="true"></i>';
                disheart.setAttribute('class', 'heart');
                //Checking if the current liked postid is inside the user profile alr, if yes it wont add if not it adds to firebase
                var ref = database.ref('profile/' + curemail);
                ref.once("value", function(snapshot){
                    ulikes = snapshot.val().likes
                    for(key in ulikes){
                        if(ulikes[key] == instance.pid){
                            ref.child('likes').child(key).remove();
                        }
                    }

                })
            }
            else{
                disheart.innerHTML='<i class="fa fa-heart" aria-hidden="true"></i>';
                disheart.setAttribute('class', 'heart liked'); 
                //Checking if the current liked postid is inside the user profile alr, if yes it wont add if not it adds to firebase
                var ref = database.ref('profile/' + curemail);
                ref.once("value", function(snapshot){
                    ulikes = snapshot.val().likes
                    valid = true;
                    for(key in ulikes){
                        if(ulikes[key] == instance.pid){
                            valid = false;
                        }
                    }
                    if(valid == true) {
                        ref.child('likes').push(instance.pid);
                    }
                })
            }
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
        firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                this.email = user.email
                //Trying to Populate this.userlikes
                console.log(this.email)
                        // Bryans code
                database = firebase.database();
                curemail = this.email
                console.log(curemail);
                curemail = curemail.replace("@",'-');
                curemail = curemail.replaceAll(".",'-');
                var ref = database.ref('profile/' + curemail);
                var likelist = [];
                ref.once("value", function(snapshot){
                    ulikes = snapshot.val().likes
                    console.log(ulikes)
                    for(key in ulikes){
                        likelist.push(ulikes[key]);
                    }
                })
                console.log(this.userlikes);
                this.userlikes = likelist;
                console.log(this.userlikes);
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
            console.log(this.filtered)
            
            // //pagination
            // var pageSize = 1;
            // console.log(this.filtered.length)
            // var pageCount = this.filtered.length / pageSize;
            // console.log(pageCount)
            // var temp = this.filtered

            // for(var i = 0 ; i<pageCount;i++){
            //     $("#pagin").append('<li><a href="#">'+(i+1)+'</a></li> ');
            // }

            // $("#pagin li").first().find("a").addClass("current")
            // showPage = function(page) {
            //     console.log(temp);
        
            //     temp.hide();
            //     temp.each(function(n) {
            //     if (n >= pageSize * (page - 1) && n < pageSize * page)
            //         $(this).show();
            //     });        
            // }

            // showPage(1);

            // $("#pagin li a").click(function() {
            //     $("#pagin li a").removeClass("current");
            //     $(this).addClass("current");
            //     showPage(parseInt($(this).text())) 
            // });
            }
        else {
            console.log("Not Found")
        }
        });

    },
    })

const vm2 = app.mount("#container")

