import { useState, useEffect } from 'react';
import { Trash2, Download, Search, Plus, FolderOpen, Eye, EllipsisVertical } from 'lucide-react';
import { AnimatePresence, motion } from "framer-motion";
import Error from '../components/Error';
import toast from 'react-hot-toast';
import Modal from '../components/Modal';
import { useDispatch, useSelector } from 'react-redux';
import { setIsUploading, setShowUploadModal, setUploadProgress } from '../redux/slices/modalSlice';
import SingleFile from '../components/SingleFile';
import { formatDate, formatFileSize, getFileIcon } from '../utils/utils';
import { fetchFiles, setError, setFiles } from '../redux/slices/fetchSlice';
import axiosInstance from '../axios/axios';
import API_ENDPOINTS from '../axios/ApiConfig';
import FileUpdatePop from '../components/FileUpdatePop';


const GoogleDriveClone = () => {

            const { showUploadModal, viewMode } = useSelector(state => state.modal);
            const { searchTerm, error, files } = useSelector(state => state.fetch)
            const [selectedFile, setSelectedFile] = useState(null);
            const [dot, setDot] = useState("");
            const [fileRename, setFileRename] = useState("");
            const [filename, setFilename] = useState("")



            const dispatch = useDispatch();

            useEffect(() => {
                        dispatch(fetchFiles())
            }, []);

            const updateDocsName = async (id) => {
                        try {
                                    const { data } = await axiosInstance.patch(API_ENDPOINTS.update(id), { filename })
                                    toast.success(data.message)
                                    setFileRename("")
                                    setDot("")
                        } catch (error) {
                                    console.log("Update file error", error)
                        }
            }


            const handleFileUpload = async (uploadedFiles) => {
                        const fileArray = Array.from(uploadedFiles);
                        dispatch(setIsUploading(true))
                        dispatch(setError(null))

                        for (let i = 0; i < fileArray.length; i++) {
                                    const file = fileArray[i];
                                    const formData = new FormData();
                                    formData.append('file', file);

                                    // You can add additional metadata 
                                    formData.append('filename', file.name);
                                    formData.append('filesize', file.size.toString());
                                    formData.append('filetype', file.type);

                                    try {
                                                dispatch(setUploadProgress({
                                                            [file.name]: { uploading: true, progress: 0 }
                                                }));

                                                const { data } = await axiosInstance.post(API_ENDPOINTS.upload, formData, { withCredentials: true });

                                                // Add the uploaded file to the files lis
                                                dispatch(setFiles(data.file))
                                                // setFiles(prev => [...prev, ...data.file])
                                                // data.file.map(item => setFiles(prev => [...prev, item]))

                                                dispatch(setUploadProgress({
                                                            [file.name]: { uploading: false, progress: 100, success: true }
                                                }));

                                    } catch (err) {
                                                // console.error('Error uploading file:', err);
                                                dispatch(setUploadProgress(
                                                            {
                                                                        [file.name]: { uploading: false, progress: 0, error: err.message }
                                                            }
                                                ))
                                                setError(`Failed to upload ${file.name}: ${err.message}`);
                                                console.log(err)
                                                toast.error(err.message)
                                    } finally {
                                                dispatch(setIsUploading(false))
                                    }
                        }

                        dispatch(setIsUploading(false))
                        // Clear upload progress after a delay
                        setTimeout(() => {
                                    dispatch(setUploadProgress({}))
                        }, 3000);

                        // Close modal after successful uploads
                        if (!error) {
                                    dispatch(setShowUploadModal(false));
                        }
            };

            const deleteFile = async (fileId) => {
                        if (!confirm('Are you sure you want to delete this file?')) {
                                    return;
                        }
                        try {

                                    const { data } = await axiosInstance.delete(API_ENDPOINTS.delete(fileId), { withCredentials: true })
                                    dispatch(fetchFiles())
                                    toast.success(data.message)
                                    // Remove file from local state
                                    setFiles(prev => prev.filter(file => file._id !== fileId));

                                    // Close preview if deleted file was selected
                                    if (selectedFile && selectedFile._id === fileId) {
                                                setSelectedFile(null);
                                    }
                        } catch (err) {
                                    console.error('Error deleting file:', err);
                                    dispatch(setError(`Failed to delete file: ${err.message}`))
                        }
            };

            const downloadFile = async (file) => {
                        try {
                                    const { data } = await axiosInstance.get(API_ENDPOINTS.download(file._id), { responseType: "blob" });
                                    const blob = new Blob([data], { type: "image/jpeg" })
                                    const url = window.URL.createObjectURL(blob)

                                    const link = document.createElement('a');
                                    link.href = url;
                                    link.download = file.name || file.filename || 'download';
                                    document.body.appendChild(link);
                                    link.click();

                                    document.body.removeChild(link);
                                    window.URL.revokeObjectURL(url);
                        } catch (err) {
                                    console.error('Error downloading file:', err);
                                    dispatch(setError(`Failed to download file: ${err.message}`));
                        }
            };

            const filteredFiles = files.filter(file => (file.name || file.filename || '').toLowerCase().includes(searchTerm.toLowerCase()));


            const openFile = (file, e) => {
                        if (e.target.tagName === "svg") return
                        setSelectedFile(file);
                        setDot("")
            };


            return (
                        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
                                    {/* Error Banner */}
                                    {error && <Error />}

                                    {/* Main Content */}
                                    <motion.main
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: 20 }}

                                                className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 ">
                                                <div className="flex gap-8">
                                                            {/* Files Display */}
                                                            <div className={`${selectedFile ? 'flex-1' : 'w-full'}`}>
                                                                        {filteredFiles.length > 0 ? (
                                                                                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-100">
                                                                                                <div className="px-6 py-5 border-b border-gray-100">
                                                                                                            <h2 className="text-xl font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                                                                                                        My Files ({filteredFiles.length})
                                                                                                            </h2>
                                                                                                </div>

                                                                                                {viewMode === 'grid' ? (
                                                                                                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-5 p-6">

                                                                                                                        {filteredFiles.map(file => (
                                                                                                                                    <motion.div
                                                                                                                                                key={file._id}
                                                                                                                                                initial={{ opacity: 0, scale: 0.9 }}
                                                                                                                                                animate={{ opacity: 1, scale: 1 }}
                                                                                                                                                whileHover={{ y: -4 }}
                                                                                                                                                className="relative bg-gradient-to-br from-white to-gray-50 rounded-xl p-5 border border-gray-200 hover:border-blue-300 hover:shadow-xl transition-all cursor-pointer group"
                                                                                                                                                onClick={(e) => openFile(file, e)}
                                                                                                                                    >
                                                                                                                                                <div className="text-center relative">
                                                                                                                                                            {/* Dots menu */}
                                                                                                                                                            <button
                                                                                                                                                                        onClick={() => setDot(file._id)}
                                                                                                                                                                        className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 cursor-pointer hover:bg-white p-1.5 rounded-lg transition-all"
                                                                                                                                                            >
                                                                                                                                                                        <EllipsisVertical size={16} className="text-gray-600" />
                                                                                                                                                            </button>

                                                                                                                                                            {/* Dropdown menu */}
                                                                                                                                                            {dot === file._id && (
                                                                                                                                                                        <div className="absolute top-0 right-12 w-36 bg-white rounded-xl shadow-xl border border-gray-200 z-50 overflow-hidden">
                                                                                                                                                                                    <button
                                                                                                                                                                                                className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 transition-colors"
                                                                                                                                                                                                onClick={(e) => {
                                                                                                                                                                                                            e.stopPropagation();
                                                                                                                                                                                                            setFileRename(file._id);
                                                                                                                                                                                                }}
                                                                                                                                                                                    >
                                                                                                                                                                                                Edit Name
                                                                                                                                                                                    </button>
                                                                                                                                                                        </div>
                                                                                                                                                            )}

                                                                                                                                                            {/* Rename Popup */}
                                                                                                                                                            {fileRename === file._id && (
                                                                                                                                                                        <FileUpdatePop
                                                                                                                                                                                    filename={filename}
                                                                                                                                                                                    setFilename={setFilename}
                                                                                                                                                                                    setDot={setDot}
                                                                                                                                                                                    setFileRename={setFileRename}
                                                                                                                                                                                    updateDocsName={updateDocsName}
                                                                                                                                                                                    id={file._id}
                                                                                                                                                                        />
                                                                                                                                                            )}

                                                                                                                                                            {/* Icon */}
                                                                                                                                                            <div className="text-5xl mb-4">{getFileIcon(file.type || file.mimetype)}</div>

                                                                                                                                                            {/* Filename */}
                                                                                                                                                            <h3 className="font-semibold text-gray-800 truncate mb-2 text-sm">
                                                                                                                                                                        {file.name || file.filename}
                                                                                                                                                            </h3>

                                                                                                                                                            {/* File size */}
                                                                                                                                                            <p className="text-xs text-gray-500 mb-2">
                                                                                                                                                                        {formatFileSize(file.size || file.filesize)}
                                                                                                                                                            </p>

                                                                                                                                                            {/* Date */}
                                                                                                                                                            <p className="text-xs text-gray-400 mb-3">
                                                                                                                                                                        {formatDate(file.uploadDate || file.createdAt || file.created_at)}
                                                                                                                                                            </p>

                                                                                                                                                            {/* AI Summary (if available) */}
                                                                                                                                                            {file.aiProcessed && (
                                                                                                                                                                        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-3 mb-3 text-left space-y-1">
                                                                                                                                                                                    <p className="text-xs text-gray-700">
                                                                                                                                                                                                <span className="font-semibold text-blue-700">Summary:</span> {file.aiSummary || '—'}
                                                                                                                                                                                    </p>
                                                                                                                                                                                    <div className="flex flex-wrap gap-1">
                                                                                                                                                                                                {file.aiTags?.map((tag, i) => (
                                                                                                                                                                                                            <span key={i} className="px-2 py-0.5 bg-white rounded-full text-[10px] text-gray-600 border border-gray-200">
                                                                                                                                                                                                                        {tag}
                                                                                                                                                                                                            </span>
                                                                                                                                                                                                ))}
                                                                                                                                                                                    </div>
                                                                                                                                                                                    <p className="text-xs text-gray-700">
                                                                                                                                                                                                <span className="font-semibold text-blue-700">Category:</span> {file.aiCategory || '—'}
                                                                                                                                                                                    </p>
                                                                                                                                                                        </div>
                                                                                                                                                            )}

                                                                                                                                                            {/* Status */}
                                                                                                                                                            <div className="flex items-center justify-center mb-3">
                                                                                                                                                                        <span className={`text-[10px] px-2 py-1 rounded-full font-medium ${file.aiProcessingStatus === 'completed'
                                                                                                                                                                                                ? 'bg-green-100 text-green-700'
                                                                                                                                                                                                : file.aiProcessingStatus === 'pending'
                                                                                                                                                                                                            ? 'bg-yellow-100 text-yellow-700'
                                                                                                                                                                                                            : 'bg-gray-100 text-gray-600'
                                                                                                                                                                                    }`}>
                                                                                                                                                                                    AI: {file.aiProcessingStatus || 'n/a'}
                                                                                                                                                                        </span>
                                                                                                                                                            </div>

                                                                                                                                                            {/* Hover Actions */}
                                                                                                                                                            <div className="flex justify-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                                                                                                                                        <button
                                                                                                                                                                                    onClick={(e) => {
                                                                                                                                                                                                e.stopPropagation();
                                                                                                                                                                                                openFile(file);
                                                                                                                                                                                    }}
                                                                                                                                                                                    className="p-2 bg-blue-100 text-blue-600 hover:bg-blue-200 rounded-lg transition-colors"
                                                                                                                                                                                    title="View"
                                                                                                                                                                        >
                                                                                                                                                                                    <Eye size={14} />
                                                                                                                                                                        </button>
                                                                                                                                                                        <button
                                                                                                                                                                                    onClick={(e) => {
                                                                                                                                                                                                e.stopPropagation();
                                                                                                                                                                                                downloadFile(file);
                                                                                                                                                                                    }}
                                                                                                                                                                                    className="p-2 bg-green-100 text-green-600 hover:bg-green-200 rounded-lg transition-colors"
                                                                                                                                                                                    title="Download"
                                                                                                                                                                        >
                                                                                                                                                                                    <Download size={14} />
                                                                                                                                                                        </button>
                                                                                                                                                                        <button
                                                                                                                                                                                    onClick={(e) => {
                                                                                                                                                                                                e.stopPropagation();
                                                                                                                                                                                                deleteFile(file._id);
                                                                                                                                                                                    }}
                                                                                                                                                                                    className="p-2 bg-red-100 text-red-600 hover:bg-red-200 rounded-lg transition-colors"
                                                                                                                                                                                    title="Delete"
                                                                                                                                                                        >
                                                                                                                                                                                    <Trash2 size={14} />
                                                                                                                                                                        </button>
                                                                                                                                                            </div>
                                                                                                                                                </div>
                                                                                                                                    </motion.div>

                                                                                                                        ))}
                                                                                                            </div>
                                                                                                ) : (
                                                                                                            <div className="divide-y divide-gray-100">
                                                                                                                        {filteredFiles.map(file => (
                                                                                                                                    <motion.div
                                                                                                                                                key={file._id}
                                                                                                                                                initial={{ opacity: 0, x: -20 }}
                                                                                                                                                animate={{ opacity: 1, x: 0 }}
                                                                                                                                                className="flex flex-col md:flex-row md:items-center md:justify-between p-5 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 cursor-pointer transition-all"
                                                                                                                                                onClick={() => openFile(file)}
                                                                                                                                    >
                                                                                                                                                <div className="flex items-start md:items-center flex-1 min-w-0">
                                                                                                                                                            <span className="text-3xl mr-4 flex-shrink-0">{getFileIcon(file.type || file.mimetype)}</span>

                                                                                                                                                            <div className="flex-1 min-w-0">
                                                                                                                                                                        {/* Filename and details */}
                                                                                                                                                                        <h3 className="font-semibold text-gray-800 truncate">{file.name || file.filename}</h3>
                                                                                                                                                                        <p className="text-sm text-gray-500">
                                                                                                                                                                                    {formatFileSize(file.size || file.filesize)} • {formatDate(file.uploadDate || file.createdAt || file.created_at)}
                                                                                                                                                                        </p>

                                                                                                                                                                        {/* AI info (only if processed) */}
                                                                                                                                                                        {file.aiProcessed && (
                                                                                                                                                                                    <div className="mt-2 space-y-1">
                                                                                                                                                                                                <p className="text-xs text-gray-700">
                                                                                                                                                                                                            <span className="font-semibold text-blue-700">Summary:</span> {file.aiSummary || '—'}
                                                                                                                                                                                                </p>
                                                                                                                                                                                                <div className="flex flex-wrap gap-1">
                                                                                                                                                                                                            {file.aiTags?.map((tag, i) => (
                                                                                                                                                                                                                        <span key={i} className="px-2 py-0.5 bg-blue-100 rounded-full text-[10px] text-blue-700">
                                                                                                                                                                                                                                    {tag}
                                                                                                                                                                                                                        </span>
                                                                                                                                                                                                            ))}
                                                                                                                                                                                                </div>
                                                                                                                                                                                                <p className="text-xs text-gray-700">
                                                                                                                                                                                                            <span className="font-semibold text-blue-700">Category:</span> {file.aiCategory || '—'}
                                                                                                                                                                                                </p>
                                                                                                                                                                                    </div>
                                                                                                                                                                        )}

                                                                                                                                                                        {/* Always show AI status */}
                                                                                                                                                                        <span className={`inline-block mt-2 text-[10px] px-2 py-0.5 rounded-full font-medium ${file.aiProcessingStatus === 'completed'
                                                                                                                                                                                                ? 'bg-green-100 text-green-700'
                                                                                                                                                                                                : file.aiProcessingStatus === 'pending'
                                                                                                                                                                                                            ? 'bg-yellow-100 text-yellow-700'
                                                                                                                                                                                                            : 'bg-gray-100 text-gray-600'
                                                                                                                                                                                    }`}>
                                                                                                                                                                                    AI: {file.aiProcessingStatus || 'n/a'}
                                                                                                                                                                        </span>
                                                                                                                                                            </div>
                                                                                                                                                </div>

                                                                                                                                                {/* Actions */}
                                                                                                                                                <div className="flex items-center space-x-2 mt-3 md:mt-0 md:ml-4">
                                                                                                                                                            <button
                                                                                                                                                                        onClick={(e) => {
                                                                                                                                                                                    e.stopPropagation();
                                                                                                                                                                                    openFile(file);
                                                                                                                                                                        }}
                                                                                                                                                                        className="p-2 bg-blue-100 text-blue-600 hover:bg-blue-200 rounded-lg transition-colors"
                                                                                                                                                                        title="View"
                                                                                                                                                            >
                                                                                                                                                                        <Eye size={16} />
                                                                                                                                                            </button>
                                                                                                                                                            <button
                                                                                                                                                                        onClick={(e) => {
                                                                                                                                                                                    e.stopPropagation();
                                                                                                                                                                                    downloadFile(file);
                                                                                                                                                                        }}
                                                                                                                                                                        className="p-2 bg-green-100 text-green-600 hover:bg-green-200 rounded-lg transition-colors"
                                                                                                                                                                        title="Download"
                                                                                                                                                            >
                                                                                                                                                                        <Download size={16} />
                                                                                                                                                            </button>
                                                                                                                                                            <button
                                                                                                                                                                        onClick={(e) => {
                                                                                                                                                                                    e.stopPropagation();
                                                                                                                                                                                    deleteFile(file._id);
                                                                                                                                                                        }}
                                                                                                                                                                        className="p-2 bg-red-100 text-red-600 hover:bg-red-200 rounded-lg transition-colors"
                                                                                                                                                                        title="Delete"
                                                                                                                                                            >
                                                                                                                                                                        <Trash2 size={16} />
                                                                                                                                                            </button>
                                                                                                                                                </div>
                                                                                                                                    </motion.div>
                                                                                                                        ))}
                                                                                                            </div>

                                                                                                )}
                                                                                    </div>
                                                                        ) : "" ? (
                                                                                    <div className="text-center py-16 bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-100">
                                                                                                <Search className="mx-auto text-gray-400 mb-4" size={48} />
                                                                                                <h3 className="text-lg font-medium text-gray-900 mb-2">
                                                                                                            No files found
                                                                                                </h3>
                                                                                                <p className="text-gray-500">
                                                                                                            Try adjusting your search terms or upload some files
                                                                                                </p>
                                                                                    </div>
                                                                        ) : (
                                                                                    <motion.div
                                                                                                initial={{ opacity: 0, scale: 0.9 }}
                                                                                                animate={{ opacity: 1, scale: 1 }}
                                                                                                className="text-center py-20 bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-100"
                                                                                    >
                                                                                                <div className="bg-gradient-to-br from-blue-100 to-purple-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                                                                                                            <FolderOpen className="text-blue-600" size={48} />
                                                                                                </div>
                                                                                                <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3">
                                                                                                            Welcome to MyDrive
                                                                                                </h3>
                                                                                                <p className="text-gray-600 mb-8 max-w-md mx-auto">
                                                                                                            Your personal cloud storage space. Upload your first file to get started.
                                                                                                </p>
                                                                                                <button
                                                                                                            onClick={() => dispatch(setShowUploadModal(true))}
                                                                                                            className="inline-flex items-center px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
                                                                                                >
                                                                                                            <Plus className="mr-2" size={20} />
                                                                                                            Upload Files
                                                                                                </button>
                                                                                    </motion.div>
                                                                        )}
                                                            </div>

                                                            {/* File Preview Sidebar */}
                                                            <AnimatePresence >
                                                                        <div className='relative z-30'>
                                                                                    {selectedFile && <SingleFile
                                                                                                downloadFile={downloadFile}
                                                                                                setSelectedFile={setSelectedFile}
                                                                                                selectedFile={selectedFile}
                                                                                                deleteFile={deleteFile}
                                                                                    />}
                                                                        </div>

                                                            </AnimatePresence>
                                                </div>
                                    </motion.main >

                                    {/* Upload Modal */}
                                    {showUploadModal && <Modal handleFileUpload={handleFileUpload} />}
                        </div >
            );
};

export default GoogleDriveClone;