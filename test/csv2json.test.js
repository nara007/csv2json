const csv2json = require('../src/csv2json.js');
require('should');

const parseResultFromCSV = [];

parseResultFromCSV.push({
    ID: '001',
    'Vessel Name': 'Bayern Munich',
    Longitude: '1.269708',
    Latiude: '103.795908',
    Timestamp: '1524574620',
    Speed: '25 km/h'
});

parseResultFromCSV.push({
    ID: '002',
    'Vessel Name': 'Darmstadt 98',
    Longitude: '1.270197',
    Latiude: '103.794978',
    Timestamp: '1524574620',
    Speed: '0 km/h'
});

parseResultFromCSV.push({
    ID: '001',
    'Vessel Name': 'Bayern Munich',
    Longitude: '1.269668',
    Latiude: '103.796123',
    Timestamp: '1524578220',
    Speed: '15 km/h'
});

parseResultFromCSV.push({
    ID: '002',
    'Vessel Name': 'Darmstadt 98',
    Longitude: '1.270197',
    Latiude: '103.794978',
    Timestamp: '1524578220',
    Speed: '0 km/h'
});

parseResultFromCSV.push({
    ID: '001',
    'Vessel Name': 'Bayern Munich',
    Longitude: '1.269483',
    Latiude: '103.796544',
    Timestamp: '1524585420',
    Speed: '20 km/h'
});

parseResultFromCSV.push({
    ID: '002',
    'Vessel Name': 'Darmstadt 98',
    Longitude: '1.269355',
    Latiude: '103.794558',
    Timestamp: '1524585420',
    Speed: '40 km/h'
});


describe('Generate Track from parsedCSV', () => {
    it('should generate track from coordinates at different time', () => {

        const tracks = csv2json.generateTrackForVessel(parseResultFromCSV);
        const vesselOne = tracks.find(vesselInfo => vesselInfo.ID === '001');
        const vesselTwo = tracks.find(vesselInfo => vesselInfo.ID === '002');

        vesselOne.should.have.property('line').which.is.a.Array();
        vesselOne.should.have.property('ID').which.is.a.String();
        vesselOne.should.have.property('Vessel Name').which.is.a.String();

        vesselTwo.should.be.eql({
            line: [
                [103.794978, 1.270197],
                [103.794978, 1.270197],
                [103.794558, 1.269355]
            ],
            ID: '002',
            'Vessel Name': 'Darmstadt 98'
        });
    });
});

describe('Generate GeoJSON from CSV file', () => {
    it('should generate GeoJSON from CSV file successfully', () => {

        const geoJSON = csv2json.convertCSV2GeoJSON('./src/sample.csv');
        const coordinatesOfLastItem = geoJSON.features[2].geometry.coordinates;
        geoJSON.should.have.property('type', 'FeatureCollection');
        geoJSON.should.have.property('features').which.is.a.Array();
        coordinatesOfLastItem.should.be.eql(
            [
                [103.809941, 1.262393],
                [103.798218, 1.267831],
                [103.798156, 1.266683],
                [103.79738, 1.266218]
            ]
        );

    });
});

describe('Generate GeoJSON from CSV file with extra column(incorrect CSV file)', () => {
    it('should generate correct GeoJSON from CSV file by filtering extra column', () => {
        const geoJSON = csv2json.convertCSV2GeoJSON('./src/error.csv');
        const coordinatesOfItemTwo = geoJSON.features[1].geometry.coordinates;
        geoJSON.should.have.property('type', 'FeatureCollection');
        geoJSON.should.have.property('features').which.is.a.Array();
        coordinatesOfItemTwo.should.be.eql(
            [
                [103.794978, 1.270197],
                [103.794978, 1.270197],
                [103.794567, 1.269903],
                [103.794558, 1.269355]
            ]
        );
    });
});