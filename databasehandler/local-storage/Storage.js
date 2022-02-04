import Storage from 'react-native-storage'
import AsyncStorage from '@react-native-async-storage/async-storage'



export default class LocalStorage {
    constructor()
    {
        if(LocalStorage._instance)
        {
            return LocalStorage._instance;
        }

        console.log("Initializing Storage")

        LocalStorage._instance = this;
        this.IP = "192.168.1.10";
        this.user = "";
        this.KEYS = {
            IP:"IP",
            USER: "USER"
        }

        this.storage = new Storage({
            // maximum capacity, default 1000 key-ids
            size: 10,
          
            // Use AsyncStorage for RN apps, or window.localStorage for web apps.
            // If storageBackend is not set, data will be lost after reload.
            storageBackend: AsyncStorage, // for web: window.localStorage
          
            // expire time, default: 1 day (1000 * 3600 * 24 milliseconds).
            // can be null, which means never expire.
            defaultExpires: null,
          
            // cache data in the memory. default is true.
            enableCache: true,
          
            // if data was not found in storage or expired data was found,
            // the corresponding sync method will be invoked returning
            // the latest data.
            sync: {
              // we'll talk about the details later.
            }
          });

        return LocalStorage._instance;
    }

    async readValuesFromStorage()
    {
        this.IP = await this.storage.load({
            key: this.KEYS.IP
        })
        console.log(`IP from Storage: ${this.IP}`)

        this.user = await this.storage.load({
            key: this.KEYS.USER
        })
        console.log(`User from Storage: ${this.user}`)
    }

    setIP(value)
    {
        console.log(`Setting IP: ${value}`)
        this.storage.save({
            key: this.KEYS.IP,
            data: value
        })
        this.IP = value
    }

    setUser(value)
    {
        console.log(`Setting User: ${value}`)
        this.storage.save({
            key: this.KEYS.USER,
            data: value
        })
        this.user = value;
    }
}