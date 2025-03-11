import { Router } from "express";
import { check } from "express-validator";
import { getUsers, getUsersById, updateUser, deleteUser, updatePassword } from "./user.controller.js";
import { existeUsuarioByID } from "../helpers/db-validator.js";
import { validarCampos } from "../middlewares/validar-campos.js";
import { uploadProfilePicture } from "../middlewares/multer-upload.js"
import { validarJWT } from "../middlewares/validar-jwt.js";
import { tieneRole } from "../middlewares/validar-roles.js";

const router = Router();

router.get("/", getUsers);

router.get(
    "/findUser/:id",
    [
        check("id", "No es un ID válido").isMongoId(),
        check("id").custom(existeUsuarioByID),
        validarCampos
    ],
    getUsersById
)

router.put(
    "/:id",
    uploadProfilePicture.single('profilePicture'),
    [
        check("id", "No es un ID válido").isMongoId(),
        check("id").custom(existeUsuarioByID),
        validarCampos
    ],
    updateUser
)

router.delete(
    "/:id",
    [
        validarJWT,
        tieneRole('ADMIN_ROLE', "VENTAS_ROLE"),
        check("id", "No es un ID válido").isMongoId(),
        check("id").custom(existeUsuarioByID),
        validarCampos
    ],
    deleteUser
)

router.put(
    "/updatePassword/:id",
    [
        check("id").custom(existeUsuarioByID),
        validarCampos
    ],
    updatePassword
)

export default router;