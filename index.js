const express = require("express");
const {createNote,updateNote,loginUser,createUser} =require("./types");
const {note,user} = require("./db");
const cors = require("cors");
const app = express();
const port = 3000;
const jwt = require("jsonwebtoken");
const {authenticateJWT} = require("./middleware");
const {jwtKey} = require("./jwtConfig");

app.use(express.json());
app.use(cors());

app.post("/Signup", async function(req, res) {
    const createPayload = req.body;
    const parsePayload = createUser.safeParse(createPayload);

    if (!parsePayload.success) {
        return res.status(400).json({ msg: "You have sent wrong input" });
    }

    try {
        const oldUser = await user.findOne({ email: createPayload.email });

        if (oldUser) {
            return res.status(401).json({ msg: "User email already exists" });
        } else {
            await user.create({
                name: createPayload.name,
                email: createPayload.email,
                password: createPayload.password,
            });

            return res.json({ msg: "Signup successfully" });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: "Server is down" });
    }
});

app.post("/Login", async function (req, res) {
    const loginPayload = req.body;
    const parsePayload = loginUser.safeParse(loginPayload);

    if (!parsePayload.success) {
        return res.status(400).json({ msg: "You have sent wrong Input" });
    }

    try {
        const User = await user.findOne({
            email: loginPayload.email,
            password: loginPayload.password,
        });

        if (!User) {
            return res.status(403).json({ msg: "Invalid Email or Password" });
        } else {
            const token = jwt.sign(
                {
                    email: loginPayload.email,
                    id: User._id,  // Including user id for reference
                },
                jwtKey,
                { expiresIn: "1h" }  // Token expires in 1 hour
            );

            res.status(201).json({
                msg: "Login successfully",
                token: token,  // Send only the token without "Bearer "
            });
        }
    } catch (e) {
        console.log(e);
        res.status(500).json("Server is Busy");
    }
});



app.post("/Notes",authenticateJWT,async function (req,res){
    const createPayload = req.body;
    const parsePayload = createNote.safeParse(createPayload);
    if(!parsePayload.success){
        res.status(400).json({mgs: "You have sent wrong input"});
        return;
    }
    await note.create({
        title:createPayload.title,
        body:createPayload.body,
    })

    res.json("Note is created");
})

app.get("/Notes",async function(req, res){
    const notes = await note.find({});
    res.json({
        notes
    })
})

app.put("/Notes/:id",async function(req,res){
    const {id} = req.params;
    const updatePayload = req.body;
    const parsePayload = updateNote.safeParse(updatePayload);
    if(!parsePayload.success){
        res.status(400).json({
            msg:"Invaild input"
        })
        return;
    }
    await note.updateOne({_id:id},{
        $set:{
            title:updatePayload.title,
            body:updatePayload.body
        }
    });
    res.json({
            msg: "Note is updated"
    })
})
app.delete("/Notes/:id",async function (req,res){
    const noteId = req.params.id;
    const result = await note.deleteOne({_id:noteId});
    if(result.deleteCount ===0){
        return res.status(404).json({msg:"Note is not found"});
    }
    res.json({
        msg:"Note is Deleted successfully"
    })
})


app.listen(port,()=>{
    console.log("server is running on port 3000")
});

module.exports ={
    jwtKey,
}
