import { Gender, NewPatient, NewPatientFields } from './types';

const isString = (text: unknown): text is string => typeof text === 'string' || text instanceof String;

const isNotNumber = (argument: unknown): boolean => isNaN(Number(argument));

const isDate = (date: string): boolean => Boolean(Date.parse(date));

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isGender = (gender: any): gender is Gender => Object.values(Gender).includes(gender);

const parseName = (name: unknown): string => {
	if (!name || !isString(name) || !isNotNumber(name)) {
		throw new Error('Incorrect or missing name:' + name);
	}
	return name;
};

const parseDate = (date: unknown): string => {
	if (!date || !isString(date) || !isDate(date)) {
		throw new Error('Incorrect or missing date: ' + date);
	}
	return date;
};

const parseSSN = (ssn: unknown): string => {
	if (!ssn || !isString(ssn)) {
		throw new Error('Incorrect or missing SSN:' + ssn);
	}
	return ssn;
};


const parseGender = (gender: unknown): Gender => {
	if (!gender || !isGender(gender)) {
		throw new Error('Incorrect or missing Gender:' + gender);
	}
	return gender;
};

const parseOccupation = (occupation: unknown): string => {
	if (!occupation || !isString(occupation)) {
		throw new Error('Incorrect or missing occupation:' + occupation);
	}
	return occupation;
};

const toNewPatient = ({ name, dateOfBirth, ssn, gender, occupation }: NewPatientFields): NewPatient => {
	const newPatient: NewPatient = {
		name: parseName(name),
		dateOfBirth: parseDate(dateOfBirth),
		ssn: parseSSN(ssn),
		gender: parseGender(gender),
		occupation: parseOccupation(occupation)
	};

	return newPatient;
};

export default toNewPatient;