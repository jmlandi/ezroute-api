export interface createLink {
    userId: string;
    shortCode: string;
    originalUrl: string;
    workspaceId: string;
    searchParams: Record<string, string>;
    isActive: boolean;
    createdAt: Date;
}

export interface insertClick {
    shortCode: string;
    referrer: string;
    userAgent: string;
    ip: string;
    eventTime: Date;
}