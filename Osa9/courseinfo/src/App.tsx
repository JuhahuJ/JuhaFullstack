interface CoursePartBase {
  name: string;
  exerciseCount: number;
}

interface CoursePartDescription extends CoursePartBase {
  description: string;
}

interface CoursePartBasic extends CoursePartDescription {
  kind: "basic"
}

interface CoursePartGroup extends CoursePartBase {
  groupProjectCount: number;
  kind: "group"
}

interface CoursePartBackground extends CoursePartDescription {
  backgroundMaterial: string;
  kind: "background"
}

interface CoursePartSpecial extends CoursePartDescription {
  requirements: Array<string>;
  kind: "special"
}

type CoursePart = CoursePartBasic | CoursePartGroup | CoursePartBackground | CoursePartSpecial;

const assertNever = (value: never): never => {
  throw new Error(
    `Unhandled discriminated union member: ${JSON.stringify(value)}`
  );
};

const Header = ({ courseName }: { courseName: string }) => <h1>{courseName}</h1>

const Part = ({ part }: { part: CoursePart }) => {
  switch (part.kind) {
    case "basic": return <div><h4>{part.name} {part.exerciseCount}</h4><i>{part.description}</i></div>;
    case "group": return <div><h4>{part.name} {part.exerciseCount}</h4>project exercises {part.groupProjectCount}</div>;
    case "background": return <div><h4>{part.name} {part.exerciseCount}</h4><i>{part.description}</i><br/>material {part.backgroundMaterial}</div>;
    case "special": return <div><h4>{part.name} {part.exerciseCount}</h4><i>{part.description}</i><br/>required skills: {part.requirements.map((requirement) => <p>{requirement}</p>)}</div>;
    default: return assertNever(part);
  }
}

const Content = ({ courseParts }: { courseParts: CoursePart[] }) => courseParts.map((part) => <Part part={part} />)

const Total = ({ totalExercises }: { totalExercises: number }) => <p>Number of exercises {totalExercises}</p>

const App = () => {
  const courseName = "Half Stack application development";

  const courseParts: CoursePart[] = [
    {
      name: "Fundamentals",
      exerciseCount: 10,
      description: "This is an awesome course part",
      kind: "basic"
    },
    {
      name: "Using props to pass data",
      exerciseCount: 7,
      groupProjectCount: 3,
      kind: "group"
    },
    {
      name: "Basics of type Narrowing",
      exerciseCount: 7,
      description: "How to go from unknown to string",
      kind: "basic"
    },
    {
      name: "Deeper type usage",
      exerciseCount: 14,
      description: "Confusing description",
      backgroundMaterial: "https://type-level-typescript.com/template-literal-types",
      kind: "background"
    },
    {
      name: "TypeScript in frontend",
      exerciseCount: 10,
      description: "a hard part",
      kind: "basic",
    },
    {
      name: "Backend development",
      exerciseCount: 21,
      description: "Typing the backend",
      requirements: ["nodejs", "jest"],
      kind: "special"
    }
  ];

  const totalExercises = courseParts.reduce((sum, part) => sum + part.exerciseCount, 0);

  return (
    <div>
      <Header courseName={courseName} />
      <Content courseParts={courseParts} />
      <Total totalExercises={totalExercises} />
    </div>
  );
};

export default App;