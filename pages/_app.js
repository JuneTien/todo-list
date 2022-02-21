import { ApolloProvider } from '@apollo/client';
import { useApollo } from '../apollo/client';

import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
	const apollo = useApollo(pageProps.initialApolloState);

	return (
		<ApolloProvider client={apollo}>
			<Component {...pageProps} />
		</ApolloProvider>
	);
}

export default MyApp;
