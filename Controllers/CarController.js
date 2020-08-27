const RequestService = require('../Services/RequestService');
const CarRepo   = require('../Data/CarRepo');
const _carRepo  = new CarRepo();
const Car       = require('../Models/Car');
const path          = require('path');
const fs            = require('fs');

// This is the default page for domain.com/product/index.
// It shows a listing of all cars if any exist.
exports.ListAllCars = async function(request, response){
    let reqInfo = await RequestService.jwtReqHelper(request, ['Admin', 'HR', 'Manager', 'General']);
    if(reqInfo.rolePermitted) {
        let cars = await _carRepo.getAllCars();
        if(cars != null) {
            response.json({cars:cars, errorMessage:""});
        }
        else {
            response.json({cars:[], errorMessage:"Could not load cars"});
        }
    }
};

exports.GetCarById = async function(request, response){
    let reqInfo = await RequestService.jwtReqHelper(request, ['Admin', 'HR', 'Manager', 'General']);
    if(reqInfo.rolePermitted) {
        let car_id = request.body.car_id;
        let reponseJson = await _carRepo.getCarById(car_id);
        if(reponseJson.car!= null) {
            response.json({car:reponseJson.car, errorMessage:""});
        }
        else {
            response.json({car:reponseJson.car, errorMessage:reponseJson.errorMessage});
        }
    }
};

// Receives POST data and tries to save it.
exports.CreateCar = async function(request, response) {
    let reqInfo = await RequestService.jwtReqHelper(request, ['Admin', 'HR', 'Manager', 'General']);
    if(reqInfo.rolePermitted) {
        // Package object up nicely using content from 'body'
        // of the POST request.
        let tempTicketObj  = new Car( {
            "car_id": request.body.obj.car_id,
            "model":request.body.obj.model,
            "make": request.body.obj.make,
            "imgurl": request.body.obj.imgurl,
            "office": request.body.obj.office,
            "booked_user": request.body.obj.booked_user,
            "schedule": request.body.obj.schedule
        });

        // Call Repo to save 'Car' object.
        let responseObject = await _carRepo.create(tempTicketObj);

        // No errors so save is successful.
        if(responseObject.errorMessage == "") {
            console.log('Saved without errors.');
            response.json({tickets:responseObject.cars, errorMessage:""});
        }
        // There are errors. Show form the again with an error message.
        else {
            console.log("An error occured. Car not created.");
            response.json({ cars:responseObject.cars, errorMessage:responseObject.errorMessage});
        }
    }
};

exports.UpdateCar = async function(request, response) {
    let reqInfo = await RequestService.jwtReqHelper(request, ['Admin', 'HR', 'Manager', 'General']);
    if(reqInfo.rolePermitted) {
        // Parcel up data in a 'Car' object.
        let tempCarObj  = new Car({
            car_id: request.body.obj.car_id,
            model: request.body.obj.model,
            make: request.body.obj.make,
            imgurl: request.body.obj.imgurl,
            office: request.body.obj.office,
            booked_user: request.body.obj.booked_user,
            schedule: request.body.obj.schedule
        });

        // Call update() function in repository with the object.
        let responseObject = await _carRepo.updateCar(tempCarObj);

        // Update was successful. Show detail page with updated object.
        if(responseObject.errorMessage == "") {
            response.json({ car:responseObject.obj, errorMessage:"" });
        }
        // Update not successful. Show edit form again.
        else {
            response.json({ car: responseObject.obj, errorMessage: responseObject.errorMessage });
        }
    }
}