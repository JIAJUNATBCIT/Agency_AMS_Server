const Ticket = require('../Models/Ticket');

class TicketRepo {
    TicketReop() {}

    // List all open tickets
    async getAllActiveTickets() {
        let response = { tickets:[], errorMessage: "" };
        try {
            let tks = await Ticket.find({status: {$ne: "Closed"}}).exec();
            response.tickets = tks;
            return response;
        } catch(error) {
            response.errorMessage = error.message;
            return  response;
        }
    }

    // Find specify ticket by ID
    async getTicketByID(ticket_id) {
        var ticket = await Ticket.findOne({ticket_id: ticket_id}).exec();
        if(ticket) {
            let respose = { ticket: ticket, errorMessage:"" }
            return respose;
        }
        else {
            let response = { ticket: ticket, errorMessage: "Could not find Ticket by ID: " + ticket_id}
            return response;
        }
    }

    async listTicketsByUsername(username) {
        let response = { tickets:[], errorMessage: "" };
        try {
            let tks = await Ticket.find({ $and: [ { username: username }, { status: { $ne: "Closed" } } ] } ).exec();
            response.tickets = tks;
            return response;
        } catch(error) {
            response.errorMessage = error.message;
            return  response;
        }
    }

    // Create a ticket
    async create(ticketObj) {
            // Checks if model conforms to validation rules that we set in Mongoose.
            var error = await ticketObj.validateSync();
            var response = {
                tickets: [],
                errorMessage: ""
            }

            // The model is invalid. Return the object and error message.
            if(error) {
                response.errorMessage = error.message;
                return response; // Exit if the model is invalid.
            }

            // Model is not invalid so save it.
            await ticketObj.save();     

            // Success! Return the model and no error message needed.
            let tickets = await Ticket.find({email: ticketObj.email}).exec();
            if(tickets != null) {
                response.tickets = tickets;
            } else {
                response.errorMessage = "Could not load tickets"
            }
            return response;
    }

    // Update a ticket
    async updateTicket(editedObj) {      
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
            let ticketObject = await this.getTicketByID(editedObj.ticket_id);
    
            // Check if user exists.
            if(ticketObject) { 
                // User exists so update it.
                let updated = await Ticket.updateOne(
                    { ticket_id: editedObj.ticket_id}, // Match id.
    
                    // Set new attribute values here.
                    {$set: 
                        {
                            'username': editedObj.username,
                            'phonenumber': editedObj.phonenumber,
                            'email': editedObj.email,
                            'date': editedObj.date,
                            'description': editedObj.description,
                            'assigned_name': editedObj.assigned_name,
                            'assigned_email': editedObj.assigned_email,
                            'assigned_phone': editedObj.assigned_phone,
                            'status': editedObj.status,
                            'admin_note': editedObj.admin_note,
                            'downloadJson': editedObj.downloadJson
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
                        "Nothing changed or an error occurred during the update. The ticket did not save. Ticket ID: " + editedObj.ticket_id 
                }
                return response;
            }
                
            // Ticket not found.
            else {
                response.errorMessage = "A Ticket with id: "+ editedObj.ticket_id +" cannot be found." };
                return response; 
            }
    
                    // An error occurred during the update. 
        catch (err) {
            response.errorMessage = err.message;
            return  response;
        }    
    }


    // Delete an existing ticket
    async deleteTicket(ticket_id) {
        let response = { deletedObj: null, errorMessage: "" };
        console.log("Ticket to be deleted is: " + ticket_id);
        try{
            
            response.deletedObj = await Ticket.find({ticket_id:ticket_id}).deleteMany().exec();
            return response;
        } catch (err) {
            response.errorMessage = err.message;
            return response;
        }
    }

    async delTicketsByUsername(username) {
        let response = {errorMessage: ""};
        console.log("Delete Tickets by username: " + username);
        try{
            await Ticket.find({username: username}).deleteMany().exec();
            return response;
        }
        catch (err) {
            response.errorMessage = err.message;
            return response;
        }
    }
}
module.exports = TicketRepo;

