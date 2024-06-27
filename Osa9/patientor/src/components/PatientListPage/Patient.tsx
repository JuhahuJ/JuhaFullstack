import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Diagnosis, Entry, Patient } from "../../types";
import MaleIcon from '@mui/icons-material/Male';
import FemaleIcon from '@mui/icons-material/Female';
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import patientService from "../../services/patients";
import diagnosisService from "../../services/diagnoses";

const Icon = ({ patient }: { patient: Patient }) => {
  switch (patient.gender) {
    case 'male': return <MaleIcon />;
    case 'female': return <FemaleIcon />;
    case 'other': return <QuestionMarkIcon />;
    default: return <QuestionMarkIcon />;
  }
};

const Entries = ({ entries, diagnoses }: { entries: Entry[], diagnoses: Diagnosis[] }) => {
  return (
    <div>
      {entries.map((e: Entry) => (
        <div key={e.id}>
          <div>{e.date} {e.description}</div>
          {e.diagnosisCodes && (
            <ul>
              {e.diagnosisCodes.map((code: string) => {
                const diagnosis = diagnoses.find(d => d.code === code);
                return (
                  <li key={code}>
                    {code} {diagnosis ? diagnosis.name : 'loading diagnosis'}
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      ))}
    </div>
  );
};

const PatientPage = () => {
  const { id } = useParams<{ id: string }>();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [diagnoses, setDiagnoses] = useState<Diagnosis[]>([]);

  useEffect(() => {
    const fetchPatient = async () => {
      if (id) {
        const fetchedPatient = await patientService.getWithId(id);
        setPatient(fetchedPatient);
      }
    };
    fetchPatient();
  }, [id]);

  useEffect(() => {
    const fetchDiagnoses = async () => {
      const fetchedDiagnoses = await diagnosisService.getAll();
      setDiagnoses(fetchedDiagnoses);
    };
    fetchDiagnoses();
  }, []);

  if (!patient) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>{patient.name} <Icon patient={patient} /></h2>
      ssn: {patient.ssn}<br />
      occupation: {patient.occupation}
      <h3>entries</h3>
      <Entries entries={patient.entries} diagnoses={diagnoses} />
    </div>
  );
};

export default PatientPage;
