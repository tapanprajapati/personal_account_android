import api from "../utils/api";

export default class UserDBHandler {
    constructor(){}

    getAllUsers(groupid="1640932481964"){
        console.log('Fetching users from group '+groupid);
        const getAPI = `${api.user.getAllUsers}groupid=${groupid}`
        return new Promise((resolve, reject) => {
            fetch(getAPI)
            .then((response)=>response.json())
            .then(json=>{
                resolve(json.message)
            })
            .catch(error=>{
                reject(error)
            })
        });
    }
}