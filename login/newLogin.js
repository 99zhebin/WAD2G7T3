const firebaseConfig = {
    apiKey: "AIzaSyAWvVP_h1HKDOSqjp9BFZ1ttifg_UhC0eQ",
    authDomain: "is216-webapp.firebaseapp.com",
    databaseURL: "https://is216-webapp-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "is216-webapp",
    storageBucket: "is216-webapp.appspot.com",
    messagingSenderId: "113592009297",
    appId: "1:113592009297:web:fd8286678c0c18abc3ee70"
    };

    const app = Vue.createApp({
        data(){
            return{
                password: "",

                email: "",

                url: "",
                
                emailError: "",

                passwordError: "",
            }
        },
    
        methods: {
            signup(){
                this.url = "sign_up.html?page=" + this.url
                window.location.href=this.url
            },

            back(){
                window.location.href=this.url
            },

            login(){
                console.log("Start")
                this.emailError = ""
                this.passwordError = ""
                console.log(this.email + ", " + this.password)
                firebase.auth().signInWithEmailAndPassword(this.email, this.password)
                    .then((userCredential) => {
                        // Signed in 
                        const user = userCredential.user;
                        alert("Welcome " + user.email)
                        window.location.href=this.url
                    })
                    .catch((error) => {
                        const errorCode = error.code;
                        if (errorCode == "auth/invalid-email"){
                            this.emailError="Please enter a valid email address!"
                        }
                        else if (errorCode == "auth/wrong-password"){
                            this.passwordError="You have entered an invalid password or the email address does not exist!"
                        }
                    });
                },

            inputCheck(){
                if (this.email != "" && this.password != ""){
                    return false
                }
                else {
                    return true
                }
            }
        },
    
        mounted() {
            console.log("--- Initialise Firebase ---")
            firebase.initializeApp(firebaseConfig);
            this.url = window.location.search;
            this.url = this.url.replace("?page=", '');
            console.log(this.url)
        }
    })
    
    const vm2 = app.mount("#content")