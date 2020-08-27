const Car = require('../Models/Car');

class CarRepo {
    async getAllCars() {
        let cars = await Car.find({}).exec();
        return cars;
    }

    async getCarById(car_id) {  
        // Set up response object which contains origianl user object and empty error message.
        let car = await Car.findOne({car_id:car_id});
        let response = { responseObj: car, errorMessage: "" };
        if(car) {
            response.responseObj = car
        }
        else {
            response.errorMessage = "Could not find car " + car_id
        }
        return response;
    }

    // Create a car object
    async create(newObj) {
        // Checks if model conforms to validation rules that we set in Mongoose.
        var error = await newObj.validateSync();
        var response = {
            cars: [],
            errorMessage: ""
        }

        // The model is invalid. Return the object and error message.
        if(error) {
            response.errorMessage = error.message;
            return response; // Exit if the model is invalid.
        }

        // Model is not invalid so save it.
        await newObj.save();   

        // Success! Return the model and no error message needed.
        let cars = await Car.find({}).exec();
        if(cars != null) {
            response.cars = cars;
        } else {
            response.errorMessage = "Could not load cars"
        }
        return response;
    }

    async updateCar(editedObj) {    
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
            let carObject = await this.getCarById(editedObj.car_id);
    
            // Check if user exists.
            if(carObject) { 
                // User exists so update it.
                let updated = await Car.updateOne(
                    { car_id: editedObj.car_id}, // Match id.
    
                    // Set new attribute values here.
                    {$set: 
                        { 
                            'model':        editedObj.model,
                            'make':         editedObj.make,
                            'imgurl':       editedObj.imgurl,
                            'office':       editedObj.office,
                            'booked_user':  editedObj.booked_user,
                            'schedule':     editedObj.schedule
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
                        "An error occurred during the update. The car did not save." 
                }
                return response; 
            }
                
            // Car not found.
            else {
                response.errorMessage = "A car with this id cannot be found." };
                return response; 
            }
    
                    // An error occurred during the update. 
        catch (err) {
            response.errorMessage = err.message;
            return  response;
        }    
    }
}
module.exports = CarRepo;

