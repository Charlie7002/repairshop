import BackButton from '@/components/BackButton'
import { getCustomer } from '@/lib/query/getCustomer'
import React from 'react'
import * as Sentry from '@sentry/nextjs'
import CustomerForm from '@/app/(rs)/customers/form/CustomerForm'

interface SearchParams {
	searchParams: Promise<{ [key: string]: string | undefined }>
}
export async function generateMetadata({ searchParams }: SearchParams) {
	const { customerId } = await searchParams

	if (!customerId) return { title: 'New Customer' }

	return { title: `Edit Customer #${customerId}` }
}

const CustomerFormPage = async ({ searchParams }: SearchParams) => {
	try {
		const { customerId } = await searchParams
		if (customerId) {
			const customer = await getCustomer(Number(customerId))

			if (!customer) {
				return (
					<>
						<h2 className="test-2xl mb-2">
							Customer ID#{customerId} not found
						</h2>
						<BackButton title="Go back" variant="default" />
					</>
				)
			}
			return <CustomerForm customer={customer} />
		} else {
			return <CustomerForm />
		}
	} catch (err) {
		console.error(err)
		if (err) {
			Sentry.captureException(err)
		}
		return <div>Error fetching customer data</div>
	}

	return <div>yooooo</div>
}

export default CustomerFormPage
