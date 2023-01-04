const Course = ({ course }) => (
	<div>
		<Header title={course.name} />
		<Content parts={course.parts} />
		<Total parts={course.parts} />
	</div>
)

const Header = (props) => {
	return (
		<>
			<h1>{props.title}</h1>
		</>
	)
}

const Content = ({ parts }) => {
	return (
		<>
			{parts.map(part => <Part name={part.name} key={part.id} exercises={part.exercises} />)}
		</>
	)
}

const Part = (props) => {
	return (
		<>
			<p>{props.name} {props.exercises}</p>
		</>
	)
}

const Total = ({ parts }) => {
	const exercises = parts.map(part => part.exercises)
	const sum = exercises.reduce((total, current) => total + current)
	return (
		<>
			<p><b>Number of exercises:</b> {sum}</p>
		</>
	)
}

export default Course