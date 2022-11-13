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
        window.location.href = "../index.html"
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

            pet: '',

            name: "",

            birthday: '',

            species: '',

            personality: '',

            hdbApproved: '',

            vaccinationStatus: '',

            health: '',

            email: '',

            pics: [],

            description: "",

            uid: '',

            illness: '',

            oldname: '',

            postid: '',

            url: '/profile/newProfile.html?email=',

            gender: '',

        }
    },

    methods: {

        validate(){

            var name = this.name
            var birthday = this.birthday
            var species = this.species
            var personality = this.personality
            var hdbApproved = this.hdbApproved
            var vaccinated = this.vaccinationStatus 
            var health = this.health
            var description = this.description
            
            if(!name || !birthday || !species || !personality || !hdbApproved || !vaccinated || !health || !description){
                console.log(name,birthday,species,personality,hdbApproved,vaccinated,health)
                alert("Please fill up ALL fields\n" + "Do not leave any blanks")
            }
            else{
                if(description.length > 250){
                    alert("You have overshot the character limit!\nPlease shorten your message!")
                }
                else{
                    this.post()
                }
            }
        },


        post() {
            console.log(this.email)
            this.email = this.email.replace("?email=", '');
            this.key = this.email.replace("@", '-');
            this.key = this.key.replace(".", '-');
            console.log(this.uid)
            var user = firebase.database().ref().child('profile/' + this.key + '/listings').orderByChild('postid').equalTo(this.uid)
            user.once('value').then((snapshot) => {
                if (snapshot.exists()){
                    files = document.getElementById('pic').files
                    if (files.length == 0){
                        var user = firebase.database().ref().child('profile/' + this.key + '/listings').orderByChild('postid').equalTo(this.uid)
                        user.once('value').then((snapshot) => {
                            for (key in snapshot.val()){
                                user = firebase.database().ref().child('profile/' + this.key + '/listings/' + key)
                                user.child('name').set(this.name)
                                user.child('birthday').set(this.birthday)
                                user.child('personality').set(this.personality)
                                user.child('vaccinated').set(this.vaccinationStatus)
                                user.child('HDB').set(this.hdbApproved)
                                user.child('health').set(this.health)
                                user.child('pics').set(this.pics)
                                user.child('species').set(this.species)
                                user.child('illness').set(this.illness)
                                user.child('description').set(this.description)
                                user.child('gender').set(this.gender)
                            }
                        })
                        var adoption = firebase.database().ref().child('adoption').orderByChild('postid').equalTo(this.uid)
                        adoption.once('value').then((snapshot) => {
                            for (key in snapshot.val()){
                                adoption = firebase.database().ref().child('adoption/' + key)
                                adoption.child('name').set(this.name)
                                adoption.child('birthday').set(this.birthday)
                                adoption.child('personality').set(this.personality)
                                adoption.child('vaccinated').set(this.vaccinationStatus)
                                adoption.child('HDB').set(this.hdbApproved)
                                adoption.child('health').set(this.health)
                                adoption.child('pics').set(this.pics)
                                adoption.child('species').set(this.species)
                                adoption.child('illness').set(this.illness)
                                adoption.child('description').set(this.description)
                                user.child('gender').set(this.gender)
                            }
                            window.location.href = "../adoptionInfo/newAdoptionInfo.html?name=" + this.email + '-' + this.name
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
                                            var user = firebase.database().ref().child('profile/' + this.key + '/listings').orderByChild('postid').equalTo(this.uid)
                                            user.once('value').then((snapshot) => {
                                                for (key in snapshot.val()){
                                                    user = firebase.database().ref().child('profile/' + this.key + '/listings/' + key)
                                                    user.child('name').set(this.name)
                                                    user.child('birthday').set(this.birthday)
                                                    user.child('personality').set(this.personality)
                                                    user.child('vaccinated').set(this.vaccinationStatus)
                                                    user.child('HDB').set(this.hdbApproved)
                                                    user.child('health').set(this.health)
                                                    user.child('pics').set(this.pics)
                                                    user.child('species').set(this.species)
                                                    user.child('illness').set(this.illness)
                                                    user.child('description').set(this.description)
                                                    user.child('gender').set(this.gender)
                                                }
                                            })
                                            var adoption = firebase.database().ref().child('adoption').orderByChild('postid').equalTo(this.uid)
                                            adoption.once('value').then((snapshot) => {
                                                for (key in snapshot.val()){
                                                    adoption = firebase.database().ref().child('adoption/' + key)
                                                    adoption.child('name').set(this.name)
                                                    adoption.child('birthday').set(this.birthday)
                                                    adoption.child('personality').set(this.personality)
                                                    adoption.child('vaccinated').set(this.vaccinationStatus)
                                                    adoption.child('HDB').set(this.hdbApproved)
                                                    adoption.child('health').set(this.health)
                                                    adoption.child('pics').set(this.pics)
                                                    adoption.child('species').set(this.species)
                                                    adoption.child('illness').set(this.illness)
                                                    adoption.child('description').set(this.description)
                                                    user.child('gender').set(this.gender)
                                                }
                                                window.location.href = "../adoptionInfo/newAdoptionInfo.html?name=" + this.email + '-' + this.name
                                            })
                                        }
                                    })
                                }
                            }
                        }
                }
            })
        },
        deletepost() {
            this.email = this.email.replace("?email=", '');
            this.key = this.email.replace("@", '-');
            this.key = this.key.replace(".", '-');
            var adoptionlist = firebase.database().ref().child('profile/' + this.key)
            var thepostid = this.postid
            adoptionlist.once("value", function(snapshot){
                adoptlist = snapshot.val().listings

                for(key in adoptlist){
                    console.log(adoptlist[key].postid)
                    if(adoptlist[key].postid == thepostid){
                        adoptionlist.child('listings').child(key).remove();
                        // console.log('inside')
                    }
                }
            })
            var petname = this.name
            var adoptionlist2 = firebase.database().ref().child('adoption/');
            adoptionlist2.once("value", function(snapshot){
                alist2 = snapshot.val()
                for(item in alist2) {
                    console.log(alist2[item].postid);
                    if(alist2[item].postid == thepostid){
                        adoptionlist2.child(item).remove();
                    }
                }
            })
            this.url = this.url + this.email;
            window.location.href=this.url
            
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
                let petArray = firebase.database().ref('adoption/' + this.name)
                petArray.once('value').then((snapshot) => {
                    if(snapshot.exists()) {
                        console.log("Found")
                        this.pet = snapshot.val()
                        this.birthday = this.pet.birthday
                        this.species = this.pet.species
                        this.personality = this.pet.personality
                        this.hdbApproved = this.pet.HDB
                        this.vaccinationStatus = this.pet.vaccinated
                        this.health = this.pet.health
                        this.description = this.pet.description
                        this.pics = this.pet.pics
                        this.uid = this.pet.postid
                        this.illness = this.pet.illness
                        this.oldname = this.name
                        this.postid = this.pet.postid;
                        this.gender = this.pet.gender
                    }
                    else {
                        console.log("Not Found")
                    }
                    })
            }
        })
    }
})

const vm2 = app.mount("#content")