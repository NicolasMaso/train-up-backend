import { PaymentStatus } from '@prisma/client';
export declare class CreatePaymentDto {
    studentId: string;
    amount: number;
    dueDate: string;
    description?: string;
}
export declare class UpdatePaymentDto {
    amount?: number;
    dueDate?: string;
    status?: PaymentStatus;
    paidDate?: string;
    description?: string;
}
