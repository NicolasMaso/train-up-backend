import { UserRole, PaymentStatus } from '@prisma/client';
import { PrismaService } from '../prisma';
import { CreatePaymentDto, UpdatePaymentDto } from './dto';
import { StudentsService } from '../students/students.service';
export declare class FinancesService {
    private prisma;
    private studentsService;
    constructor(prisma: PrismaService, studentsService: StudentsService);
    createPayment(personalId: string, createPaymentDto: CreatePaymentDto): Promise<{
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
    findAllForPersonal(personalId: string, studentId?: string, status?: PaymentStatus): Promise<{
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
    findAllForStudent(studentId: string): Promise<{
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
    }>;
    getFinancialSummary(personalId: string): Promise<{
        pendingAmount: number;
        overdueAmount: number;
        totalReceived: number;
        monthlyRevenue: number;
        totalStudentsWithPendingPayments: number;
    }>;
    findOne(id: string, userId: string, userRole: UserRole): Promise<{
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
    update(personalId: string, id: string, updatePaymentDto: UpdatePaymentDto): Promise<{
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
    markAsPaid(id: string, userId: string, userRole: UserRole): Promise<{
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
    remove(personalId: string, id: string): Promise<{
        message: string;
    }>;
    updateOverduePayments(): Promise<void>;
}
