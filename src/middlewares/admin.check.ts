import { NextFunction, Request, Response } from "express";
import { Roles } from "../config/constatnts";

export const checkAdmin = (req: Request, res: Response, next: NextFunction) => {
    if (req.user?.role !== Roles.ADMIN) {
        res.status(403).json({ message: 'You do not have permission to perform this operation'});
        return;
    }
    next();
}