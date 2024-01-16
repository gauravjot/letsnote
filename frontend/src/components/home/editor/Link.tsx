export default function Link({ element, attributes, children }: any) {
	return (
		<a href={element.url} {...attributes} className={"link"}>
			{children}
		</a>
	);
}
