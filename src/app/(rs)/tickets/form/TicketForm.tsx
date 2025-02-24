'use client'

import { selectCustomerSchemaType } from '@/zod-schemas/customer'
import {
	insertTicketSchema,
	insertTicketSchemaType,
	selectTicketSchemaType,
} from '@/zod-schemas/tickets'

import { zodResolver } from '@hookform/resolvers/zod'
import { Form, useForm } from 'react-hook-form'

type Props = {
	customer: selectCustomerSchemaType
	ticket?: selectTicketSchemaType
}

const TicketForm = ({ ticket, customer }: Props) => {
	const defaultValues: insertTicketSchemaType = {
		id: ticket?.id ?? '(New)',
		customerId: ticket?.customerId ?? customer.id,
		title: ticket?.title ?? '',
		description: ticket?.description ?? '',
		completed: ticket?.completed ?? false,
		tech: ticket?.tech ?? 'new-ticket@example.com',
	}

	const form = useForm<insertTicketSchemaType>({
		mode: 'onBlur',
		defaultValues,
		resolver: zodResolver(insertTicketSchema),
	})

	async function submitForm(data: insertTicketSchemaType) {
		console.log(data)
	}

	return (
		<div className="flex flex-col gap-1 sm:px-8">
			<div>
				<h2 className="text-2xl font-bold">
					{ticket?.id ? `Edit Ticket # ${ticket.id}` : 'New'} ticket form
				</h2>
			</div>
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(submitForm)}
					className="flex flex-col sm:flex-row gap-4 sm:gap-8"
				>
					<p>{JSON.stringify(form.getValues())}</p>
				</form>
			</Form>
		</div>
	)
}

export default TicketForm
