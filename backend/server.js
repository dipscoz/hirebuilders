const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { PrismaClient } = require("@prisma/client");


const app = express();

const prisma = new PrismaClient();


// =======================
// MIDDLEWARE
// =======================

app.use(cors());

app.use(express.json());




// =======================
// TEST SERVEUR
// =======================

app.get("/", (req,res)=>{

res.json({

message:
"API HireBuilders fonctionne"

});

});




// =======================
// EMPLOYES
// =======================



// GET TOUS LES EMPLOYES

app.get(
"/api/employees",

async(req,res)=>{

try{


const employees =
await prisma.employee.findMany({

orderBy:{
createdAt:"desc"
}

});


res.json(employees);



}catch(error){


res.status(500).json({

error:
"Impossible de récupérer les employés"

});


}


});






// CREER UN EMPLOYE

app.post(
"/api/employees",

async(req,res)=>{


try{


const employee =
await prisma.employee.create({

data:{


name:req.body.name,


phone:req.body.phone,


job:req.body.job,


city:req.body.city,


experience:req.body.experience,


available:true


}


});



res.json(employee);



}

catch(error){


console.log(error);


res.status(500).json({

error:
"Erreur création employé"

});


}


});






// MODIFIER UN EMPLOYE

app.put(
"/api/employees/:id",

async(req,res)=>{


try{


const employee =
await prisma.employee.update({

where:{

id:Number(req.params.id)

},


data:req.body


});


res.json(employee);



}

catch(error){


res.status(500).json({

error:
"Erreur modification"

});


}


});








// SUPPRIMER UN EMPLOYE

app.delete(
"/api/employees/:id",

async(req,res)=>{


try{


await prisma.employee.delete({

where:{

id:Number(req.params.id)

}

});



res.json({

message:
"Employé supprimé"

});



}

catch(error){


res.status(500).json({

error:
"Erreur suppression"

});


}


});








// =======================
// RESERVATIONS
// =======================



// CREER RESERVATION


app.post(

"/api/reservations",

async(req,res)=>{


try{


const reservation =
await prisma.reservation.create({

data:{


clientName:
req.body.clientName,


phone:
req.body.phone,


startDate:
req.body.startDate,


endDate:
req.body.endDate,


message:
req.body.message,


employeeId:
Number(req.body.employeeId)



}


});



res.json(reservation);



}

catch(error){


console.log(error);


res.status(500).json({

error:
"Erreur réservation"

});


}



}

);








// VOIR LES RESERVATIONS


app.get(

"/api/reservations",

async(req,res)=>{


try{


const reservations =
await prisma.reservation.findMany({

include:{

employee:true

},


orderBy:{

createdAt:"desc"

}


});



res.json(reservations);



}

catch(error){


res.status(500).json({

error:
"Erreur récupération réservations"

});


}


}

);






// =======================
// ADMIN STATISTIQUES
// =======================


app.get(

"/api/stats",

async(req,res)=>{


try{


const employees =
await prisma.employee.count();



const reservations =
await prisma.reservation.count();



res.json({

employees,

reservations


});



}

catch(error){


res.status(500).json({

error:
"Erreur statistiques"

});


}



}

);






// =======================
// LANCEMENT SERVEUR
// =======================


const PORT = 5000;



app.listen(

PORT,

()=>{


console.log(
`🚀 HireBuilders API démarrée sur http://localhost:${PORT}`
);


}

);