import { X, AlertCircle } from 'lucide-react'

type Props = {
    message: string
    onClose: () => void
}

export default function ServerErrorBox({ message, onClose }: Props) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm p-4">
            <div className="bg-white rounded-3xl shadow-xl border border-zinc-200 p-6 max-w-sm w-full relative animate-in fade-in zoom-in-95 duration-200">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-1.5 rounded-full text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition-all"
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="flex flex-col items-center text-center mt-2">
                    <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center mb-4 border border-red-100">
                        <AlertCircle className="w-7 h-7 text-red-500" />
                    </div>
                    <h3 className="text-xl font-black text-zinc-800 mb-2">Server Error</h3>
                    <p className="text-sm text-zinc-500 font-medium leading-relaxed">
                        {message}
                    </p>

                    <button
                        onClick={onClose}
                        className="mt-6 w-full py-2.5 rounded-2xl bg-zinc-100 hover:bg-zinc-200 text-zinc-700 text-sm font-bold transition-all"
                    >
                        Dismiss
                    </button>
                </div>
            </div>
        </div>
    )
}