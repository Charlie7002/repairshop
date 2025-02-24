import BackButton from '@/components/BackButton'

import { getCustomer } from '@/lib/query/getCustomer'
import { getTicket } from '@/lib/query/getTicket'
import React from 'react'
import * as Sentry from '@sentry/nextjs'
import TicketForm from './TicketForm'

interface SearchParams {
	searchParams: Promise<{ [key: string]: string | undefined }>
}

const TicketFormPage = async ({ searchParams }: SearchParams) => {
	try {
		const { customerId, ticketId } = await searchParams
		if (!customerId && !ticketId) {
			return (
				<>
					<h2 className="test-2xl mb-2">
						Please provide a Customer ID or Ticket ID
					</h2>
					<BackButton title="Go back" variant="default" />
				</>
			)
		}

		//new ticket
		if (customerId && !ticketId) {
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
			if (!customer.active) {
				return (
					<>
						<h2 className="test-2xl mb-2">
							Customer ID#{customerId} is not active.
						</h2>
						<BackButton title="Go back" variant="default" />
					</>
				)
			}

			//return ticket form page with customer details
			return <TicketForm customer={customer} />
		}

		if (ticketId) {
			//existing ticket
			const ticket = await getTicket(Number(ticketId))

			if (!ticket) {
				return (
					<>
						<h2 className="test-2xl mb-2">
							Ticket ID#{customerId} not found
						</h2>
						<BackButton title="Go back" variant="default" />
					</>
				)
			}

			const customer = await getCustomer(ticket.customerId)

			return <TicketForm customer={customer} ticket={ticket} />
		}
	} catch (err) {
		console.error(err)
		if (err) {
			Sentry.captureException(err)
		}
		return <div>Error fetching customer data</div>
	}

	return <div>page</div>
}

export default TicketFormPage
