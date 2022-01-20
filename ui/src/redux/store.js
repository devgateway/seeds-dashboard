import { applyMiddleware, compose, createStore } from 'redux'
import thunk from 'redux-thunk'
import { createHashHistory } from 'history'
import { routerMiddleware } from 'connected-react-router/immutable'
import Immutable from 'immutable'
import createRootReducer from "./reducer";


export const history = createHashHistory()

const initialState = Immutable.Map()

let reducer = null;
let store = null

const getRootReducer = () => {
  if (!reducer) {
    reducer = createRootReducer(history)
  }
  return reducer
}


export default function getStore() {
  const composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  if (!store) {

    store = createStore(
      getRootReducer(), // root reducer with router state
      initialState,
      composeEnhancer(
        applyMiddleware(
          routerMiddleware(history), thunk // for dispatching history actions
          // ... other middlewares ...
        )
      )
    )
  }

  return store
}
