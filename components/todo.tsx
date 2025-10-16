'use client';
import { ChangeEvent, FC, useState } from 'react';
import { todoType } from '@/types/todoType';

interface Props {
    todo: todoType;
    changeTodoText: (id: number, text: string) => void;
    toggleIsTodoDone: (id: number, done: boolean) => void;
    deleteTodoItem: (id: number) => void;
}

const Todo: FC<Props> = ({
    todo,
    changeTodoText,
    toggleIsTodoDone,
    deleteTodoItem,
}) => {
    // State for handling editing mode
    const [editing, setEditing] = useState(false);

    // State for handling text input
    const [text, setText] = useState(todo.text);

    // State for handling "done" status
    const [isDone, setIsDone] = useState(todo.done);

    // Event handler for text input change
    const handleTextChange = (e: ChangeEvent<HTMLInputElement>) => {
        setText(e.target.value);
    };

    // Event handler for toggling "done" status
    const handleIsDone = async () => {
        toggleIsTodoDone(todo.id, !isDone);
        setIsDone((prev) => !prev);
    };

    // Event handler for initiating the edit mode
    const handleEdit = () => {
        setEditing(true);
    };

    // Event handler for saving the edited text
    const handleSave = async () => {
        changeTodoText(todo.id, text);
        setEditing(false);
    };

    // Event handler for canceling the edit mode
    const handleCancel = () => {
        setEditing(false);
        setText(todo.text);
    };

    // Event handler for deleting a todo item
    const handleDelete = () => {
        if (confirm('Are you sure you want to delete this todo?')) {
            deleteTodoItem(todo.id);
        }
    };

    // Rendering the Todo component
    return (
        <div className="flex items-center gap-2 rounded-lg border border-solid border-gray-200 p-4">
            {/* Checkbox for marking the todo as done */}
            <input
                type="checkbox"
                className="h-4 w-4 rounded-sm text-blue-200"
                checked={isDone}
                onChange={handleIsDone}
            />
            {/* Input field for todo text */}
            <input
                type="text"
                value={text}
                onChange={handleTextChange}
                readOnly={!editing}
                className={`${
                    todo.done ? 'line-through' : ''
                } w-full rounded border-gray-200 px-2 py-1 outline-none read-only:border-transparent focus:border`}
            />
            {/* Action buttons for editing, saving, canceling, and deleting */}
            <div className="ml-auto flex gap-1">
                {editing ? (
                    <button
                        onClick={handleSave}
                        className="w-14 rounded bg-green-600 px-2 py-1 text-green-50"
                    >
                        Save
                    </button>
                ) : (
                    <button
                        onClick={handleEdit}
                        className="w-14 rounded bg-blue-400 px-2 py-1 text-blue-50"
                    >
                        Edit
                    </button>
                )}
                {editing ? (
                    <button
                        onClick={handleCancel}
                        className="w-16 rounded bg-red-400 px-2 py-1 text-red-50"
                    >
                        Close
                    </button>
                ) : (
                    <button
                        onClick={handleDelete}
                        className="w-16 rounded bg-red-400 px-2 py-1 text-red-50"
                    >
                        Delete
                    </button>
                )}
            </div>
        </div>
    );
};

export default Todo;
