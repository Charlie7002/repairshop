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
import { useKindeBrowserClient } from '@kinde-oss/kinde-auth-nextjs'
import CheckboxWithLabel from '@/components/inputs/CheckboxWithLabel'
import { useAction } from 'next-safe-action/hooks'
import { saveCustomerAction } from '@/app/actions/saveCustomerAction'
import { toast } from 'sonner'
import { LoaderCircle } from 'lucide-react'
import { DisplayServerActionResponse } from '@/components/DisplayServerActionResponse'

type Props = {
	customer?: selectCustomerSchemaType
}

const CustomerForm = ({ customer }: Props) => {
	const { getPermission, isLoading } = useKindeBrowserClient()
	const isManager = !isLoading && getPermission('manager')?.isGranted

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
		active: customer?.active || true,
	}

	const form = useForm<insertCustomerSchemaType>({
		mode: 'onBlur',
		defaultValues,
		resolver: zodResolver(insertCustomerSchema),
	})

	const {
		execute: executeSave,
		result: saveResult,
		isPending: isSaving,
		reset: resetSaveAction,
	} = useAction(saveCustomerAction, {
		onSuccess: ({ data }) => {
			if (data?.message) {
				toast.success(
					<div>
						<p> Success! 🎉</p>
						{data.message}
					</div>,
				)
			}
		},
		onError: (error) => {
			console.error(error)
			toast.error(
				<div>
					<p> Error </p>Save failed
				</div>,
			)
		},
	})

	async function submitForm(data: insertCustomerSchemaType) {
		executeSave(data)
		resetSaveAction()
	}

	return (
		<div className="flex flex-col gap-1 sm:px-8">
			<DisplayServerActionResponse result={saveResult} />
			<div>
				<h2 className="text-2xl font-bold">
					{customer?.id ? 'Edit' : 'New'} Customer{' '}
					{customer?.id ? `#${customer.id}` : 'Form'}
				</h2>
			</div>
			<FormProvider {...form}>
				<form
					onSubmit={form.handleSubmit(submitForm)}
					className="flex flex-col md:flex-row gap-4 md:gap-8"
				>
					<div className="flex flex-col gap-4 w-full max-w-xs">
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
						<InputWithLabel<insertCustomerSchemaType>
							fieldTitle="City"
							nameInSchema="city"
						/>
						<SelectWithLabel<insertCustomerSchemaType>
							fieldTitle="Department"
							nameInSchema="state"
							data={DepArray}
						/>
					</div>
					<div className="flex flex-col gap-4 w-full max-w-xs">
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

						{isLoading ? (
							<p>Loading...</p>
						) : isManager && customer?.id ? (
							<CheckboxWithLabel<insertCustomerSchemaType>
								fieldTitle="Active"
								nameInSchema="active"
								message="Yes"
							/>
						) : null}

						<div className="flex gap-2 ">
							<Button
								type="submit"
								className="w-40"
								variant="default"
								title="Save"
								size="lg"
								disabled={isSaving}
							>
								{isSaving ? (
									<>
										<LoaderCircle className="animate-spin" /> Saving
									</>
								) : (
									'Save'
								)}
							</Button>
							<Button
								type="button"
								className="w-40"
								variant="destructive"
								title="Reset"
								onClick={() => {
									form.reset(defaultValues)
									resetSaveAction()
								}}
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
