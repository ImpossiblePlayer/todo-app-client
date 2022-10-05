import React, { useEffect, useState } from 'react';
import { Routes, Route, Link } from 'react-router-dom';

import {
	NewTaskContainer,
	CompletedTaskContainer,
	FailedTasksContainer,
} from './components/TaskContainers';

const App = () => {
	const [newTasks, setNewTasks] = useState([]);
	const [completedTasks, setCompletedTasks] = useState([]);
	const [failedTasks, setFailedTasks] = useState([]);
	const [newInput, setNewInput] = useState('');
	const [newDate, setNewDate] = useState(
		new Date().toISOString().split('T')[0]
	);

	const funcs = {
		getLatestTasks: () => {
			fetch('/api/gettasks/', {
				headers: {
					'Content-Type': 'application/json',
				},
			})
				.then((res) => {
					if (res.ok) {
						return res.json();
					}
				})
				.then((data) => {
					setNewTasks(
						data.new_tasks.sort((a, b) => {
							return new Date(a.date) - new Date(b.date);
						})
					);
					setCompletedTasks(
						data.completed_tasks.sort((a, b) => {
							return new Date(a.date) - new Date(b.date);
						})
					);
					setFailedTasks(
						data.failed_tasks.sort((a, b) => {
							return new Date(a.date) - new Date(b.date);
						})
					);
				});
		},

		// функция для создания нового задания
		setTask: () => {
			fetch('/api/createtask/', {
				method: 'POST',
				body: JSON.stringify({
					content: newInput,
					date: newDate,
				}),
				headers: {
					'Content-type': 'application/json; charset=UTF-8',
				},
			})
				.then((res) => res.json())
				.then(() => {
					setNewInput('');
					setNewDate(new Date().toISOString().split('T')[0]);
					funcs.getLatestTasks();
				});
		},

		// функция для удаления задания
		deleteTask: (id, taskList) => {
			fetch(`/api/deletetask/`, {
				method: 'POST',
				body: JSON.stringify({
					taskList: taskList,
					id: id,
				}),
				headers: {
					'Content-type': 'application/json; charset=UTF-8',
				},
			})
				.then((res) => res.json())
				.then(() => funcs.getLatestTasks());
		},

		moveTask: (id, from, to) => {
			fetch(`/api/move/${from}-${to}/${id}/`, {
				method: 'POST',
				body: JSON.stringify({
					from: from,
					id: id,
				}),
				headers: {
					'Content-type': 'application/json; charset=UTF-8',
				},
			})
				.then((res) => res.json())
				.then(() => funcs.getLatestTasks());
		},

		handleFormChange: (text) => setNewInput(text),

		setNewTaskDate: (date) => setNewDate(date),
	};

	// получаем задания с сервера
	useEffect(() => {
		funcs.getLatestTasks();
	}, []);

	return (
		<main>
			{/* <header /> */}

			<Routes>
				{/* Блок с заданиями */}

				<Route
					path='/'
					element={
						<>
							<NewTaskContainer
								tasks={newTasks}
								newInput={newInput}
								newDate={newDate}
								funcs={funcs}
							/>
							<CompletedTaskContainer tasks={completedTasks} funcs={funcs} />
							<FailedTasksContainer tasks={failedTasks} funcs={funcs} />{' '}
						</>
					}
				/>
			</Routes>
		</main>
	);
};

export default App;
