# 🔐 Module 2 - Authentication & Authorization

Ce document explique le système d'authentification et d'autorisation implémenté dans le backend Restaurant SaaS.

## ✅ Fonctionnalités Implémentées

### 🔑 **Authentification JWT**
- **Inscription** (`POST /auth/register`) avec validation
- **Connexion** (`POST /auth/login`) avec vérification mot de passe
- **Déconnexion** (`POST /auth/logout`) avec logging
- **Profil** (`GET /auth/profile`) pour récupérer les infos utilisateur
- **Token JWT** avec expiration configurable (7 jours par défaut)

### 👥 **Gestion des Utilisateurs**
- **CRUD complet** des utilisateurs par tenant
- **Rôles hiérarchiques** : ADMIN > MANAGER > STAFF
- **Changement de mot de passe** sécurisé
- **Soft delete** (désactivation au lieu de suppression)
- **Statistiques** utilisateurs par tenant

### 🛡️ **Sécurité**
- **Hachage bcrypt** des mots de passe (12 rounds)
- **Validation stricte** des données (class-validator)
- **Protection CSRF** via JWT Bearer tokens
- **Isolation multi-tenant** automatique
- **Audit trail** de toutes les actions

### 🔒 **Autorisation (RBAC)**
- **Guards JWT** pour protéger les routes
- **Guards Rôles** pour contrôler l'accès par fonction
- **Middleware Tenant** pour isolation des données
- **Décorateurs** `@Public()`, `@Roles()`, `@CurrentUser()`

---

## 🏗️ Architecture

### **Flux d'Authentification**
```
1. Client → POST /auth/register → Création utilisateur + JWT
2. Client → POST /auth/login → Validation + JWT
3. Client → Header "Authorization: Bearer <token>" → Accès protégé
4. Middleware → Validation JWT → Extraction user/tenant
5. Guards → Vérification rôles → Autorisation finale
```

### **Structure des Modules**
```
src/
├── auth/
│   ├── auth.controller.ts      # Endpoints register/login/logout
│   ├── auth.service.ts         # Logique JWT + validation
│   ├── strategies/
│   │   ├── jwt.strategy.ts     # Stratégie Passport JWT
│   │   └── local.strategy.ts   # Stratégie Passport Local
│   ├── guards/
│   │   ├── jwt-auth.guard.ts   # Protection routes avec JWT
│   │   ├── local-auth.guard.ts # Authentification locale
│   │   └── roles.guard.ts      # Contrôle d'accès par rôles
│   ├── decorators/
│   │   ├── public.decorator.ts # @Public() pour routes ouvertes
│   │   └── roles.decorator.ts  # @Roles() pour RBAC
│   └── dto/
│       ├── register.dto.ts     # Validation inscription
│       └── login.dto.ts        # Validation connexion
├── users/
│   ├── users.controller.ts     # CRUD utilisateurs
│   ├── users.service.ts        # Logique métier utilisateurs
│   └── dto/                    # DTOs pour validation
└── common/
    ├── middleware/
    │   └── tenant.middleware.ts # Extraction tenant depuis JWT
    ├── guards/
    │   └── tenant.guard.ts     # Vérification tenant
    └── decorators/
        └── tenant.decorator.ts # @CurrentUser(), @CurrentTenant()
```

---

## 🔐 Rôles et Permissions

### **Hiérarchie des Rôles**
```
ADMIN (Super-utilisateur)
├── Gestion complète du tenant
├── CRUD utilisateurs
├── Modification paramètres restaurant
└── Accès à toutes les statistiques

MANAGER (Gestionnaire)
├── Gestion menu et commandes
├── Consultation utilisateurs
├── Statistiques opérationnelles
└── Pas de gestion utilisateurs ADMIN

STAFF (Personnel)
├── Consultation commandes
├── Mise à jour statuts
├── Profil personnel seulement
└── Accès cuisine/service uniquement
```

### **Matrice des Permissions**
| Endpoint | ADMIN | MANAGER | STAFF | Public |
|----------|-------|---------|--------|--------|
| `POST /auth/register` | ✅ | ✅ | ✅ | ✅ |
| `POST /auth/login` | ✅ | ✅ | ✅ | ✅ |
| `GET /auth/profile` | ✅ | ✅ | ✅ | ❌ |
| `POST /users` | ✅ | ✅ | ❌ | ❌ |
| `GET /users` | ✅ | ✅ | ❌ | ❌ |
| `DELETE /users/:id` | ✅ | ❌ | ❌ | ❌ |
| `PATCH /tenants/:id` | ✅ | ❌ | ❌ | ❌ |
| `GET /tenants/slug/:slug` | ✅ | ✅ | ✅ | ✅ |

---

## 🧪 Tests

### **Test Rapide (Compilation)**
```bash
node test-auth-quick.js
```
Vérifie la compilation et la structure des fichiers.

### **Test Complet (API)**
```bash
# Démarrer les services
docker-compose up -d

# Attendre puis migrer
docker-compose exec app npx prisma migrate dev

# Tester l'authentification
node test-auth.js
```

### **Tests Manuels avec curl**

#### 1. Créer un tenant
```bash
curl -X POST http://localhost:3000/api/v1/tenants \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Mon Restaurant",
    "slug": "mon-resto",
    "email": "contact@monresto.com"
  }'
```

#### 2. S'inscrire comme ADMIN
```bash
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "tenant_id": "TENANT_ID_FROM_STEP_1",
    "email": "admin@monresto.com",
    "password": "password123",
    "first_name": "Admin",
    "last_name": "Restaurant",
    "role": "ADMIN"
  }'
```

#### 3. Se connecter
```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@monresto.com",
    "password": "password123"
  }'
```

#### 4. Accéder au profil (route protégée)
```bash
curl -X GET http://localhost:3000/api/v1/auth/profile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

#### 5. Créer un utilisateur STAFF
```bash
curl -X POST http://localhost:3000/api/v1/users \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "X-Tenant-Id: YOUR_TENANT_ID" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "staff@monresto.com",
    "password": "password123",
    "first_name": "Staff",
    "last_name": "Member",
    "role": "STAFF"
  }'
```

---

## 🔒 Sécurité

### **Bonnes Pratiques Implémentées**
- ✅ **Mots de passe hachés** avec bcrypt (12 rounds)
- ✅ **JWT sécurisé** avec secret fort et expiration
- ✅ **Validation stricte** de toutes les entrées
- ✅ **Isolation multi-tenant** automatique
- ✅ **Audit trail** de toutes les actions
- ✅ **Guards multiples** (JWT + Rôles + Tenant)
- ✅ **Pas de données sensibles** dans les réponses

### **Configuration de Production**
```env
# JWT avec secret fort
JWT_SECRET="votre-clé-très-sécurisée-256-bits-minimum"
JWT_EXPIRES_IN="7d"

# Base de données sécurisée
DATABASE_URL="postgresql://user:password@host:5432/db?sslmode=require"

# CORS restreint
CORS_ORIGIN="https://votre-domaine.com"
```

---

## 🚀 Prochaines Étapes

Le **Module 2** est maintenant **TERMINÉ** ✅

**Prêt pour le Module 3 - Menu CRUD & Management** :
- CRUD des catégories de menu
- CRUD des items avec gestion stock
- Endpoints publics pour affichage menu
- Upload d'images pour les plats
- Gestion des prix et disponibilités

---

## 🔧 Dépannage

### **Erreur "Token invalide"**
- Vérifier que le JWT_SECRET est configuré
- Vérifier l'expiration du token
- Vérifier le format: `Authorization: Bearer <token>`

### **Erreur "Accès refusé"**
- Vérifier le rôle de l'utilisateur
- Vérifier que l'utilisateur appartient au bon tenant
- Vérifier que l'utilisateur est actif

### **Erreur "Tenant non trouvé"**
- Vérifier le header `X-Tenant-Id`
- Vérifier que le tenant existe et est actif
- Vérifier que l'utilisateur appartient au tenant

---

## 📊 Métriques

**Module 2 - Authentification :** ✅ **100% TERMINÉ**

- ✅ 9 endpoints d'authentification
- ✅ 3 rôles utilisateurs (ADMIN, MANAGER, STAFF)
- ✅ 4 guards de sécurité
- ✅ 2 stratégies Passport (JWT + Local)
- ✅ 1 middleware multi-tenant
- ✅ 8 DTOs de validation
- ✅ Tests automatisés complets
- ✅ Documentation complète












