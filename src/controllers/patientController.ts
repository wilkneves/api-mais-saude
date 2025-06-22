import {Request, Response} from 'express';
import * as Patient from '../modules/patientModule'; // Importando nosso "Almoxarife"
import { error } from 'console';

export const createPatient = (req: Request, res: Response): void => {
    const newPatientData: Omit<Patient.Patient, 'id'> = req.body;

    if (!newPatientData || !newPatientData.name || !newPatientData.birthDate || !newPatientData.phoneNumber || !newPatientData.cpf || !newPatientData.rg || newPatientData.susCard || !newPatientData.neighborhood || !newPatientData.street || !newPatientData.houseNumber || !newPatientData.city || !newPatientData.state ){
        res.status(400).json({ message: "Todos os dados obrigatórios"});
    }
    Patient.addPatient(newPatientData, (err, result) => {
        if (err) {
            if (err.message.includes('UNIQUE constraint failed')) {
                return res.status(409).json({ message: 'O CPF já está cadastrado.'});
            }
        return res.status(500).json({ message: "Erro ao criar paciente.", error: err.message});
        }
    return res.status(201).json({message: "Paciente criado com sucesso!", patientId: result?.id});
    });
};

export const getAllPatients = (req: Request, res: Response): void => {
    Patient.getAllPatients((err, patients) => {
        if (err) {
            return res.status(500).json({ message: "Erro ao listar paciente.", error: err.message});
        }
        return res.status(200).json(patients);
    });
}

export const getPatientByCpf = (req: Request, res: Response): void => {
    const cpf = req.params.cpf;

    Patient.getPatientByCpf(cpf, (err, patient) => {
        if (err) {
            return res.status(500).json({ error: "Erro interno do servidor", message: err.message });
        }

        if (!patient) {
            return res.status(404).json({ message: `Paciente com CPF ${cpf} não encontrado.` });
        }
        return res.status(200).json(patient);
    });
};

export const updateBirthDate = (req: Request, res: Response): void => {
    const { cpf } = req.body;
    const { birthDate } = req.body;

    if (!birthDate) {
        res.status(400).json({ message: "O campo 'data de nascimento' é obrigatório."});
    } 

    Patient.updateBirthDate(cpf, birthDate, (err, result) => {
        if(err) {
            return res.status(500).json({ message: "Erro ao atualizar data de nascimento", error: err.message})
        } if (result?.changes === 0) {
            return res.status(404).json({ message: "Paciente não encontrado."})
        } 
        return res.status(200).json({ message: "Data de nascimento atualizada com sucesso."})
    })
}

export const updatePhone = (req: Request, res: Response): void => {
    const { cpf } = req.params;
    const { phone } = req.params;

    if(!phone) {
        res.status(400).json({ message: "O campo 'phone' é obrigatório."});
    }
    Patient.updatePhone(cpf, phone, (err, result) => {
        if (err) {
            return res.status(500).json({ message: "Erro ao atualizar telefone.", error: err.message});
        }
        if (result?.changes === 0) {
            return res.status(404).json({message: "Paciente não encontrado."})
        }
        return res.status(200).json({ message: "Telefone atualizado com sucesso."})
    });
};

export const deletePatient = (req: Request, res: Response): void => {
    const { cpf } = req.params;
    Patient.deletePatient(cpf, (err, result) => {
    if (err) {
        return res.status(500).json({ message: "Erro ao deletar paciente: ", error: err.message}); 
    }
    if (result?.changes === 0) {
        return res.status(404).json({ message: "Paciente não encontrado."});
    }
    res.status(200).json({message: "Paciente deletado com sucesso."});
    });
};