import { Download, Trash2, X } from 'lucide-react'
import { formatDate, formatFileSize, getFileIcon } from '../utils/utils'
import { motion } from 'framer-motion';

const SingleFile = (prop) => {
            const { setSelectedFile, selectedFile, downloadFile, deleteFile } = prop
            return (
                        <  >
                                    <motion.div
                                                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                                exit={{ opacity: 0, y: 20, scale: 0.95 }}
                                                transition={{ duration: 0.15 }}
                                                className="w-full max-w-md
bg-white rounded-t-2xl md:rounded-lg shadow 
    p-6 h-fit
    fixed bottom-0 left-0 right-0 z-30 mx-auto
     md:bottom-auto md:top-20 md:right-2 md:left-auto"
                                    >
                                                {/* Header */}
                                                <div className="flex justify-between items-start mb-4">
                                                            <h3 className="font-medium text-gray-900 text-lg">File Details</h3>
                                                            <button
                                                                        onClick={() => setSelectedFile(null)}
                                                                        className="text-gray-400 hover:text-gray-600 p-1"
                                                            >
                                                                        <X size={20} />
                                                            </button>
                                                </div>

                                                {/* File Icon + Name */}
                                                <div className="text-center mb-4">
                                                            <div className="text-6xl mb-2">{getFileIcon(selectedFile.type || selectedFile.mimetype)}</div>
                                                            <h4 className="font-medium text-gray-900 break-words text-sm">
                                                                        {selectedFile.name || selectedFile.filename}
                                                            </h4>
                                                </div>

                                                {/* Metadata Section */}
                                                <div className="space-y-2 text-sm bg-gray-50 rounded-lg p-3 mb-4">
                                                            <div className="flex justify-between">
                                                                        <span className="text-gray-600">Size:</span>
                                                                        <span className="text-gray-900 font-medium">{formatFileSize(selectedFile.size || selectedFile.filesize)}</span>
                                                            </div>
                                                            <div className="flex justify-between">
                                                                        <span className="text-gray-600">Type:</span>
                                                                        <span className="text-gray-900 font-medium">{selectedFile.fileType || selectedFile.mimetype || 'Unknown'}</span>
                                                            </div>
                                                            <div className="flex justify-between">
                                                                        <span className="text-gray-600">Uploaded:</span>
                                                                        <span className="text-gray-900 font-medium">{formatDate(selectedFile.uploadDate || selectedFile.createdAt || selectedFile.created_at)}</span>
                                                            </div>
                                                            {selectedFile._id && (
                                                                        <div className="flex justify-between">
                                                                                    <span className="text-gray-600">File ID:</span>
                                                                                    <span className="text-gray-900 font-medium text-xs">{selectedFile._id}</span>
                                                                        </div>
                                                            )}
                                                </div>

                                                {/* Action Buttons */}
                                                <div className="flex space-x-2">
                                                            <button
                                                                        onClick={() => downloadFile(selectedFile)}
                                                                        className="flex-1 bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 text-sm flex items-center justify-center transition-colors"
                                                            >
                                                                        <Download className="mr-1" size={16} />
                                                                        Download
                                                            </button>
                                                            <button
                                                                        onClick={() => deleteFile(selectedFile._id)}
                                                                        className="flex-1 bg-red-600 text-white px-3 py-2 rounded-lg hover:bg-red-700 text-sm flex items-center justify-center transition-colors"
                                                            >
                                                                        <Trash2 className="mr-1" size={16} />
                                                                        Delete
                                                            </button>
                                                </div>
                                    </motion.div>

                        </ >
            )
}

export default SingleFile