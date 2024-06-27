export interface Diagnosis {
	code: string,
	name: string,
	latin?: string
}

interface BaseEntry {
	id: string;
	description: string;
	date: string;
	specialist: string;

	diagnosisCodes?: Array<Diagnosis['code']>;
}

export type Entry =
	| HospitalEntry
	| OccupationalHealthcareEntry
	| HealthCheckEntry;

export enum HealthCheckRating {
	"Healthy" = 0,
	"LowRisk" = 1,
	"HighRisk" = 2,
	"CriticalRisk" = 3
}

interface HealthCheckEntry extends BaseEntry {
	type: "HealthCheck";
	healthCheckRating: HealthCheckRating;
}

interface OccupationalHealthcareEntry extends BaseEntry {
	type: "OccupationalHealthcare";
	employerName: string
	sickLeave?: SickLeave
}

interface HospitalEntry extends BaseEntry {
	type: "Hospital";
	discharge: Discharge
}

export interface SickLeave {
	startDate: string
	endDate: string
}

export interface Discharge {
  date: string
  criteria: string
}

export interface Patient {
	id: string,
	name: string,
	dateOfBirth: string,
	ssn: string,
	gender: Gender,
	occupation: string
	entries: Entry[]
}

export interface NewPatientFields {
	id: unknown,
	name: unknown,
	dateOfBirth: unknown,
	ssn: unknown,
	gender: unknown,
	occupation: unknown,
	entries: unknown
}

export enum Gender {
	Male = 'male',
	Female = 'female',
	Other = 'other'
}

export type NonSensitivePatient = Omit<Patient, 'ssn' | 'entries'>;

export type NewPatient = Omit<Patient, 'id'>;