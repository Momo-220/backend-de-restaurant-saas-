// Tests pour les utilitaires communs
describe('Common Utils', () => {
  describe('String utilities', () => {
    it('devrait générer un slug valide', () => {
      const generateSlug = (text: string): string => {
        return text
          .toLowerCase()
          .replace(/[^a-z0-9 -]/g, '')
          .replace(/\s+/g, '-')
          .replace(/-+/g, '-')
          .trim();
      };

      expect(generateSlug('Restaurant Test')).toBe('restaurant-test');
      expect(generateSlug('Café de la Paix')).toBe('caf-de-la-paix');
      expect(generateSlug('Pizza & Co.')).toBe('pizza-co');
    });

    it('devrait formater les numéros de téléphone', () => {
      const formatPhone = (phone: string): string => {
        const cleaned = phone.replace(/\D/g, '');
        if (cleaned.length === 9 && !cleaned.startsWith('221')) {
          return `+221${cleaned}`;
        }
        if (cleaned.length === 12 && cleaned.startsWith('221')) {
          return `+${cleaned}`;
        }
        return phone;
      };

      expect(formatPhone('701234567')).toBe('+221701234567');
      expect(formatPhone('221701234567')).toBe('+221701234567');
      expect(formatPhone('+221701234567')).toBe('+221701234567');
    });
  });

  describe('Number utilities', () => {
    it('devrait formater les prix en XOF', () => {
      const formatPrice = (price: number): string => {
        return `${price.toLocaleString('fr-FR')} XOF`;
      };

      // Test avec regex pour gérer les différents types d'espaces
      expect(formatPrice(2500)).toMatch(/2\s?500 XOF/);
      expect(formatPrice(15000)).toMatch(/15\s?000 XOF/);
      expect(formatPrice(1000000)).toMatch(/1\s?000\s?000 XOF/);
    });

    it('devrait calculer les taxes correctement', () => {
      const calculateTax = (amount: number, taxRate: number = 0.18): number => {
        return Math.round(amount * taxRate);
      };

      expect(calculateTax(10000)).toBe(1800); // 18% de TVA
      expect(calculateTax(5000, 0.1)).toBe(500); // 10% de taxe
    });
  });

  describe('Date utilities', () => {
    it('devrait formater les dates en français', () => {
      const formatDate = (date: Date): string => {
        return date.toLocaleDateString('fr-FR', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        });
      };

      const testDate = new Date('2024-01-15');
      expect(formatDate(testDate)).toContain('2024');
      expect(formatDate(testDate)).toContain('janvier');
    });

    it('devrait calculer la différence entre deux dates', () => {
      const daysDifference = (date1: Date, date2: Date): number => {
        const diffTime = Math.abs(date2.getTime() - date1.getTime());
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      };

      const date1 = new Date('2024-01-01');
      const date2 = new Date('2024-01-05');
      expect(daysDifference(date1, date2)).toBe(4);
    });
  });

  describe('Validation utilities', () => {
    it('devrait valider les emails', () => {
      const isValidEmail = (email: string): boolean => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
      };

      expect(isValidEmail('test@example.com')).toBe(true);
      expect(isValidEmail('user@restaurant.sn')).toBe(true);
      expect(isValidEmail('invalid-email')).toBe(false);
      expect(isValidEmail('test@')).toBe(false);
    });

    it('devrait valider les numéros de téléphone sénégalais', () => {
      const isValidSenegalPhone = (phone: string): boolean => {
        const cleaned = phone.replace(/\D/g, '');
        return (cleaned.length === 9 && cleaned.startsWith('7')) ||
               (cleaned.length === 12 && cleaned.startsWith('2217'));
      };

      expect(isValidSenegalPhone('+221701234567')).toBe(true);
      expect(isValidSenegalPhone('701234567')).toBe(true);
      expect(isValidSenegalPhone('221701234567')).toBe(true);
      expect(isValidSenegalPhone('801234567')).toBe(false); // Ne commence pas par 7
      expect(isValidSenegalPhone('12345')).toBe(false); // Trop court
    });
  });

  describe('Array utilities', () => {
    it('devrait grouper les éléments par propriété', () => {
      const groupBy = <T>(array: T[], key: keyof T): Record<string, T[]> => {
        return array.reduce((groups, item) => {
          const group = String(item[key]);
          groups[group] = groups[group] || [];
          groups[group].push(item);
          return groups;
        }, {} as Record<string, T[]>);
      };

      const items = [
        { category: 'plats', name: 'Thieb' },
        { category: 'boissons', name: 'Bissap' },
        { category: 'plats', name: 'Yassa' },
      ];

      const grouped = groupBy(items, 'category');
      expect(grouped.plats).toHaveLength(2);
      expect(grouped.boissons).toHaveLength(1);
    });

    it('devrait calculer la somme d\'un tableau', () => {
      const sum = (numbers: number[]): number => {
        return numbers.reduce((total, num) => total + num, 0);
      };

      expect(sum([1, 2, 3, 4, 5])).toBe(15);
      expect(sum([])).toBe(0);
      expect(sum([2500, 1500, 3000])).toBe(7000);
    });
  });
});
