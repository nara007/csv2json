# csv2json

This is a JavaScript application that runs on Node.js. It receives a CSV file as input and outputs a GeoJSON file. Please make sure you have already installed Node.js before running it.
The test environment on my PC is: 

  - Ubuntu 18.04 LTS
  - Node.js v8.10.0
  - NPM 3.5.2

# Installation

```sh
$ git clone https://github.com/nara007/csv2json.git
$ cd csv2json
$ npm install
```


# Usage

```sh
$ cd src        ( csv2json/src ) 
$ node csv2json.js sample.csv  （Or node csv2json_validator.js sample.csv）
```

Both **csv2json.js** and **csv2json_validator.js** will output '**sample.json**', csv2json_validator.js employs 'csv-validator' to check if a CSV file respects the predefined rules.

# Unit Test of csv2json
```sh
$ cd csv2json
$ npm test
```
  
