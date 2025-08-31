# 🧪 Guide de Tests - Restaurant SaaS Backend

Ce document explique comment valider que le **Module 1 - Database & Multi-Tenant** fonctionne correctement.

## ✅ Tests Automatisés Disponibles

### 1. Test Rapide (Sans base de données)
```bash
node test-quick.js
```

**Ce test vérifie :**
- ✅ Compilation TypeScript sans erreurs
- ✅ Build NestJS réussi
- ✅ Génération du client Prisma
- ✅ Présence de tous les fichiers compilés

**Durée :** ~30 secondes

---

### 2. Test Complet (Avec base de données)
```bash
node test-with-database.js
```

**Ce test vérifie :**
- ✅ Démarrage des services Docker (PostgreSQL + Redis + App)
- ✅ Application des migrations Prisma
- ✅ API accessible sur http://localhost:3000/api/v1
- ✅ CRUD des restaurants (Create, Read)
- ✅ Recherche par slug
- ✅ Nettoyage automatique des services

**Durée :** ~2-3 minutes

---

## 🔧 Tests Manuels

### Démarrage Manuel avec Docker
```bash
# 1. Démarrer les services
docker-compose up -d

# 2. Attendre 30 secondes puis appliquer les migrations
docker-compose exec app npx prisma migrate dev --name init

# 3. Vérifier les logs
docker-compose logs app

# 4. Tester l'API
curl http://localhost:3000/api/v1/tenants
```

### Tests API avec curl/Postman

#### 1. Créer un restaurant
```bash
curl -X POST http://localhost:3000/api/v1/tenants \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Mon Restaurant",
    "slug": "mon-restaurant",
    "email": "contact@monrestaurant.com",
    "phone": "+33123456789",
    "address": "123 Rue de la Paix, Paris"
  }'
```

#### 2. Lister les restaurants
```bash
curl http://localhost:3000/api/v1/tenants
```

#### 3. Récupérer un restaurant par ID
```bash
curl http://localhost:3000/api/v1/tenants/{TENANT_ID}
```

#### 4. Récupérer un restaurant par slug
```bash
curl http://localhost:3000/api/v1/tenants/slug/mon-restaurant
```

#### 5. Modifier un restaurant
```bash
curl -X PATCH http://localhost:3000/api/v1/tenants/{TENANT_ID} \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Mon Restaurant Modifié"
  }'
```

---

## 📊 Validation du Schéma Prisma

### Vérifier la base de données
```bash
# Interface graphique Prisma Studio
docker-compose exec app npx prisma studio

# Ou se connecter directement à PostgreSQL
docker-compose exec postgres psql -U restaurant_user -d restaurant_saas
```

### Requêtes SQL de validation
```sql
-- Vérifier les tables créées
\dt

-- Vérifier la structure de la table tenants
\d tenants

-- Compter les restaurants
SELECT COUNT(*) FROM tenants;

-- Voir les restaurants actifs
SELECT id, name, slug, email, is_active FROM tenants WHERE is_active = true;
```

---

## 🚨 Résolution de Problèmes

### Erreur "Port déjà utilisé"
```bash
# Arrêter tous les services
docker-compose down

# Vérifier les ports
netstat -an | findstr :3000
netstat -an | findstr :5432
netstat -an | findstr :6379

# Redémarrer
docker-compose up -d
```

### Erreur de migration Prisma
```bash
# Reset complet de la base
docker-compose exec app npx prisma migrate reset

# Ou recréer les services
docker-compose down -v
docker-compose up -d
```

### Erreur de compilation
```bash
# Nettoyer et reconstruire
npm run build
rm -rf dist node_modules
npm install
npm run build
```

---

## ✅ Critères de Validation

Le **Module 1** est considéré comme **VALIDÉ** si :

### Tests Automatisés
- [ ] `node test-quick.js` → 100% réussi (3/3 tests + 6/6 fichiers)
- [ ] `node test-with-database.js` → 100% réussi (tous les tests API)

### Fonctionnalités Multi-Tenant
- [ ] Création d'un restaurant via API
- [ ] Récupération par ID et par slug
- [ ] Validation des données (email unique, slug unique)
- [ ] Soft delete (désactivation au lieu de suppression)

### Architecture
- [ ] Services Docker démarrent correctement
- [ ] Migrations Prisma appliquées sans erreur
- [ ] Client Prisma généré
- [ ] API accessible sur le port 3000

### Sécurité
- [ ] Validation des DTOs (class-validator)
- [ ] Gestion des erreurs appropriée
- [ ] Middleware tenant configuré
- [ ] Guards de sécurité en place

---

## 🚀 Prochaine Étape

Une fois le **Module 1** validé, nous pouvons passer au **Module 2 - Authentication & Authorization** :

```bash
# Le projet est prêt pour l'authentification JWT
# Prochaine implémentation :
# - JWT Strategy
# - User registration/login
# - Role-based access control (Admin, Manager, Staff)
# - Protected routes
```

---

## 📝 Notes de Développement

- **Base de données** : PostgreSQL avec isolation multi-tenant
- **ORM** : Prisma avec client généré
- **Architecture** : NestJS modulaire
- **Validation** : class-validator + class-transformer
- **Sécurité** : Middleware tenant + Guards
- **Déploiement** : Docker ready pour AWS ECS/Fargate












