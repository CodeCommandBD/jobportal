'use client'
import { store } from '@/redux/store'
import React from 'react'
import { Provider } from 'react-redux'

/**
 * Global provider for the Redux state management store.
 * Wraps the entire application to enable state access across all components.
 */
const StoreProvider = ({children}) => {
  return (
    <Provider store={store}>
        {children}
    </Provider>
  )
}

export default StoreProvider
