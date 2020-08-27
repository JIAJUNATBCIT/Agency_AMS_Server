const RequestService = require('../Services/RequestService');
const TicketRepo   = require('../Data/TicketRepo');
const _ticketRepo  = new TicketRepo();
const Ticket       = require('../Models/Ticket');
const path          = require('path');
const fs            = require('fs');

// This is the default page for domain.com/product/index.
// It shows a listing of tickets if any exist.
exports.ListAllActiveTickets = async function(request, response){
    let reqInfo = await RequestService.jwtReqHelper(request, ['Admin']);
    if(reqInfo.rolePermitted) {
        let res = await _ticketRepo.getAllActiveTickets();
        if(res.tickets != null) {
            response.json({tickets:res.tickets, errorMessage:""});
        }
        else {
            response.json({tickets:[], errorMessage:"Could not load Tickets"});
        }
    }
};

// List all tickets by User name.
exports.ListTicketsByUsername = async function(request, response){
    let reqInfo = await RequestService.jwtReqHelper(request, ['Admin', 'HR', 'Manager', 'General']);
    if(reqInfo.rolePermitted) {
        let username = request.body.obj.username;
        let res = await _ticketRepo.listTicketsByUsername(username);
        if(res.tickets != null) {
            response.json({tickets:res.tickets, errorMessage:""});
        }
        else {
            response.json({tickets:[], errorMessage:"Could not load Tickets"});
        }
    }
};

exports.GetTicketById = async function(request, response){
    let reqInfo = await RequestService.jwtReqHelper(request, ['Admin', 'HR', 'Manager', 'General']);
    if(reqInfo.rolePermitted) {
        let ticket_id = request.body.ticket_id;
        let reponseJson = await _ticketRepo.getTicketByID(ticket_id);
        if(reponseJson.ticket!= null) {
            response.json({ticket:reponseJson.ticket, errorMessage:""});
        }
        else {
            response.json({ticket:reponseJson.ticket, errorMessage:reponseJson.errorMessage});
        }
    }
};

// Receives POST data and tries to save it.
exports.CreateTicket = async function(request, response) {
    let reqInfo = await RequestService.jwtReqHelper(request, ['Admin', 'HR', 'Manager', 'General']);
    if(reqInfo.rolePermitted) {
        // Package object up nicely using content from 'body'
        // of the POST request.
        let tempTicketObj  = new Ticket( {
            "ticket_id": request.body.obj.ticket_id,
            "username":request.body.obj.username,
            "email": request.body.obj.email,
            "phonenumber": request.body.obj.phonenumber,
            "date": request.body.obj.date,
            "description": request.body.obj.description,
            "downloadJson": request.body.obj.downloadJson
        });

        // Call Repo to save 'Ticket' object.
        let responseObject = await _ticketRepo.create(tempTicketObj);

        // No errors so save is successful.
        if(responseObject.errorMessage == "") {
            console.log('Saved without errors.');
            response.json({tickets:responseObject.tickets, errorMessage:""});
            //console.log(JSON.stringify(responseObject.tickets));
        }
        // There are errors. Show form the again with an error message.
        else {
            console.log("An error occured. Ticket not created.");
            response.json({ tickets:responseObject.tickets, errorMessage:responseObject.errorMessage});
        }
    }
};

exports.UpdateTicket = async function(request, response) {
    let reqInfo = await RequestService.jwtReqHelper(request, ['Admin', 'HR', 'Manager', 'General']);
    if(reqInfo.rolePermitted) {
        // Parcel up data in a 'Ticket' object.
        let tempTicketObj  = new Ticket({
            ticket_id: request.body.obj.ticket_id,
            username: request.body.obj.username,
            phonenumber: request.body.obj.phonenumber,
            email: request.body.obj.email,
            date: request.body.obj.date,
            description: request.body.obj.description,
            assigned_name: request.body.obj.assigned_name,
            assigned_email: request.body.obj.assigned_email,
            assigned_phone: request.body.obj.assigned_phone,
            status: request.body.obj.status,
            admin_note: request.body.obj.admin_note,
            downloadJson: request.body.obj.downloadJson
        });

        // Call update() function in repository with the object.
        let responseObject = await _ticketRepo.updateTicket(tempTicketObj);

        // Update was successful. Show detail page with updated object.
        if(responseObject.errorMessage == "") {
            response.json({ ticket:responseObject.obj, errorMessage:"" });
        }
        // Update not successful. Show edit form again.
        else {
            response.json({ ticket: responseObject.obj, errorMessage: responseObject.errorMessage });
        }
    }
}


// This function receives an id when it is posted.
// It then performs the delete and shows the ticket listing after.
// A nicer (future) version could take you to a page to confirm the deletion first.
exports.DeleteTicket = async function(request, response) {
    let reqInfo = await RequestService.jwtReqHelper(request, ['Admin', 'HR', 'Manager', 'General']);
    if(reqInfo.rolePermitted) {
        // Delete ticket
        let res = await _ticketRepo.deleteTicket(request.body.obj.ticket_id);
        if (res.errorMessage == '') {
            response.json({errorMessage: res.errorMessage, ticket: res.deletedObj});
        } else {
            response.json({errorMessage: res.errorMessage, tickets:null});
        }
    } else {
        response.json( {errorMessage:'/User/Login?errorMessage=You ' +
                'must be logged in to view this page.'});
    }
};

exports.DelTicketsByUsername = async function(request, response) {
    let reqInfo = await RequestService.jwtReqHelper(request, ['Admin', 'HR']);
    if(reqInfo.rolePermitted) {
        let username = request.body.username;
        let rep = await _ticketRepo.delTicketsByUsername(username);
        response.json({errorMessage: rep.errorMessage});
    }
}

// Rename uploaded files to avoid duplicated files
exports.GetDownLoadLink = async function(request, response) {
    let reqInfo = await RequestService.jwtReqHelper(request, ['Admin', 'HR', 'Manager', 'General']);
    if(reqInfo.rolePermitted) {
        var files = request.body.obj.myfiles;
        var newNames = [];
        var errorMessage = "";
        files.forEach(file => {
            var file_extension = path.extname(file.filename);
            var file_name = path.basename(file.filename, file_extension);
            var timestamp = new Date().getTime();
            var file_new_name = file_name + '-' + String(timestamp) + file_extension;
            fs.rename('./uploads/' + file.filename, './uploads/' + file_new_name, function(err) {
                if ( err ) {
                    errorMessage = err;
                }
            })
            newNames.push({filename: file_new_name, fileDisplayName: file.filename, filesize: (file.filesize/1000)});
        });
        response.json({errorMessage: errorMessage, myfiles: newNames});
    } else {
        response.json({errorMessage: "You must login first", myfiles: []});
    }
}