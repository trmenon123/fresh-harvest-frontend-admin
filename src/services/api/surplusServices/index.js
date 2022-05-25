import { fetchCall } from '../../endpoints';
import config from '../../../constants/config.json';

// Creating new surplus
const createSurplus = (data)=> 
    fetchCall(
        "/admin/createSurplus",
        config.requestMethod.POST,
        data,
        true
    );

// Getting surplus data with or without filters
const getSurplusDetails = (data)=> 
    fetchCall(
        "/admin/getSurplusDetails",
        config.requestMethod.POST,
        data,
        true
    );

// Getting stock details of surplus
const getSurplusStockDetails = (surplusId)=> 
    fetchCall(
        `/admin/getSurplusStockDetails/${surplusId}`,
        config.requestMethod.GET,
        {},
        true
    );

export {
    createSurplus,
    getSurplusDetails,
    getSurplusStockDetails
};