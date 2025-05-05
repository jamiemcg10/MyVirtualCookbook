import clsx from 'clsx'

export default function Logo(props: { small?: boolean }) {
	return (
		<h1
			className={clsx(
				'flex flex-wrap justify-center text-[#ffd966] tracking-[.5px]',
				props.small ? 'text-3xl' : 'text-6xl'
			)}
			style={{ wordSpacing: -16 }}>
			<span className="text-white">My </span>
			<span>Virtual</span> <span>Cookbook</span>
		</h1>
	)
}
