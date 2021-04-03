import axios from 'axios'

const api = axios.create({
    baseURL: '//volamtarpeppers.wrclan.ca' + (window.location.protocol === 'https:' ? ':3001' : ':3000') + '/api',
})

export const loginUser = payload => api.post('/login', payload)

export const insertBatch = payload => api.post(`/batch`, payload)
export const getAllBatches = () => api.get(`/batches`)
export const getActiveBatches = () => api.get('/batches/active')
export const updateBatchById = (id, payload) => api.put(`/batch/${id}`, payload)
export const deleteBatchById = id => api.delete(`/batch/${id}`)
export const getBatchById = id => api.get(`/batch/${id}`)
export const printBatchById = (id, payload) => api.post(`/batch/${id}/print`, payload)

export const getIngredients = () => api.get(`/ingredients`)
export const insertIngredient = payload => api.post(`ingredient`, payload)

export const contactRequest = payload => api.post('/contact', payload)

const apis = {
    loginUser,
    
    insertBatch,
    getAllBatches,
    getActiveBatches,
    updateBatchById,
    deleteBatchById,
    getBatchById,
    printBatchById,

    getIngredients,
    insertIngredient,

    contactRequest,
}

export default apis