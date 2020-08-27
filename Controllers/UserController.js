const User           = require('../Models/User');
var   passport       = require('passport');
const RequestService = require('../Services/RequestService');
const UserRepo   = require('../Data/UserRepo');
const TicketRepo = require('../Data/TicketRepo');
const _userRepo  = new UserRepo();
const _ticketRepo = new TicketRepo();

// Handles 'POST' with registration form submission.
exports.RegisterUser  = async function(req, res){
    var password        = req.body.password;
    var passwordConfirm = req.body.passwordConfirm;

    if (password == passwordConfirm) {

        // Creates user object with mongoose model.
        // Note that the password is not present.
        var newUser = new User({
            firstname:    req.body.firstname,
            lastname:     req.body.lastname,
            email:        req.body.email,
            username:     req.body.username,
            office: req.body.office,
            password: req.body.password,
            phonenumber:   req.body.phonenumber,
            roles:        req.body.roles
        });
       
        // Uses passport to register the user.
        // Pass in user object without password
        // and password as next parameter.
        let userObj = new User(newUser)
        User.register(userObj, req.body.password, 
                function(err, account) {
                    // Show registration form with errors if fail.
                    if (err) {
                        res.json({errorMessage: err.message});
                    } else {
                        // User registered so authenticate and redirect to secure 
                        // area.
                        res.json({ errorMessage:"" });
                    }
                });

    }
    else {
        res.json({errorMessage: "Passwords do not match."})
    }
};

// Handles 'POST' with registration form submission.
exports.UpdateUser  = async function(req, res){      
    // Uses passport to register the user.
    // Pass in user object without password
    // and password as next parameter.
    let reqInfo = await RequestService.jwtReqHelper(req, ['Admin', 'HR', 'Manager', 'General']);
    if(reqInfo.rolePermitted) {
        let tempUserObj = new User ({
            firstname : req.body.obj.firstname,
            lastname : req.body.obj.lastname,
            email : req.body.obj.email,
            username : req.body.obj.username,
            office : req.body.obj.office,
            phonenumber : req.body.obj.phonenumber,
            password: req.body.obj.password,
            roles: req.body.obj.roles
        })
        // Call update() function in repository with the object.
        let responseObject = await _userRepo.updateUser(tempUserObj);
        console.log("#### User: " + JSON.stringify(responseObject.obj));

        // Update was successful. Show detail page with updated object.
        if(responseObject.errorMessage == "") {
            res.json({ user:responseObject.obj, errorMessage:"" });
        }
        // Update not successful. Show edit form again.
        else {
            res.json({ user: responseObject.obj, errorMessage: responseObject.errorMessage });
        }
    }
}

// Handles 'POST' with registration form submission.
exports.UpdateSalary  = async function(req, res){      
    // Uses passport to register the user.
    // Pass in user object without password
    // and password as next parameter.
    let reqInfo = await RequestService.jwtReqHelper(req, ['HR']);
    if(reqInfo.rolePermitted) {
        let tempUserObj = new User ({
            username : req.body.obj.username,
            salary: req.body.obj.salary,
            roles: reqInfo.roles,
        })
        // Call update() function in repository with the object.
        let responseObject = await _userRepo.updateSalary(tempUserObj);

        // Update was successful. Show detail page with updated object.
        if(responseObject.errorMessage == "") {
            res.json({ errorMessage:"Salary Updated", updatedSalary:responseObject.obj  });
        }
        // Update not successful. Show edit form again.
        else {
            res.json({ errorMessage: responseObject.errorMessage, updatedSalary: responseObject.obj });
        }
    }
}

// Get all IT staff

exports.GetAllITStaff = async function(req, res) {
    let reqInfo = await RequestService.jwtReqHelper(req, ['Admin', 'HR', 'Manager']);
    if(reqInfo.rolePermitted) {
        let all_ITers = await _userRepo.getAllITers();
        res.json({ ITers: all_ITers })
    }
}

// This function returns data to Manager only
exports.GetAllUsers = async function(req, res) {
    let reqInfo = await RequestService.jwtReqHelper(req, ['Admin', 'HR', 'Manager']);
    if(reqInfo.rolePermitted) {
        let all_users = await _userRepo.getAllUsersWithoutSalary();
        res.json({ all_users: all_users })
    }
}

// This function returns data to Manager only
exports.GetAllUsersWithSalary = async function(req, res) {
    let reqInfo = await RequestService.jwtReqHelper(req, ['Admin', 'HR']);
    if(reqInfo.rolePermitted) {
        let all_users = await _userRepo.getAllUsersWithSalary();
        res.json({ all_users: all_users })
    }
}

// This function returns data to logged in users only.
exports.Profile = async function(req, res) {
    let reqInfo = await RequestService.jwtReqHelper(req, ['Admin', 'HR', 'Manager', 'General']);
    if(reqInfo.rolePermitted) {
        let response = await _userRepo.getUserByUsername(reqInfo.username)
        if (response.errorMessage == "") {
            res.json({errorMessage: response.errorMessage, user: response.responseObj })
        } else {
            res.json({errorMessage: response.errorMessage, user: null })
        }
    }
    else {
        res.json( {errorMessage:'/User/Login?errorMessage=You ' +
                'must be logged in to view this page.'})
    }
}

exports.DelUser = async function(req, res) {
    let reqInfo = await RequestService.jwtReqHelper(req, ['Admin', 'HR', 'Manager']);
    if(reqInfo.rolePermitted) {
        // Delete User's tickets
        let response = await _ticketRepo.delTicketsByUsername(req.body.obj.username);
        if(response.errorMessage == '') {
            // Delete User's profile
            response = await _userRepo.deleteUser(req.body.obj.username);
            if (response.errorMessage == '') {
                res.json({errorMessage: response.errorMessage, users: response.users});
            } else {
                res.json({errorMessage: response.errorMessage, users:[]});
            }
        } else {
            res.json({errorMessage: response.errorMessage, users:[]});
        } 
    } else {
        res.json( {errorMessage:'/User/Login?errorMessage=You ' +
                'must be logged in to view this page.'});
    }
}
