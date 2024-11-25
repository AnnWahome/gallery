var config = {}

// Update to have your correct username and password
config.mongoURI = {

    production: 'mongodb+srv://annsonnie1:Annsonnie@123@devopscluster1.okwjc.mongodb.net/darkroom?retryWrites=true&w=majority',
    development: 'mongodb+srv://annsonnie1:Annsonnie@123@devopscluster1.okwjc.mongodb.net/darkroom-dev?retryWrites=true&w=majority',
    test: 'mongodb+srv://annsonnie1:Annsonnie@123@devopscluster1.okwjc.mongodb.net/darkroom-test?retryWrites=true&w=majority',


}
module.exports = config;
