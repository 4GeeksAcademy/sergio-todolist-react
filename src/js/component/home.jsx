import React from "react";
import { TodoListWithFetch } from "./TodoListWithFetch.jsx"


//create your first component
const Home = () => {
	return (
		<div className="text-start">
			<TodoListWithFetch />
		</div>
	);
};

export default Home;
