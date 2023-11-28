import { createSlice } from "@reduxjs/toolkit";
import { createNewBoard, deleteBoard, updateBoard, updateColumn } from "../api/boardsHandler";

const boardsSlice = createSlice({
  name: "boards",
  initialState: [],
  reducers: {
    setInitialData: (state, action) => {
      return (state = action.payload.initialData);
    },
    deleteInitialData: (state, action) => {
      state = [];
    },
    addBoard: (state, action) => {
      const isActive = state.length > 0 ? false : true;
      const payload = action.payload;
      const board = {
        name: payload.name,
        isActive,
        columns: [],
      };
      board.columns = payload.newColumns;
      createNewBoard(board);
      // state.push({...board, _id: boardid});
    },
    editBoard: (state, action) => {
      const {boardid, name} = action.payload;
      const board = state.find((brd) => brd._id === boardid);
      
      board.name = name;
      updateBoard(action.payload);
    },
    deleteBoard: (state, action) => {
      let board_id = action.payload.boardid
      deleteBoard(board_id);
      // state = [...state.filter((brd) => board_id !== brd._id.$oid)];
    },
    setBoardActive: (state, action) => {
      state.map((board, index) => {
        index === action.payload.index
          ? (board.isActive = true)
          : (board.isActive = false);
        return board;
      });
    },
    addTask: (state, action) => {
      const { title, status, description, subtasks, newColIndex } =
        action.payload;
      const task = { title, description, subtasks, status };
      const board = state.find((board) => board.isActive);
      const column = board.columns.find((col, index) => index === newColIndex);
      column.tasks.push(task);
      updateColumn(column)
      // createNewBoard(state);
    },
    editTask: (state, action) => {
      const {
        title,
        status,
        description,
        subtasks,
        prevColIndex,
        newColIndex,
        taskIndex,
      } = action.payload;
      const board = state.find((board) => board.isActive);
      const column = board.columns.find((col, index) => index === prevColIndex);
      const task = column.tasks.find((task, index) => index === taskIndex);
      task.title = title;
      task.status = status;
      task.description = description;
      task.subtasks = subtasks;
      column.task = task
      if (prevColIndex === newColIndex) {
        updateColumn(column)
      } else {
        const prevCol = board.columns.find((col, i) => i === prevColIndex);
        const task = prevCol.tasks.splice(taskIndex, 1)[0];
        prevCol.tasks = prevCol.tasks.filter(index => index !== taskIndex)
        const col = board.columns.find((col, i) => i === newColIndex);
        task.status = col.name;
        col.tasks.push(task);
        updateColumn(col)
        updateColumn(prevCol)
      }
    },
    dragTask: (state, action) => {
      const { colIndex, prevColIndex, taskIndex } = action.payload;
      const board = state.find((board) => board.isActive);
      const prevCol = board.columns.find((col, i) => i === prevColIndex);
      const task = prevCol.tasks.splice(taskIndex, 1)[0];
      prevCol.tasks = prevCol.tasks.filter(index => index !== taskIndex)
      const col = board.columns.find((col, i) => i === colIndex);
      task.status = col.name;
      col.tasks.push(task);
      updateColumn(col)
      updateColumn(prevCol)
      // createNewBoard(state);
    },
    setSubtaskCompleted: (state, action) => {
      const payload = action.payload;
      const board = state.find((board) => board.isActive);
      const col = board.columns.find((col, i) => i === payload.colIndex);
      const task = col.tasks.find((task, i) => i === payload.taskIndex);
      const subtask = task.subtasks.find((subtask, i) => i === payload.index);
      subtask.isCompleted = !subtask.isCompleted;
      updateColumn(col)
    },
    setTaskStatus: (state, action) => {
      const payload = action.payload;
      const board = state.find((board) => board.isActive);
      const columns = board.columns;
      const col = columns.find((col, i) => i === payload.colIndex);
      if (payload.colIndex === payload.newColIndex) return;
      const task = col.tasks.find((task, i) => i === payload.taskIndex);
      task.status = payload.status;
      col.tasks = col.tasks.filter((task, i) => i !== payload.taskIndex);
      const newCol = columns.find((col, i) => i === payload.newColIndex);
      newCol.tasks.push(task);
      updateColumn(newCol)
    },
    deleteTask: (state, action) => {
      const payload = action.payload;
      const board = state.find((board) => board.isActive);
      const col = board.columns.find((col, i) => i === payload.colIndex);
      col.tasks = col.tasks.filter((task, i) => i !== payload.taskIndex);
      updateColumn(col)
    },
  },
});

export default boardsSlice;
