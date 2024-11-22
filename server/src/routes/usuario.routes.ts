import { Router } from 'express';
import {
    getUsuarios,
    getUsuario,
    postUsuario,
    updateUsuario,
    deleteUsuario,

} from '../controllers/usuario.controller'; // Ajusta el path si es necesario

const router = Router();

router.get('/', getUsuarios);
router.get('/:id', getUsuario);
router.post('/', postUsuario);
router.put('/:id', updateUsuario);
router.delete('/:id', deleteUsuario);


export default router;
