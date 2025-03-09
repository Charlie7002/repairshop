'use client'

import { selectCustomerSchemaType } from '@/zod-schemas/customer'
import {
	insertTicketSchema,
	insertTicketSchemaType,
	selectTicketSchemaType,
} from '@/zod-schemas/tickets'

import InputWithLabel from '@/components/inputs/InputWithLabel'

import TextAreaWithLabel from '@/components/inputs/TextAreaWithLael'

import { zodResolver } from '@hookform/resolvers/zod'
import { FormProvider, useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import CheckboxWithLabel from '@/components/inputs/CheckboxWithLabel'
import SelectWithLabel from '@/components/inputs/SelectWithLabel'

import { useAction } from 'next-safe-action/hooks'

import { toast } from 'sonner'
import { LoaderCircle } from 'lucide-react'
import { DisplayServerActionResponse } from '@/components/DisplayServerActionResponse'
import { saveTicketAction } from '@/app/actions/saveTicketActions='

type Props = {
	customer: selectCustomerSchemaType
	ticket?: selectTicketSchemaType
	techs?: {
		id: string
		description: string
	}[]
	isEditable?: boolean
}

const TicketForm = ({ ticket, customer, techs, isEditable = true }: Props) => {
	const isManager = Array.isArray(techs)

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

	const {
		execute: executeSave,
		result: saveResult,
		isPending: isSaving,
		reset: resetSaveAction,
	} = useAction(saveTicketAction, {
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

	async function submitForm(data: insertTicketSchemaType) {
		executeSave(data)
	}

	return (
		<div className="flex flex-col gap-1 sm:px-8">
			<DisplayServerActionResponse result={saveResult} />
			<div>
				<h2 className="text-2xl font-bold">
					{ticket?.id && isEditable
						? `Edit Ticket # ${ticket.id}`
						: ticket?.id
						? `View Ticket # ${ticket.id}`
						: 'New Ticket Form'}
				</h2>
			</div>
			<FormProvider {...form}>
				<form
					onSubmit={form.handleSubmit(submitForm)}
					className="flex flex-col md:flex-row gap-4 md:gap-8"
				>
					<div className="flex flex-col gap-4 w-full max-w-xs">
						<InputWithLabel<insertTicketSchemaType>
							fieldTitle="Title"
							nameInSchema="title"
							disabled={!isEditable}
						/>
						{isManager ? (
							<SelectWithLabel<insertTicketSchemaType>
								fieldTitle="Techs"
								nameInSchema="tech"
								data={[
									{
										id: 'new-ticket@example.com',
										description: 'new-ticket@example.com',
									},
									...techs,
								]}
							/>
						) : (
							<InputWithLabel<insertTicketSchemaType>
								fieldTitle="Tech"
								nameInSchema="tech"
								disabled={true}
							/>
						)}
						{ticket?.id && (
							<CheckboxWithLabel<insertTicketSchemaType>
								fieldTitle="Completed"
								nameInSchema="completed"
								message="Yes"
								disabled={!isEditable}
							/>
						)}

						<div className="mt-4 space-y-2">
							<h3 className="text-lg">Customer Info</h3>
							<hr className="w-4/5" />
							<p>
								{customer.firstName} {customer.lastName}
							</p>
							<p>{customer.address1}</p>
							{customer.address2 ? <p>{customer.address2}</p> : null}
							<p>
								{customer.city}, {customer.state} {customer.zip}
							</p>
							<hr className="w-4/5" />
							<p>{customer.email}</p>
							<p>Phone: {customer.phone}</p>
						</div>
					</div>

					<div className="flex flex-col gap-4 w-full max-w-xs">
						<TextAreaWithLabel<insertTicketSchemaType>
							fieldTitle="Description"
							nameInSchema="description"
							className="h-96"
						/>
						{isEditable && (
							<div className="flex gap-2">
								<Button
									type="submit"
									className="w-3/4"
									variant="default"
									title="Save"
								>
									{isSaving ? (
										<>
											<LoaderCircle className="animate-spin" />{' '}
											Saving
										</>
									) : (
										'Save'
									)}
								</Button>

								<Button
									type="button"
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
						)}
					</div>
				</form>
			</FormProvider>
		</div>
	)
}

export default TicketForm
