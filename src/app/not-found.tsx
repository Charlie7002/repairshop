import Image from 'next/image'

export const metadata = {
	title: 'Page Not Found',
	description: 'Page not found',
}

export default function NotFound() {
	return (
		<div>
			<div className="px-2 w-full">
				<Image
					src="/images/notfound.webp"
					alt="Page not found"
					fill
					priority
					style={{ objectFit: 'cover' }}
				/>
			</div>
		</div>
	)
}
