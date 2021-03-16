import { Offering } from '../store/types';

export const compareOfferings = (a: Offering, b: Offering) => {
    if(a.is_available && b.is_available) return a.number - b.number
    if(!a.is_available && b.is_available) return 1
    return -1
}