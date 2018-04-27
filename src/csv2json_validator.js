const fs = require('fs');
const path = require('path');
const exists = require('fs-exists-sync');
const Papa = require('papaparse');
const GeoJSON = require('geojson');
const Observable = require('rxjs/Observable').Observable;
const fromPromise = require('rxjs/observable/fromPromise').fromPromise;
const csvValidator = require('csv-validator');

const fileNames = process.argv.splice(2);
const headers = {
    ID: '', // any string
    'Vessel Name': '',
    Longitude: 1, //any number
    Latiude: 1,
    Timestamp: '',
    Speed: ''
};

const CSVFiles = fileNames.filter(fileName => exists(path.resolve(fileName)));

for (let CSVFile of CSVFiles) {
    const source = fromPromise(csvValidator(CSVFile, headers));
    source.subscribe(CSVString => generateGeoJSONFromCSVStr(CSVFile, CSVString), error => console.error(error));
}

function generateGeoJSONFromCSVStr(filePath, CSVString) {
    const result = generateTrackForVessel(CSVString);
    const basename = path.basename(filePath, '.csv');
    const geoJSON = GeoJSON.parse(result, { LineString: 'line' });
    fs.writeFileSync(`./${basename}.json`, JSON.stringify(geoJSON));
}

function generateTrackForVessel(parseResult) {
    const vesselClassifier = new Map();
    for (let vessel of parseResult) {
        if (!vesselClassifier.has(vessel.ID)) {
            let set = new Set();
            vesselClassifier.set(vessel.ID, set);
            set.add(vessel);
        } else {
            vesselClassifier.get(vessel.ID).add(vessel);
        }
    }
    const result = [];
    for (let singleVesselSet of vesselClassifier.values()) {
        let vessel = {};
        vessel.line = [];
        for (let singleVessel of singleVesselSet.values()) {
            vessel.ID = singleVessel.ID;
            vessel['Vessel Name'] = singleVessel['Vessel Name'];
            vessel.line.push([Number.parseFloat(singleVessel.Latiude), Number.parseFloat(singleVessel.Longitude)]);
        }
        result.push(vessel);
    }

    return result;
}