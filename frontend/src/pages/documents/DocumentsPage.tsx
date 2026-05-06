import { useEffect, useMemo, useState } from 'react'
import WorkspaceSidebar from '../../components/workspace/shell/WorkspaceSidebar'
import {
  deleteSavedDocument,
  getSavedDocuments,
  renameSavedDocument,
} from '../../features/documents/documentLibraryApi'
import type { SavedDocument } from '../../features/documents/documentLibrary.types'

function DocumentsPage() {
  const [documents, setDocuments] = useState<SavedDocument[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingTitle, setEditingTitle] = useState('')
  const [actionError, setActionError] = useState<string | null>(null)

  const totalDocuments = documents.length

  const latestSavedDate = useMemo(() => {
    if (documents.length === 0) return null

    return documents
      .map((document) => new Date(document.savedAt).getTime())
      .sort((a, b) => b - a)[0]
  }, [documents])

  async function loadDocuments() {
    try {
      const docs = await getSavedDocuments()
      setDocuments(docs)
    } catch {
      setError('Could not load documents.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadDocuments()
  }, [])

  const handleStartRename = (document: SavedDocument) => {
    setEditingId(document.id)
    setEditingTitle(document.title)
    setActionError(null)
  }

  const handleCancelRename = () => {
    setEditingId(null)
    setEditingTitle('')
    setActionError(null)
  }

  const handleRename = async (id: string) => {
    if (!editingTitle.trim()) return

    try {
      const updatedDocument = await renameSavedDocument(id, editingTitle.trim())

      setDocuments((currentDocuments) =>
        currentDocuments.map((document) =>
          document.id === id ? updatedDocument : document,
        ),
      )

      setEditingId(null)
      setEditingTitle('')
      setActionError(null)
    } catch {
      setActionError('Could not rename document.')
    }
  }

  const handleDelete = async (id: string) => {
    const shouldDelete = window.confirm('Delete this document?')

    if (!shouldDelete) return

    try {
      await deleteSavedDocument(id)

      setDocuments((currentDocuments) =>
        currentDocuments.filter((document) => document.id !== id),
      )

      setActionError(null)
    } catch {
      setActionError('Could not delete document.')
    }
  }

  return (
    <div className="min-h-screen bg-[#f4f1eb] px-4 py-4 md:px-6 lg:px-8">
      <div className="mx-auto flex h-[calc(100vh-2rem)] w-full max-w-[1560px] overflow-hidden rounded-[34px] border border-stone-200/80 bg-white shadow-[0_28px_90px_rgba(28,25,23,0.10)]">
        <WorkspaceSidebar />

        <main className="flex-1 overflow-y-auto bg-white px-6 py-6 md:px-8">
          <div className="mx-auto w-full max-w-[1180px] pb-16">
            <div className="flex items-start justify-between gap-6">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-stone-400">
                  Document Library
                </p>

                <h1 className="mt-3 text-[44px] font-semibold leading-[1] tracking-[-0.045em] text-stone-950">
                  Saved Documents
                </h1>

                <p className="mt-4 max-w-[620px] text-sm leading-7 text-stone-500">
                  Open, rename and manage the documents you have generated in
                  this workspace.
                </p>
              </div>

              <a
                href="/"
                className="inline-flex h-11 shrink-0 items-center justify-center rounded-full bg-stone-950 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-stone-800"
              >
                Back to workspace
              </a>
            </div>

            <div className="mt-9 grid gap-4 md:grid-cols-3">
              <LibraryStatCard label="Saved documents" value={totalDocuments} />
              <LibraryStatCard
                label="Latest save"
                value={
                  latestSavedDate
                    ? new Date(latestSavedDate).toLocaleDateString()
                    : 'None yet'
                }
              />
              <LibraryStatCard label="Storage" value="Local JSON" />
            </div>

            {loading && (
              <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {[1, 2, 3].map((item) => (
                  <div
                    key={item}
                    className="h-[280px] animate-pulse rounded-[30px] border border-stone-200 bg-stone-50"
                  />
                ))}
              </div>
            )}

            {error && <AlertBox message={error} />}

            {actionError && <AlertBox message={actionError} />}

            {!loading && !error && documents.length === 0 && (
              <div className="mt-10 rounded-[34px] border border-dashed border-stone-300 bg-stone-50 p-10">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-stone-400">
                  Empty library
                </p>

                <h2 className="mt-3 text-2xl font-semibold tracking-[-0.03em] text-stone-950">
                  No saved documents yet
                </h2>

                <p className="mt-3 max-w-[620px] text-sm leading-7 text-stone-500">
                  Generate a document, edit it, then click Save document. Saved
                  documents will appear here.
                </p>

                <a
                  href="/"
                  className="mt-6 inline-flex h-11 items-center justify-center rounded-full bg-stone-950 px-5 text-sm font-semibold text-white transition hover:bg-stone-800"
                >
                  Create your first document
                </a>
              </div>
            )}

            {!loading && !error && documents.length > 0 && (
              <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {documents.map((doc) => {
                  const isEditing = editingId === doc.id

                  return (
                    <article
                      key={doc.id}
                      className="group rounded-[32px] border border-stone-200 bg-white p-6 shadow-[0_20px_60px_rgba(28,25,23,0.06)] transition hover:-translate-y-0.5 hover:shadow-[0_28px_80px_rgba(28,25,23,0.10)]"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <p className="rounded-full border border-stone-200 bg-stone-50 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-stone-500">
                          {doc.templateTitle}
                        </p>

                        <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 shadow-[0_0_0_4px_rgba(16,185,129,0.12)]" />
                      </div>

                      {isEditing ? (
                        <div className="mt-5">
                          <label className="text-xs font-bold uppercase tracking-[0.16em] text-stone-400">
                            Document name
                          </label>

                          <input
                            value={editingTitle}
                            onChange={(event) =>
                              setEditingTitle(event.target.value)
                            }
                            className="mt-3 w-full rounded-[18px] border border-stone-200 bg-stone-50 px-4 py-3 text-sm font-semibold text-stone-900 outline-none transition focus:border-stone-300 focus:bg-white"
                          />

                          <div className="mt-4 flex flex-wrap gap-3">
                            <button
                              type="button"
                              onClick={() => handleRename(doc.id)}
                              className="inline-flex h-10 items-center justify-center rounded-full bg-stone-950 px-4 text-sm font-semibold text-white transition hover:bg-stone-800"
                            >
                              Save name
                            </button>

                            <button
                              type="button"
                              onClick={handleCancelRename}
                              className="inline-flex h-10 items-center justify-center rounded-full border border-stone-200 bg-white px-4 text-sm font-semibold text-stone-700 transition hover:bg-stone-50"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <h2 className="mt-5 min-h-[64px] text-xl font-semibold leading-8 tracking-[-0.025em] text-stone-950">
                            {doc.title}
                          </h2>

                          <p className="mt-3 line-clamp-3 min-h-[84px] text-sm leading-7 text-stone-500">
                            {doc.summary || 'No summary available yet.'}
                          </p>

                          <div className="mt-5 rounded-[22px] border border-stone-200 bg-stone-50 px-4 py-4">
                            <p className="text-xs font-bold uppercase tracking-[0.16em] text-stone-400">
                              Saved
                            </p>
                            <p className="mt-2 text-sm font-medium text-stone-700">
                              {new Date(doc.savedAt).toLocaleString()}
                            </p>
                          </div>

                          <div className="mt-6 flex flex-wrap gap-3">
                            <a
                              href={`/documents/${doc.id}`}
                              className="inline-flex h-10 items-center justify-center rounded-full bg-stone-950 px-4 text-sm font-semibold text-white transition hover:bg-stone-800"
                            >
                              Open
                            </a>

                            <button
                              type="button"
                              onClick={() => handleStartRename(doc)}
                              className="inline-flex h-10 items-center justify-center rounded-full border border-stone-200 bg-white px-4 text-sm font-semibold text-stone-700 transition hover:bg-stone-50"
                            >
                              Rename
                            </button>

                            <button
                              type="button"
                              onClick={() => handleDelete(doc.id)}
                              className="inline-flex h-10 items-center justify-center rounded-full border border-red-200 bg-red-50 px-4 text-sm font-semibold text-red-700 transition hover:bg-red-100"
                            >
                              Delete
                            </button>
                          </div>
                        </>
                      )}
                    </article>
                  )
                })}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}

function LibraryStatCard({
  label,
  value,
}: {
  label: string
  value: string | number
}) {
  return (
    <div className="rounded-[26px] border border-stone-200 bg-stone-50 px-5 py-5">
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-stone-400">
        {label}
      </p>
      <p className="mt-3 text-2xl font-semibold tracking-[-0.03em] text-stone-950">
        {value}
      </p>
    </div>
  )
}

function AlertBox({ message }: { message: string }) {
  return (
    <div className="mt-8 rounded-[24px] border border-red-200 bg-red-50 p-5 text-sm font-medium text-red-700">
      {message}
    </div>
  )
}

export default DocumentsPage