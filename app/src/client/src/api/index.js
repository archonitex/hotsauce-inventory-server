import axios from 'axios'

const api = axios.create({
    baseURL: 'http://localhost:3000/api',
})

export const insertBatch = payload => api.post(`/batch`, payload)
export const getAllBatches = () => api.get(`/batches`)
export const updateBatchById = (id, payload) => api.put(`/batch/${id}`, payload)
export const deleteBatchById = id => api.delete(`/batch/${id}`)
export const getBatchById = id => api.get(`/batch/${id}`)
export const printBatchById = id => api.post(`/batch/${id}/print`)

export const getIngredients = () => api.get(`/ingredients`)
export const insertIngredient = payload => api.post(`ingredient`, payload)

const apis = {
    insertBatch,
    getAllBatches,
    updateBatchById,
    deleteBatchById,
    getBatchById,
    printBatchById,

    getIngredients,
    insertIngredient
}

export default apis