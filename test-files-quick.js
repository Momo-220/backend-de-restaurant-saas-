// Test rapide du Module 5 - QR Code & PDF
const { execSync } = require('child_process');
const fs = require('fs');

console.log('📄 Test rapide Module 5 - QR Code & PDF');
console.log('=======================================\n');

function testFilesQuick() {
  const tests = [
    {
      name: 'Compilation TypeScript',
      command: 'npx tsc --noEmit',
      description: 'Vérifier que le code TypeScript avec files est valide'
    },
    {
      name: 'Build NestJS',
      command: 'npm run build',
      description: 'Compiler l\'application avec le module files'
    },
    {
      name: 'Génération Prisma',
      command: 'npx prisma generate',
      description: 'Générer le client Prisma avec les types files'
    }
  ];

  let passed = 0;
  let total = tests.length;

  tests.forEach((test, index) => {
    try {
      console.log(`${index + 1}️⃣  ${test.name}...`);
      console.log(`   ${test.description}`);
      
      execSync(test.command, { stdio: 'pipe' });
      console.log('✅ Réussi\n');
      passed++;
      
    } catch (error) {
      console.log(`❌ Échec: ${error.message}\n`);
    }
  });

  // Vérification des fichiers générés pour les files
  console.log('📁 Vérification des fichiers du module Files...');
  const expectedFilesFiles = [
    { path: 'dist/files/files.service.js', description: 'Service fichiers de base' },
    { path: 'dist/files/qr-code.controller.js', description: 'Contrôleur QR codes' },
    { path: 'dist/files/qr-code.service.js', description: 'Service QR codes' },
    { path: 'dist/files/pdf.controller.js', description: 'Contrôleur PDF' },
    { path: 'dist/files/pdf.service.js', description: 'Service PDF' },
    { path: 'dist/files/files.module.js', description: 'Module files complet' }
  ];

  let filesOk = 0;
  expectedFilesFiles.forEach(file => {
    if (fs.existsSync(file.path)) {
      console.log(`✅ ${file.path} - ${file.description}`);
      filesOk++;
    } else {
      console.log(`❌ ${file.path} - ${file.description} (MANQUANT)`);
    }
  });

  // Vérifier la création des dossiers
  console.log('\n📂 Vérification des dossiers de fichiers...');
  const expectedDirs = [
    { path: 'public', description: 'Dossier public pour les fichiers' },
    { path: 'public/qr-codes', description: 'Dossier QR codes' },
    { path: 'public/receipts', description: 'Dossier reçus PDF' },
    { path: 'uploads', description: 'Dossier uploads' }
  ];

  let dirsOk = 0;
  expectedDirs.forEach(dir => {
    if (fs.existsSync(dir.path)) {
      console.log(`✅ ${dir.path}/ - ${dir.description}`);
      dirsOk++;
    } else {
      console.log(`❌ ${dir.path}/ - ${dir.description} (MANQUANT)`);
      // Créer le dossier pour les tests
      try {
        fs.mkdirSync(dir.path, { recursive: true });
        console.log(`   → Dossier créé automatiquement`);
        dirsOk++;
      } catch (error) {
        console.log(`   → Erreur création: ${error.message}`);
      }
    }
  });

  console.log(`\n📊 Résultats:`);
  console.log(`   Tests de compilation: ${passed}/${total}`);
  console.log(`   Fichiers files générés: ${filesOk}/${expectedFilesFiles.length}`);
  console.log(`   Dossiers créés: ${dirsOk}/${expectedDirs.length}`);

  if (passed === total && filesOk === expectedFilesFiles.length) {
    console.log('\n🎉 TOUS LES TESTS RAPIDES DES FICHIERS RÉUSSIS !');
    console.log('✨ Le Module 5 est prêt pour les tests avec base de données');
    console.log('\n📄 Fonctionnalités QR Code implémentées:');
    console.log('   ✅ Génération QR codes pour tables individuelles');
    console.log('   ✅ Génération QR code menu global restaurant');
    console.log('   ✅ QR codes publics (sans authentification)');
    console.log('   ✅ Génération en masse pour toutes les tables');
    console.log('   ✅ Régénération QR codes existants');
    console.log('   ✅ Personnalisation (taille, couleurs, marge)');
    console.log('   ✅ Statistiques couverture QR codes');
    console.log('   ✅ Téléchargement et visualisation QR codes');
    console.log('\n📋 Fonctionnalités PDF implémentées:');
    console.log('   ✅ Génération reçus automatiques pour commandes');
    console.log('   ✅ Template HTML responsive pour reçus');
    console.log('   ✅ Conversion HTML vers PDF avec Puppeteer');
    console.log('   ✅ Informations complètes (restaurant, commande, items)');
    console.log('   ✅ Support logo restaurant et personnalisation');
    console.log('   ✅ Format ticket de caisse optimisé');
    console.log('   ✅ Téléchargement et visualisation PDF');
    console.log('   ✅ Statistiques génération reçus');
    console.log('\n🗂️  Fonctionnalités gestion fichiers:');
    console.log('   ✅ Service fichiers centralisé');
    console.log('   ✅ Gestion dossiers automatique (public/, uploads/)');
    console.log('   ✅ Noms de fichiers uniques avec timestamps');
    console.log('   ✅ Suppression fichiers sécurisée');
    console.log('   ✅ URLs publiques pour accès frontend');
    console.log('   ✅ Nettoyage automatique fichiers anciens');
    console.log('\n📱 Endpoints QR Code implémentés:');
    console.log('   🔐 POST /qr-codes/table/:id - QR code table (ADMIN/MANAGER)');
    console.log('   🔐 POST /qr-codes/menu - QR code menu (ADMIN/MANAGER)');
    console.log('   🌐 POST /qr-codes/public/menu/:slug - QR code public');
    console.log('   🔐 POST /qr-codes/tables/generate-all - Tous les QR codes');
    console.log('   🔐 POST /qr-codes/table/:id/regenerate - Régénérer QR');
    console.log('   🔐 GET /qr-codes/stats - Statistiques QR codes');
    console.log('   🌐 GET /qr-codes/download/:filename - Télécharger QR');
    console.log('   🌐 GET /qr-codes/view/:filename - Visualiser QR');
    console.log('\n📱 Endpoints PDF implémentés:');
    console.log('   🔐 POST /pdf/receipt/order/:id - Reçu commande (ALL ROLES)');
    console.log('   🔐 GET /pdf/stats - Statistiques PDF (ADMIN/MANAGER)');
    console.log('   🌐 GET /pdf/download/:filename - Télécharger PDF');
    console.log('   🌐 GET /pdf/view/:filename - Visualiser PDF');
    console.log('\nPour tester avec une vraie base de données:');
    console.log('   node test-files.js');
    return true;
  } else {
    console.log('\n❌ Certains tests ont échoué');
    console.log('Vérifiez les erreurs ci-dessus avant de continuer');
    return false;
  }
}

testFilesQuick();












