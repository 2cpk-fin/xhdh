/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useRef } from 'react'
import { X, Edit, Trash2, Trophy, Tag, GripVertical } from 'lucide-react'
import { universityApi } from '../../api/universityApi'
import { tagApi } from '../../api/tagApi'
import type { UniversityResponse, UniversityRequest } from '../../types/university'
import type { TagResponse } from '../../types/tag'

type Props = {
    university?: UniversityResponse // undefined = create mode
    onClose: () => void
    onSuccess: () => void
}

export default function UniversityControllingBox({ university, onClose, onSuccess }: Props) {
    const isEditMode = !!university

    const [formData, setFormData] = useState({
        name: university?.name ?? '',
        abbreviation: university?.abbreviation ?? '',
        elo: university?.elo ?? 1000,
    })
    const [assignedTags, setAssignedTags] = useState<TagResponse[]>(university?.tags ?? [])
    const [allTags, setAllTags] = useState<TagResponse[]>([])
    const [error, setError] = useState('')
    const [draggingTag, setDraggingTag] = useState<TagResponse | null>(null)
    const [isDragOver, setIsDragOver] = useState(false)
    const dropZoneRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        tagApi.getAllTags().then(setAllTags).catch(console.error)
    }, [])

    // Tags available in the right panel = all tags not yet assigned
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const availableTags = allTags.filter(t => !assignedTags.some(a => a.id === t.id))

    /* ── Drag handlers (from TagSection → UniversityStat) ── */
    const handleDragStart = (tag: TagResponse) => setDraggingTag(tag)
    const handleDragEnd = () => setDraggingTag(null)

    const handleDropZoneDragOver = (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragOver(true)
    }
    const handleDropZoneDragLeave = () => setIsDragOver(false)

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragOver(false)
        if (draggingTag && !assignedTags.some(t => t.id === draggingTag.id)) {
            setAssignedTags(prev => [...prev, draggingTag])
        }
        setDraggingTag(null)
    }

    /* ── Also allow dragging assigned tags back to remove ── */
    const handleAssignedDragStart = (tag: TagResponse) => setDraggingTag(tag)

    const handleAvailableDrop = (e: React.DragEvent) => {
        e.preventDefault()
        if (draggingTag) {
            setAssignedTags(prev => prev.filter(t => t.id !== draggingTag.id))
        }
        setDraggingTag(null)
    }

    const removeTag = (id: number) => setAssignedTags(prev => prev.filter(t => t.id !== id))

    /* ── Submit ── */
    const buildPayload = (): UniversityRequest => ({
        name: formData.name,
        abbreviation: formData.abbreviation,
        elo: Number(formData.elo),
        tagIds: assignedTags.map(t => t.id),
    })

    const handleSave = async () => {
        setError('')
        if (!formData.name.trim()) return setError('University name is required.')
        if (!formData.abbreviation.trim()) return setError('Abbreviation is required.')
        try {
            if (isEditMode) {
                await universityApi.updateUniversity(university.id, buildPayload())
            } else {
                await universityApi.createUniversity(buildPayload())
            }
            onSuccess()
        } catch (err: any) {
            setError(err.response?.data || `Failed to ${isEditMode ? 'update' : 'create'} university`)
        }
    }

    const handleDelete = async () => {
        if (!university) return
        if (!window.confirm(`Delete "${university.name}"? This cannot be undone.`)) return
        try {
            await universityApi.deleteUniversity(university.id)
            onSuccess()
        } catch (err: any) {
            setError(err.response?.data || 'Failed to delete university')
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-900/40 backdrop-blur-sm p-4">
            <div className="bg-zinc-100 rounded-[2rem] w-full max-w-5xl h-[620px] flex overflow-hidden shadow-2xl relative">
                {/* Close */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 bg-white rounded-full text-zinc-400 hover:text-red-500 shadow-sm z-10 transition-colors"
                >
                    <X size={20} />
                </button>

                {/* ── LEFT: University Stats (drop zone) ── */}
                <div
                    ref={dropZoneRef}
                    onDragOver={handleDropZoneDragOver}
                    onDragLeave={handleDropZoneDragLeave}
                    onDrop={handleDrop}
                    className={`w-2/5 bg-white p-8 overflow-y-auto flex flex-col border-r border-zinc-200 transition-colors duration-200 ${isDragOver ? 'bg-purple-50 border-purple-300' : ''}`}
                >
                    <div className="flex items-center gap-2 mb-6">
                        <h2 className="text-2xl font-extrabold text-zinc-900">
                            {isEditMode ? 'Edit University' : 'Create University'}
                        </h2>
                    </div>

                    {error && (
                        <div className="p-3 mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl">
                            {error}
                        </div>
                    )}

                    <div className="space-y-4 flex-1 flex flex-col">
                        <div>
                            <label className="block text-sm font-bold text-zinc-700 mb-1">University Name</label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                placeholder="e.g. Harvard University"
                                className="w-full px-4 py-2 bg-zinc-50 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none text-sm"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-zinc-700 mb-1">Abbreviation</label>
                            <input
                                type="text"
                                value={formData.abbreviation}
                                onChange={e => setFormData({ ...formData, abbreviation: e.target.value })}
                                placeholder="e.g. HU"
                                className="w-full px-4 py-2 bg-zinc-50 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none text-sm"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-zinc-700 mb-1 flex items-center gap-1">
                                <Trophy size={14} className="text-green-500" /> ELO Rating
                            </label>
                            <input
                                type="number"
                                value={formData.elo}
                                onChange={e => setFormData({ ...formData, elo: Number(e.target.value) })}
                                className="w-full px-4 py-2 bg-zinc-50 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none text-sm"
                            />
                        </div>

                        {/* Assigned Tags Drop Zone */}
                        <div className="flex-1">
                            <label className="block text-sm font-bold text-zinc-700 mb-2 flex items-center gap-1">
                                <Tag size={14} className="text-purple-500" /> Assigned Tags
                                <span className="ml-auto text-xs font-normal text-zinc-400">← drag tags here</span>
                            </label>
                            <div className={`min-h-[80px] p-3 rounded-xl border-2 border-dashed transition-colors ${isDragOver ? 'border-purple-400 bg-purple-50' : 'border-zinc-200 bg-zinc-50'}`}>
                                {assignedTags.length === 0 ? (
                                    <p className="text-xs text-zinc-400 text-center mt-4">
                                        No tags assigned. Drag from the right panel.
                                    </p>
                                ) : (
                                    <div className="flex flex-wrap gap-2">
                                        {assignedTags.map(tag => (
                                            <div
                                                key={tag.id}
                                                draggable
                                                onDragStart={() => handleAssignedDragStart(tag)}
                                                onDragEnd={handleDragEnd}
                                                className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-purple-100 border border-purple-200 text-purple-700 text-xs font-bold cursor-grab active:cursor-grabbing group"
                                            >
                                                <GripVertical size={12} className="text-purple-400" />
                                                {tag.name}
                                                <button
                                                    type="button"
                                                    onClick={() => removeTag(tag.id)}
                                                    className="ml-1 text-purple-400 hover:text-red-500 transition-colors"
                                                >
                                                    <X size={12} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="mt-auto pt-4 flex gap-3">
                            <button
                                onClick={handleSave}
                                className="flex-1 flex items-center justify-center bg-zinc-900 text-white py-3 rounded-xl font-bold hover:bg-zinc-800 transition-all shadow-sm"
                            >
                                <Edit size={18} className="mr-2" />
                                {isEditMode ? 'Update' : 'Create'}
                            </button>
                            {isEditMode && (
                                <button
                                    onClick={handleDelete}
                                    className="flex items-center justify-center bg-red-50 text-red-600 px-4 py-3 rounded-xl font-bold hover:bg-red-100 hover:text-red-700 border border-red-200 transition-all shadow-sm"
                                >
                                    <Trash2 size={18} />
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* ── RIGHT: Tag Section ── */}
                <div
                    className="w-3/5 p-6 bg-zinc-50/50 flex flex-col overflow-hidden"
                    onDragOver={e => e.preventDefault()}
                    onDrop={handleAvailableDrop}
                >
                    <div className="flex flex-col h-full bg-white rounded-3xl p-6 border border-zinc-200">
                        <h3 className="text-lg font-bold text-zinc-800 mb-1 shrink-0">Tag Library</h3>
                        <p className="text-xs text-zinc-400 mb-4 shrink-0">
                            Drag a tag to the left panel to assign it. Drag an assigned tag here to remove it.
                        </p>

                        <div
                            className={`flex-1 overflow-y-auto no-scrollbar transition-colors rounded-2xl p-2 ${draggingTag && assignedTags.some(t => t.id === draggingTag?.id) ? 'bg-red-50 border-2 border-dashed border-red-300' : ''}`}
                        >
                            {allTags.length === 0 ? (
                                <div className="text-center text-zinc-400 text-sm mt-8">Loading tags…</div>
                            ) : (
                                <div className="flex flex-wrap gap-2 content-start pt-1">
                                    {allTags.map(tag => {
                                        const isAssigned = assignedTags.some(a => a.id === tag.id)
                                        return (
                                            <div
                                                key={tag.id}
                                                draggable
                                                onDragStart={() => handleDragStart(tag)}
                                                onDragEnd={handleDragEnd}
                                                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-bold border transition-all cursor-grab active:cursor-grabbing select-none ${isAssigned
                                                    ? 'bg-green-100 border-green-300 text-green-700 opacity-60'
                                                    : 'bg-white border-zinc-200 text-zinc-600 hover:border-purple-300 hover:text-purple-600 hover:shadow-sm'
                                                    }`}
                                            >
                                                <GripVertical size={14} className="text-zinc-300 shrink-0" />
                                                {tag.name}
                                                {isAssigned && (
                                                    <span className="text-xs font-normal text-green-500 ml-1">✓</span>
                                                )}
                                            </div>
                                        )
                                    })}
                                </div>
                            )}
                        </div>

                        {/* Drop hint when dragging assigned tag back */}
                        {draggingTag && assignedTags.some(t => t.id === draggingTag?.id) && (
                            <div className="mt-3 text-center text-xs font-bold text-red-400 animate-pulse shrink-0">
                                Drop here to remove tag
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}