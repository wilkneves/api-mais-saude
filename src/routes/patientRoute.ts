import { Router } from 'express';
import * as Patient from '../controllers/patientController';

const router = Router();

router.route('/patients')
    .post(Patient.createPatient)
    .get(Patient.getAllPatients);
router.route('/:cpf')
    .get(Patient.getPatientByCpf)
    .delete(Patient.deletePatient);
router.put('/', Patient.updatePhone);

router.patch('/:cpf/birthdate', Patient.updateBirthDate);

export default router;