function createEmployeeRecord(employeeInfo) {
    return {
        firstName: employeeInfo[0],
        familyName: employeeInfo[1],
        title: employeeInfo[2],
        payPerHour: employeeInfo[3],
        timeInEvents: [],
        timeOutEvents: []
    };
}
function createEmployeeRecords(employeeData) {
    return employeeData.map(createEmployeeRecord);
}
function createTimeInEvent(employeeRecord, timeStamp) {
    // Check if timeStamp is undefined
    if (!timeStamp) {
        console.error("Invalid timeStamp. Please provide a valid timeStamp.");
        return employeeRecord;
    }
    // Check if timeStamp has the expected format 'YYYY-MM-DD HHMM'
    const timeStampRegex = /^\d{4}-\d{2}-\d{2} \d{4}$/;
    if (!timeStampRegex.test(timeStamp)) {
        console.error("Invalid timeStamp format. Please provide timeStamp in 'YYYY-MM-DD HHMM' format.");
        return employeeRecord;
    }
    // Split timeStamp into date and hour
    const [date, hour] = timeStamp.split(' ');
    employeeRecord.timeInEvents.push({
        type: "TimeIn",
        hour: parseInt(hour),
        date: date
    });
    return employeeRecord;
}

function createTimeOutEvent(employeeRecord, timeStamp) {
    if (!timeStamp) return employeeRecord; // Check if timeStamp is undefined
    const [date, hour] = timeStamp.split(' ');
    employeeRecord.timeOutEvents.push({
        type: "TimeOut",
        hour: parseInt(hour),
        date: date
    });
    return employeeRecord;
}
// Function to calculate hours worked on a specific date
function hoursWorkedOnDate(employeeRecord, date) {
    const timeIn = employeeRecord.timeInEvents.find(event => event.date === date);
    const timeOut = employeeRecord.timeOutEvents.find(event => event.date === date);
    return (timeOut.hour - timeIn.hour) / 100;
}
function wagesEarnedOnDate(employeeRecord, date) {
    const hoursWorked = hoursWorkedOnDate(employeeRecord, date);
    return hoursWorked * employeeRecord.payPerHour;
}
// Function to find an employee by first name
function findEmployeeByFirstName(srcArray, firstName) {
    return srcArray.find(employee => employee.firstName === firstName);
}
// Function to calculate payroll for all employees
function calculatePayroll(employeeRecords) {
    return employeeRecords.reduce((totalPayroll, employee) => totalPayroll + allWagesFor(employee), 0);
}
const allWagesFor = function () {
    const eligibleDates = this.timeInEvents.map(function (e) {
        return e.date
    })
    const payable = eligibleDates.reduce(function (memo, d) {
        return memo + wagesEarnedOnDate.call(this, d)
    }.bind(this), 0) // <== Hm, why did we need to add bind() there? We'll discuss soon!
    return payable
}