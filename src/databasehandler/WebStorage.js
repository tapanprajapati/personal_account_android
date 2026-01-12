export default class WebStorage {
    constructor() {
        if (WebStorage._instance) {
            return WebStorage._instance;
        }

        console.log("Initializing Web Storage");
        
        WebStorage._instance = this;
        this.IP = "http://10.0.0.172:8081";
        this.user = "";
        this.KEYS = {
            USER: "USER",
            TOKEN: "TOKEN"
        };
        this.jwtToken = null;
        this.readFromStorage()
        return WebStorage._instance;
    }

    readFromStorage() {
        console.log("Reading from storage")
        this.user = localStorage.getItem(this.KEYS.USER)
        this.jwtToken = localStorage.getItem(this.KEYS.TOKEN)
    }

    setUser(user) {
        this.user = user;
        localStorage.setItem(this.KEYS.USER, user)
    }

    setToken(token) {
        this.jwtToken = token;
        localStorage.setItem(this.KEYS.TOKEN, token)
    }
}
