import { UIMessage } from '@ai-sdk/react';

export type ExtendedMessage = UIMessage & {
    parts?: any[];
    timestamp?: string | number | Date;
    metadata?: any;
};
