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

birthday.max = new Date().toISOString().split("T")[0]

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
            li.innerHTML = '<button type="button" class="btn button my-3" data-bs-toggle="modal" data-bs-target="#logout">Logout</button>'
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
        window.location.href = "../homepage/newHomepage.html"
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
    data() {
        return {
            name: "",

            birthday: '',

            species: '',

            personality: '',

            hdbApproved: '',

            vaccinationStatus: '',

            health: '',

            email: '',

            pics: [],

        }
    },

    methods: {

        validate(){

            var today = new Date()
            var date = this.birthday
            console.log(date)
            date = date.split("-")
            var year = date[0]
            var month = date[1]
            var day = date[2]
            console.log(date)

            console.log(today.getFullYear())
            console.log(today.getMonth() + 1)
            console.log(today.getDate())

            var name = this.name
            var birthday = this.birthday
            var species = this.species
            var personality = this.personality
            var hdbApproved = this.hdbApproved
            var vaccinated = this.vaccinationStatus 
            var health = this.health
            
            if(!name || !birthday || !species || !personality || !hdbApproved || !vaccinated || !health){
                console.log(name,birthday,species,personality,hdbApproved,vaccinated,health)
                alert("Please fill up ALL fields\n" + "Do not leave any blanks")
            }
            else{
                this.post()
            }
        },


        post() {
            //creation of unique id based on date(millisecond precision)
            var uid = Date.now()
            console.log(this.email)
            this.email = this.email.replace("?email=", '');
            this.key = this.email.replace("@", '-');
            this.key = this.key.replace(".", '-');
            console.log(this.key)
            var user = firebase.database().ref().child('profile/' + this.key).child('listings')
            var postref = user.push()
            files = document.getElementById('pic').files
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
                            if (this.pics.length == files.length) {
                                postref.set({
                                    type: 'adoption',
                                    username: this.email,
                                    name: this.name,
                                    birthday: this.birthday,
                                    description: this.personality,
                                    vaccinated: this.vaccinationStatus,
                                    HDB: this.hdbApproved,
                                    health: this.health,
                                    pics: this.pics,
                                    species: this.species

                                })
                                var adoption = firebase.database().ref().child('adoption/' + this.name)
                                adoption.set({
                                    postid: uid,
                                    username: this.email,
                                    name: this.name,
                                    birthday: this.birthday,
                                    description: this.personality,
                                    vaccinated: this.vaccinationStatus,
                                    HDB: this.hdbApproved,
                                    health: this.health,
                                    pics: this.pics,
                                    species: this.species
                                })
                            }
                            if (this.pics.length == files.length) {
                                window.location.href = "../adoptionInfo/newAdoptionInfo.html?name=" + this.email + '-' + this.name
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
            }
        })
    }
})

const vm2 = app.mount("#content")