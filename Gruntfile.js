"use strict";

module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),

        clean: {
            tests: ["build/test/"]
        },

        copy: {
            tests: {
                files: [
                    { expand: true, cwd: "test", src: ["**"], dest: "build/test" },
                    { expand: true, cwd: "node_modules/mocha/", src: ["mocha.js", "mocha.css"], dest: "build/test/inte" }
                ]
            }
        },

        browserify: {
            integration: {
                files: {
                    "dist/integration.js": ["lib/integration.js"]
                },
                options: {
                    browserifyOptions: {
                        standalone: "obsidianApp"
                    }
                }
            },
            application: {
                files: {
                    "dist/obsidian-api.js": ["lib/index.js"]
                },
                options: {
                    browserifyOptions: {
                        standalone: "ObsidianApi"
                    }
                }
            },
            testInte: {
                files: {
                    "build/test/inte/tests.generated.js": ["test/*.js"]
                },
                options: {
                    browserifyOptions: {
                        debug: true
                    }
                }
            },
            testApp: {
                files: {
                    "build/test/app/app.generated.js": ["test/app/app.js"]
                },
                options: {
                    browserifyOptions: {
                        debug: true
                    }
                }
            }
        },

        uglify: {
            dist: {
                files: {
                    "dist/integration.min.js": "dist/integration.js",
                    "dist/obsidian-api.min.js": "dist/obsidian-api.js"
                }
            }
        },

        jshint: {
            all: ["lib/*.js"],
            options: {
                jshintrc: true
            }
        },

        shell: {
            serverStart: {
                command: [
                    "node node_modules/.bin/pm2 delete wanadev-project-api-app > /dev/null 2> /dev/null || echo -n",
                    "node node_modules/.bin/pm2 delete wanadev-project-api-inte > /dev/null 2> /dev/null || echo -n",
                    "node node_modules/.bin/pm2 start -f build/test/app/server.js --name=obsidian-api-app --watch > /dev/null 2> /dev/null",
                    "node node_modules/.bin/pm2 start -f build/test/inte/server.js --name=obsidian-api-inte --watch",
                    "sleep 1"
                ].join(" && ")
            },
            serverStop: {
                command: [
                    "node node_modules/.bin/pm2 delete obsidian-api-app > /dev/null 2> /dev/null",
                    "node node_modules/.bin/pm2 delete obsidian-api-inte"
                ].join(" && ")
            },
            mocha_headless_chrome: {
                command: "npx mocha-headless-chrome -f http://localhost:3010",
            },
        }
    });

    grunt.loadNpmTasks("grunt-contrib-clean");
    grunt.loadNpmTasks("grunt-contrib-copy");
    grunt.loadNpmTasks("grunt-browserify");
    grunt.loadNpmTasks("grunt-contrib-jshint");
    grunt.loadNpmTasks("grunt-shell");
    grunt.loadNpmTasks("grunt-contrib-uglify");

    grunt.registerTask("default", ["gen-inte", "gen-app", "uglify"]);
    grunt.registerTask("gen-inte", "Generates the dist integration script", ["browserify:integration"]);
    grunt.registerTask("gen-app", "Generates the dist application script", ["browserify:application"]);
    grunt.registerTask("gen-test", "Generates the test scripts", ["clean:tests", "copy:tests", "browserify:testInte",  "browserify:testApp"]);
    grunt.registerTask("test", "Run tests in a web browser", ["jshint", "gen-test", "shell:serverStart", "shell:mocha_headless_chrome", "shell:serverStop"]);

};
