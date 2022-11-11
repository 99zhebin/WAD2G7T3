
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
          let query = window.location.search
          let url = "../login/newLogin.html?page=../adoptionInfo/newAdoptionInfo.html" + query 
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
        let url = "newAdoptionInfo.html" + query
        window.location.href=url
      }).catch((error) => {
        // An error happened.
      });
}

const app = Vue.createApp({
    data(){
        return{

            // have to edit data returned
            images: [],

            email:"",

            name:"",

            address: "",

            api: "",

            locationDetails: "",

            apiLink: "",

            latitude: "",

            longitude: "",

            username: ""
        }
    },

    methods: {
        url(){
            let url = "../profile/newProfilePublic.html?email=" + this.email
            return url
        },
    },

    mounted() {
        console.log("--- Initialise Firebase ---")
        var url = window.location.search;
        console.log(url)
        url = url.replace("?name=", '');
        url = url.split("-")
        this.email = url[0]
        this.name = url[1]
        this.name = this.name.split('%20')
        this.name = this.name.join(' ')
        console.log(this.name)
        var adoptionArray = firebase.database().ref('adoption/' + this.name)

        adoptionArray.on('value',(snapshot) =>{
            const animalArray = snapshot.val()
            console.log(animalArray)
            this.animal = animalArray
            this.images = animalArray.pics
        })

        // petArray.once('value').then((snapshot) => {
        // if(snapshot.exists()) {
        //     console.log("Found")
        //     eventArray = snapshot.val()
        //     console.log(eventArray)
        //     this.event = eventArray
        //     this.address = eventArray.location
        //     this.images = eventArray.pics
        //     this.api = "https://developers.onemap.sg/commonapi/search?searchVal=" + this.address + "&returnGeom=Y&getAddrDetails=Y&pageNum=1"
        //     console.log(this.api)
        //     axios.get(this.api)
        //     .then(response => {
        //         console.log(response.data)
        //         this.latitude = response.data.results[0].LATITUDE
        //         this.longitude = response.data.results[0].LONGITUDE
        //         this.apiLink = "https://www.onemap.gov.sg/minimap/mm.html?mapStyle=Default&zoomLevel=17&latLng=" + this.latitude + "," + this.longitude
        //         document.getElementById("locationAPI").src = this.apiLink;
        //     })
        // }
        // else {
        //     console.log("Not Found")
        // }
        // })
    }
})

const vm2 = app.mount("#content")
