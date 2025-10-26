import WebStorage from "../databasehandler/WebStorage";

class API {
    constructor() {
        if (API._instance) {
            return API._instance;
        }

        API._instance = this;
        this.storage = new WebStorage();
        
        this.entry = new EntryAPI(this.storage);
        this.summary = new SummaryAPI(this.storage);
        this.category = new CategoryAPI(this.storage);
        this.user = new UserAPI(this.storage);

        return API._instance;
    }
}

class UserAPI {
    constructor(_storage) {
        if (UserAPI._instance) {
            return UserAPI._instance;
        }

        UserAPI._instance = this;
        this.storage = _storage;
        return UserAPI._instance;
    }

    getAllUsers() { 
        return `${this.storage.IP}/api/user?`;
    }
}

class SummaryAPI {
    constructor(_storage) {
        if (SummaryAPI._instance) {
            return SummaryAPI._instance;
        }

        SummaryAPI._instance = this;
        this.storage = _storage;
        return SummaryAPI._instance;
    }

    getYears() { return `${this.storage.IP}/api/summary/year?`; }
    getAllYears() { return `${this.storage.IP}/api/summary/year/all`; }
    getYearTotal() { return `${this.storage.IP}/api/summary/year/total?`; }
    getYearTotalAllCategories() { return `${this.storage.IP}/api/summary/year/total/allcategories?`; }
    getMonths() { return `${this.storage.IP}/api/summary/month?`; }
    getAllMonths() { return `${this.storage.IP}/api/summary/month/all?`; }
    getMonthTotal() { return `${this.storage.IP}/api/summary/month/total?`; }
    getMonthTotalAllCategories() { return `${this.storage.IP}/api/summary/month/total/allcategories?`; }
    getDates() { return `${this.storage.IP}/api/summary/date?`; }
    getDateTotal() { return `${this.storage.IP}/api/summary/date/total?`; }
    getTypeTotal() { return `${this.storage.IP}/api/summary/total/`; }
    getAllCategoriesTotal() { return `${this.storage.IP}/api/summary/category/all/total/`; }
    getAllCategoriesTotalMonth() { return `${this.storage.IP}/api/summary/category/all/total/month/`; }
    getAllCategoriesTotalYear() { return `${this.storage.IP}/api/summary/category/all/total/year/`; }
    getDifferenceData() {return `${this.storage.IP}/api/summary/differenceData?`;}
}

class EntryAPI {
    constructor(_storage) {
        if (EntryAPI._instance) {
            return EntryAPI._instance;
        }

        EntryAPI._instance = this;
        this.storage = _storage;
        return EntryAPI._instance;
    }

    getEntries() { return `${this.storage.IP}/api/entry?`; }
    createEntry() { return `${this.storage.IP}/api/entry/create/`; }
    updateEntry() { return `${this.storage.IP}/api/entry/update/`; }
    deleteEntry() { return `${this.storage.IP}/api/entry/`; }
    recentEntries() { return `${this.storage.IP}/api/entry/recent?limit=`; }
    saveImage() { return `${this.storage.IP}/api/entry/image/save/`; }
    getImage() { return `${this.storage.IP}/api/entry/image/get?id=`; }
    checkImageExists() { return `${this.storage.IP}/api/entry/image/exists?id=`; }
    deleteImage() { return `${this.storage.IP}/api/entry/image/delete?id=`; }
}

class CategoryAPI {
    constructor(_storage) {
        if (CategoryAPI._instance) {
            return CategoryAPI._instance;
        }

        CategoryAPI._instance = this;
        this.storage = _storage;
        return CategoryAPI._instance;
    }

    getByType() { return `${this.storage.IP}/api/category/1640932481964?type=`; }
    create() { return `${this.storage.IP}/api/category/create/`; }
    update() { return `${this.storage.IP}/api/category/update/`; }
    delete() { return `${this.storage.IP}/api/category/`; }
    transfer() { return `${this.storage.IP}/api/category/transfer/`; }
}

export default API;
