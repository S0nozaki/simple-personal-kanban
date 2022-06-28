import Column from "./Column";

const Columns = ({ columns, onEditColumn, onDelete, onCreateTask, onDeleteTask }) => {
    return (
        <div className="columns">
            {columns.map((column)=>(
                <Column key={column.id} column={column} onEditColumn={onEditColumn} onDelete={onDelete} onCreateTask={onCreateTask} onDeleteTask={onDeleteTask}></Column>
            ))}
        </div>
    )
}

export default Columns
