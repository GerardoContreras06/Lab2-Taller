import {Schema, model } from "mongoose";

const AppointmentSchema = Schema({
    date: {
        type: String,
        required: true
    },
    descripcion: {
        type: String,
        required: true 
    },
    sintomas: {
        type: String, 
        required: true
    }, 
    keeper: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true 
    },
    status:{
        type: Boolean,
        default: true 
    }
},{
    timestamps: true,
    versionKey: false 
});

export default model('Appointment', AppointmentSchema);