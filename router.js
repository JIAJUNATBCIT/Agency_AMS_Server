var HomeController   = require('./Controllers/HomeController');
var UserController   = require('./Controllers/UserController');
var TicketController = require('./Controllers/TicketController');
var CarController    = require('./Controllers/CarController');
const authMiddleware = require('./authHelper');
const cors           = require('cors');


// Routes
module.exports = function(app){  
    // Main Routes
    app.get('/',      HomeController.Index);

    // Sign in
    app.post('/auth', cors(),
        // middleware that handles the sign in process
        authMiddleware.signIn,
        authMiddleware.signJWTForUser
    )

    app.post('/User/Register', cors(),
        UserController.RegisterUser)
    
    app.post('/User/Update', cors(),
        authMiddleware.requireJWT, UserController.UpdateUser)

    app.get('/User/Profile', cors(),
        authMiddleware.requireJWT, UserController.Profile)

    app.post('/User/Del', cors(),
        authMiddleware.requireJWT, UserController.DelUser)

    app.post('/User/UpdateSalary', cors(),
        authMiddleware.requireJWT, UserController.UpdateSalary)

    app.get('/User/AllUsers', cors(),
        authMiddleware.requireJWT, UserController.GetAllUsers)

    app.get('/User/AllUsersWithSalary', cors(),
        authMiddleware.requireJWT, UserController.GetAllUsersWithSalary)

    app.get('/User/GetAllITStaff', cors(),
        authMiddleware.requireJWT, UserController.GetAllITStaff)

    app.post('/Ticket/ListAllActiveTickets', cors(), 
        authMiddleware.requireJWT, TicketController.ListAllActiveTickets);

    app.post('/Ticket/ListTicketsByUsername', cors(), 
        authMiddleware.requireJWT, TicketController.ListTicketsByUsername);

    app.delete('/Ticket/GetTicketById', cors(), 
        authMiddleware.requireJWT, TicketController.GetTicketById);

    app.post('/Ticket/CreateTicket', cors(), 
        authMiddleware.requireJWT, TicketController.CreateTicket);

    app.post('/Ticket/UpdateTicket', cors(), 
        authMiddleware.requireJWT, TicketController.UpdateTicket);
        
    app.post('/Ticket/DeleteTicket', cors(), 
        authMiddleware.requireJWT, TicketController.DeleteTicket);

    app.post('/Ticket/GetDownLoadLink', cors(), 
        authMiddleware.requireJWT, TicketController.GetDownLoadLink);

    app.get('/Car/ListAllCars', cors(), 
        authMiddleware.requireJWT, CarController.ListAllCars);

    app.post('/Car/CreateCar', cors(), 
        authMiddleware.requireJWT, CarController.CreateCar);

    app.post('/Car/UpdateCar', cors(), 
        authMiddleware.requireJWT, CarController.UpdateCar);
    
    app.post('/Car/GetCarById', cors(), 
        authMiddleware.requireJWT, CarController.GetCarById);
};
