'use client'

import {
	insertCustomerSchema,
	insertCustomerSchemaType,
	selectCustomerSchemaType,
} from '@/zod-schemas/customer'

import { zodResolver } from '@hookform/resolvers/zod'
import { Form, useForm } from 'react-hook-form'

type Props = {
	customer?: selectCustomerSchemaType
}

const CustomerForm = ({ customer }: Props) => {
	const defaultValues: insertCustomerSchemaType = {
		id: customer?.id || 0,
		firstName: customer?.firstName || '',
		lastName: customer?.lastName || '',
		address1: customer?.address1 || '',
		address2: customer?.address2 || '',
		city: customer?.city || '',
		state: customer?.state || '',
		zip: customer?.zip || '',
		email: customer?.email || '',
		phone: customer?.phone || '',
		notes: customer?.notes || '',
	}

	const form = useForm<insertCustomerSchemaType>({
		mode: 'onBlur',
		defaultValues,
		resolver: zodResolver(insertCustomerSchema),
	})

	async function submitForm(data: insertCustomerSchemaType) {
		console.log(data)
	}

	return (
		<div className="flex flex-col gap-1 sm:px-8">
			<div>
				<h2 className="text-2xl font-bold">
					{customer?.id ? 'Edit' : 'New'} Customer form
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

export default CustomerForm
