# 📄 Module 5 - QR Code & PDF

Ce document explique le système de génération de QR codes et de PDF implémenté dans le backend Restaurant SaaS.

## ✅ Fonctionnalités Implémentées

### 📱 **Génération QR Codes**
- **QR codes pour tables** individuelles avec paramètres de table
- **QR code menu global** du restaurant
- **QR codes publics** accessibles sans authentification
- **Génération en masse** pour toutes les tables d'un restaurant
- **Régénération** de QR codes existants
- **Personnalisation** complète (taille, couleurs, marges, correction d'erreur)
- **Statistiques** de couverture QR codes

### 📋 **Génération PDF**
- **Reçus automatiques** pour toutes les commandes livrées
- **Template HTML responsive** pour un rendu professionnel
- **Conversion HTML vers PDF** avec Puppeteer
- **Informations complètes** (restaurant, commande, items, totaux)
- **Support logo restaurant** et personnalisation visuelle
- **Format ticket de caisse** optimisé pour l'impression
- **Gestion multilingue** (français par défaut)

### 🗂️ **Gestion Fichiers**
- **Service fichiers centralisé** pour toutes les opérations
- **Gestion automatique** des dossiers (public/, uploads/)
- **Noms de fichiers uniques** avec timestamps et hash
- **Suppression sécurisée** des fichiers
- **URLs publiques** pour accès frontend
- **Nettoyage automatique** des fichiers anciens

---

## 🏗️ Architecture

### **Structure des Modules**
```
src/files/
├── files.service.ts          # Service fichiers centralisé
├── qr-code.controller.ts      # Endpoints QR codes
├── qr-code.service.ts         # Logique génération QR codes
├── pdf.controller.ts          # Endpoints PDF
├── pdf.service.ts             # Logique génération PDF
└── files.module.ts            # Module files complet

public/                        # Dossier fichiers publics
├── qr-codes/                  # QR codes générés
└── receipts/                  # Reçus PDF générés

uploads/                       # Dossier uploads temporaires
```

### **Flux QR Code**
```
1. Admin/Manager → POST /qr-codes/table/:id
2. Service → Génération URL menu + paramètres table
3. QRCode library → Création image PNG
4. FilesService → Sauvegarde dans public/qr-codes/
5. Database → Mise à jour table.qr_code_url
6. Response → URL publique pour téléchargement
```

### **Flux PDF Reçu**
```
1. Staff → POST /pdf/receipt/order/:id
2. Service → Récupération données commande complète
3. Template → Génération HTML responsive
4. Puppeteer → Conversion HTML vers PDF
5. FilesService → Sauvegarde dans public/receipts/
6. Response → URL publique pour téléchargement
```

---

## 📱 API Endpoints

### **QR Codes**

#### Génération QR Code Table
```http
POST /api/v1/qr-codes/table/:tableId
Authorization: Bearer <jwt_token>
X-Tenant-Id: <tenant_id>

Query Parameters:
- size: 300 (taille en pixels)
- margin: 2 (marge)
- dark_color: #000000 (couleur sombre)
- light_color: #FFFFFF (couleur claire)

Response:
{
  "table_id": "uuid",
  "qr_code_url": "/public/qr-codes/qr_table_1_20240101_abc123.png",
  "public_url": "http://localhost:3001/public/qr-codes/qr_table_1_20240101_abc123.png"
}
```

#### Génération QR Code Menu
```http
POST /api/v1/qr-codes/menu
Authorization: Bearer <jwt_token>
X-Tenant-Id: <tenant_id>

Response:
{
  "tenant_slug": "mon-restaurant",
  "qr_code_url": "/public/qr-codes/menu_mon-restaurant_20240101_def456.png",
  "public_url": "http://localhost:3001/public/qr-codes/menu_mon-restaurant_20240101_def456.png"
}
```

#### QR Code Public (sans auth)
```http
POST /api/v1/qr-codes/public/menu/:tenantSlug

Response:
{
  "tenant_slug": "mon-restaurant",
  "qr_code_url": "/public/qr-codes/menu_mon-restaurant_20240101_ghi789.png",
  "public_url": "http://localhost:3001/public/qr-codes/menu_mon-restaurant_20240101_ghi789.png"
}
```

#### Génération Masse Tables
```http
POST /api/v1/qr-codes/tables/generate-all
Authorization: Bearer <jwt_token>

Response:
{
  "tenant_id": "uuid",
  "total_tables": 15,
  "results": [
    {
      "table": {
        "id": "uuid",
        "number": "1",
        "name": "Terrasse",
        "capacity": 4
      },
      "qr_url": "/public/qr-codes/qr_table_1_20240101_abc.png",
      "public_url": "http://localhost:3001/public/qr-codes/qr_table_1_20240101_abc.png"
    }
  ]
}
```

### **PDF Reçus**

#### Génération Reçu Commande
```http
POST /api/v1/pdf/receipt/order/:orderId
Authorization: Bearer <jwt_token>
X-Tenant-Id: <tenant_id>

Response:
{
  "order_id": "uuid",
  "pdf_url": "/public/receipts/receipt_20240101001_20240101_xyz123.pdf",
  "public_url": "http://localhost:3001/public/receipts/receipt_20240101001_20240101_xyz123.pdf",
  "download_url": "/api/v1/pdf/download/receipt_20240101001_20240101_xyz123.pdf"
}
```

### **Téléchargement & Visualisation**

#### Télécharger QR Code
```http
GET /api/v1/qr-codes/download/:filename

Response: Binary PNG file
Headers:
- Content-Type: image/png
- Content-Disposition: attachment; filename="qr_code.png"
```

#### Visualiser PDF
```http
GET /api/v1/pdf/view/:filename

Response: Binary PDF file
Headers:
- Content-Type: application/pdf
- Content-Disposition: inline
```

---

## 🎨 Personnalisation

### **Options QR Code**
```typescript
interface QRCodeOptions {
  size?: number;              // 300px par défaut
  margin?: number;            // 2 par défaut
  color?: {
    dark?: string;            // #000000 par défaut
    light?: string;           // #FFFFFF par défaut
  };
  errorCorrectionLevel?: 'L' | 'M' | 'Q' | 'H'; // 'M' par défaut
}
```

### **Template Reçu PDF**
Le template HTML est entièrement personnalisable et inclut :
- **Header** avec logo restaurant et informations
- **Informations commande** (numéro, date, table, client)
- **Liste items** avec quantités, prix unitaires et totaux
- **Total final** mis en évidence
- **Informations paiement** et statut
- **Notes commande** si présentes
- **Footer** avec date génération et remerciements

---

## 🧪 Tests

### **Test Rapide (Compilation)**
```bash
node test-files-quick.js
```

### **Tests Manuels avec curl**

#### 1. Générer QR Code pour table
```bash
curl -X POST "http://localhost:3000/api/v1/qr-codes/table/TABLE_ID?size=400&dark_color=%23333333" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "X-Tenant-Id: YOUR_TENANT_ID"
```

#### 2. Générer QR Code menu public
```bash
curl -X POST "http://localhost:3000/api/v1/qr-codes/public/menu/mon-restaurant?size=500" \
  -H "Content-Type: application/json"
```

#### 3. Générer reçu PDF
```bash
curl -X POST "http://localhost:3000/api/v1/pdf/receipt/order/ORDER_ID" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "X-Tenant-Id: YOUR_TENANT_ID"
```

#### 4. Télécharger QR Code
```bash
curl -O "http://localhost:3000/api/v1/qr-codes/download/qr_table_1_20240101_abc123.png"
```

### **Test Intégration Frontend**
```html
<!DOCTYPE html>
<html>
<head>
    <title>Test QR Codes & PDF</title>
</head>
<body>
    <h1>Test Module Files</h1>
    
    <!-- Affichage QR Code -->
    <img src="http://localhost:3000/api/v1/qr-codes/view/qr_table_1_20240101_abc123.png" 
         alt="QR Code Table 1" 
         style="width: 200px;">
    
    <!-- Lien téléchargement PDF -->
    <a href="http://localhost:3000/api/v1/pdf/download/receipt_20240101001_20240101_xyz123.pdf" 
       target="_blank">
        Télécharger Reçu PDF
    </a>
    
    <!-- Visualisation PDF -->
    <iframe src="http://localhost:3000/api/v1/pdf/view/receipt_20240101001_20240101_xyz123.pdf"
            width="100%" 
            height="600px">
    </iframe>
</body>
</html>
```

---

## 🔧 Configuration

### **Variables d'Environnement**
```env
# Frontend URL pour QR codes
FRONTEND_URL="http://localhost:3001"

# Configuration Puppeteer (optionnel)
PUPPETEER_EXECUTABLE_PATH="/usr/bin/chromium-browser"
PUPPETEER_ARGS="--no-sandbox,--disable-setuid-sandbox"
```

### **Permissions par Rôle**
| Action | ADMIN | MANAGER | STAFF | Public |
|--------|-------|---------|-------|--------|
| Générer QR table | ✅ | ✅ | ❌ | ❌ |
| Générer QR menu | ✅ | ✅ | ❌ | ❌ |
| QR menu public | ✅ | ✅ | ✅ | ✅ |
| Générer reçu PDF | ✅ | ✅ | ✅ | ❌ |
| Voir statistiques | ✅ | ✅ | ❌ | ❌ |
| Télécharger fichiers | ✅ | ✅ | ✅ | ✅ |

---

## 🚀 Intégrations

### **Avec le Module Tables**
- Génération automatique QR codes lors création tables
- Mise à jour `table.qr_code_url` dans la base de données
- Régénération QR codes lors modification tables

### **Avec le Module Orders**
- Génération automatique reçus PDF après livraison
- Données complètes commande + items + restaurant
- Intégration avec les statuts de commande

### **Avec le Module Menu**
- QR codes pointent vers menu public avec paramètres table
- URLs dynamiques basées sur `tenant.slug`
- Intégration avec le système de tables

---

## 📊 Statistiques

### **QR Codes Stats**
```http
GET /api/v1/qr-codes/stats

Response:
{
  "totalTables": 15,
  "tablesWithQR": 12,
  "tablesWithoutQR": 3,
  "coveragePercentage": 80,
  "recentQRCodes": [...]
}
```

### **PDF Stats**
```http
GET /api/v1/pdf/stats

Response:
{
  "totalReceipts": 245,
  "recentReceipts": [...]
}
```

---

## 🔒 Sécurité

### **Validation Fichiers**
- Noms de fichiers validés avec regex strict
- Pas d'accès aux fichiers en dehors des dossiers autorisés
- Headers de sécurité appropriés pour téléchargements

### **Gestion Mémoire**
- Puppeteer avec limite de mémoire
- Nettoyage automatique des fichiers temporaires
- Fermeture propre des browsers Puppeteer

---

## 📈 Performance

### **Optimisations QR Codes**
- Génération en mémoire sans fichiers temporaires
- Cache des QR codes générés
- Compression PNG optimisée

### **Optimisations PDF**
- Template HTML optimisé pour Puppeteer
- Réutilisation des instances browser quand possible
- Format PDF compressé pour réduire la taille

---

## 📊 Métriques

**Module 5 - QR Code & PDF :** ✅ **100% TERMINÉ**

- ✅ 8 endpoints QR codes
- ✅ 4 endpoints PDF
- ✅ 3 services spécialisés (Files, QR, PDF)
- ✅ Support complet Puppeteer
- ✅ Template HTML responsive
- ✅ Personnalisation QR codes complète
- ✅ Gestion fichiers sécurisée
- ✅ Statistiques détaillées
- ✅ Tests automatisés
- ✅ Documentation complète












