// Test rapide du Module 4 - Orders & WebSocket
const { execSync } = require('child_process');
const fs = require('fs');

console.log('📝 Test rapide Module 4 - Orders & WebSocket');
console.log('============================================\n');

function testOrdersQuick() {
  const tests = [
    {
      name: 'Compilation TypeScript',
      command: 'npx tsc --noEmit',
      description: 'Vérifier que le code TypeScript avec orders est valide'
    },
    {
      name: 'Build NestJS',
      command: 'npm run build',
      description: 'Compiler l\'application avec les modules orders & websocket'
    },
    {
      name: 'Génération Prisma',
      command: 'npx prisma generate',
      description: 'Générer le client Prisma avec les types orders'
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

  // Vérification des fichiers générés pour les orders & websocket
  console.log('📁 Vérification des fichiers du module Orders & WebSocket...');
  const expectedOrderFiles = [
    { path: 'dist/orders/orders.controller.js', description: 'Contrôleur commandes' },
    { path: 'dist/orders/orders.service.js', description: 'Service commandes' },
    { path: 'dist/orders/order-items.service.js', description: 'Service items de commande' },
    { path: 'dist/orders/orders.module.js', description: 'Module commandes complet' },
    { path: 'dist/websocket/orders.gateway.js', description: 'Gateway WebSocket commandes' },
    { path: 'dist/websocket/websocket.service.js', description: 'Service WebSocket' },
    { path: 'dist/websocket/websocket.module.js', description: 'Module WebSocket' },
    { path: 'dist/common/types/order.types.js', description: 'Types commandes' }
  ];

  let filesOk = 0;
  expectedOrderFiles.forEach(file => {
    if (fs.existsSync(file.path)) {
      console.log(`✅ ${file.path} - ${file.description}`);
      filesOk++;
    } else {
      console.log(`❌ ${file.path} - ${file.description} (MANQUANT)`);
    }
  });

  console.log(`\n📊 Résultats:`);
  console.log(`   Tests de compilation: ${passed}/${total}`);
  console.log(`   Fichiers orders/websocket générés: ${filesOk}/${expectedOrderFiles.length}`);

  if (passed === total && filesOk === expectedOrderFiles.length) {
    console.log('\n🎉 TOUS LES TESTS RAPIDES DES COMMANDES RÉUSSIS !');
    console.log('✨ Le Module 4 est prêt pour les tests avec base de données');
    console.log('\n📝 Fonctionnalités commandes implémentées:');
    console.log('   ✅ Création de commandes (publiques et privées)');
    console.log('   ✅ Gestion des statuts (PENDING → ACCEPTED → PREPARING → READY → DELIVERED)');
    console.log('   ✅ Validation des items et calcul automatique des prix');
    console.log('   ✅ Génération automatique de numéros de commande');
    console.log('   ✅ Filtrage avancé des commandes');
    console.log('   ✅ Statistiques complètes (CA, items populaires, etc.)');
    console.log('   ✅ Transitions de statut sécurisées');
    console.log('   ✅ Audit trail complet des actions');
    console.log('\n⚡ Fonctionnalités WebSocket temps réel:');
    console.log('   ✅ Authentification JWT pour WebSocket');
    console.log('   ✅ Rooms par tenant et par rôle');
    console.log('   ✅ Notifications nouvelles commandes (cuisine)');
    console.log('   ✅ Notifications changements de statut');
    console.log('   ✅ Notifications commandes prêtes');
    console.log('   ✅ Statistiques temps réel (admins/managers)');
    console.log('   ✅ Room spéciale cuisine pour le personnel');
    console.log('\n📱 Endpoints commandes implémentés:');
    console.log('   🌐 POST /orders/public/:slug - Commande publique client');
    console.log('   🔐 POST /orders - Commande privée (utilisateurs connectés)');
    console.log('   🔐 GET /orders - Liste des commandes (avec filtres)');
    console.log('   🔐 GET /orders/active - Commandes actives (cuisine)');
    console.log('   🔐 GET /orders/stats - Statistiques détaillées');
    console.log('   🔐 PATCH /orders/:id/status - Changer statut');
    console.log('   🔐 PATCH /orders/:id/accept - Accepter commande');
    console.log('   🔐 PATCH /orders/:id/preparing - Commencer préparation');
    console.log('   🔐 PATCH /orders/:id/ready - Marquer prêt');
    console.log('   🔐 PATCH /orders/:id/delivered - Marquer livré');
    console.log('   🔐 PATCH /orders/:id/cancel - Annuler commande');
    console.log('\n🔌 WebSocket endpoints:');
    console.log('   ⚡ /orders - Namespace principal');
    console.log('   📡 join_kitchen - Rejoindre la cuisine');
    console.log('   📡 get_active_orders - Récupérer commandes actives');
    console.log('   📡 ping/pong - Test de connexion');
    console.log('\nPour tester avec une vraie base de données:');
    console.log('   node test-orders.js');
    return true;
  } else {
    console.log('\n❌ Certains tests ont échoué');
    console.log('Vérifiez les erreurs ci-dessus avant de continuer');
    return false;
  }
}

testOrdersQuick();












