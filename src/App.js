import React, { useState } from 'react'
import './App.css'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import _ from 'lodash'
import { v4 } from 'uuid'

// const item = {
//   id: v4(),
//   name: 'Clean the house'
// }

// const item2 = {
//   id: v4(),
//   name: 'Wash the car'
// }

function App() {
  const [text, setText] = useState('')
  const [state, setState] = useState({
    todo: {
      title: 'Todo',
      items: []
    },
    inprogress: {
      title: 'Doing',
      items: []
    }
    // ,
    // done: {
    //   title: 'Completed',
    //   items: []
    // }
  })

  const handleDragEnd = ({ destination, source }) => {
    if (!destination) {
      return
    }

    if (
      destination.index === source.index &&
      destination.droppableId === source.droppableId
    ) {
      return
    }

    // Creating a copy of item before removing it from state
    const itemCopy = { ...state[source.droppableId].items[source.index] }

    setState(prev => {
      prev = { ...prev }
      // Remove from previous items array
      prev[source.droppableId].items.splice(source.index, 1)

      // Adding to new items array location
      prev[destination.droppableId].items.splice(destination.index, 0, itemCopy)

      return prev
    })
  }

  const addItem = () => {
    setState(prev => {
      return {
        ...prev,
        todo: {
          title: 'Todo',
          items: [
            {
              id: v4(),
              name: text
              // <button onClick={addItem}>Del</button>
            },
            ...prev.todo.items
          ]
        }
      }
    })

    setText('')
  }

  const delItem = id => {
    // setState(prev => {
    //   let items = prev.inprogress.items
    //   const index = items.findIndex(item => item.id === id)
    //   items.splice(index, 1)
    //   return { items }
    // })
  }

  return (
    <div className='App'>
      <div>
        <input
          type='text'
          value={text}
          onChange={e => setText(e.target.value)}
        />
        <button onClick={addItem}>Add</button>
      </div>
      <DragDropContext onDragEnd={handleDragEnd}>
        {_.map(state, (data, key) => {
          return (
            <div
              key={key}
              className={'column'}
              style={{ marginRight: 1 + 'em' }}
            >
              <h3>{data.title}</h3>
              <Droppable droppableId={key}>
                {(provided, snapshot) => {
                  return (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={'droppable-col'}
                    >
                      {data.items.map((el, index) => {
                        return (
                          <Draggable
                            key={el.id}
                            index={index}
                            draggableId={el.id}
                          >
                            {(provided, snapshot) => {
                              console.log(snapshot, 'el', el.name)
                              return (
                                <div
                                  className={`item ${
                                    snapshot.isDragging && 'dragging'
                                  }`}
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                >
                                  {el.name}
                                  <button
                                    onClick={delItem(el)}
                                    className={key === 'todo' ? 'hide' : 'show'}
                                    // style={{ marginBottom: 0, display: 'none' }}
                                  >
                                    Del
                                  </button>
                                </div>
                              )
                            }}
                          </Draggable>
                        )
                      })}
                      {provided.placeholder}
                    </div>
                  )
                }}
              </Droppable>
            </div>
          )
        })}
      </DragDropContext>
    </div>
  )
}

export default App
