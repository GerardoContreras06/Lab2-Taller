import User from '../users/user.model.js'
import Appointment from '../appointments/appointment.model.js'

export const saveAppointment = async (req , res) => {
    try {
        const data = req.body;
        const user = await User.findOne({email: data.email});
        console.log(user)
        if(!user){
            return res.status(404).json({
                success: false,
                message: 'Propietario no encontrado'
            })
        }

        const appointment = new Appointment({
            ...data,
            keeper: user._id
        });
         
        await appointment.save();

        res.status(200).json({
            success: true,
            appointment
        })
        
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al generar la cita',
            error 
        })
    }
    
}

export const getAppointment = async (req, res) => {

    const {limite = 10, desde = 0} = req.query
    const query = {status : true};

    try {
        const appointments = await Appointment.find(query)
        .skip(Number(desde))
        .limit(Number(limite));

        const appointmentsWhithOwnerNames = await Promise.all(appointments.map(async (appointment) => {
        const owner = await User.findById(appointment.keeper);
        return{
                ...appointment.toObject(),
                keeper: owner ? owner.nombre: "Propietario no encontrado"
            }            
        }));

        const total = await Appointment.countDocuments(query);
        res.status(200).json({
            success: true,
            total,
            pats: appointmentsWhithOwnerNames
        })
        
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al Obtener las Citas',
            error
         })
    }
}

export const searchAppointment = async (req, res) => {
    const {id} = req.params;
    try {
        const appointment = await Appointment.findById(id);

        if (!appointment) {
            return res.status(404).json({
                success: false,
                message: 'Cita no encontrada'
            })
         }

         const owner = await User.findById(appointment.keeper);

         res.status(200).json({
            success: true,
            pet: {
                    ...appointment.toObject(),
                    keeper: owner ? owner.nombre : "Propietario no Encontrado"
            }

         })

    
        } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al buscar la cita',
            error
        })
    }
    
}

export const deleteAppointment = async (req, res) => {
    const {id} = req.params;

    try {
        await Appointment.findByIdAndUpdate(id, {status : false});
        res.status(200).json({
            success: true,
            message: "Cita cancelada Exitosamente"
        })
        
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erro al cancelar la Cita'
        })
    }
    
}