import BackButton from '@/components/BackButton'

import { getCustomer } from '@/lib/query/getCustomer'
import { getTicket } from '@/lib/query/getTicket'
import React from 'react'
import * as Sentry from '@sentry/nextjs'
import TicketForm from './TicketForm'

import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server'

import { Users, init as kindeInit } from '@kinde/management-api-js'

export async function generateMetadata({
	searchParams,
}: {
	searchParams: Promise<{ [key: string]: string | undefined }>
}) {
	const { customerId, ticketId } = await searchParams

	if (!customerId && !ticketId)
		return {
			title: 'Missing Ticket ID or Customer ID',
		}

	if (customerId)
		return {
			title: `New Ticket for Customer #${customerId}`,
		}

	if (ticketId)
		return {
			title: `Edit Ticket #${ticketId}`,
		}
}

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
		const { getPermission, getUser } = getKindeServerSession()
		const [managerPermission, user] = await Promise.all([
			getPermission('manager'),
			getUser(),
		])
		console.log('**********')
		console.log(user)
		console.log(managerPermission)
		const isManager = managerPermission?.isGranted

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

			// return ticket form
			if (isManager) {
				kindeInit() // Initializes the Kinde Management API
				const { users } = await Users.getUsers()

				const techs = users
					? users.map((user) => ({
							id: user.email!,
							description: user.email!,
					  }))
					: []

				return <TicketForm customer={customer} techs={techs} />
			} else {
				return <TicketForm customer={customer} />
			}
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

			if (isManager) {
				kindeInit() // Initializes the Kinde Management API
				const { users } = await Users.getUsers()

				const techs = users
					? users.map((user) => ({
							id: user.email!,
							description: user.email!,
					  }))
					: []
				console.log('techs', techs)
				return (
					<TicketForm customer={customer} ticket={ticket} techs={techs} />
				)
			} else {
				const isEditable = user.email === ticket.tech
				return (
					<TicketForm
						customer={customer}
						ticket={ticket}
						isEditable={isEditable}
					/>
				)
			}
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
