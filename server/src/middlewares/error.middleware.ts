import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/AppError';

const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
    // Log the error for debugging purposes
    console.error(err);

    // Check if the error is a known, operational error
    if (err instanceof AppError) {
        return res.status(err.statusCode).json({
            success: false,
            message: err.message,
        });
    }

    // For unknown errors, send a generic 500 response
    return res.status(500).json({
        success: false,
        message: 'An unexpected internal server error occurred.',
    });
};

export default errorHandler;