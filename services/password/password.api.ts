import axios from "axios";
import { API_BASE_URL } from "@/lib/constants";


// Handle password change before expiry
export const changePasswordBeforeExpire = async (
    token: string,
    email: string,
    old_password: string,
    new_password: string,
    confirm_new_password: string
) => {
    const res = await axios.patch(
        `${API_BASE_URL}/password/change-before-expire`,
        {
            email,
            old_password,
            new_password,
            confirm_new_password,
        },
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );
    return res.data;
};



//change default password
export const resetUserPassword = async (
    email: string,
    old_password: string,
    new_password: string,
    confirm_new_password: string
) => {
    const res = await axios.post(`${API_BASE_URL}/password/reset-password`, {
        email,
        old_password,
        new_password,
        confirm_new_password,
    });
    return res.data;
};

