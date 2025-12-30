import { FolderOpen, Grid, List, Search, Plus, Loader2, RefreshCcw } from 'lucide-react'
import { setShowUploadModal, setViewMode } from '../redux/slices/modalSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useState } from 'react';
import { fetchFiles } from '../redux/slices/fetchSlice';
import AccountMenu from './Account';
import { useLocation, useNavigate } from 'react-router-dom';


const Header = () => {
            const [searchTerm, setSearchTerm] = useState('');
            const location = useLocation();
            const navigate = useNavigate();
            const dispatch = useDispatch();
            const { isUploading, viewMode } = useSelector(state => state.modal);
            const { isLoading } = useSelector(state => state.fetch);

            return (
                        <>
                                    <header className="bg-white/90 backdrop-blur-xl shadow-lg border-b border-gray-200/50 sticky top-0 z-40">
                                                <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
                                                            <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center py-3 sm:py-4 lg:py-0 lg:h-20 gap-4 lg:gap-6">

                                                                        {/* Logo / Title */}
                                                                        <div className="flex items-center justify-between">
                                                                                    <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent flex items-center gap-3">
                                                                                                <div className="relative">
                                                                                                            <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-500 rounded-2xl blur-sm opacity-75"></div>
                                                                                                            <div className="relative bg-gradient-to-br from-blue-500 to-purple-600 p-2.5 rounded-2xl shadow-lg hover:shadow-xl transition-all cursor-pointer transform hover:scale-105">
                                                                                                                        <FolderOpen className="text-white" size={26} />
                                                                                                            </div>
                                                                                                </div>
                                                                                                <div>
                                                                                                            <span className="hidden xs:inline">MyDrive</span>
                                                                                                            <span onClick={() => navigate("/")} className="xs:hidden cursor-pointer">DriveBox</span>
                                                                                                            <p className="hidden lg:block text-xs text-gray-500 font-medium bg-clip-text">Your cloud storage</p>
                                                                                                </div>
                                                                                    </h1>

                                                                                    {/* Mobile-only refresh button */}
                                                                                    <div className="flex items-center gap-2 lg:hidden">
                                                                                                <button
                                                                                                            onClick={() => dispatch(fetchFiles())}
                                                                                                            className="p-2 text-gray-600 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 rounded-xl transition-all border border-transparent hover:border-blue-200"
                                                                                                            title="Refresh files"
                                                                                                >
                                                                                                            {isLoading ? <Loader2 className="animate-spin text-blue-600" size={18} /> : <RefreshCcw size={18} />}
                                                                                                </button>
                                                                                                <AccountMenu />
                                                                                    </div>
                                                                        </div>

                                                                        {/* Search and Actions Container */}
                                                                        <div className='flex items-center gap-4'>
                                                                                    {
                                                                                                (location.pathname !== "/login" && location.pathname !== "/signup") && <div className='flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 flex-1 lg:flex-initial'>
                                                                                                            {/* Search Bar */}
                                                                                                            <div className="relative w-full sm:w-auto sm:min-w-[200px] md:min-w-[280px] lg:w-80">
                                                                                                                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                                                                                                                        <input
                                                                                                                                    type="text"
                                                                                                                                    placeholder="Search files and folders..."
                                                                                                                                    value={searchTerm}
                                                                                                                                    onChange={(e) => setSearchTerm(e.target.value)}
                                                                                                                                    className="w-full pl-12 pr-4 py-3 text-sm border-2 border-gray-200 rounded-2xl bg-gray-50/50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 placeholder:text-gray-400 shadow-sm hover:shadow-md"
                                                                                                                        />
                                                                                                            </div>

                                                                                                            {/* Desktop Actions */}
                                                                                                            <div className="hidden lg:flex items-center gap-3">
                                                                                                                        {/* View Mode Buttons */}
                                                                                                                        <div className="flex items-center gap-1 bg-gradient-to-r from-gray-100 to-gray-50 rounded-2xl p-1.5 shadow-sm border border-gray-200">
                                                                                                                                    <button
                                                                                                                                                onClick={() => dispatch(setViewMode('grid'))}
                                                                                                                                                className={`p-2.5 rounded-xl transition-all duration-300 ${viewMode === 'grid'
                                                                                                                                                            ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg scale-105'
                                                                                                                                                            : 'text-gray-600 hover:bg-white hover:shadow-md'
                                                                                                                                                            }`}
                                                                                                                                                title="Grid view"
                                                                                                                                    >
                                                                                                                                                <Grid size={20} />
                                                                                                                                    </button>
                                                                                                                                    <button
                                                                                                                                                onClick={() => dispatch(setViewMode('list'))}
                                                                                                                                                className={`p-2.5 rounded-xl transition-all duration-300 ${viewMode === 'list'
                                                                                                                                                            ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg scale-105'
                                                                                                                                                            : 'text-gray-600 hover:bg-white hover:shadow-md'
                                                                                                                                                            }`}
                                                                                                                                                title="List view"
                                                                                                                                    >
                                                                                                                                                <List size={20} />
                                                                                                                                    </button>
                                                                                                                        </div>

                                                                                                                        {/* Refresh Button */}
                                                                                                                        <button
                                                                                                                                    onClick={() => dispatch(fetchFiles())}
                                                                                                                                    className="p-2.5 text-gray-600 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 rounded-xl transition-all shadow-sm hover:shadow-md border border-gray-200 hover:border-blue-300"
                                                                                                                                    title="Refresh files"
                                                                                                                        >
                                                                                                                                    {isLoading ? <Loader2 className="animate-spin text-blue-600" size={20} /> : <RefreshCcw size={20} />}
                                                                                                                        </button>

                                                                                                                        {/* Upload Button */}
                                                                                                                        <button
                                                                                                                                    onClick={() => dispatch(setShowUploadModal(true))}
                                                                                                                                    disabled={isUploading}
                                                                                                                                    className="relative inline-flex items-center px-6 py-2.5 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white rounded-xl font-semibold disabled:opacity-50 whitespace-nowrap shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 overflow-hidden group"
                                                                                                                        >
                                                                                                                                    <div className="absolute inset-0 bg-gradient-to-r from-blue-700 via-purple-700 to-pink-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                                                                                                                    <span className="relative flex items-center gap-2">
                                                                                                                                                {isUploading ? (
                                                                                                                                                            <Loader2 className="animate-spin" size={18} />
                                                                                                                                                ) : (
                                                                                                                                                            <Plus size={18} />
                                                                                                                                                )}
                                                                                                                                                <span className="hidden xl:inline">Upload File</span>
                                                                                                                                                <span className="xl:hidden">Upload</span>
                                                                                                                                    </span>
                                                                                                                        </button>
                                                                                                            </div>

                                                                                                            {/* Mobile and Tablet Actions */}
                                                                                                            <div className="flex lg:hidden items-center justify-between gap-3">
                                                                                                                        {/* View Mode Buttons */}
                                                                                                                        <div className="flex items-center gap-1 bg-gradient-to-r from-gray-100 to-gray-50 rounded-2xl p-1.5 shadow-sm border border-gray-200">
                                                                                                                                    <button
                                                                                                                                                onClick={() => dispatch(setViewMode('grid'))}
                                                                                                                                                className={`p-2 rounded-xl transition-all ${viewMode === 'grid'
                                                                                                                                                            ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md'
                                                                                                                                                            : 'text-gray-600 hover:bg-white hover:shadow-sm'
                                                                                                                                                            }`}
                                                                                                                                                title="Grid view"
                                                                                                                                    >
                                                                                                                                                <Grid size={18} />
                                                                                                                                    </button>
                                                                                                                                    <button
                                                                                                                                                onClick={() => dispatch(setViewMode('list'))}
                                                                                                                                                className={`p-2 rounded-xl transition-all ${viewMode === 'list'
                                                                                                                                                            ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md'
                                                                                                                                                            : 'text-gray-600 hover:bg-white hover:shadow-sm'
                                                                                                                                                            }`}
                                                                                                                                                title="List view"
                                                                                                                                    >
                                                                                                                                                <List size={18} />
                                                                                                                                    </button>
                                                                                                                        </div>

                                                                                                                        {/* Upload Button */}
                                                                                                                        <button
                                                                                                                                    onClick={() => dispatch(setShowUploadModal(true))}
                                                                                                                                    disabled={isUploading}
                                                                                                                                    className="inline-flex items-center px-4 py-2.5 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white rounded-xl hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 transition-all font-semibold disabled:opacity-50 shadow-lg hover:shadow-xl transform hover:scale-105"
                                                                                                                        >
                                                                                                                                    {isUploading ? (
                                                                                                                                                <Loader2 className="mr-1.5 animate-spin" size={16} />
                                                                                                                                    ) : (
                                                                                                                                                <Plus className="mr-1.5" size={16} />
                                                                                                                                    )}
                                                                                                                                    Upload
                                                                                                                        </button>
                                                                                                            </div>
                                                                                                </div>
                                                                                    }

                                                                                    <div className='hidden sm:block'>
                                                                                                <AccountMenu />
                                                                                    </div>
                                                                        </div>
                                                            </div>
                                                </div>
                                    </header>
                        </>
            )
}

export default Header