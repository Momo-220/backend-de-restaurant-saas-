describe('Configuration Jest', () => {
    it('devrait pouvoir exécuter un test basique', () => {
        expect(1 + 1).toBe(2);
    });
    it('devrait pouvoir tester des promesses', async () => {
        const result = await Promise.resolve('test');
        expect(result).toBe('test');
    });
    it('devrait pouvoir utiliser des mocks', () => {
        const mockFn = jest.fn();
        mockFn('test');
        expect(mockFn).toHaveBeenCalledWith('test');
    });
});
//# sourceMappingURL=simple.spec.js.map