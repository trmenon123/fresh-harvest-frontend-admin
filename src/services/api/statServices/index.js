import { fetchCall } from '../../endpoints';
import config from '../../../constants/config.json';

// Getting user list by pattern
const getSurplusStatistics = ()=> 
    fetchCall(
        '/admin/getSurplusStatistics',
        config.requestMethod.GET,
        {},
        true,
    );

export {
    getSurplusStatistics
}