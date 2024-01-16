export default function ErrorPage({ error }: { error: any }) {
	return (
		<div className="p-8">
			<div className="text-xl font-serif">Err, note is not found.</div>
			<p className="text-sm mt-4 font-mono">
				Response Code: {error.code}
				<br />
				Response Msg&nbsp;: {error.message.toString()}
			</p>
			<p className="mt-8 text-sm underline">
				<a href="/">Go to home</a>
			</p>
		</div>
	);
}
