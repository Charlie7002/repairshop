import { getCustomerSearchResult } from '@/lib/query/getCustomerSearchResult'
import CustomerSearch from './CustomerSearch'
import CustomerTable from './CustomerTable'

export const metadata = {
	title: 'Customers',
}

interface SearchParams {
	searchParams: Promise<{ [key: string]: string | undefined }>
}

const Customers = async ({ searchParams }: SearchParams) => {
	const { searchText } = await searchParams

	if (!searchText) return <CustomerSearch />
	const results = await getCustomerSearchResult(searchText)
	return (
		<>
			<CustomerSearch />
			{results.length ? (
				<CustomerTable data={results} />
			) : (
				<p>No results found</p>
			)}
		</>
	)
}

export default Customers
