module.exports = {
    networks: {
        test: {
            host: "ethereum",
            port: 8545,
            network_id: "*"
        },
        develop: {
            host: "localhost",
            port: 9545,
            network_id: "*"
        }
    },
    compilers: {
        solc: {
            version: "^0.8.7",
            settings: {
                optimizer: {
                    enabled: true,
                    runs: 200
                }
            }
        },
    },
    mocha: {
        useColors: true,
        reporter: 'mocha-multi-reporters',
        reporterOptions: {
            reporterEnabled: "spec, mocha-junit-reporter",
            mochaJunitReporterReporterOptions: {
                testCaseSwitchClassnameAndName: true,
                mochaFile: "test-results.xml"
            }
        }
    }
};
