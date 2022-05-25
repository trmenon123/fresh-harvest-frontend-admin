import { fetchCall } from '../../endpoints';
import config from '../../../constants/config.json';

// Creating new surplus
const getAllTransactions = (data)=> 
    fetchCall(
        "/admin/getAllTransactions",
        config.requestMethod.POST,
        data,
        true
    );

export {
    getAllTransactions,
};