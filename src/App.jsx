import React from 'react'
import FormViewer from './FormViewer'
import { SubmissionProvider } from './contexts/SubmissionContext'

function App() {
  const styles = {
    container: {
      padding: '100px',
      height: '100vh',
      width: '100vw',
      margin: 0,
      boxSizing: 'border-box'
    }
  }


  return (
      <SubmissionProvider>
        <div style={styles.container}>
          <FormViewer />
        </div>
      </SubmissionProvider>
  )
}

export default App
