import { RunResult } from "sqlite3";
import db from "../database";

export interface Patient {
    id: number;
    name: string;
    birthDate: string;
    phoneNumber: string;
    cpf: string;
    rg: string;
    susCard: string,
    neighborhood: string;
    street: string;
    houseNumber: number;
    city: string | null; 
    state: string | null; 
}

type Callback<T> = (err: Error | null, result?: T) => void;

export const addPatient = (patientData: Omit<Patient, 'id'>, callback: Callback<{ id: number}>) => {
    const {name, birthDate, phoneNumber, cpf, rg, neighborhood, street, houseNumber, city, state} = patientData;
    const sql = `INSERT INTO patient (name, birthDate, phoneNumber, cpf, rg, neighborhood, street, houseNumber, city, state)
    VALUES
    (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    db.run(sql, [name, birthDate, phoneNumber, cpf, rg, neighborhood, street, houseNumber, city, state], function(this: RunResult, err) {
        if (err) {
            callback(err);
        } else {
            callback(null, {id: this.lastID});
        }
    });
};

export const getAllPatients = (callback: Callback<Patient[]>) => {
    const sql = `SELECT * FROM patient`;
    db.all(sql, [], (err, rows: Patient[]) =>  {
        if(err) {
            callback(err);
        } else {
            callback(null, rows);
        }
    });
};

export const getPatientByCpf = (cpf: string, callback: Callback<Patient | undefined>) => {
    const sql = `SELECT * FROM patient WHERE cpf = ?`;
    db.get(sql, [cpf], (err, row: Patient) => {
        if (err) {
            callback(err);
        } else {
            callback(null, row);
        }
    });
};


export const updatePhone = (cpf: string, newPhone: string, callback: Callback<{ changes: number }>) => {
    const sql = `UPDATE patient SET phoneNumber = ? WHERE cpf = ?`;

    db.run(sql, [newPhone, cpf], function(this: RunResult, err) {
        if (err) {
            callback(err);
        } else {
            callback(null,{ changes: this.changes });
        }
    });
};

export const updateBirthDate = (cpf: string, newDate: Date, callback: Callback<{ changes: number }>) => {
    const sql = `UPDATE patient SET birthDate = ? WHERE cpf = ?`;

    const formattedDate = newDate.toISOString().split('T')[0];
    db.run(sql, [formattedDate, cpf], function(this: RunResult, err) {
        if (err) {
            callback(err);
        } else {
            callback(null, { changes: this.changes });
        }
    });
};

export const deletePatient = (cpf: string, callback: Callback<{ changes: number }>) => {
    const sql = `DELETE FROM patient WHERE cpf = ?`;

    db.run(sql, [cpf], function(this: RunResult, err) {
        if (err) {
            callback(err);
        } else {
            callback(null, { changes: this.changes });
        }
    });
};