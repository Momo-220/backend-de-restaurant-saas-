"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
describe('Validation Tests', () => {
    describe('DTO Validation', () => {
        it('devrait créer un objet DTO', () => {
            const dto = {
                name: 'Restaurant Test',
                slug: 'restaurant-test',
                email: 'test@restaurant.com',
                phone: '+221701234567',
                address: 'Dakar, Sénégal',
            };
            expect(dto.name).toBe('Restaurant Test');
            expect(dto.email).toBe('test@restaurant.com');
        });
        it('devrait valider la structure des données', () => {
            const isValidTenantData = (data) => {
                return !!(data && data.name && data.slug && data.email && data.phone && data.address);
            };
            const validData = {
                name: 'Restaurant Test',
                slug: 'restaurant-test',
                email: 'test@restaurant.com',
                phone: '+221701234567',
                address: 'Dakar, Sénégal',
            };
            const invalidData = {
                name: 'Restaurant Test',
            };
            expect(isValidTenantData(validData)).toBe(true);
            expect(isValidTenantData(invalidData)).toBe(false);
        });
    });
    describe('Business Logic Validation', () => {
        it('devrait valider les statuts de commande', () => {
            const validStatuses = ['PENDING', 'ACCEPTED', 'PREPARING', 'READY', 'DELIVERED', 'CANCELLED'];
            const isValidOrderStatus = (status) => {
                return validStatuses.includes(status);
            };
            expect(isValidOrderStatus('PENDING')).toBe(true);
            expect(isValidOrderStatus('DELIVERED')).toBe(true);
            expect(isValidOrderStatus('INVALID_STATUS')).toBe(false);
        });
        it('devrait valider les méthodes de paiement', () => {
            const validPaymentMethods = ['MYNITA', 'WAVE'];
            const isValidPaymentMethod = (method) => {
                return validPaymentMethods.includes(method);
            };
            expect(isValidPaymentMethod('MYNITA')).toBe(true);
            expect(isValidPaymentMethod('WAVE')).toBe(true);
            expect(isValidPaymentMethod('PAYPAL')).toBe(false);
        });
        it('devrait valider les rôles utilisateur', () => {
            const validRoles = ['ADMIN', 'MANAGER', 'STAFF'];
            const isValidUserRole = (role) => {
                return validRoles.includes(role);
            };
            expect(isValidUserRole('ADMIN')).toBe(true);
            expect(isValidUserRole('MANAGER')).toBe(true);
            expect(isValidUserRole('STAFF')).toBe(true);
            expect(isValidUserRole('CUSTOMER')).toBe(false);
        });
    });
    describe('Data Sanitization', () => {
        it('devrait nettoyer les entrées utilisateur', () => {
            const sanitizeString = (input) => {
                return input
                    .trim()
                    .replace(/[<>]/g, '')
                    .substring(0, 255);
            };
            expect(sanitizeString('  test  ')).toBe('test');
            expect(sanitizeString('test<script>alert("xss")</script>')).toBe('testscriptalert("xss")/script');
            expect(sanitizeString('a'.repeat(300))).toHaveLength(255);
        });
        it('devrait normaliser les numéros de téléphone', () => {
            const normalizePhone = (phone) => {
                const cleaned = phone.replace(/\D/g, '');
                if (cleaned.length === 9 && cleaned.startsWith('7')) {
                    return `+221${cleaned}`;
                }
                return phone;
            };
            expect(normalizePhone('70 123 45 67')).toBe('+221701234567');
            expect(normalizePhone('+221 70 123 45 67')).toBe('+221 70 123 45 67');
        });
    });
    describe('Password Validation', () => {
        it('devrait valider la force des mots de passe', () => {
            const isStrongPassword = (password) => {
                return password.length >= 8 &&
                    /[A-Z]/.test(password) &&
                    /[a-z]/.test(password) &&
                    /[0-9]/.test(password);
            };
            expect(isStrongPassword('Password123')).toBe(true);
            expect(isStrongPassword('password123')).toBe(false);
            expect(isStrongPassword('PASSWORD123')).toBe(false);
            expect(isStrongPassword('Password')).toBe(false);
            expect(isStrongPassword('Pass1')).toBe(false);
        });
    });
    describe('Amount Validation', () => {
        it('devrait valider les montants positifs', () => {
            const isValidAmount = (amount) => {
                return amount > 0 && amount <= 10000000 && Number.isInteger(amount);
            };
            expect(isValidAmount(2500)).toBe(true);
            expect(isValidAmount(0)).toBe(false);
            expect(isValidAmount(-100)).toBe(false);
            expect(isValidAmount(15000000)).toBe(false);
            expect(isValidAmount(25.5)).toBe(false);
        });
        it('devrait valider les quantités', () => {
            const isValidQuantity = (quantity) => {
                return quantity > 0 && quantity <= 100 && Number.isInteger(quantity);
            };
            expect(isValidQuantity(1)).toBe(true);
            expect(isValidQuantity(5)).toBe(true);
            expect(isValidQuantity(0)).toBe(false);
            expect(isValidQuantity(-1)).toBe(false);
            expect(isValidQuantity(101)).toBe(false);
            expect(isValidQuantity(2.5)).toBe(false);
        });
    });
});
//# sourceMappingURL=validation.spec.js.map