import { fetchCall } from '../../endpoints';
import config from '../../../constants/config.json';

const getUsers = (data)=> 
    fetchCall(
        "/admin/getUserDetails",
        config.requestMethod.POST,
        data,
        true
    );

export {
    getUsers
};