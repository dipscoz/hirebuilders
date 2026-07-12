const express = require("express");
const cors = require("cors");

const {PrismaClient} = require("@prisma/client");


const app = express();

const prisma = new PrismaClient();


app.use(cors());

app.use(express.json());



// récupérer employés

app.get(
"/api/employees",
async(req,res)=>{


const employees =
await prisma.employee.findMany();


res.json(employees);


});




// ajouter employé

app.post(
"/api/employees",
async(req,res)=>{


const employee =
await prisma.employee.create({

data:req.body

});


res.json(employee);


});






// réservation

app.post(
"/api/reservations",
async(req,res)=>{


const reservation =
await prisma.reservation.create({

data:req.body

});


res.json(reservation);


});






app.listen(
5000,
()=>{

console.log(
"API HireBuilders démarrée sur port 5000"
);

});