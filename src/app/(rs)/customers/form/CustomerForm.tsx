'use client'

import InputWithLabel from '@/components/inputs/InputWithLabel'
import SelectWithLabel from '@/components/inputs/SelectWithLabel'
import TextAreaWithLabel from '@/components/inputs/TextAreaWithLael'
import { Button } from '@/components/ui/button'
import { DepArray } from '@/constants/DepArray'
import {
	insertCustomerSchema,
	insertCustomerSchemaType,
	selectCustomerSchemaType,
} from '@/zod-schemas/customer'

import { zodResolver } from '@hookform/resolvers/zod'
import { FormProvider, useForm } from 'react-hook-form'

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
			<FormProvider {...form}>
				<form
					onSubmit={form.handleSubmit(submitForm)}
					className="flex flex-col md:flex-row gap-4 md:gap-8"
				>
					<div className="flex flex-col gap-" w-full max-w-xs>
						<InputWithLabel<insertCustomerSchemaType>
							fieldTitle="FirstName"
							nameInSchema="firstName"
						/>
						<InputWithLabel<insertCustomerSchemaType>
							fieldTitle="Last Name"
							nameInSchema="lastName"
						/>

						<InputWithLabel<insertCustomerSchemaType>
							fieldTitle="Address 1"
							nameInSchema="address1"
						/>

						<InputWithLabel<insertCustomerSchemaType>
							fieldTitle="Address 2"
							nameInSchema="address2"
						/>
					</div>
					<div className="flex flex-col gap-4" w-full max-w-xs>
						<InputWithLabel<insertCustomerSchemaType>
							fieldTitle="City"
							nameInSchema="city"
						/>
						<InputWithLabel<insertCustomerSchemaType>
							fieldTitle="Zip Code"
							nameInSchema="zip"
						/>
						<InputWithLabel<insertCustomerSchemaType>
							fieldTitle="Phone"
							nameInSchema="phone"
						/>
						<InputWithLabel<insertCustomerSchemaType>
							fieldTitle="Email"
							nameInSchema="email"
						/>

						<TextAreaWithLabel<insertCustomerSchemaType>
							fieldTitle="Notes"
							nameInSchema="notes"
							rows={3}
							maxLength={2000}
							placeholder="Add any additional notes here"
							className="h-40"
						/>

						<div className="flex gap-2 ">
							<Button
								type="submit"
								className="w-40"
								variant="default"
								title="Save"
								size="lg"
							>
								Save
							</Button>
							<Button
								type="button"
								className="w-40"
								variant="destructive"
								title="Reset"
								onClick={() => form.reset(defaultValues)}
							>
								Reset
							</Button>
						</div>
					</div>
				</form>
			</FormProvider>
		</div>
	)
}

export default CustomerForm
