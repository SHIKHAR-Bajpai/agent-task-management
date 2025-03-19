const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")

// Agent Schema
const agentSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
    },
    email:{
        type: String,
        required: true,
        unique : true,
    },
    password:{
        type: String,
        required: true,
    },
    mobile:{
        type: String,
        required: true,
    },
    role:{
        type: String,
        default : "agent",
    },
}, {timestamps : true},
)

agentSchema.pre('save' , async function(next){
    if( !this.isModified('password')) return next()
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password , salt)
    next()
})

module.exports = mongoose.model("Agent" , agentSchema)