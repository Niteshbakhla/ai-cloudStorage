
const API_BASE_URL = 'drive';
const API_ENDPOINTS = {
            files: `${API_BASE_URL}/files`,
            upload: `${API_BASE_URL}/files`,
            download: (fileId) => `${API_BASE_URL}/files/${fileId}/download`,
            delete: (fileId) => `${API_BASE_URL}/files/${fileId}`,
            update: (id) => `${API_BASE_URL}/files/${id}`
};



export default API_ENDPOINTS;