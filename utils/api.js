import LocalStorage from "../databasehandler/local-storage/Storage";

class API{
  constructor()
  {
    if(API._instance)
    {
      return API._instance;
    }

    API._instance = this;
    this.storage = new LocalStorage();
    
    this.entry = new EntryAPI(this.storage)
    this.summary = new SummaryAPI(this.storage)
    this.category = new CategoryAPI(this.storage)
    this.user = new UserAPI(this.storage);

    return API._instance;

  }

};

class UserAPI{
  constructor(_storage)
  {
    if(UserAPI._instance)
    {
      return UserAPI._instance;
    }

    UserAPI._instance = this;
    this.storage = _storage;
    return UserAPI._instance;
  }

  getAllUsers(){ return `http://${this.storage.IP}/api/user?`}
}

class SummaryAPI{
  constructor(_storage)
  {
    if(SummaryAPI._instance)
    {
      return SummaryAPI._instance;
    }

    SummaryAPI._instance = this;
    this.storage = _storage;
    return SummaryAPI._instance;
  }

  getYears(){ return `http://${this.storage.IP}/api/summary/year?`}
  getAllYears(){ return `http://${this.storage.IP}/api/summary/year/all`}
  getYearTotal(){ return `http://${this.storage.IP}/api/summary/year/total?`}
  getYearTotalAllCategories(){ return `http://${this.storage.IP}/api/summary/year/total/allcategories?`}
  getMonths(){ return `http://${this.storage.IP}/api/summary/month?`}
  getAllMonths(){ return `http://${this.storage.IP}/api/summary/month/all?`}
  getMonthTotal(){ return `http://${this.storage.IP}/api/summary/month/total?`}
  getMonthTotalAllCategories(){ return `http://${this.storage.IP}/api/summary/month/total/allcategories?`}
  getDates(){ return `http://${this.storage.IP}/api/summary/date?`}
  getDateTotal(){ return `http://${this.storage.IP}/api/summary/date/total?`}
  getTypeTotal(){ return `http://${this.storage.IP}/api/summary/total/`}
  getAllCategoriesTotal(){ return `http://${this.storage.IP}/api/summary/category/all/total/`}
  getAllCategoriesTotalMonth(){ return `http://${this.storage.IP}/api/summary/category/all/total/month/`}
  getAllCategoriesTotalYear(){ return `http://${this.storage.IP}/api/summary/category/all/total/year/`}
}

class EntryAPI{
  constructor(_storage)
  {
    if(EntryAPI._instance)
    {
      return EntryAPI._instance;
    }

    EntryAPI._instance = this;
    this.storage = _storage;
    return EntryAPI._instance;
  }

  getEntries(){return `http://${this.storage.IP}/api/entry?`}
  createEntry(){return `http://${this.storage.IP}/api/entry/create/`}
  updateEntry(){return `http://${this.storage.IP}/api/entry/update/`}
  deleteEntry(){return `http://${this.storage.IP}/api/entry/`}
  recentEntries(){return `http://${this.storage.IP}/api/entry/recent?limit=`}
  saveImage(){return `http://${this.storage.IP}/api/entry/image/save/`}
  getImage(){return `http://${this.storage.IP}/api/entry/image/get?id=`}
  checkImageExists(){return `http://${this.storage.IP}/api/entry/image/exists?id=`}
  deleteImage(){return `http://${this.storage.IP}/api/entry/image/delete?id=`}
}

class CategoryAPI{
  constructor(_storage)
  {
    if(CategoryAPI._instance)
    {
      return CategoryAPI._instance
    }

    CategoryAPI._instance = this;
    this.storage = _storage;
    return CategoryAPI._instance;
  }


  getByType() {return `http://${this.storage.IP}/api/category/1640932481964?type=`}
  create() {return `http://${this.storage.IP}/api/category/create/`}
  rename() {return `http://${this.storage.IP}/api/category/rename/`}
  delete() {return `http://${this.storage.IP}/api/category/`}
  transfer() {return `http://${this.storage.IP}/api/category/transfer/`}
}

export default API;
