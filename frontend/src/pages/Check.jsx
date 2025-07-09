
// components/FileCard.js
import React from 'react';
import { Download, Eye, Clock, CheckCircle, XCircle } from 'lucide-react';

export const FileCard = ({ file, onDownload, onView }) => {
            const getStatusIcon = () => {
                        switch (file?.aiProcessingStatus) {
                                    case 'completed':
                                                return <CheckCircle className="w-4 h-4 text-green-500" />;
                                    case 'processing':
                                                return <Clock className="w-4 h-4 text-blue-500 animate-spin" />;
                                    case 'pending':
                                                return <Clock className="w-4 h-4 text-yellow-500" />;
                                    case 'failed':
                                                return <XCircle className="w-4 h-4 text-red-500" />;
                                    default:
                                                return null;
                        }
            };

            const getFileIcon = () => {
                        if (file?.type.includes('image/')) return '🖼️';
                        if (file?.type.includes('pdf')) return '📄';
                        if (file?.type.includes('word')) return '📝';
                        if (file?.type.includes('text')) return '📄';
                        return '📁';
            };

            return (
                        <div className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow border">
                                    {/* Header */}
                                    <div className="flex items-start justify-between mb-3">
                                                <div className="flex items-center space-x-3">
                                                            <span className="text-2xl">{getFileIcon()}</span>
                                                            <div>
                                                                        <h3 className="font-semibold text-gray-800 text-sm">
                                                                                    {file?.name}
                                                                        </h3>
                                                                        <p className="text-xs text-gray-500">
                                                                                    {new Date(file?.uploadDate).toLocaleDateString()}
                                                                        </p>
                                                            </div>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                            {getStatusIcon()}
                                                            <span className="text-xs text-gray-500">
                                                                        {(file?.size / 1024).toFixed(1)} KB
                                                            </span>
                                                </div>
                                    </div>

                                    {/* AI Summary */}
                                    {file?.aiSummary && (
                                                <div className="mb-3 p-3 bg-blue-50 rounded-md">
                                                            <p className="text-sm text-gray-700">{file?.aiSummary}</p>
                                                            <p className="text-sm text-gray-700">{"sadogisjdo"}</p>
                                                </div>
                                    )}

                                    {/* Processing Status */}
                                    {file?.aiProcessingStatus !== 'pending' && (
                                                <div className="mb-3 p-2 bg-yellow-50 rounded-md">
                                                            <p className="text-xs text-yellow-700">⏳ AI analysis queued...</p>
                                                </div>
                                    )}

                                    {file?.aiProcessingStatus !== 'processing' && (
                                                <div className="mb-3 p-2 bg-blue-50 rounded-md">
                                                            <p className="text-xs text-blue-700">🔄 Analyzing content...</p>
                                                </div>
                                    )}

                                    {/* Tags */}
                                    {file?.aiTags && file.aiTags.length > 0 && (
                                                <div className="mb-3 flex flex-wrap gap-1">
                                                            {file.aiTags.map((tag, index) => (
                                                                        <span
                                                                                    key={index}
                                                                                    className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs"
                                                                        >
                                                                                    #{tag}
                                                                        </span>
                                                            ))}
                                                </div>
                                    )}

                                    {/* Category */}
                                    {file?.aiCategory && (
                                                <div className="mb-3">
                                                            <span className="inline-block px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">
                                                                        {file.aiCategory}
                                                            </span>
                                                </div>
                                    )}

                                    {/* Actions */}
                                    <div className="flex space-x-2">
                                                <button
                                                            onClick={() => onView(file)}
                                                            className="flex-1 bg-blue-500 text-white py-2 px-3 rounded-md hover:bg-blue-600 transition-colors flex items-center justify-center space-x-1 text-sm"
                                                >
                                                            <Eye className="w-4 h-4" />
                                                            <span>View</span>
                                                </button>
                                                <button
                                                            onClick={() => onDownload(file)}
                                                            className="flex-1 bg-gray-500 text-white py-2 px-3 rounded-md hover:bg-gray-600 transition-colors flex items-center justify-center space-x-1 text-sm"
                                                >
                                                            <Download className="w-4 h-4" />
                                                            <span>Download</span>
                                                </button>
                                    </div>
                        </div>
            );
};

// Main Files Display Component
const FilesDisplay = () => {
            const [files, setFiles] = React.useState([]);
            const [searchTerm, setSearchTerm] = React.useState('');
            const [selectedCategory, setSelectedCategory] = React.useState('all');
            const [loading, setLoading] = React.useState(true);

            // Fetch files
            React.useEffect(() => {
                        fetchFiles();
            }, [searchTerm, selectedCategory]);

            const fetchFiles = async () => {
                        try {
                                    const params = new URLSearchParams();
                                    if (searchTerm) params.append('search', searchTerm);
                                    if (selectedCategory !== 'all') params.append('category', selectedCategory);

                                    const response = await fetch(`/api/files?${params}`);
                                    const data = await response.json();

                                    if (data.success) {
                                                setFiles(data.files);
                                    }
                        } catch (error) {
                                    console.error('Error fetching files:', error);
                        } finally {
                                    setLoading(false);
                        }
            };

            const categories = ['all', 'document', 'image', 'contract', 'report', 'photo', 'other'];

            const handleDownload = (file) => {
                        window.open(`/api/files/${file.id}/download`, '_blank');
            };

            const handleView = (file) => {
                        window.open(`/api/files/${file.id}/view`, '_blank');
            };

            return (
                        <div className="max-w-7xl mx-auto p-6">
                                    <h1 className="text-3xl font-bold text-gray-800 mb-8">My Smart Drive</h1>

                                    {/* Search and Filter */}
                                    <div className="mb-8 bg-white rounded-lg shadow-md p-4">
                                                <div className="flex flex-col md:flex-row gap-4">
                                                            <div className="flex-1">
                                                                        <input
                                                                                    type="text"
                                                                                    placeholder="Search files by name, content, or tags..."
                                                                                    value={searchTerm}
                                                                                    onChange={(e) => setSearchTerm(e.target.value)}
                                                                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                                        />
                                                            </div>
                                                            <div>
                                                                        <select
                                                                                    value={selectedCategory}
                                                                                    onChange={(e) => setSelectedCategory(e.target.value)}
                                                                                    className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                                        >
                                                                                    {categories.map(cat => (
                                                                                                <option key={cat} value={cat}>
                                                                                                            {cat.charAt(0).toUpperCase() + cat.slice(1)}
                                                                                                </option>
                                                                                    ))}
                                                                        </select>
                                                            </div>
                                                </div>
                                    </div>

                                    {/* Files Grid */}
                                    {loading ? (
                                                <div className="text-center py-8">
                                                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                                                            <p className="mt-4 text-gray-600">Loading files...</p>
                                                </div>
                                    ) : (
                                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                                            {files.map(file => (
                                                                        <FileCard
                                                                                    key={file.id}
                                                                                    file={file}
                                                                                    onDownload={handleDownload}
                                                                                    onView={handleView}
                                                                        />
                                                            ))}
                                                </div>
                                    )}

                                    {files.length === 0 && !loading && (
                                                <div className="text-center py-8">
                                                            <p className="text-gray-600">No files found. Upload some files to get started!</p>
                                                </div>
                                    )}
                        </div>
            );
};

export default FilesDisplay;