import axios from 'axios';
const BASE_URL = " https://smart-city-backend-production-1a0b.up.railway.app";

import { useQuery } from "@tanstack/react-query";

export const  fetchLightState = async ()=> {
 return axios.get(`${BASE_URL}/api/v1/ldr/status`);
    
} 
    

// let x = useQuery({
//     queryKey:["lightState"],
//     queryFn:fetchLightState
// })
// console.log(x);
