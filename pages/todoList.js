import React, { useState } from 'react';
import gql from 'graphql-tag';
import { useQuery, useMutation } from '@apollo/client';
import { initializeApollo } from '../apollo/client';

import {
	Button,
	Container,
	Grid,
	IconButton,
	List,
	ListItem,
	ListItemIcon,
	ListItemText,
	Snackbar,
	TextField,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CheckIcon from '@mui/icons-material/Check';

const GET_TODO = gql`
	query ReadList {
		readList {
			id
			content
			completed
		}
	}
`;

const ADD_TODO = gql`
	mutation CreateList($content: String) {
		createList(content: $content) {
			success
		}
	}
`;

const DELETE_TODO = gql`
	mutation DeleteList($id: String) {
		deleteList(id: $id) {
			success
		}
	}
`;

const UPDATE_TODO = gql`
	mutation UpdateList($id: String, $completed: Boolean) {
		updateList(id: $id, completed: $completed) {
			success
		}
	}
`;

const TipMessage = ({ showTip, setShowTip }) => {
	return (
		<Snackbar
			open={showTip.isShow}
			autoHideDuration={3000}
			onClose={() => setShowTip({ isShow: false, msg: '' })}
			message={showTip.msg}
		/>
	);
};

const TodoList = () => {
	const [content, setContent] = useState('');

	const { data, refetch } = useQuery(GET_TODO);

	const [createList] = useMutation(ADD_TODO);
	const [deleteList] = useMutation(DELETE_TODO);
	const [updateList] = useMutation(UPDATE_TODO);

	const [showTip, setShowTip] = useState({ isShow: false, msg: '' });

	const addTodo = async () => {
		const result = await createList({ variables: { content } });
		if (result?.data?.createList?.success) {
			setContent('');
			refetch();
			setShowTip({ isShow: true, msg: 'Add todo success!' });
		} else {
			setShowTip({ isShow: true, msg: 'Add todo failed!' });
		}
	};

	const deleteTodo = (id) => async () => {
		const result = await deleteList({ variables: { id } });
		if (result?.data?.deleteList?.success) {
			refetch();
			setShowTip({ isShow: true, msg: 'Delete todo success!' });
		} else {
			setShowTip({ isShow: true, msg: 'Delete todo failed!' });
		}
	};

	const updateTodo = (id, completed) => async () => {
		const result = await updateList({ variables: { id, completed } });
		if (result?.data?.updateList?.success) {
			refetch();
			setShowTip({ isShow: true, msg: 'Update todo success!' });
		} else {
			setShowTip({ isShow: true, msg: 'Update todo failed!' });
		}
	};

	return (
		<Container maxWidth="sm" style={{ marginTop: '20px' }}>
			<Grid item align="center">
				<List
					subheader={<span style={{ color: '#80d8f7', marginBottom: '20px' }}>Todo List</span>}
					style={{ textAlign: 'left', fontWeight: 900 }}
				>
					{data?.readList?.map((item) => {
						return (
							<div key={`${item.id}`}>
								<ListItem
									divider={true}
									secondaryAction={
										<IconButton edge="end" onClick={deleteTodo(item.id)}>
											<CloseIcon />
										</IconButton>
									}
								>
									<ListItemIcon style={{ color: item.completed ? '#eb3426' : '#80d8f7' }}>
										<CheckIcon />
									</ListItemIcon>
									<ListItemText
										primary={item.content}
										style={{
											color: item.completed ? '#eb3426' : '#80d8f7',
											textDecoration: item.completed ? 'line-through' : 'none',
											cursor: 'pointer',
										}}
										onClick={updateTodo(item.id, !item.completed)}
									/>
								</ListItem>
							</div>
						);
					})}
				</List>

				<br />
				<div
					style={{
						display: 'flex',
						verticalAlign: 'middle',
						justifyContent: 'space-around',
						margin: '0 50px',
					}}
				>
					<TextField
						fullWidth
						id="add-todo"
						size="small"
						label="Add a new todo ..."
						variant="outlined"
						value={content}
						onChange={(e) => setContent(e.target.value)}
					/>
					<Button size="large" variant="contained" disabled={!content} onClick={addTodo}>
						Add
					</Button>
				</div>
			</Grid>
			<TipMessage showTip={showTip} setShowTip={setShowTip} />
		</Container>
	);
};

export async function getStaticProps() {
	const apolloClient = initializeApollo();

	// await apolloClient.query({
	// 	query: GET_TODO,
	// });

	return {
		props: {
			initialApolloState: apolloClient.cache.extract(),
		},
	};
}

export default TodoList;
