/* CIS 215 Final Project Assignment. Team 3: Travis, Zion, George */

var ndcs = {
    "45802-0088-01": ["Albuterol", "90", "mcg", "Puff", "By Inhalation"],
    "00143-9938-01": ["Amoxicillin", "500", "mg", "Capsule", "By Mouth"],
    "00093-2263-01": ["Amoxicillin", "875", "mg", "Tablet", "By Mouth"],
    "68180-0635-06": ["Atorvastatin", "10", "mg", "Tablet", "By Mouth"],
    "16714-0875-01": ["Atorvastatin", "20", "mg", "Tablet", "By Mouth"],
    "68180-0637-06": ["Atorvastatin", "40", "mg", "Tablet", "By Mouth"],
    "63981-0458-88": ["Cetirizine", "10", "mg", "Tablet", "By Mouth"],
    "16729-0376-01": ["Lisinopril", "5", "mg", "Tablet", "By Mouth"],
    "65862-0039-01": ["Lisinopril", "10", "mg", "Tablet", "By Mouth"],
    "68001-0335-00": ["Lisinopril", "20", "mg", "Tablet", "By Mouth"]
}

var medications = [
    ["16729-0376-01", "Lisinopril", "5", "mg", "Tablet", "By Mouth", 1, 1, 30, 9, "2020-06-10", ["08:00"], 7],
    ["63981-0458-88", "Cetirizine", "10", "mg", "Tablet", "By Mouth", 1, 1, 365, 0, "2020-03-20", ["08:00"], 14]
]

function populateMyMedications() {
    myMeds = document.getElementById("my-medications");
    myMeds.innerHTML = "";
    var medInfo = "";
    
    for (var med in medications) {
        var searchTerm = "";
        var linkTerm = ""
        var div = document.createElement("div");
        
        if (medications[med][0] === "") {
            searchTerm = medications[med][1];
            linkTerm = searchTerm + "</a>"
        }
        else {
            searchTerm = medications[med][0];
            linkTerm = searchTerm + "</a> | " + medications[med][1]
        }
        
        medInfo = '<h3><a href="https://dailymed.nlm.nih.gov/dailymed/search.cfm?labeltype=all&query=' + searchTerm + '&pagesize=20&page=1&audience=consumer" target="_blank">' + linkTerm + ' | ' + medications[med][2] + ' ' + medications[med][3] + ' | ' + medications[med][4] + ' | ' + medications[med][5] + '</h3><p>Take ' + medications[med][6] + ' ' + medications[med][4].toLowerCase() + '(s) ' + medications[med][5].toLowerCase() + ' ' + medications[med][7] + ' time(s) daily</p><p>Daily Reminder(s): ' + convertTime(medications[med][11][0]);
        
        for (var i = 1; i < medications[med][11].length; i++) {
            medInfo += " | " + convertTime(medications[med][11][i]);
        }
        
        medInfo += '</p><p>Refill Reminder (' + medications[med][9] + ' remaining): ' + medications[med][12] + ' day(s) before completion</p>' + calculateProgress(medications[med][10], medications[med][12], medications[med][8]) + '<br><hr><br>';
        
        div.innerHTML = medInfo;
        myMeds.appendChild(div);
    }
    
    var legend = document.createElement("div");
    legend.id = "progress-legend";
    legend.innerHTML = '<strong>Progress Bar Legend</strong><li class="completed">Days completed</li><li class="to-refill">Days until refill reminder</li><li class="remaining">Days between today or refill reminder (whichever is later) and completion</li>';
    myMeds.appendChild(legend);
}

function addMedication() {
    if (document.getElementById("add-new-medication").reportValidity()) {        
        if (isValidNDC()) {
            radio1 = document.getElementById("entry-type-1");
            radio2 = document.getElementById("entry-type-2");
            var medArray = [];
            var reminderArray = [];

            switch(frequency.value) {
                case "3":
                    reminderArray.unshift(document.getElementById("reminder3").value);
                case "2":
                    reminderArray.unshift(document.getElementById("reminder2").value);
                case "1":
                    reminderArray.unshift(document.getElementById("reminder1").value);
            }
            
            if (radio1.checked) {
                var ndc = document.getElementById("ndc").value;
                medArray.push(ndc);
                medArray.push(ndcs[ndc][0]);
                medArray.push(ndcs[ndc][1]);
                medArray.push(ndcs[ndc][2]);
                medArray.push(ndcs[ndc][3]);
                medArray.push(ndcs[ndc][4]);
            }
            else if (radio2.checked) {
                medArray.push("");
                medArray.push(document.getElementById("drug-name").value);
                medArray.push(document.getElementById("strength").value);
                medArray.push(document.getElementById("units").value);
                medArray.push(document.getElementById("dosage-form").value);
                medArray.push(document.getElementById("route").value);
            }

            medArray.push(document.getElementById("dose").value);
            medArray.push(document.getElementById("frequency").value);
            medArray.push(document.getElementById("duration").value);
            medArray.push(document.getElementById("refills").value);
            medArray.push(document.getElementById("start-date").value);   
            medArray.push(reminderArray);
            medArray.push(document.getElementById("refill-reminder").value);        

            medications.push(medArray);
            populateMyMedications();
        }
    }
}

function customReminders() {
    defaultReminders = document.getElementById("default-reminders");
    frequency = document.getElementById("frequency");
    reminder = document.getElementById("custom-reminders");
    reminder1 = document.getElementById("custom-reminder-1");
    reminder2 = document.getElementById("custom-reminder-2");
    reminder3 = document.getElementById("custom-reminder-3");
    
    if (defaultReminders.checked) {
        reminder.style.display = "none";
    }
    else {
        switch(frequency.value) {
            case "1":
                reminder2.style.display = "none";
                reminder3.style.display = "none";
                break;
            case "2":
                reminder2.style.display = "block";
                reminder3.style.display = "none";
                break;
            case "3":
                reminder2.style.display = "block";
                reminder3.style.display = "block";
                break;
        }
        reminder.style.display = "block";
    }
}

function isValidNDC() {
    ndc = document.getElementById("ndc");
    invalid = document.getElementById("invalid-ndc");
    var validNDC = ndc.value in ndcs;
    
    if (validNDC || ndc.value === "" || ndc.disabled === true) {
        invalid.style.display = "none";
        return true;
    }
    else {
        invalid.style.display = "block";
        return false;
    }
}

function calculateProgress(startDate, refillTime, duration) {
    var start = formatDate(startDate);
    start = start.getTime();
    var today = new Date();
    today = today.getTime();
    var end = new Date(duration * 1000 * 60 * 60 * 24);
    end = end.getTime() + start;
    var refill = new Date(refillTime * 1000 * 60 * 60 * 24);
    refill = end - refill.getTime();
    var total = (end - start) / (1000 * 60 * 60 * 24);
    var daysStartToToday = (today - start) / (1000 * 60 * 60 * 24);
    var daysTodayToRefill = (refill - today) / (1000 * 60 * 60 * 24);
    var daysRefillToEnd = (end - refill) / (1000 * 60 * 60 * 24);
    var daysTodayToEnd = (end - today) / (1000 * 60 * 60 * 24);
    
    var divHTML = '<div id="progress-bar"><div class="progress completed" style="width:' + (daysStartToToday / total * 100) + '%">' + Math.round(daysStartToToday) + '</div>'
    
    if (today < refill) {
        divHTML += '<div class="progress to-refill" style="width:' + (daysTodayToRefill / total * 100) + '%">' + Math.round(daysTodayToRefill) + '</div><div class="progress remaining" style="width:' + (daysRefillToEnd / total * 100) + '%">' + Math.round(daysRefillToEnd) + '</div></div>'
    }
    else {
        divHTML += '<div class="progress remaining" style="width:' + (daysTodayToEnd / total * 100) + '%">' + Math.round(daysTodayToEnd) + '</div></div>'
    }
    
    return divHTML;
}

function formatDate(textDate) {
    var year = parseInt(textDate.substr(0,4));
    var month = parseInt(textDate.substr(5,7));
    var day = parseInt(textDate.substr(8));
    var date = new Date(year, month - 1, day);
    return date;
}

function convertTime(textTime) {
    var hours = parseInt(textTime.substr(0, 2));
    var minutes = textTime.substr(2);
    var ampm = "AM";
    
    if (hours === 0) {
        hours = 12;
    }
    else if (hours === 12) {
        ampm = "PM";
    }        
    else if (hours > 12) {
        hours -= 12;
        ampm = "PM";
    }
    
    return (hours + minutes + " " + ampm);
}

function getTodaysDate() {
    var today = new Date();
    return today.toISOString().substr(0, 10);
}

function bodyLoaded() {
    radio1 = document.getElementById("entry-type-1");
    radio2 = document.getElementById("entry-type-2");
    ndc = document.getElementById("ndc");
    frequency = document.getElementById("frequency");
    checkbox = document.getElementById("default-reminders");
    submitButton = document.getElementById("submit");
    resetButton = document.getElementById("reset");
    
    document.getElementById("start-date").value = getTodaysDate();
    populateMyMedications();
    
    radio1.addEventListener("click", function(){
        document.getElementById("ndc").disabled = false;
        document.getElementById("drug-name").disabled = true;
        document.getElementById("strength").disabled = true;
        document.getElementById("units").disabled = true;
        document.getElementById("dosage-form").disabled = true;
        document.getElementById("route").disabled = true;
        !isValidNDC();
    })
    
    radio2.addEventListener("click", function(){
        document.getElementById("ndc").disabled = true;
        document.getElementById("drug-name").disabled = false;
        document.getElementById("strength").disabled = false;
        document.getElementById("units").disabled = false;
        document.getElementById("dosage-form").disabled = false;
        document.getElementById("route").disabled = false;
        document.getElementById("invalid-ndc").style.display = "none";
    })
    
    ndc.addEventListener("keyup", isValidNDC);
    
    frequency.addEventListener("change", customReminders);
    
    checkbox.addEventListener("click", customReminders);
    
    submitButton.addEventListener("click", addMedication);
    
    resetButton.addEventListener("click", function() {
        document.getElementById("start-date").value = getTodaysDate();
        checkbox.checked = true;
        document.getElementById("custom-reminders").style.display = "none";
    })
}