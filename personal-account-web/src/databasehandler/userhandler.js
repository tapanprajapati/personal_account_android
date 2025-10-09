import API from "../utils/api";

//TODO: Handle unsuccessful API calls properly

export default class UserDBHandler {
    constructor(){
        if(UserDBHandler._instance)
        {
          return UserDBHandler._instance;
        }
        UserDBHandler._instance = this;
        this.api = new API()
        return UserDBHandler._instance;
    }

    getAllUsers(groupid="1640932481964"){
        console.log('Fetching users from group '+groupid);
        const getAPI = `${this.api.user.getAllUsers()}groupid=${groupid}`
        return new Promise((resolve, reject) => {
            fetch(getAPI)
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