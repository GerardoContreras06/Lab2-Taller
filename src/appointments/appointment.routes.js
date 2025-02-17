import { Router } from "express";
import { check } from "express-validator";
import { deleteAppointment, getAppointment, saveAppointment, searchAppointment } from "./appointment.controller.js";
import { validarCampos } from "../middlewares/validar-campos.js";
import { validarJWT } from "../middlewares/validar-jwt.js";

const router = Router();

router.post(
    "/",
    [
        validarJWT,
        check('email', 'Este no es un correo valido').not().isEmpty(),
        validarCampos
    ],
    saveAppointment
)

router.get("/", getAppointment)

router.get(
    "/:id",
    [
        validarJWT,
        check("id", "No es un id valido para buscar la cita").isMongoId(),
        validarCampos
    ],
    searchAppointment
)

router.delete(
    "/:id",
    [
        validarJWT,
        check("id", "No es un id valido").isMongoId(),
    ],
    deleteAppointment


)

export default router;