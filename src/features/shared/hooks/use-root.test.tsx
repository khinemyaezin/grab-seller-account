// @vitest-environment jsdom

import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import useRoot from './use-root';
import * as sellerUi from '@khinemyaezin/seller-ui';
import React from 'react';
import { fetchRoot } from '../api/root';

vi.mock('@khinemyaezin/seller-ui', () => ({
    useEntryLink: vi.fn(),
}));

vi.mock('../api/root', () => ({
    fetchRoot: vi.fn(),
}));

const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
});

const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
        {children}
    </QueryClientProvider>
);

describe('useRoot', () => {
    beforeEach(() => {
        queryClient.clear();
        vi.clearAllMocks();
    });

    it('should not fetch if entryLink is missing', () => {
        vi.mocked(sellerUi.useEntryLink).mockReturnValue(undefined as any);
        
        const { result } = renderHook(() => useRoot(), { wrapper });
        
        expect(result.current.isPending).toBe(true);
        expect(fetchRoot).not.toHaveBeenCalled();
    });

    it('should fetch root data when entryLink is present', async () => {
        const mockLink = { href: '/api/root', rel: 'self' };
        const mockData = { id: 'root1', listMerchants: { href: '/api/merchants', rel: 'list' } };
        
        vi.mocked(sellerUi.useEntryLink).mockReturnValue(mockLink);
        vi.mocked(fetchRoot).mockResolvedValue(mockData as any);
        
        const { result } = renderHook(() => useRoot(), { wrapper });
        
        await waitFor(() => {
            expect(result.current.isSuccess).toBe(true);
        });
        
        expect(fetchRoot).toHaveBeenCalledWith(mockLink);
        expect(result.current.data).toEqual(mockData);
    });
});
