import { isNotNumber } from "./helper";

interface result {
	periodLength: number;
	trainingDays: number;
	success: boolean;
	rating: number;
	ratingDescription: string;
	target: number;
	average: number;
}

interface parsedArguments {
	hours: Array<number>,
	target: number
}

export const calculateExercises = (target: number, hours: Array<number>): result => {
	const average = hours.reduce((a, c) => a + c) / hours.length;
	let rating, ratingDescription;
	if (target - average < 1 && target - average > 0) rating = 2, ratingDescription = 'almost there!';
	if (target - average < 0) rating = 3, ratingDescription = 'great job!';
	else rating = 1, ratingDescription = 'a ways away!';
	return {
		periodLength: hours.length,
		trainingDays: hours.filter((hour) => hour > 0).length,
		success: (average > target),
		rating: rating,
		ratingDescription: ratingDescription,
		target: target,
		average: average,
	};
};
const parse = (args: Array<string>): parsedArguments => {
	if (args.length < 4) throw new Error('Please give enough values! The first value should be the target and the rest should be hours exercised per day.');
	args.forEach(element => {
		if (isNotNumber(element)) throw new Error('All values given must be positive numbers!');
	});
	const asNumbers = args.map(Number);
	return {
		hours: asNumbers.slice(1),
		target: asNumbers[0]
	};
};

try {
	const { hours, target } = parse(process.argv.slice(2));
	console.log(hours);
	console.log(target);
	console.log(calculateExercises(target, hours));
} catch (error: unknown) {
	let errorMessage = 'Something bad happened.';
	if (error instanceof Error) {
		errorMessage += ' Error: ' + error.message;
	}
	console.log(errorMessage);
}