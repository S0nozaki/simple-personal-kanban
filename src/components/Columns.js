import Column from "./Column";

const Columns = ({ columns, onEditColumn, onDelete, onCreateTask, onDeleteTask, onSelectTask}) => {
    return (
        <div className="columns">
            {columns.map((column)=>(
                <Column key={column.id} column={column} onEditColumn={onEditColumn} onDelete={onDelete} onCreateTask={onCreateTask} onDeleteTask={onDeleteTask} onSelectTask={onSelectTask}></Column>
            ))}
        </div>
    )
}

export default Columns
