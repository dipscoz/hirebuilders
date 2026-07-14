const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { PrismaClient } = require("@prisma/client");

const app = express();

const prisma = new PrismaClient();


app.use(cors({
    origin: [
        "https://hirebuilders-tn8k.vercel.app"
    ],
    methods:["GET","POST"],
}));

app.use(express.json());



app.get("/", (req,res)=>{
    res.json({
        message:"HireBuilders API fonctionne 🚀"
    });
});



// récupérer les employés

app.get("/api/employees", async(req,res)=>{

    try{

        const employees = await prisma.employee.findMany();

        res.json(employees);


    }catch(error){

        res.status(500).json({
            error:error.message
        });

    }

});




// créer un employé

app.post("/api/employees", async(req,res)=>{

    try{


        const employee = await prisma.employee.create({

            data:req.body

        });


        res.json(employee);



    }catch(error){


        console.log(error);


        res.status(500).json({

            error:error.message

        });


    }


});





const PORT = process.env.PORT || 5000;


app.listen(PORT,()=>{

console.log(
`🚀 Serveur HireBuilders lancé sur ${PORT}`
);

});