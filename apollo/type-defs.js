import { gql } from '@apollo/client';

export const typeDefs = gql`
	type GetListResult {
		id: String
		content: String
		completed: Boolean
	}

	type SetListResult {
		success: Boolean
	}

	type Query {
		readList: [GetListResult]
	}

	type Mutation {
		createList(content: String): SetListResult
		updateList(id: String, completed: Boolean): SetListResult
		deleteList(id: String): SetListResult
	}
`;
