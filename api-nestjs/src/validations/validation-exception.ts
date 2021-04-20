import { BadRequestException } from '@nestjs/common';
interface Error {
    error: string
    message: string
}
export class ValidationException extends BadRequestException {
    constructor(public validationErrors: Error[]) {
        super();
    }
}