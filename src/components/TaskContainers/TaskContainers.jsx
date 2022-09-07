import React from 'react';
import styles from './TaskContainers.module.css';
import addBtn from '../../img/add.svg';
import delBtn from '../../img/del.svg';
import doneBtn from '../../img/done.svg';

const img = {
	addBtn: <img src={addBtn} alt='add' style={{ height: '1.2rem' }} />,
	delBtn: <img src={delBtn} alt='delete' style={{ height: '1.2rem' }} />,
	doneBtn: <img src={doneBtn} alt='done' style={{ height: '1.2rem' }} />,
};

export const NewTaskContainer = (props) => {
	const handleFormChange = (evt) => {
		props.funcs.handleFormChange(evt.target.value);
	};

	const handleDateInput = (evt) => props.funcs.setNewTaskDate(evt.target.value);

	const handleFormSubmit = (evt) => {
		evt.preventDefault();
		props.funcs.setTask();
	};

	const taskDone = (id) => props.funcs.moveTask(id, 'new', 'done');
	const taskFailed = (id) => props.funcs.moveTask(id, 'new', 'failed');

	return (
		<>
			{/* блок с новыми заданиямм */}
			<div className={styles.taskContainer}>
				<span className={styles.taskTitle}>
					<span>НОВЫЕ ЗАДАНИЯ</span>
					<span>{props.tasks.length}</span>
				</span>

				<form
					onSubmit={handleFormSubmit}
					className={`${styles.task} ${styles.newInput}`}
				>
					<textarea
						value={props.newInput}
						onChange={handleFormChange}
						required
						id={styles.newTaskInput}
					/>
					<div className={styles.taskFooter}>
						<div className={styles.taskDate}>
							<input
								type='date'
								min={new Date().toISOString().split('T')[0]}
								value={props.newDate}
								onInput={handleDateInput}
								required
							/>
						</div>
						<div className={styles.taskBtns}>
							<button type='submit'>{img.addBtn}</button>
						</div>
					</div>
				</form>
				<ul className={styles.taskList}>
					{/* генерация блоков по шаблону */}
					{props.tasks.map((task) => {
						const [taskYear, taskMonth, taskDay] = task.date.split('-');
						const [year, month, day] = new Date()
							.toISOString()
							.split('T')[0]
							.split('-');
						if (
							parseInt(taskYear) < year ||
							(parseInt(taskYear) <= year && parseInt(taskMonth) < month) ||
							(parseInt(taskYear) <= year &&
								parseInt(taskMonth) <= month &&
								parseInt(taskDay) < day)
						) {
							taskFailed(task.id);
						}
						return (
							<li key={task.id} className={styles.task}>
								<div className={styles.taskContent}>{task.content}</div>
								<div className={styles.taskFooter}>
									<div className={styles.taskDate}>{task.date}</div>
									<div className={styles.taskBtns}>
										<button onClick={() => taskDone(task.id)}>
											{img.doneBtn}
										</button>
										<button
											onClick={() => props.funcs.deleteTask(task.id, 'new')}
										>
											{img.delBtn}
										</button>
									</div>
								</div>
							</li>
						);
					})}
				</ul>
			</div>
		</>
	);
};

export const CompletedTaskContainer = (props) => {
	return (
		<>
			{/* блок с выполненными заданиями */}
			<div className={styles.taskContainer}>
				<span className={styles.taskTitle}>
					<span>ВЫПОЛНЕННЫЕ</span>
					<span>{props.tasks.length}</span>
				</span>
				{/* генерация блоков по шаблону */}
				<ul className={styles.taskList}>
					{props.tasks.map((task) => {
						return (
							<li key={task.id} className={styles.task}>
								<div className={styles.taskContent}>{task.content}</div>
								<div className={styles.taskFooter}>
									<div className={styles.taskDate}>{task.date}</div>
									<div className={styles.taskBtns}>
										<button
											onClick={() =>
												props.funcs.deleteTask(task.id, 'completed')
											}
										>
											{img.delBtn}
										</button>
									</div>
								</div>
							</li>
						);
					})}
				</ul>
			</div>
		</>
	);
};

export const FailedTasksContainer = (props) => {
	return (
		<>
			{/* блок с просроченными заданиями */}
			<div className={styles.taskContainer}>
				<span className={styles.taskTitle}>
					<span>ПРОСРОЧЕННЫЕ</span>
					<span>{props.tasks.length}</span>
				</span>
				{/* генерация блоков по шаблону */}
				<ul className={styles.taskList}>
					{props.tasks.map((task) => {
						return (
							<li key={task.id} className={styles.task}>
								<div className={styles.taskContent}>{task.content}</div>
								<div className={styles.taskFooter}>
									<div className={styles.taskDate}>{task.date}</div>
									<div className={styles.taskBtns}>
										<button
											onClick={() => props.funcs.deleteTask(task.id, 'failed')}
										>
											{img.delBtn}
										</button>
									</div>
								</div>
							</li>
						);
					})}
				</ul>
			</div>
		</>
	);
};
