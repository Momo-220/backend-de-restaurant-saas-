// Test rapide sans base de données - juste la compilation et structure
const { execSync } = require('child_process');
const fs = require('fs');

console.log('⚡ Test rapide Restaurant SaaS Backend');
console.log('=====================================\n');

function testQuick() {
  const tests = [
    {
      name: 'Compilation TypeScript',
      command: 'npx tsc --noEmit',
      description: 'Vérifier que le code TypeScript est valide'
    },
    {
      name: 'Build NestJS',
      command: 'npm run build',
      description: 'Compiler l\'application pour la production'
    },
    {
      name: 'Génération Prisma',
      command: 'npx prisma generate',
      description: 'Générer le client Prisma depuis le schéma'
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

  // Vérification des fichiers générés
  console.log('📁 Vérification des fichiers générés...');
  const expectedFiles = [
    { path: 'dist/main.js', description: 'Point d\'entrée principal' },
    { path: 'dist/app.module.js', description: 'Module racine NestJS' },
    { path: 'dist/prisma/prisma.service.js', description: 'Service base de données' },
    { path: 'dist/tenants/tenants.controller.js', description: 'Contrôleur restaurants' },
    { path: 'dist/tenants/tenants.service.js', description: 'Service restaurants' },
    { path: 'node_modules/@prisma/client/index.js', description: 'Client Prisma généré' }
  ];

  let filesOk = 0;
  expectedFiles.forEach(file => {
    if (fs.existsSync(file.path)) {
      console.log(`✅ ${file.path} - ${file.description}`);
      filesOk++;
    } else {
      console.log(`❌ ${file.path} - ${file.description} (MANQUANT)`);
    }
  });

  console.log(`\n📊 Résultats:`);
  console.log(`   Tests de compilation: ${passed}/${total}`);
  console.log(`   Fichiers générés: ${filesOk}/${expectedFiles.length}`);

  if (passed === total && filesOk === expectedFiles.length) {
    console.log('\n🎉 TOUS LES TESTS RAPIDES RÉUSSIS !');
    console.log('✨ Le projet est prêt pour les tests avec base de données');
    console.log('\nPour tester avec une vraie base de données:');
    console.log('   node test-with-database.js');
    console.log('\nOu démarrer manuellement:');
    console.log('   docker-compose up -d');
    console.log('   # Attendre 30s puis:');
    console.log('   docker-compose exec app npx prisma migrate dev');
    return true;
  } else {
    console.log('\n❌ Certains tests ont échoué');
    console.log('Vérifiez les erreurs ci-dessus avant de continuer');
    return false;
  }
}

testQuick();












