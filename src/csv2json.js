const fs = require('fs');
const path = require('path');
const exists = require('fs-exists-sync');
const Papa = require('papaparse');
const GeoJSON = require('geojson');

const fileNames = process.argv.splice(2);
const CSVFiles = fileNames.filter(fileName => exists(path.resolve(fileName)));
convertMultiCSV2GeoJSON(CSVFiles);

function convertMultiCSV2GeoJSON(CSVFiles) {
    for (let CSVFile of CSVFiles) {
    	convertCSV2GeoJSON(CSVFile);
    }
}

function convertCSV2GeoJSON(CSVFile) {
    const basename = path.basename(CSVFile, '.csv');
    const file = fs.readFileSync(CSVFile, 'utf8');
    const parseResult = Papa.parse(file, { 'header': true });

    console.log(parseResult.data);

    const result = generateTrackForVessel(parseResult.data);
    const geoJSON = GeoJSON.parse(result, { LineString: 'line' });
    fs.writeFileSync(`./${basename}.json`, JSON.stringify(geoJSON));

    return geoJSON;
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

module.exports = {
	convertCSV2GeoJSON: convertCSV2GeoJSON,
	generateTrackForVessel: generateTrackForVessel
}