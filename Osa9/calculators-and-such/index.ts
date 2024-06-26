import express from 'express';
import { calculateBmi } from './bmiCalculator';
import { isNotNumber } from './helper';
import { calculateExercises } from './exerciseCalculator';
const app = express();

app.use(express.json());

app.get('/hello', (_req, res) => {
	res.send('Hello Full Stack!');
});

app.get('/bmi', (req, res) => {
	if (!req.query.height || !req.query.weight || isNotNumber(req.query.height) || isNotNumber(req.query.weight)) {
		res.status(400).json({ error: 'malformatted parameters' });
	} else {
		const bmi = calculateBmi(Number(req.query.height), Number(req.query.weight));
		res.json({
			weight: Number(req.query.height),
			height: Number(req.query.weight),
			bmi: bmi
		});
	}
});

app.post('/exercises', (req, res) => {
    const daily_exercises: Array<number> = req.body.daily_exercises;
    const target = Number(req.body.target);


    if (!daily_exercises || !target) {
        res.status(400).json({ error: 'parameters missing'});
    }

    if(!Array.isArray(daily_exercises)) {
        res.status(400).json({ error: 'malformatted parameters'});
    }

	daily_exercises.forEach(element => {
		if (isNotNumber(element)) res.status(400).json({ error: 'malformatted parameters'});
	});

    const result = calculateExercises(target, daily_exercises);
    res.status(200).json(result);
});


const PORT = 3003;

app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});