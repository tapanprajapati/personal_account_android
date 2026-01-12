import API from "../utils/api";

//TODO: Handle unsuccessful API calls properly

export default class UserDBHandler {
    constructor(){
        if(UserDBHandler._instance)
        {
          return UserDBHandler._instance;
        }
        console.log('Creating UserDBHandler instance');
        UserDBHandler._instance = this;
        this.api = new API()
        return UserDBHandler._instance;
    }

    getAllUsers(groupid="1640932481964"){
        console.log('Fetching users from group '+groupid);
        const getAPI = `${this.api.user.getAllUsers()}groupid=${groupid}`
        return new Promise((resolve, reject) => {
            fetch(getAPI, {
                headers: {
                    'ngrok-skip-browser-warning': 'true'
                }
            })
            .then((response)=>response.json())
            .then(json=>{
                resolve(json)
            })
            .catch(error=>{
                reject(error)
            })
        });
    }

    login(user, pass) {
        const loginAPI = this.api.user.login()
        return new Promise((resolve, reject) => {
            fetch(loginAPI, {
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'ngrok-skip-browser-warning': 'true'
                },
                method: 'POST',
                body: JSON.stringify({
                    username: user,
                    password: pass
                })
            })
            .then((response)=>response.json())
            .then(json=>{
                resolve(json)
            })
            .catch(error=>{
                reject(error)
            })
        });
    }
}