const Header = ({course}) => <h2>{course}</h2>

const Part = ({part, exercises}) => <p>{part} {exercises} </p>

const Content = ({parts}) => {
  return (
    <div>
      {parts.map(part => 
          <p key={part.id}>
            <Part part={part.name} exercises={part.exercises}/>
          </p>       
      )}
    </div>
  )
}

const Total = ({parts}) => {
  const count = parts.reduce( (value, part) => value + part.exercises, 0 )
  return (
    <div>
      <b>total of {count} exercises</b>
    </div>
  )

}

const Course = ({course}) => {
  return (
    <div>
      <Header course={course.name} />
      <Content parts={course.parts} />
      <Total parts={course.parts} />
    </div>
  )

}

export default Course