const RecurringService = require("./RecurringService");
const EntryService = require("./EntryService");

function RecurringEntryCreator(){
    this.recurringService = new RecurringService();
    this.entryService = new EntryService();
}

RecurringEntryCreator.prototype.run = function run() {
    console.log("Running recurring entry creator");
    console.log("Getting recurring schedules");
    this.recurringService.getRecurrings().then(result=> {
        if(result.success) {
            result.message.filter(recurring=>this.shouldCreateEntry(recurring))
            .forEach(recurring => this.createEntry(recurring));
        } else {
            console.log(`Error getting recurring schedules`)
            console.log(result)
        }
    }).catch(error=>{
        console.log(error)
    })
}

RecurringEntryCreator.prototype.shouldCreateEntry = function shouldCreateEntry(recurring) {
    const now = new Date();
    if(recurring.start_date > now) {
        return false;
    }
    if(recurring.last_run_date==null) {
        return true;
    }
    if(recurring.next_run_date.toDateString()==now.toDateString()){
        return true;
    }
    return false;
}

RecurringEntryCreator.prototype.createEntry = function createEntry(recurring) {
    console.log(`Creating entry for recurring`)
    console.log(recurring);
    let body = {
        title:recurring.title,
        description:recurring.description,
        amount:recurring.amount,
        date:new Date().toISOString().slice(0, 10),
        categoryid:recurring.cId,
        username:recurring.username
    }

    this.entryService.createEntry(body).then(result=> {
        if(result.success) {
            this.updateRecurring(recurring)
        } else {
            console.log("Error creating entry");
            console.log(result);
        }
    })

}

RecurringEntryCreator.prototype.updateRecurring = function updateRecurring(recurring) {
    const now = new Date();
    recurring.last_run_date = new Date();
    
    switch(recurring.freq) {
        case 'week':
            now.setDate(now.getDate() +7)
       	    break;
	case 'bi-week':
            now.setDate(now.getDate() +14)
	    break;
        case 'month':
            now.setMonth(now.getMonth() +1)
	    break;
        case 'year':
            now.setFullYear(now.getFullYear() +1)
	    break;
        default:
            console.log("Nothing");
    }
    recurring.next_run_date = now;

    console.log(`Updating recurring schedule:`)
    console.log(recurring);
    this.recurringService.updateRecurringSchedule(recurring).then(result=> {
        if(result.success) {
            console.log(`Recurring schedule updated`)
        }
        else {
            console.log(result);
        }
    }).catch(error=>{
        console.log(error)
    })
}

module.exports = RecurringEntryCreator;
