import { useEffect, useState } from "react";
import { NonSensitiveDiaryEntry, Visibility, Weather } from "./types";
import { createEntry, getAllEntries } from "./diaryService";
import axios from "axios";

const App = () => {
  const [entries, setEntries] = useState<NonSensitiveDiaryEntry[]>([]);
  const [date, setDate] = useState('');
  const [weather, setWeather] = useState(Weather.Sunny);
  const [visibility, setVisibility] = useState(Visibility.Ok);
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    getAllEntries().then(data => {
      setEntries(data);
    }).catch(err => {
      console.error('Error fetching entries', err);
      setError('Error fetching entries');
    });
  }, []);

  const entryCreation = async (event: React.SyntheticEvent) => {
    event.preventDefault();
    try {
      const data = await createEntry({ date, weather, visibility, comment });
      setEntries(entries.concat(data));

      setDate('');
      setWeather(Weather.Sunny);
      setVisibility(Visibility.Ok);
      setComment('');
      setError('');
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        if (err?.response?.data && typeof err?.response?.data === 'string') {
          const message = err.response.data.replace(
            'Something went wrong. ',
            ''
          );
          setError(message);
        } else {
          setError('Unrecognized axios error');
        }
      } else {
        setError('Unknown error');
      }
    }
  };

  return (
    <div>
      <h2>Add new entry</h2>
      {error && <div>{error}</div>}
      <form onSubmit={entryCreation}>
        <div>
          date
          <input 
            type="date" 
            value={date} 
            onChange={({ target }) => setDate(target.value)} 
          />
        </div>
        <div>
          visibility
          {Object.values(Visibility).map(v => (
            <label key={v}>
              <input
                type="radio"
                value={v}
                checked={visibility === v}
                onChange={() => setVisibility(v as Visibility)}
              />
              {v}
            </label>
          ))}
        </div>
        <div>
          weather
          {Object.values(Weather).map(w => (
            <label key={w}>
              <input
                type="radio"
                value={w}
                checked={weather === w}
                onChange={() => setWeather(w as Weather)}
              />
              {w}
            </label>
          ))}
        </div>
        <div>
          comment
          <input 
            type="text"
            value={comment}
            onChange={({ target }) => setComment(target.value)} 
          />
        </div>
        <button type="submit">add</button>
      </form>
      <h2>Diary entries</h2>
      {entries.map(e => (
        <div key={e.id}>
          <h3>{e.date}</h3>
          visibility: {e.visibility}<br />
          weather: {e.weather}
        </div>
      ))}
    </div>
  );
};

export default App;
