const todoListData = [];

export const resolvers = {
	Query: {
		readList: (_parent, _args, _context, _info) => {
			return todoListData;
		},
	},
	Mutation: {
		createList: (_parent, _args, _context, _info) => {
			const { content } = _args;
			todoListData.push({ id: new Date().valueOf().toString(), content, completed: false });
			return {
				success: true,
			};
		},
		updateList: (_parent, _args, _context, _info) => {
			const { id, completed } = _args;
			const editIdx = todoListData.findIndex((item) => item.id === id);
			todoListData[editIdx].completed = completed;
			return {
				success: true,
			};
		},
		deleteList: (_parent, _args, _context, _info) => {
			const { id } = _args;
			const rmIdx = todoListData.findIndex((item) => item.id === id);
			todoListData.splice(rmIdx, 1);
			return {
				success: true,
			};
		},
	},
};
