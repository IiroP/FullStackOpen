const Notification = ({ status, error }) => {
	if (error !== '') {
		return (
			<div className='error message'>
				{error}
			</div>
		)
	} else if (status !== '') {
		return (
			<div className='message'>
				{status}
			</div>
		)
	}
}

export default Notification