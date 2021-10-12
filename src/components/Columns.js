import Column from "./Column";

const Columns = ({ columns, onDelete, onCreateTask, onDeleteTask }) => {
    return (
        <div className="columns">
            {columns.map((column)=>(
                <Column key={column.id} column={column} onDelete={onDelete} onCreateTask={onCreateTask} onDeleteTask={onDeleteTask}></Column>
            ))}
        </div>
    )
}

export default Columns
