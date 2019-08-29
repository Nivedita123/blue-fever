import clock from "clock";
import document from "document";
import { preferences } from "user-settings";
import * as util from "../common/utils";
import { distUnit, themes, tempUnits, months, days, blueTheme } from "../common/constants"
import { HeartRateSensor } from "heart-rate";
import { today } from "user-activity";
import { BodyPresenceSensor } from "body-presence";

// configurable items
var currentTheme = null;
var currentTempUnit = null;
var currentDistUnit = null;

// setting defaults
var currentTheme = currentTheme == null ? themes[0] : currentTheme;
var currentTempUnit = currentTempUnit == null ? tempUnits[0] : currentTempUnit;
var currentDistUnit = currentDistUnit == null ? distUnit[0] : currentDistUnit;

// dynamic ui elements
const time = document.getElementById('clock-val');
const date = document.getElementById('date-val');
const heartRate = document.getElementById('hr-val');
const steps = document.getElementById('steps-val');
const floors = document.getElementById('floors-val');
const distance = document.getElementById('distance-val');
const distanceUnit = document.getElementById('distance-unit');
const cals = document.getElementById('calories-val');
const active = document.getElementById('active-val');

// setting theme
const bg1 = document.getElementById('bg1');
const bg2 = document.getElementById('bg2');
const bg3 = document.getElementById('bg3');
const bg4 = document.getElementById('bg4');

if (currentTheme === themes[0]) {
    bg1.style.fill = blueTheme[0];
    bg2.style.fill = blueTheme[1];
    bg3.style.fill = blueTheme[2];
    bg4.style.fill = blueTheme[3];
}

// Update the clock every minute
clock.granularity = "minutes";

// Display Time
clock.ontick = (evt) => {
    let today = evt.date;
    let hours = today.getHours();
    if (preferences.clockDisplay === "12h") {
        // 12h format
        hours = hours % 12 || 12;
    } else {
        // 24h format
        hours = util.zeroPad(hours);
    }
    let mins = util.zeroPad(today.getMinutes());
    time.text = `${hours}:${mins}`;
}

// Display heart rate
if (HeartRateSensor) {
    const hrm = new HeartRateSensor({ frequency: 1 });
    if (!BodyPresenceSensor) {
        heartRate.text = '--';
    }
    hrm.addEventListener("reading", () => {
        heartRate.text = hrm.heartRate ? hrm.heartRate.toString() : '--'
    });
    hrm.start();
} else {
    heartRate.text = '--';
}
// display steps
steps.text = today.adjusted.steps.toLocaleString("en-US");

// display distance
var dist = today.adjusted.distance; // in meters
if (currentDistUnit === distUnit[0]) { // metric
    if (dist < 1000) {
        distance.text = today.adjusted.distance.toLocaleString("en-US"); 
        distanceUnit.text = "meters"
    }
    else {
        distance.text = (today.adjusted.distance / 1000).toLocaleString("en-US");
        distanceUnit.text = "Km"
    }
} 
else { // imperial
    if (today.adjusted.distance * 1.09361 < 1000) {
        distance.text = (today.adjusted.distance * 1.09361).toLocaleString("en-US");
        distanceUnit.text = "yds"
    }
    else {
        distance.text = (today.adjusted.distance * 1.09361 / 1760 ).toLocaleString("en-US");
        distanceUnit.text = "miles"
    }
}

//display calories burned
cals.text = today.adjusted.calories.toLocaleString("en-US");

// display floors
floors.text = today.adjusted.floors ? today.adjusted.floors : '0';

// display date
var d = new Date();
date.text = days[d.getDay()] + ', ' + months[d.getMonth()] + ' ' + d.getDate();

// display battery level
active.text = today.adjusted.activeMinutes.toLocaleString("en-US");
