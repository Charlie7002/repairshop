import Link from 'next/link'

// import { Button } from '@/components/ui/button'

export default function Home() {
	return (
		<div className="bg-black bg-[url('/images/home-i.jpg')] bg-cover bg-center">
			<main className="flex flex-col justify-center text-center max-w-5xl mx-auto h-dvh">
				<div className="flex flex-col gap-6 p-12 rounded-xl bg-black/90 w-4/5 sm:max-w-96 mx-auto text-white sm:text-2xl">
					<h1>
						Cha&apos;s computer <br /> Repair Shop
					</h1>
					<address>555 rue de la matrice Labas city, 01001</address>
					<p>Open Daily : 9:00 AM &bull; 5:00 PM</p>
					<Link href="tel:5555555555" className="hover:underline">
						+33 01 01 01 01 01
					</Link>
				</div>
			</main>
		</div>
	)
}
