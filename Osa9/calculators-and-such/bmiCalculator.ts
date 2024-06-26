import { isNotNumber } from "./helper";

export const calculateBmi = (height: number, weight: number): string => {
	const heightInMeters = height / 100;
	const bmi = weight / (heightInMeters ** 2);
	if (bmi < 16) return 'Severely underweight';
	if (16 <= bmi && bmi < 18.5) return 'Underweight';
	if (18.5 <= bmi && bmi < 25) return 'Normal weight';
	if (25 <= bmi && bmi < 30) return 'Overweight';
	else return 'Obese';
};

interface parsedArguments {
	height: number,
	weight: number
}

const parse = (args: Array<string>): parsedArguments => {
	if (isNotNumber(args[2]) || isNotNumber(args[3]) || args.length != 4) throw new Error('Invalid value given! Please input height (cm) and weight (kg).');

	return {
		height: Number(args[2]),
		weight: Number(args[3])
	};
};

try {
	const { height, weight } = parse(process.argv);
	console.log(calculateBmi(height, weight));
} catch (error: unknown) {
	let errorMessage = 'Something bad happened.';
	if (error instanceof Error) {
		errorMessage += ' Error: ' + error.message;
	}
	console.log(errorMessage);
}

