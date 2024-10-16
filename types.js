const zod = require("zod");

const createNote = zod.object({
    title:zod.string().min(1,"Title is required"),
    body:zod.string().min(1,"Body is required"),
})

const updateNote = zod.object({
    title:zod.string().min(1,"Title is required"),
    body:zod.string().min(1,"Body is required"),

})
const createUser = zod.object({
    name:zod.string(),
    email:zod.string().email(),
    password:zod.string().min(8),
})
const loginUser = zod.object({
    email:zod.string().email(),
    password:zod.string().min(8)
})

module.exports = {
    createNote,
    updateNote,
    createUser,
    loginUser
}