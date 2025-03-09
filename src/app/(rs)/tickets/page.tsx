import { getTicketSearchResults } from '@/lib/query/getTicketSearchResult'
import TicketSearch from './TicketSearch'
import { getOpenTickets } from '@/lib/query/getOpenTickets'
import TicketTable from './TicketTable'

export const metadata = {
	title: 'Tickets',
}

interface SearchParams {
	searchParams: Promise<{ [key: string]: string | undefined }>
}

const Tickets = async ({ searchParams }: SearchParams) => {
	const { searchText } = await searchParams

	if (!searchText) {
		const results = await getOpenTickets()
		return (
			<>
				<TicketSearch />
				{results.length ? (
					<TicketTable data={results} />
				) : (
					<p>No open tickets</p>
				)}
			</>
		)
	}
	const results = await getTicketSearchResults(searchText)

	return (
		<>
			<TicketSearch />
			{results.length ? (
				<TicketTable data={results} />
			) : (
				<p>No tickets found</p>
			)}
		</>
	)
}

export default Tickets
