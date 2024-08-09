const Course = ({ course }) => {
	return (
		<div>
			<Header course={course.name} />
			<Content parts={course.parts} />
			<Total parts={course.parts} />
		</div>
	)
}

const Header = ({ course }) => {
	return (<h2>{course}</h2>)
}

const Content = ({ parts }) => {
	return (
		<>
			{parts.map(part => <Part key={part.id} part={part} />)}
		</>
	)
}

const Part = ({ part }) => {
	return (<p>{part.name} {part.exercises}</p>)
}

const Total = ({ parts }) => {
	const total = parts.map(p => p.exercises).reduce((total, curr) => total + curr)
	return (<p><b>Number of exercises {total}</b></p>)
}

export default Course