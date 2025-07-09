import { Loader2, Plus, Upload, X } from 'lucide-react'
import { useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { setIsDragging, setShowUploadModal } from '../redux/slices/modalSlice';
import { AnimatePresence, motion } from "framer-motion"


const Modal = (prop) => {
            const { isUploading, handleFileUpload } = prop
            const fileInputRef = useRef(null);
            const dispatch = useDispatch();
            const { uploadProgress, isDragging } = useSelector(state => state.modal);

            const handleDrop = (e) => {
                        e.preventDefault();
                        dispatch(setIsDragging(false))
                        const droppedFiles = e.dataTransfer.files;
                        if (droppedFiles.length > 0) {
                                    handleFileUpload(droppedFiles);
                        }
            };
            const handleDragOver = (e) => {
                        e.preventDefault();
                        setIsDragging(true);
            };

            const handleDragLeave = (e) => {
                        e.preventDefault();
                        setIsDragging(false);
            };
            return (
                        <>
                                    <div

                                                className="fixed inset-0 bg-black/80 bg-opacity-50 flex items-center justify-center z-50 p-4">
                                                <motion.div
                                                            initial={{ opacity: 0, scale: 0.9 }}
                                                            animate={{ opacity: 1, scale: 1 }}
                                                            exit={{ opacity: 0, scale: 0.9 }}
                                                            className="bg-white rounded-lg max-w-md w-full p-6">
                                                            <div className="flex justify-between items-center mb-6">
                                                                        <h2 className="text-xl font-bold text-gray-900">Upload Files</h2>
                                                                        <button
                                                                                    onClick={() => dispatch(setShowUploadModal(false))}
                                                                                    className="text-gray-400 hover:text-gray-600 p-1"
                                                                                    disabled={isUploading}
                                                                        >
                                                                                    <X size={24} />
                                                                        </button>
                                                            </div>

                                                            <div
                                                                        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${isDragging
                                                                                    ? 'border-blue-500 bg-blue-50'
                                                                                    : 'border-gray-300 hover:border-gray-400'
                                                                                    }`}
                                                                        onDrop={handleDrop}
                                                                        onDragOver={handleDragOver}
                                                                        onDragLeave={handleDragLeave}
                                                            >
                                                                        <Upload className="mx-auto mb-4 text-gray-400" size={48} />
                                                                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                                                                                    Drop files here or click to upload
                                                                        </h3>
                                                                        <p className="text-gray-500 mb-4 text-sm">
                                                                                    Support for images, documents, videos, and more
                                                                        </p>
                                                                        <button
                                                                                    onClick={() => fileInputRef.current?.click()}
                                                                                    disabled={isUploading}
                                                                                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                                                                        >
                                                                                    {isUploading ? <Loader2 className="mr-2 animate-spin" size={20} /> : <Plus className="mr-2" size={20} />}
                                                                                    Choose Files
                                                                        </button>
                                                                        <input
                                                                                    ref={fileInputRef}
                                                                                    type="file"
                                                                                    multiple
                                                                                    onChange={(e) => handleFileUpload(e.target.files)}
                                                                                    className="hidden"
                                                                                    disabled={isUploading}
                                                                        />
                                                            </div>

                                                            {/* Upload Progress */}
                                                            {Object.keys(uploadProgress).length > 0 && (
                                                                        <div className="mt-6 space-y-2">
                                                                                    <h4 className="font-medium text-gray-900">Upload Progress:</h4>
                                                                                    {Object.entries(uploadProgress).map(([filename, progress]) => (
                                                                                                <div key={filename} className="text-sm">
                                                                                                            <div className="flex justify-between mb-1">
                                                                                                                        <span className="truncate">{filename}</span>
                                                                                                                        <span className={`${progress.success ? 'text-green-600' : progress.error ? 'text-red-600' : 'text-blue-600'}`}>
                                                                                                                                    {progress.success ? '✓' : progress.error ? '✗' : progress.uploading ? '⏳' : ''}
                                                                                                                        </span>
                                                                                                            </div>
                                                                                                            {progress.error && (
                                                                                                                        <div className="text-red-600 text-xs">{progress.error}</div>
                                                                                                            )}
                                                                                                </div>
                                                                                    ))}
                                                                        </div>
                                                            )}

                                                            <div className="mt-6 flex justify-end space-x-3">
                                                                        <button
                                                                                    onClick={() => dispatch(setShowUploadModal(false))}
                                                                                    disabled={isUploading}
                                                                                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                                                                        >
                                                                                    {isUploading ? 'Uploading...' : 'Cancel'}
                                                                        </button>
                                                            </div>
                                                </motion.div>
                                    </div>
                        </>
            )
}

export default Modal