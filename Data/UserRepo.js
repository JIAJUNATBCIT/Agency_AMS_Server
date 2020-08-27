const User = require('../Models/User');

class UserRepo {
    UserRepo() {}

    // deprecated
    async getUserByEmail(email) {
        var user = await User.findOne({email: email});
        if(user) {
            let respose = { obj: user, errorMessage:"" }
            return respose;
        }
        else {
            return null;
        }
    }

    // deprecated
    async getRolesByUsername(username) {
        var user = await User.findOne({username: username}, {_id:0, roles:1});
        if(user.roles) {
            return user.roles;
        }
        else {
            return [];
        }
    }

    // Get a user by username
    async getUserByUsername(username) {  
        // Set up response object which contains origianl user object and empty error message.
        let user = await User.findOne({username:username});
        let response = { responseObj: user, errorMessage: "" };
        if(user) {
            response.responseObj = user
        }
        else {
            response.errorMessage = "Could not find user " + username
        }
        return response;
    }

    async updateUser(editedObj) {    
        // Set up response object which contains origianl product object and empty error message.
        let response = { obj: editedObj, errorMessage: "" };
    
        try {
            // Ensure the content submitted by the user validates.
            var error = await editedObj.validateSync();
            if(error) {
                response.errorMessage = error.message;
                return response;
            } 
    
            // Load the actual corresponding object in the database.
            let userObject = await this.getUserByUsername(editedObj.username);
    
            // Check if user exists.
            if(userObject) { 
                // User exists so update it.
                let updated = await User.updateOne(
                    { username: editedObj.username}, // Match id.
    
                    // Set new attribute values here.
                    {$set: 
                        { 
                            'firstname':    editedObj.firstname,
                            'lastname':     editedObj.lastname,
                            'email':        editedObj.email,
                            'office':       editedObj.office,
                            'phonenumber':  editedObj.phonenumber,
                            'roles': editedObj.roles
                        }
                    });     
                // No errors during update.
                if(updated.nModified!=0) {
                    response.obj = editedObj;
                    return response;
                }
                // Errors occurred during the update.
                else {
                    response.errorMessage = 
                        "An error occurred during the update. The user did not save." 
                }
                return response; 
            }
                
            // User not found.
            else {
                response.errorMessage = "An user with this username cannot be found." };
                return response; 
            }
    
                    // An error occurred during the update. 
        catch (err) {
            response.errorMessage = err.message;
            return  response;
        }    
    }

    async updateSalary(editedObj) {      
        // Set up response object which contains origianl product object and empty error message.
        let response = { obj: editedObj, errorMessage: "" };
    
        try {
            // Ensure the content submitted by the user validates.
            var error = await editedObj.validateSync();
            if(error) {
                response.errorMessage = error.message;
                return response;
            } 
    
            // Load the actual corresponding object in the database.
            let userObject = await this.getUserByUsername(editedObj.username);
    
            // Check if user exists.
            if(userObject) { 
                // User exists so update it.
                let updated = await User.updateOne(
                    { username: editedObj.username}, // Match id.  
                    // Set new attribute values here.
                    {$set: 
                        { 
                            'salary': editedObj.salary
                        }
                    });     
                // No errors during update.
                if(updated.nModified!=0) {
                    response.obj = editedObj;
                    return response;
                } else if (updated.nModified==0 && updated.ok ==1) {
                    response.errorMessage = "Nothing to be updated"
                }
                // Errors occurred during the update.
                else {
                    response.errorMessage = "An error occurred during the update. The salary did not save." 
                }
                return response; 
            }
                
            // User not found.
            else {
                response.errorMessage = "An user with this username cannot be found." };
                return response; 
            }
    
                    // An error occurred during the update. 
        catch (err) {
            response.errorMessage = err.message;
            return  response;
        }    
    }

    // Delete an existing user
    async deleteUser(username) {
        let response = { users: [], errorMessage: "" };
        console.log("User to be deleted is: " + username);
        try{
            await User.find({username:username}).deleteOne().exec();
            response.users = await User.find({}).exec();
            return response;
        } catch (err) {
            response.errorMessage = err.message;
            return response;
        }
    }

    async getAllITers() {
        let users = await User.find({roles: 'Admin'},{_id:0, salary:0}).exec();
        return users;
    }
    
    async getAllUsersWithoutSalary() {
        let users = await User.find({},{_id:0, salary:0}).exec();
        return users;
    }

    async getAllUsersWithSalary() {
        let users = await User.find({},{_id:0}).exec();
        return users;
    }
}
module.exports = UserRepo;

