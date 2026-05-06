import WorkspaceShell from './components/workspace/shell/WorkspaceShell'
import DocumentsPage from './pages/documents/DocumentsPage'
import SavedDocumentEditorPage from './pages/documents/SavedDocumentEditorPage'

function App() {
  const path = window.location.pathname

  if (path === '/documents') {
    return <DocumentsPage />
  }

  if (path.startsWith('/documents/')) {
    return <SavedDocumentEditorPage />
  }

  return <WorkspaceShell />
}

export default App