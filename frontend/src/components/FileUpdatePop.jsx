import { useState } from "react"

const FileUpdatePop = ({ filename, setFilename, setDot, setFileRename, updateDocsName, id }) => {



            return (
                        <div onClick={(e) => e.stopPropagation()} class="absolute top-12 right-0 w-64 bg-white border border-gray-200 rounded shadow-md p-4 z-50">
                                    <label class="block text-sm font-medium text-gray-700 mb-2">
                                                Edit filename
                                    </label>
                                    <input
                                                type="text"
                                                class="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                                placeholder="Enter new name"
                                                value={filename}
                                                onChange={(e) => setFilename(e.target.value)}
                                    />
                                    <div class="flex justify-end space-x-2 mt-4">
                                                <button
                                                            class="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded"
                                                            onClick={() => { setDot(""), setFileRename("") }}
                                                >
                                                            Cancel
                                                </button>
                                                <button
                                                            class="px-3 py-1 text-sm bg-blue-500 text-white hover:bg-blue-600 rounded"
                                                            onClick={() => updateDocsName(id)}
                                                >
                                                            Save
                                                </button>
                                    </div>
                        </div>

            )
}

export default FileUpdatePop