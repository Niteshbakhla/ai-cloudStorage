import { FolderOpen, Grid, List, Search, Plus, Loader2, RefreshCcw } from 'lucide-react'
import { setShowUploadModal, setViewMode } from '../redux/slices/modalSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useState } from 'react';
import { fetchFiles } from '../redux/slices/fetchSlice';
import AccountMenu from './Account';
import { useLocation, useNavigate, useNavigation } from 'react-router-dom';


const Header = () => {
            const [searchTerm, setSearchTerm] = useState('');
            const location = useLocation();
            const navigate = useNavigate();
            const dispatch = useDispatch();
            const { isUploading, viewMode } = useSelector(state => state.modal);
            const { isLoading } = useSelector(state => state.fetch);

            return (
                        <>
                                    <header className="bg-white shadow-sm border-b sticky top-0 z-40">
                                                <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
                                                            <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center py-2 sm:py-3 lg:py-0 lg:h-16 gap-3 lg:gap-4">

                                                                        {/* Logo / Title */}
                                                                        <div className="flex items-center justify-between">
                                                                                    <h1 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center">
                                                                                                <FolderOpen className="mr-2 text-blue-600" size={24} />
                                                                                                <span className="hidden xs:inline">MyDrive</span>
                                                                                                <span onClick={() => navigate("/")} className="xs:hidden">DriveBox</span>
                                                                                    </h1>

                                                                                    {/* Mobile-only refresh button */}
                                                                                    <div className="flex items-center lg:hidden ">
                                                                                                <button
                                                                                                            onClick={() => dispatch(fetchFiles())}
                                                                                                            className="p-2 text-gray-600 hover:bg-gray-100 rounded-md"
                                                                                                            title="Refresh files"
                                                                                                >
                                                                                                            {isLoading ? <Loader2 className="animate-spin" size={18} /> : ""}
                                                                                                </button>
                                                                                                <AccountMenu />
                                                                                    </div>
                                                                        </div>

                                                                        {/* Search and Actions Container */}



                                                                        <div className='flex items-center'>
                                                                                    {
                                                                                                (location.pathname !== "/login" && location.pathname !== "/signup") && <div className='flex flex-col sm:flex-row sm:items-center  gap-3 sm:gap-4'>
                                                                                                            {/* Search Bar */}
                                                                                                            <div className="relative w-full sm:w-auto sm:min-w-[200px] md:min-w-[250px] lg:w-64">
                                                                                                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                                                                                                                        <input
                                                                                                                                    type="text"
                                                                                                                                    placeholder="Search files..."
                                                                                                                                    value={searchTerm}
                                                                                                                                    onChange={(e) => setSearchTerm(e.target.value)}
                                                                                                                                    className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                                                                                                        />
                                                                                                            </div>

                                                                                                            {/* Desktop Actions */}
                                                                                                            <div className="hidden lg:flex items-center space-x-2">
                                                                                                                        {/* View Mode Buttons */}
                                                                                                                        <div className="flex items-center space-x-1 bg-gray-50 rounded-lg p-1">
                                                                                                                                    <button
                                                                                                                                                onClick={() => dispatch(setViewMode('grid'))}
                                                                                                                                                className={`p-2 rounded-md transition-colors ${viewMode === 'grid'
                                                                                                                                                            ? 'bg-white text-blue-600 shadow-sm'
                                                                                                                                                            : 'text-gray-600 hover:bg-white hover:shadow-sm'
                                                                                                                                                            }`}
                                                                                                                                                title="Grid view"
                                                                                                                                    >
                                                                                                                                                <Grid size={18} />
                                                                                                                                    </button>
                                                                                                                                    <button
                                                                                                                                                onClick={() => dispatch(setViewMode('list'))}
                                                                                                                                                className={`p-2 rounded-md transition-colors ${viewMode === 'list'
                                                                                                                                                            ? 'bg-white text-blue-600 shadow-sm'
                                                                                                                                                            : 'text-gray-600 hover:bg-white hover:shadow-sm'
                                                                                                                                                            }`}
                                                                                                                                                title="List view"
                                                                                                                                    >
                                                                                                                                                <List size={18} />
                                                                                                                                    </button>


                                                                                                                        </div>

                                                                                                                        {/* Refresh Button */}
                                                                                                                        <button
                                                                                                                                    onClick={() => dispatch(fetchFiles())}
                                                                                                                                    className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                                                                                                                                    title="Refresh files"
                                                                                                                        >
                                                                                                                                    {isLoading ? <Loader2 className="animate-spin" size={20} /> : <RefreshCcw />}
                                                                                                                        </button>

                                                                                                                        {/* Upload Button */}
                                                                                                                        <button
                                                                                                                                    onClick={() => dispatch(setShowUploadModal(true))}
                                                                                                                                    disabled={isUploading}
                                                                                                                                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 whitespace-nowrap"
                                                                                                                        >
                                                                                                                                    {isUploading ? (
                                                                                                                                                <Loader2 className="mr-2 animate-spin" size={18} />
                                                                                                                                    ) : (
                                                                                                                                                <Plus className="mr-2" size={18} />
                                                                                                                                    )}
                                                                                                                                    <span className="hidden xl:inline">Upload</span>
                                                                                                                                    <span className="xl:hidden">Add</span>
                                                                                                                        </button>
                                                                                                            </div>

                                                                                                            {/* Mobile and Tablet Actions */}
                                                                                                            <div className="flex lg:hidden items-center justify-between">
                                                                                                                        {/* View Mode Buttons */}
                                                                                                                        <div className="flex items-center space-x-1 bg-gray-50 rounded-lg p-1">
                                                                                                                                    <button
                                                                                                                                                onClick={() => dispatch(setViewMode('grid'))}
                                                                                                                                                className={`p-2 rounded-md transition-colors ${viewMode === 'grid'
                                                                                                                                                            ? 'bg-white text-blue-600 shadow-sm'
                                                                                                                                                            : 'text-gray-600 hover:bg-white hover:shadow-sm'
                                                                                                                                                            }`}
                                                                                                                                                title="Grid view"
                                                                                                                                    >
                                                                                                                                                <Grid size={18} />
                                                                                                                                    </button>
                                                                                                                                    <button
                                                                                                                                                onClick={() => dispatch(setViewMode('list'))}
                                                                                                                                                className={`p-2 rounded-md transition-colors ${viewMode === 'list'
                                                                                                                                                            ? 'bg-white text-blue-600 shadow-sm'
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
                                                                                                                                    className="inline-flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50"
                                                                                                                        >
                                                                                                                                    {isUploading ? (
                                                                                                                                                <Loader2 className="mr-1 animate-spin" size={16} />
                                                                                                                                    ) : (
                                                                                                                                                <Plus className="mr-1" size={16} />
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