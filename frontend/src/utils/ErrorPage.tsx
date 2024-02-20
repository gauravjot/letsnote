export default function ErrorPage({
	error,
	title = "Err, note is not found.",
}: {
	error: any;
	title?: string;
}) {
	return (
		<div className="p-8">
			<div className="text-xl font-serif">{title}</div>
			<p className="text-sm mt-4 font-mono">
				Response Code: {error.code}
				<br />
				Response Msg&nbsp;: {error.message ? error.message.toString() : "Unknown"}
			</p>
			<p className="mt-8 text-sm underline">
				<a href="/">Go to home</a>
			</p>
		</div>
	);
}
