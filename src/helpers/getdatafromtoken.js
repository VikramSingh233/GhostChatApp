import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

export const getDataFromToken = (request) => {
    try {
        // Get the token from cookies
        const token = request.cookies.get("token")?.value || "";

        // Verify the token using JWT and TOKEN_SECRET from env
        const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET);

        // Return the user ID from the token
        return decodedToken.id;
    } catch (error) {
        throw new Error(error.message);
    }
};
