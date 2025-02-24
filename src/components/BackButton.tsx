'use client'

import { ButtonHTMLAttributes } from 'react'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

type Props = {
	title: string
	className?: string
	onClick?: () => void
	variant?:
		| 'default'
		| 'destructive'
		| 'outline'
		| 'secondary'
		| 'ghost'
		| 'link'
		| null
		| undefined
} & ButtonHTMLAttributes<HTMLButtonElement>

const BackButton = ({ variant, className, title, ...props }: Props) => {
	const router = useRouter()
	return (
		<Button
			variant={variant}
			title={title}
			className={className}
			onClick={() => router.back()}
			{...props}
		>
			{title}
		</Button>
	)
}

export default BackButton
