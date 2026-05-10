/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react'
import { X, Edit, Trash2, Tag as TagIcon, GripVertical, Activity } from 'lucide-react'
import { universityApi } from '../../../api/universityApi'
import type { UniversityResponse, UniversityRequest } from '../../../types/university'

type Props = {
    university?: UniversityResponse
    onClose: () => void
    onSuccess: () => void
}

const formatTag = (tag: string) => {
    return tag
        .split('_')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ')
}

export default function UniversityControllingBox({ university, onClose, onSuccess }: Props) {
    const isEditMode = !!university

    const [formData, setFormData] = useState({
        name: university?.name ?? '',
        abbreviation: university?.abbreviation ?? '',
        elo: university?.elo ?? 1200,
    })

    const [assignedTags, setAssignedTags] = useState<string[]>(university?.tags ?? [])
    const [allTags, setAllTags] = useState<string[]>([])
    const [error, setError] = useState('')
    const [draggingTag, setDraggingTag] = useState<string | null>(null)
    const [isDragOver, setIsDragOver] = useState(false)

    useEffect(() => {
        universityApi.getAllTags().then(setAllTags).catch(console.error)
    }, [])

    /* ── Drag handlers ── */
    const handleDragStart = (tag: string) => setDraggingTag(tag)
    const handleDragEnd = () => setDraggingTag(null)

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragOver(false)
        if (draggingTag && !assignedTags.includes(draggingTag)) {
            setAssignedTags(prev => [...prev, draggingTag])
        }
        setDraggingTag(null)
    }

    const handleAvailableDrop = (e: React.DragEvent) => {
        e.preventDefault()
        if (draggingTag) {
            setAssignedTags(prev => prev.filter(t => t !== draggingTag))
        }
        setDraggingTag(null)
    }

    const removeTag = (tag: string) => setAssignedTags(prev => prev.filter(t => t !== tag))

    /* ── Submit ── */
    const buildPayload = (): UniversityRequest => ({
        name: formData.name,
        abbreviation: formData.abbreviation,
        elo: Number(formData.elo),
        tags: assignedTags,
    })

    const handleSave = async () => {
        setError('')
        if (!formData.name.trim()) return setError('University name is required.')
        if (!formData.abbreviation.trim()) return setError('Abbreviation is required.')
        try {
            if (isEditMode && university) {
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
            <div className="bg-[var(--bg-main)] dark:bg-[#030005] border border-[var(--border-color)] rounded-[2rem] w-full max-w-5xl h-[620px] flex overflow-hidden shadow-2xl relative transition-colors duration-300">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 bg-[var(--bg-side)] border border-[var(--border-color)] rounded-full text-[var(--text-primary)] opacity-40 hover:opacity-100 hover:text-red-500 shadow-sm z-10"
                >
                    <X size={20} />
                </button>

                {/* LEFT: Editor */}
                <div
                    onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
                    onDragLeave={() => setIsDragOver(false)}
                    onDrop={handleDrop}
                    className={`w-2/5 bg-[var(--bg-side)] dark:bg-[#0a0a0a] p-8 overflow-y-auto flex flex-col border-r border-[var(--border-color)] transition-colors duration-200 ${isDragOver ? 'border-[var(--accent-purple)] bg-[var(--accent-purple)]/5' : ''}`}
                >
                    <h2 className="text-2xl font-extrabold text-[var(--text-primary)] mb-6">
                        {isEditMode ? 'Edit University' : 'Create University'}
                    </h2>

                    {error && (
                        <div className="p-3 mb-4 text-sm text-red-500 bg-red-500/10 border border-red-500/20 rounded-xl">{error}</div>
                    )}

                    <div className="space-y-4 flex-1 flex flex-col">
                        {/* Name Field */}
                        <div className="space-y-1">
                            <label className="block text-sm font-bold text-[var(--text-primary)] opacity-60">University Name</label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                className="w-full px-4 py-2 bg-[var(--bg-main)] border border-[var(--border-color)] rounded-xl focus:ring-2 focus:ring-[var(--accent-purple)]/50 outline-none text-sm text-[var(--text-primary)] transition-all"
                            />
                        </div>

                        {/* Abbreviation Field */}
                        <div className="space-y-1">
                            <label className="block text-sm font-bold text-[var(--text-primary)] opacity-60">Abbreviation</label>
                            <input
                                type="text"
                                value={formData.abbreviation}
                                onChange={e => setFormData({ ...formData, abbreviation: e.target.value })}
                                className="w-full px-4 py-2 bg-[var(--bg-main)] border border-[var(--border-color)] rounded-xl focus:ring-2 focus:ring-[var(--accent-purple)]/50 outline-none text-sm text-[var(--text-primary)] transition-all"
                                placeholder="e.g. MIT"
                            />
                        </div>

                        {/* ELO Field */}
                        <div className="space-y-1">
                            <label className="text-sm font-bold text-[var(--text-primary)] opacity-60 flex items-center gap-1">
                                <Activity size={14} className="text-[var(--accent-purple)]" /> Elo Rating
                            </label>
                            <input
                                type="number"
                                value={formData.elo}
                                onChange={e => setFormData({ ...formData, elo: Number(e.target.value) })}
                                className="w-full px-4 py-2 bg-[var(--bg-main)] border border-[var(--border-color)] rounded-xl focus:ring-2 focus:ring-[var(--accent-purple)]/50 outline-none text-sm text-[var(--text-primary)] transition-all"
                            />
                        </div>

                        <div className="flex-1">
                            <label className="text-sm font-bold text-[var(--text-primary)] opacity-60 mb-2 flex items-center gap-1">
                                <TagIcon size={14} className="text-[var(--accent-purple)]" /> Assigned Tags
                            </label>
                            <div className={`min-h-[120px] p-3 rounded-xl border-2 border-dashed transition-colors ${isDragOver ? 'border-[var(--accent-purple)] bg-[var(--accent-purple)]/5' : 'border-[var(--border-color)] bg-[var(--bg-main)]/50'}`}>
                                <div className="flex flex-wrap gap-2">
                                    {assignedTags.map(tag => (
                                        <div
                                            key={tag}
                                            draggable
                                            onDragStart={() => handleDragStart(tag)}
                                            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[var(--accent-purple)]/20 border border-[var(--accent-purple)]/30 text-[var(--accent-purple)] dark:text-[#e879f9] text-xs font-bold cursor-grab active:cursor-grabbing"
                                        >
                                            <GripVertical size={12} className="opacity-40" />
                                            {formatTag(tag)}
                                            <button onClick={() => removeTag(tag)} className="ml-1 opacity-40 hover:opacity-100 hover:text-red-500"><X size={12} /></button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="mt-auto pt-4 flex gap-3">
                            <button onClick={handleSave} className="flex-1 flex items-center justify-center bg-[var(--text-primary)] text-[var(--bg-main)] py-3 rounded-xl font-bold hover:opacity-90 transition-all shadow-md active:scale-95">
                                <Edit size={18} className="mr-2" /> {isEditMode ? 'Update' : 'Create'}
                            </button>
                            {isEditMode && (
                                <button onClick={handleDelete} className="bg-red-500/10 text-red-500 px-4 py-3 rounded-xl font-bold hover:bg-red-500/20 border border-red-500/20 transition-all">
                                    <Trash2 size={18} />
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* RIGHT: Library */}
                <div
                    className="w-3/5 p-6 bg-[var(--bg-main)]/50 flex flex-col"
                    onDragOver={e => e.preventDefault()}
                    onDrop={handleAvailableDrop}
                >
                    <div className="flex flex-col h-full bg-[var(--bg-side)] dark:bg-[#0d0d0d]/40 rounded-3xl p-6 border border-[var(--border-color)]">
                        <h3 className="text-lg font-bold text-[var(--text-primary)] mb-1">Tag Library</h3>
                        <p className="text-xs text-[var(--text-primary)] opacity-40 mb-4 font-medium">Drag tags to assign or remove.</p>

                        <div className="flex-1 overflow-y-auto no-scrollbar">
                            <div className="flex flex-wrap gap-2 content-start">
                                {allTags.map(tag => {
                                    const isAssigned = assignedTags.includes(tag)
                                    return (
                                        <div
                                            key={tag}
                                            draggable
                                            onDragStart={() => handleDragStart(tag)}
                                            onDragEnd={handleDragEnd}
                                            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-bold border transition-all cursor-grab active:cursor-grabbing ${isAssigned ? 'bg-green-500/10 border-green-500/30 text-green-500 opacity-40' : 'bg-[var(--bg-main)] border-[var(--border-color)] text-[var(--text-primary)] opacity-60 hover:border-[var(--accent-purple)] hover:text-[var(--accent-purple)]'
                                                }`}
                                        >
                                            <GripVertical size={14} className="opacity-20 shrink-0" />
                                            {formatTag(tag)}
                                            {isAssigned && <span className="text-xs font-normal text-green-500 ml-1">✓</span>}
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}