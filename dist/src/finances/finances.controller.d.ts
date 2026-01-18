import { UserRole, PaymentStatus } from '@prisma/client';
import { FinancesService } from './finances.service';
import { CreatePaymentDto, UpdatePaymentDto } from './dto';
export declare class FinancesController {
    private readonly financesService;
    constructor(financesService: FinancesService);
    createPayment(user: {
        id: string;
    }, createPaymentDto: CreatePaymentDto): Promise<{
        student: {
            id: string;
            name: string;
            email: string;
        };
    } & {
        id: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
        personalId: string;
        studentId: string;
        amount: import("@prisma/client-runtime-utils").Decimal;
        dueDate: Date;
        status: import("@prisma/client").$Enums.PaymentStatus;
        paidDate: Date | null;
    }>;
    findAllPayments(user: {
        id: string;
        role: UserRole;
    }, studentId?: string, status?: PaymentStatus): Promise<{
        payments: ({
            personal: {
                id: string;
                name: string;
            };
        } & {
            id: string;
            description: string | null;
            createdAt: Date;
            updatedAt: Date;
            personalId: string;
            studentId: string;
            amount: import("@prisma/client-runtime-utils").Decimal;
            dueDate: Date;
            status: import("@prisma/client").$Enums.PaymentStatus;
            paidDate: Date | null;
        })[];
        summary: {
            pendingAmount: number;
            overdueAmount: number;
            totalDue: number;
        };
    } | {
        payments: ({
            student: {
                id: string;
                name: string;
                email: string;
            };
        } & {
            id: string;
            description: string | null;
            createdAt: Date;
            updatedAt: Date;
            personalId: string;
            studentId: string;
            amount: import("@prisma/client-runtime-utils").Decimal;
            dueDate: Date;
            status: import("@prisma/client").$Enums.PaymentStatus;
            paidDate: Date | null;
        })[];
        summary: {
            pendingAmount: number;
            overdueAmount: number;
            totalReceived: number;
            monthlyRevenue: number;
            totalStudentsWithPendingPayments: number;
        };
    }>;
    getFinancialSummary(user: {
        id: string;
    }): Promise<{
        pendingAmount: number;
        overdueAmount: number;
        totalReceived: number;
        monthlyRevenue: number;
        totalStudentsWithPendingPayments: number;
    }>;
    findOne(user: {
        id: string;
        role: UserRole;
    }, id: string): Promise<{
        personal: {
            id: string;
            name: string;
        };
        student: {
            id: string;
            name: string;
            email: string;
        };
    } & {
        id: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
        personalId: string;
        studentId: string;
        amount: import("@prisma/client-runtime-utils").Decimal;
        dueDate: Date;
        status: import("@prisma/client").$Enums.PaymentStatus;
        paidDate: Date | null;
    }>;
    updatePayment(user: {
        id: string;
    }, id: string, updatePaymentDto: UpdatePaymentDto): Promise<{
        student: {
            id: string;
            name: string;
        };
    } & {
        id: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
        personalId: string;
        studentId: string;
        amount: import("@prisma/client-runtime-utils").Decimal;
        dueDate: Date;
        status: import("@prisma/client").$Enums.PaymentStatus;
        paidDate: Date | null;
    }>;
    markAsPaid(user: {
        id: string;
        role: UserRole;
    }, id: string): Promise<{
        id: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
        personalId: string;
        studentId: string;
        amount: import("@prisma/client-runtime-utils").Decimal;
        dueDate: Date;
        status: import("@prisma/client").$Enums.PaymentStatus;
        paidDate: Date | null;
    }>;
    removePayment(user: {
        id: string;
    }, id: string): Promise<{
        message: string;
    }>;
}
