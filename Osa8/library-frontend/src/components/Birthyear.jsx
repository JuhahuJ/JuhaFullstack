import { useMutation, useQuery } from '@apollo/client'
import { useState } from 'react'
import { EDIT_AUTHOR, ALL_AUTHORS } from '../queries'
import Select from 'react-select'

const SetBirthyear = () => {
	const [born, setBorn] = useState('')
	const [selectedOption, setSelectedOption] = useState(null)

	const [updateAuthor] = useMutation(EDIT_AUTHOR, {
		refetchQueries: [{ query: ALL_AUTHORS }]
	})

	const token = localStorage.getItem('library-user-token')

	const result = useQuery(ALL_AUTHORS)

	let authors

	if (result.loading) {
		return <div>loading...</div>
	} else {
		authors = result.data.allAuthors
	}

	const submit = async (event) => {
		event.preventDefault()

		updateAuthor({ variables: { name: selectedOption.value, born: parseInt(born) } })

		setBorn('')
	}

	const authorOptions = authors.map(author => ({
		value: author.name,
		label: author.name
	}))

	if (!token) return <div>you are not logged in</div>

	return (
		<div>
			<form onSubmit={submit}>
				<div>
					name
					<Select
						defaultValue={selectedOption}
						onChange={setSelectedOption}
						options={authorOptions}
					/>
				</div>
				<div>
					born
					<input
						value={born}
						onChange={({ target }) => setBorn(target.value)}
					/>
				</div>
				<button type="submit">update author</button>
			</form>
		</div>
	)
}

export default SetBirthyear