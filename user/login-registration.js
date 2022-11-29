const expressObject = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const app = expressObject();
const bcrypt = require('bcryptjs');
const CryptoJS = require('crypto-js');
const connection = require("./db/database");
const sendToQueue = require('./queue/sender');
const passwordValidator = require('password-validator');
const schema = new passwordValidator();
const dotenv = require('dotenv');
dotenv.config();

connection();

schema
    .is().min(8)
    .is().max(32)
    .has().uppercase()
    .has().lowercase()
    .has().digits()
    .has().symbols()
    .is().not().oneOf(['Passw0rd', 'Password123']);


var User = require('./models/User').User;
var Otp = require('./models/otp');

app.use(expressObject.json());
// ===========================
//  Running Port.
// ===========================
app.listen(8080);
console.log("Server is listening port 8080 !!!!");


app.get('/check-email', (request, response) => {
    const email = request.body.email;
    User.find({ email: email }, (err, emailList) => {
        if (err) {
            return response.send({ message: "Error" });
        } else {
            if (emailList.length > 0) {
                response.send({ message: "invalid" });
            } else {
                response.send({ message: "valid" });
            }
        }
    });
});

app.get('/check-username', (request, response) => {
    const username = request.body.username;
    User.find({ username: username }, (err, usernameList) => {
        if (err) {
            return response.send({ message: "error" });
        } else {
            if (usernameList.length > 0) {
                response.send({ message: "invalid" });
            } else {
                response.send({ message: "valid" });
            }
        }
    });
});

app.post('/create-otp', (request, response) => {
    var email = request.body.email;
    const otpInt = Math.floor((Math.random() * 999999) + 1);
    const otpString = otpInt.toString();
    const sr = 10;
    bcrypt.genSalt(sr, (err, salt) => {
        if (err) {
            return response.send({ message: "error" });
        } else {
            bcrypt.hash(otpString, salt, (err, hash) => {
                if (err) {
                    return response.send({ message: "error" });
                }
                else {
                    const mailRequest = {
                        otp: otpString,
                        email: email
                    }
                    sendToQueue('mailer', mailRequest);
                    var otp = new Otp({
                        email: email,
                        otp: hash
                    });
                    Otp.create(otp, (err) => {
                        if (err) {
                            return response.send({ message: "error" });
                        } else {
                            response.send({ message: "ok" });
                        }
                    });
                }
            });
        }
    });
});

app.post('/check-otp', (request, response) => {
    const email = request.body.email;
    const otp = request.body.otp;
    Otp.find({ email: email }, (err, result) => {
        if (err) {
            return response.send({ message: "error" });
        } else {
            if (result.length > 0) {
                bcrypt.compare(otp, result[0].otp, (err, r) => {
                    if (err) {
                        return response.send({ message: "error" });
                    }
                    else {
                        if (r == true) {
                            Otp.deleteOne({ email: email }, (err) => {
                                if (err) {
                                    return response.send({ message: "error" });
                                }
                            });
                            return response.send({ message: "valid" });
                        } else {
                            return response.send({ message: "invalid" });
                        }
                    }
                });
            }
        }
    });
});

app.post('/signup', (request, response) => {
    const username = request.body.username;
    const name = request.body.name;
    const email = request.body.email;
    const password = request.body.password;
    if (schema.validate(password)) {
        bcrypt.genSalt(sr, function (err, salt) {
            if (err) {
                return response.send({ message: "error" });
            } else {
                bcrypt.hash(password, salt, function (err, hash) {
                    if (err) {
                        return response.send({ message: "error" });
                    } else {
                        var newUser = new User({
                            name: name,
                            username: username,
                            email: email,
                            password: hash
                        });
                        User.create(newUser, (err) => {
                            if (err) {
                                return response.send({ message: "error" });
                            }
                        });
                        return response.send("ok");
                    }
                });
            }
        });
    } else {
        return response.send("invalid");
    }
});

app.post('/login', (request, response) => {

});
