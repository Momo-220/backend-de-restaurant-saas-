# 🚀 GUIDE DÉPLOIEMENT COMPLET - PREMIÈRE FOIS

## 🎯 ÉLÉMENTS EXTERNES À AJOUTER MANUELLEMENT

### 1️⃣ **COMPTES ET SERVICES EXTERNES REQUIS**

#### A. **Compte AWS** (OBLIGATOIRE)
- ✅ Créer un compte AWS : https://aws.amazon.com
- ✅ Configurer une carte de crédit (coût ~10-20€/mois)
- ✅ Obtenir Access Key ID + Secret Access Key

#### B. **Domaine personnalisé** (OPTIONNEL mais recommandé)
- ✅ Acheter un domaine (ex: monrestaurant.com) 
- ✅ Services : OVH, Namecheap, GoDaddy (~10€/an)

#### C. **Comptes paiement** (OBLIGATOIRE pour production)
- ✅ **Compte MyNita** : https://mynita.sn
- ✅ **Compte Wave** : https://wave.com/senegal
- ✅ Obtenir les API keys et Merchant IDs

#### D. **GitHub** (OBLIGATOIRE pour CI/CD)
- ✅ Repository GitHub public ou privé
- ✅ Configurer les secrets du repository

### 2️⃣ **VARIABLES D'ENVIRONNEMENT À CONFIGURER**

#### A. **Variables AWS** (à obtenir après création compte)
```
AWS_ACCESS_KEY_ID=AKIA...
AWS_SECRET_ACCESS_KEY=...
AWS_REGION=us-west-2
AWS_S3_BUCKET=restaurant-uploads-xxx
```

#### B. **Variables Base de Données** (générées par AWS)
```
DATABASE_URL=postgresql://user:pass@xxx.rds.amazonaws.com:5432/db
REDIS_HOST=xxx.cache.amazonaws.com
```

#### C. **Variables Paiement** (à obtenir des providers)
```
WAVE_API_URL=https://api.wave.com/v1
WAVE_MERCHANT_ID=votre_merchant_id
MYNITA_API_URL=https://api.mynita.sn/v1
MYNITA_MERCHANT_ID=votre_merchant_id
```

#### D. **Variables Sécurité** (à générer)
```
JWT_SECRET=votre_secret_super_securise_32_caracteres
```

### 3️⃣ **OUTILS À INSTALLER SUR VOTRE PC**

#### A. **AWS CLI**
```bash
# Windows
winget install Amazon.AWSCLI

# Ou télécharger : https://aws.amazon.com/cli/
```

#### B. **Terraform**
```bash
# Windows
winget install Hashicorp.Terraform

# Ou télécharger : https://terraform.io/downloads
```

#### C. **Docker Desktop** (optionnel, pour tests locaux)
```bash
# Télécharger : https://docker.com/products/docker-desktop
```

---

## 🛠️ GUIDE ÉTAPE PAR ÉTAPE - DÉPLOIEMENT

### **PHASE 1 : PRÉPARATION (30 minutes)**

#### Étape 1.1 : Créer compte AWS
1. ✅ Aller sur https://aws.amazon.com
2. ✅ Cliquer "Create AWS Account"
3. ✅ Suivre le processus (email, téléphone, carte)
4. ✅ Choisir le plan "Basic Support" (gratuit)

#### Étape 1.2 : Créer utilisateur IAM
1. ✅ Se connecter à la console AWS
2. ✅ Aller dans "IAM" → "Users" → "Create User"
3. ✅ Nom : `restaurant-deploy-user`
4. ✅ Cocher "Programmatic access"
5. ✅ Attacher la politique : `AdministratorAccess`
6. ✅ **NOTER** : Access Key ID + Secret Access Key

#### Étape 1.3 : Installer AWS CLI
```bash
# Télécharger et installer AWS CLI
# Puis configurer :
aws configure
```
- AWS Access Key ID: `[votre access key]`
- AWS Secret Access Key: `[votre secret key]`
- Default region: `us-west-2`
- Default output format: `json`

### **PHASE 2 : CONFIGURATION REPOSITORY (15 minutes)**

#### Étape 2.1 : Créer repository GitHub
1. ✅ Aller sur https://github.com
2. ✅ Cliquer "New repository"
3. ✅ Nom : `restaurant-saas-backend`
4. ✅ Choisir "Private" (recommandé)
5. ✅ Créer le repository

#### Étape 2.2 : Configurer secrets GitHub
1. ✅ Aller dans Settings → Secrets and variables → Actions
2. ✅ Ajouter ces secrets :

```
AWS_ACCESS_KEY_ID = [votre access key AWS]
AWS_SECRET_ACCESS_KEY = [votre secret key AWS]
CODECOV_TOKEN = [optionnel]
SLACK_WEBHOOK_URL = [optionnel]
```

#### Étape 2.3 : Pousser le code
```bash
git init
git add .
git commit -m "Initial commit - Restaurant SaaS Backend"
git branch -M main
git remote add origin https://github.com/VOTRE_USERNAME/restaurant-saas-backend.git
git push -u origin main
```

### **PHASE 3 : DÉPLOIEMENT INFRASTRUCTURE (45 minutes)**

#### Étape 3.1 : Préparer Terraform
```bash
cd terraform
```

#### Étape 3.2 : Modifier les variables
Éditer `terraform/terraform.tfvars` (à créer) :
```hcl
aws_region = "us-west-2"
environment = "production"
app_name = "restaurant-saas"
domain_name = "votre-domaine.com"  # ou "localhost" pour test
db_password = "VotreMotDePasseSecurise123!"
```

#### Étape 3.3 : Déployer l'infrastructure
```bash
# Initialiser Terraform
terraform init

# Voir ce qui va être créé
terraform plan

# Déployer (⚠️ Cela va créer des ressources AWS payantes)
terraform apply
```

**⏱️ Temps d'attente : ~15-20 minutes**

#### Étape 3.4 : Noter les outputs
Terraform va afficher :
```
database_endpoint = "xxx.rds.amazonaws.com"
redis_endpoint = "xxx.cache.amazonaws.com"
s3_bucket_name = "restaurant-saas-uploads-xxx"
ecr_repository_url = "xxx.dkr.ecr.us-west-2.amazonaws.com/restaurant-saas-backend"
load_balancer_dns = "xxx.elb.amazonaws.com"
```

**📝 NOTEZ CES VALEURS - VOUS EN AUREZ BESOIN !**

### **PHASE 4 : CONFIGURATION SECRETS (20 minutes)**

#### Étape 4.1 : Créer les secrets AWS
```bash
# Secret pour la base de données
aws secretsmanager create-secret \
  --name "restaurant/database-url" \
  --description "Database connection URL" \
  --secret-string "postgresql://postgres:VotreMotDePasse@ENDPOINT_RDS:5432/restaurant_saas"

# Secret pour JWT
aws secretsmanager create-secret \
  --name "restaurant/jwt-secret" \
  --description "JWT Secret Key" \
  --secret-string "VotreSecretJWT32CaracteresMinimum"

# Secret pour Redis
aws secretsmanager create-secret \
  --name "restaurant/redis-host" \
  --description "Redis endpoint" \
  --secret-string "ENDPOINT_REDIS"

# Secrets S3
aws secretsmanager create-secret \
  --name "restaurant/s3-bucket" \
  --description "S3 bucket name" \
  --secret-string "NOM_BUCKET_S3"
```

#### Étape 4.2 : Configurer les paiements (plus tard)
```bash
# MyNita (à faire quand vous aurez les clés)
aws secretsmanager create-secret \
  --name "restaurant/mynita-api-url" \
  --secret-string "https://api.mynita.sn/v1"

aws secretsmanager create-secret \
  --name "restaurant/mynita-merchant-id" \
  --secret-string "VOTRE_MERCHANT_ID_MYNITA"

# Wave (à faire quand vous aurez les clés)  
aws secretsmanager create-secret \
  --name "restaurant/wave-api-url" \
  --secret-string "https://api.wave.com/v1"

aws secretsmanager create-secret \
  --name "restaurant/wave-merchant-id" \
  --secret-string "VOTRE_MERCHANT_ID_WAVE"
```

### **PHASE 5 : PREMIER DÉPLOIEMENT (10 minutes)**

#### Étape 5.1 : Modifier task definition
Éditer `.aws/task-definition.json` :
- Remplacer `ACCOUNT_ID` par votre ID de compte AWS
- Remplacer les ARN des secrets par les vrais

#### Étape 5.2 : Pousser le code
```bash
git add .
git commit -m "Configure deployment for production"
git push origin main
```

**🚀 LE PIPELINE CI/CD VA S'EXÉCUTER AUTOMATIQUEMENT !**

#### Étape 5.3 : Suivre le déploiement
1. ✅ Aller sur GitHub → Actions
2. ✅ Voir le workflow en cours
3. ✅ Attendre que tout soit vert ✅

### **PHASE 6 : VÉRIFICATION (5 minutes)**

#### Étape 6.1 : Tester l'API
```bash
# Remplacer par votre Load Balancer DNS
curl https://VOTRE_ALB_DNS/health

# Devrait retourner :
# {"status":"ok","timestamp":"...","database":"connected"}
```

#### Étape 6.2 : Tester un endpoint
```bash
curl https://VOTRE_ALB_DNS/api/v1/tenants
# Devrait retourner une erreur 401 (normal, pas d'auth)
```

---

## 💰 COÛTS AWS ESTIMÉS

### **Coûts mensuels (USD) :**
- **ECS Fargate** : ~$15-25/mois
- **RDS t3.micro** : ~$15/mois  
- **ElastiCache t3.micro** : ~$15/mois
- **ALB** : ~$20/mois
- **S3** : ~$1-5/mois
- **NAT Gateway** : ~$45/mois
- **Autres** : ~$5/mois

**📊 TOTAL : ~$120-130/mois (~110€/mois)**

### **Optimisations possibles :**
- Supprimer NAT Gateway (-$45/mois) si pas besoin d'internet privé
- Utiliser RDS Aurora Serverless pour moins d'usage
- Optimiser les instances selon l'usage

---

## 🆘 SUPPORT ET AIDE

### **Si vous avez des problèmes :**

1. **Erreurs Terraform** :
   - Vérifier les permissions IAM
   - Vérifier les quotas AWS
   - Supprimer et recréer si nécessaire

2. **Erreurs déploiement** :
   - Vérifier les logs GitHub Actions
   - Vérifier les logs ECS dans AWS Console

3. **Erreurs application** :
   - Vérifier les logs CloudWatch
   - Tester les endpoints de health

### **Commandes utiles :**
```bash
# Voir les logs ECS
aws logs tail /ecs/restaurant-backend --follow

# Redéployer manuellement
aws ecs update-service --cluster restaurant-cluster --service restaurant-backend-service --force-new-deployment

# Détruire l'infrastructure (⚠️ ATTENTION)
terraform destroy
```

---

## 🎯 RÉSUMÉ DES ACTIONS REQUISES

### **À FAIRE AVANT DE COMMENCER :**
1. ✅ Créer compte AWS + carte bancaire
2. ✅ Installer AWS CLI + Terraform
3. ✅ Créer repository GitHub
4. ✅ Obtenir comptes MyNita/Wave (optionnel pour test)

### **DURÉE TOTALE ESTIMÉE :**
- **Première fois** : 2-3 heures
- **Déploiements suivants** : 5 minutes (automatique)

### **PRÊT À COMMENCER ?**
Dites-moi où vous en êtes et je vous guide pas à pas ! 🚀











