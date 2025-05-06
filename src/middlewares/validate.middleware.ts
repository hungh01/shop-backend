import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { Request, Response, NextFunction } from 'express';

export function validateRequest<T extends object>(type: new () => T) {
    return async (req: Request, res: Response, next: NextFunction): Promise<void> => {

        const dtoObj = plainToInstance(type, req.body);
        console.log('DTO Object:', dtoObj);
        const errors = await validate(dtoObj, {
            whitelist: true,
            forbidNonWhitelisted: true,
        });


        if (errors.length > 0) {
            const messages = errors.map(err => Object.values(err.constraints || {})).flat();
            res.status(400).json({ message: messages[0] });
            return;
        }

        req.body = dtoObj;
        next();
    };
}
