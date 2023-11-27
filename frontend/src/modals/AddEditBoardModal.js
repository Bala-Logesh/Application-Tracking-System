import React, { useState } from "react";
import crossIcon from "../assets/icon-cross.svg";
import boardsSlice from "../redux/boardsSlice";
import { v4 as uuidv4 } from "uuid";
import { useDispatch, useSelector } from "react-redux";
import { addColumn, deleteColumn, getDataFunction, updateColumn } from "../api/boardsHandler";

function AddEditBoardModal({ setIsBoardModalOpen, type }) {
  const dispatch = useDispatch();
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const [err, setErr] = useState("");
  const [boardName, setBoardName] = useState("");
  const [deleteColumns, setDeleteColumns] = useState([])
  const [createColumns, setCreateColumns] = useState([])
  const [newColumns, setNewColumns] = useState([
    { name: "Applied", tasks: [], id: uuidv4() },
    { name: "Rejected", tasks: [], id: uuidv4() },
    { name: "Waiting For Referral", tasks: [], id: uuidv4() },
  ]);
  const board = useSelector((state) => state.boards).find(
    (board) => board.isActive
  );

  if (type === "edit" && isFirstLoad) {
    setNewColumns(
      board.columns.map((col) => {
        return { ...col };
      })
    );
    setBoardName(board.name);
    setIsFirstLoad(false);
  }

  const validate = () => {
    if (!boardName.trim()) {
      setErr("Board name should not be empty");
      return false;
    }
    for (let i = 0; i < newColumns.length; i++) {
      if (!newColumns[i].name.trim()) {
        setErr("Column names should not be empty");
        return false;
      }
    }

    setErr("");
    return true;
  };

  const onChangeColumnName = (id, newValue) => {
    setNewColumns((prevState) => {
      const newState = prevState.map(col => {
        if (col.id === id) {
          col.name = newValue
        }

        return col
      });
      return newState;
    });
  };

  const onDeleteColumnEdit = (id) => {
    setDeleteColumns(prev => [...prev, id])
    setNewColumns((prevState) => prevState.filter((el) => el._id !== id));
  };

  const onDeleteColumnAdd = (id) => {
    setNewColumns((prevState) => prevState.filter((el) => el.id !== id));
  };

  const onSubmit = (type) => {
    setIsBoardModalOpen(false);
    if (type === "add") {
      console.log("here")
      dispatch(boardsSlice.actions.addBoard({ name: boardName, newColumns }));
      
      getDataFunction().then((boards) => {
        dispatch(boardsSlice.actions.setInitialData({ initialData: boards }));
      }).catch((err) => console.log(err))
    } else {
      console.log(deleteColumns.length)
      console.log(createColumns.length)
      console.log(deleteColumns)
      console.log(createColumns)
      if (deleteColumns.length > 0) {
        deleteColumns.forEach(colid => deleteColumn(colid))
      } 
      
      if (createColumns.length > 0) {
        createColumns.forEach(id => {
          let newcol = newColumns.find(col => col.id === id)
          addColumn({name: newcol.name, boardid: board._id})
        })
      }
      if (deleteColumns.length === 0 && createColumns.length === 0) {
        newColumns.forEach(newcol => updateColumn(newcol))
      }

      setTimeout(() => {
        getDataFunction().then((boards) => {
          dispatch(boardsSlice.actions.setInitialData({ initialData: boards }));
        }).catch((err) => console.log(err))
      }, 500)
    }

  };

  return (
    <div
      className="fixed right-0 top-0 px-2 py-4 overflow-scroll scrollbar-hide z-50 left-0 bottom-0 justify-center items-center flex dropdown"
      onClick={(e) => {
        if (e.target !== e.currentTarget) {
          return;
        }
        setIsBoardModalOpen(false);
      }}
    >
      <div
        className="scrollbar-hide overflow-y-scroll max-h-[95vh] bg-white dark:bg-[#2b2c37] text-black dark:text-white font-bold
       shadow-md shadow-[#364e7e1a] max-w-md mx-auto my-auto w-full px-8 py-8 rounded-xl"
      >
        <h3 className="text-lg">
          {type === "edit" ? "Edit" : "Add New"} Board
        </h3>
        <br />
        {err !== "" && <p className="text-red-800 dark:text-red-400">{err}</p>}
        {err === "" && <p className="opacity-0">{err}</p>}
        <div className="mt-8 flex flex-col space-y-1">
          <label className="text-sm dark:text-white text-gray-500">
            Board Name
          </label>
          <input
            className="bg-transparent px-4 py-2 rounded-md text-sm border-[0.5px] border-gray-600 focus:outline-[#635fc7] outline-1 ring-0"
            placeholder="e.g Web Design"
            value={boardName}
            onChange={(e) => setBoardName(e.target.value)}
            id="board-name-input"
          />
        </div>
        <div className="mt-8 flex flex-col space-y-3">
          <label className="text-sm dark:text-white text-gray-500">
            Board Columns
          </label>

          {newColumns.map((column, index) => (
            <div key={index} className="flex items-center w-full">
              <input
                className="bg-transparent flex-grow px-4 py-2 rounded-md text-sm border-[0.5px] border-gray-600 focus:outline-[#635fc7] outline-[1px]"
                onChange={(e) => {
                  // console.log(column)
                  onChangeColumnName(column.id, e.target.value);
                }}
                type="text"
                value={column.name}
              />
              <img
                src={crossIcon}
                alt="delete column button"
                onClick={() => {
                  type === "add" ? onDeleteColumnAdd(column.id) : onDeleteColumnEdit(column._id);
                }}
                className="m-4 cursor-pointer"
              />
            </div>
          ))}
          <div>
            <button
              className="w-full items-center hover:opacity-70 dark:text-[#635fc7] dark:bg-white text-white bg-[#635fc7] py-2 rounded-full"
              onClick={() => {
                let id = uuidv4() 
                setNewColumns((prev) => [
                  ...prev,
                  { name: "", tasks: [], id:id },
                ]);
                setCreateColumns(prev => [...prev, id])
              }}
            >
              + Add New Column
            </button>
            <button
              onClick={() => {
                let isValid = validate();
                if (isValid === true) onSubmit(type);
              }}
              className="w-full items-center hover:opacity-70 dark:text-white dark:bg-[#635fc7] mt-8 relative text-white bg-[#635fc7] py-2 rounded-full"
            >
              {type === "add" ? "Create New Board" : "Save Changes"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddEditBoardModal;
