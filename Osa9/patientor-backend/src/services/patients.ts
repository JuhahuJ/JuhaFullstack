import patients from '../../data/patients';
import { NewPatient, NonSensitivePatient, Patient } from '../types';
import { v1 as uuid } from 'uuid';

const getPatients = (): NonSensitivePatient[] => {
	return patients.map(({ id, name, dateOfBirth, gender, occupation }) => ({
		id,
		name,
		dateOfBirth,
		gender,
		occupation
	}));
};

const addPatient = (patient: NewPatient): Patient => {
	const newPatient = {
		id: uuid(),
		...patient,
		entries: []
	};

	patients.push(newPatient);
	return newPatient;
};

const findById = (id: string): Patient | undefined => {
	const patient = patients.find(p => p.id === id);
	return patient;
  }

export default {
	getPatients,
	addPatient,
	findById
};