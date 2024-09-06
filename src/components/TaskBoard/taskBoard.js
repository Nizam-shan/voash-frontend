import React, { useEffect } from "react";
import { Backdrop, Box, Button, CircularProgress } from "@mui/material";
import { useState } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";

import { Search } from "./seacrhFilterBar";
import { AddForm } from "./addTaskDialog";
import {
  deleteTask,
  getAllTask,
  updateTaskStatus,
} from "../services/crudServices";
import { toast } from "react-toastify";

const TaskBoard = () => {
  const [searchQuery, setSearchQuery] = useState(null);
  const [isLoading, setLoading] = useState(false);
  const [isEditMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    descriptions: "",
  });
  const [view, setView] = useState(false);
  const [open, setOpen] = useState(false);
  const [box, setBox] = useState({
    todo: [],
    in_progress: [],
    Completed: [],
  });

  const [allTasks, setAllTasks] = useState({
    todo: [],
    in_progress: [],
    Completed: [],
  });
  const fetchTasks = async () => {
    try {
      setLoading(true);
      await getAllTask()
        .then((res) => {
          const data = res.data;

          const todoTasks = data.data.filter(
            (task) => task.status === "pending"
          );
          const inProgressTasks = data.data.filter(
            (task) => task.status === "in_progress"
          );
          const completeTasks = data.data.filter(
            (task) => task.status === "Completed"
          );

          const tasks = {
            todo: todoTasks,
            in_progress: inProgressTasks,
            Completed: completeTasks,
          };
          setBox(tasks);
          setAllTasks(tasks);
          setLoading(false);
        })
        .catch((error) => {
          console.log(error);
          setLoading(false);
        });
    } catch (error) {
      console.error("Error fetching tasks:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleDelete = async (id) => {
    console.log("🚀 ~ handleDelete ~ id:", id);
    try {
      await deleteTask(id)
        .then((res) => {
          // const data = res.data;
          // setBox((prev) => ({
          //   todo: prev.todo.filter((task) => task._id !== id),
          //   Completed: prev.Completed.filter((task) => task._id !== id),

          //   in_progress: prev.in_progress.filter((task) => task._id !== id),
          // }));
          fetchTasks();
          toast.success(res.data?.message);
        })
        .catch((error) => {
          console.log("error", error);
          toast.error(error.response.data.message || "Some error occured");
        });
    } catch (error) {
      toast.error("Some error occured");
    }
  };

  const handleEditTask = (task) => {
    setFormData(task);
    setEditMode(true);
    setOpen(true);
  };

  function onDrag(result) {
    if (!result.destination) return;
    const { source, destination } = result;
    if (source.droppableId === destination.droppableId) {
      return;
    }

    const sourceBox = Array.from(box[source.droppableId]);
    const destBox = Array.from(box[destination.droppableId]);
    const [draggedItem] = sourceBox.splice(source.index, 1);

    destBox.splice(destination.index, 0, draggedItem);
    setBox((prev) => ({
      ...prev,
      [source.droppableId]: sourceBox,
      [destination.droppableId]: destBox,
    }));

    updateTaskStatus(draggedItem._id, destination.droppableId)
      .then((res) => {
        const data = res?.data;
        toast.success(data?.message.toUpperCase());
      })
      .catch((error) => {
        toast.error(error.response.data.message || "Some error occured");
      });
    // console.log("🚀 ~ TaskBoard ~ result:", result);
    // const newbox = Array.from(box);
    // console.log("🚀 ~ onDrag ~ newbox:", newbox);
    // const [draggedItem] = newbox.splice(result.source.index, 1);
    // console.log("🚀 ~ onDrag ~ draggedItem:", draggedItem);
    // newbox.splice(result.destination.index, 0, draggedItem);
    // setBox(newbox);
  }

  const addNewTask = (task) => {
    setBox((prev) => ({
      ...prev,
      todo: [...prev.todo, task],
    }));
  };

  const handleView = (task) => {
    setOpen(true);
    setFormData(task);
    setView(true);
  };

  useEffect(() => {
    const filterTask = (task) => {
      if (!searchQuery) return task;
      return task.filter((item) =>
        item.title.toUpperCase().includes(searchQuery.toUpperCase())
      );
    };
    if (searchQuery) {
      setBox((prev) => ({
        todo: filterTask(prev.todo),
        in_progress: filterTask(prev.in_progress),
        Completed: filterTask(prev.Completed),
      }));
    } else {
      setBox(allTasks);
    }
    // eslint-disable-next-line
  }, [searchQuery]);

  return (
    <>
      {isLoading === true && (
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={true}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      )}
      <div style={{ height: "100vh", width: "100%" }}>
        <div>
          <Button
            sx={{ display: "flex", justifyContent: "flex-start", m: 3 }}
            variant="contained"
            onClick={() => setOpen(true)}
          >
            Add Task
          </Button>
          <AddForm
            open={open}
            setOpen={setOpen}
            formData={formData}
            setFormData={setFormData}
            addNewTask={addNewTask}
            isEditMode={isEditMode}
            view={view}
            setView={setView}
            setEditMode={setEditMode}
            fetchTasks={fetchTasks}
          />
        </div>
        <Search setSearchQuery={setSearchQuery} />
        <Box
          sx={{
            display: { sm: "block", md: "flex" },
            justifyContent: "center",
            alignItems: "flex-start",
            height: "100%",
            // width: "100%",
            boxShadow: 3,

            padding: "20px",
            gap: "20px",
            overflow: "auto",
          }}
        >
          {/* developed by amazon need to wrap oru enatir component with dragdropcontext "only one context is possible to add in project" */}
          <DragDropContext onDragEnd={onDrag}>
            {/* <Droppable droppableId="boxes">
            {(provided) => (
              <ul
                ref={provided.innerRef}
                {...provided.droppableProps}
                style={{ padding: "50px" }}
              >
                {box.map((item, index) => (
                  <Draggable key={item.id} draggableId={item.id} index={index}>
                    {(provided) => (
                      <li
                        ref={provided.innerRef}
                        {...provided.dragHandleProps}
                        {...provided.draggableProps}
                      >
                        {" "}
                        <div
                          {...provided.dragHandleProps}
                          style={{ cursor: "grab" }}
                        >
                          <div
                            style={{
                              width: "50px",
                              height: "50px",
                              background: item.bg,
                            }}
                          />
                        </div>
                      </li>
                    )}
                  </Draggable>
                ))}

                {provided.placeholder}
              </ul>
            )}
          </Droppable> */}

            {Object.keys(box).map((boxkey, index) => (
              <Droppable droppableId={boxkey} key={index}>
                {(provider) => (
                  <div
                    ref={provider.innerRef}
                    {...provider.droppableProps}
                    key={index}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      margin: "10px",
                      overflow: "auto",
                      padding: "10px",
                      width: "450px",
                      minHeight: "200px",
                      border: "1px solid lightgrey",
                      borderRadius: "5px",
                      background: "#f9f9f9",
                    }}
                  >
                    {/* .replace(/([A-Z])/g, " $1").toUpperCase() */}
                    <h3
                      style={{
                        background: "#32a8a4",
                        padding: "6px",
                        color: "white",
                        textAlign: "center",
                        margin: "0 0 10px 0",
                      }}
                    >
                      {boxkey.replace(/([A-Z])/g, " $1").toUpperCase()}
                    </h3>
                    {box[boxkey].map((item, index) => (
                      <Draggable
                        key={item.id}
                        draggableId={item._id}
                        index={index}
                      >
                        {(provider) => (
                          <div
                            ref={provider.innerRef}
                            {...provider.dragHandleProps}
                            {...provider.draggableProps}
                            style={{
                              ...provider.draggableProps.style,
                              margin: "0 0 10px 0",
                              padding: "15px",
                              backgroundColor: "#aef2ef",
                              borderRadius: "5px",
                              overflow: "auto",
                              // width: "100%",
                            }}
                          >
                            <div
                              style={{
                                // width: "50%",
                                height: "150px",
                                // backgroundColor: item.bg,
                              }}
                            >
                              <div
                                style={{
                                  display: "block",
                                  justifyContent: "flex-start",
                                  textAlign: "start",
                                }}
                              >
                                <h3>{item.title.toUpperCase()}</h3>
                                <p style={{ marginTop: "-10px" }}>
                                  {item.descriptions}
                                </p>
                                <p style={{ paddingTop: "12px" }}>
                                  {item.createdAt}
                                </p>
                              </div>
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "flex-end",
                                  gap: 4,
                                }}
                              >
                                <button
                                  style={{
                                    background: "#f24951",
                                    borderRadius: 6,
                                    color: "white",
                                    padding: 7,
                                    border: "none",
                                    cursor: "pointer",
                                  }}
                                  onClick={() => handleDelete(item._id)}
                                >
                                  Delete
                                </button>
                                <button
                                  style={{
                                    background: "#5da5e8",
                                    borderRadius: 6,
                                    color: "white",
                                    padding: 7,
                                    border: "none",
                                    cursor: "pointer",
                                  }}
                                  onClick={() => handleEditTask(item)}
                                >
                                  Edit
                                </button>
                                <button
                                  style={{
                                    background: "#1a3470",
                                    borderRadius: 6,
                                    color: "white",
                                    padding: 7,
                                    border: "none",
                                    cursor: "pointer",
                                  }}
                                  onClick={() => handleView(item)}
                                >
                                  View Details
                                </button>
                              </div>
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provider.placeholder}
                  </div>
                )}
              </Droppable>
            ))}
          </DragDropContext>
        </Box>
      </div>
    </>
  );
};

export default TaskBoard;
