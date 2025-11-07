import Cookies from 'js-cookie';

export default class WebStorage {
    constructor() {
        if (WebStorage._instance) {
            return WebStorage._instance;
        }

        console.log("Initializing Web Storage");

        WebStorage._instance = this;
        this.IP = "http://localhost:8081";
        this.user = "";
        this.KEYS = {
            IP: "IP",
            USER: "USER"
        };

        return WebStorage._instance;
    }

    readValuesFromStorage() {
        return new Promise((resolve, reject) => {
            try {
                const storedIP = Cookies.get(this.KEYS.IP);
                const storedUser = Cookies.get(this.KEYS.USER);
                
                if (storedIP) {
                    this.IP = storedIP;
                    console.log(`IP from Storage: ${this.IP}`);
                }
                
                if (storedUser) {
                    this.user = storedUser;
                    console.log(`User from Storage: ${this.user}`);
                }
                
                resolve(true);
            } catch (error) {
                console.error("Error reading from storage:", error);
                resolve(true);
            }
        });
    }

    setIP(value) {
        console.log(`Setting IP: ${value}`);
        Cookies.set(this.KEYS.IP, value, { expires: 365 }); // Store for 1 year
        this.IP = value;
    }

    setUser(value) {
        console.log(`Setting User: ${value}`);
        Cookies.set(this.KEYS.USER, value, { expires: 365 }); // Store for 1 year
        this.user = value;
    }
}
