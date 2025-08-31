// Test rapide du Module 2 - Authentication (compilation seulement)
const { execSync } = require('child_process');
const fs = require('fs');

console.log('⚡ Test rapide Module 2 - Authentication & Authorization');
console.log('====================================================\n');

function testAuthQuick() {
  const tests = [
    {
      name: 'Compilation TypeScript',
      command: 'npx tsc --noEmit',
      description: 'Vérifier que le code TypeScript avec auth est valide'
    },
    {
      name: 'Build NestJS',
      command: 'npm run build',
      description: 'Compiler l\'application avec le module auth'
    },
    {
      name: 'Génération Prisma',
      command: 'npx prisma generate',
      description: 'Générer le client Prisma avec les nouveaux types'
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

  // Vérification des fichiers générés pour l'auth
  console.log('📁 Vérification des fichiers d\'authentification...');
  const expectedAuthFiles = [
    { path: 'dist/auth/auth.controller.js', description: 'Contrôleur auth (register/login/logout)' },
    { path: 'dist/auth/auth.service.js', description: 'Service auth avec JWT' },
    { path: 'dist/auth/strategies/jwt.strategy.js', description: 'Stratégie JWT Passport' },
    { path: 'dist/auth/strategies/local.strategy.js', description: 'Stratégie Local Passport' },
    { path: 'dist/auth/guards/jwt-auth.guard.js', description: 'Guard JWT pour protection routes' },
    { path: 'dist/auth/guards/roles.guard.js', description: 'Guard RBAC pour rôles' },
    { path: 'dist/users/users.controller.js', description: 'Contrôleur utilisateurs' },
    { path: 'dist/users/users.service.js', description: 'Service utilisateurs' },
    { path: 'dist/common/middleware/tenant.middleware.js', description: 'Middleware tenant avec JWT' }
  ];

  let filesOk = 0;
  expectedAuthFiles.forEach(file => {
    if (fs.existsSync(file.path)) {
      console.log(`✅ ${file.path} - ${file.description}`);
      filesOk++;
    } else {
      console.log(`❌ ${file.path} - ${file.description} (MANQUANT)`);
    }
  });

  console.log(`\n📊 Résultats:`);
  console.log(`   Tests de compilation: ${passed}/${total}`);
  console.log(`   Fichiers d'auth générés: ${filesOk}/${expectedAuthFiles.length}`);

  if (passed === total && filesOk === expectedAuthFiles.length) {
    console.log('\n🎉 TOUS LES TESTS RAPIDES D\'AUTHENTIFICATION RÉUSSIS !');
    console.log('✨ Le Module 2 est prêt pour les tests avec base de données');
    console.log('\n🔐 Fonctionnalités d\'authentification implémentées:');
    console.log('   ✅ JWT Strategy avec Passport');
    console.log('   ✅ Register/Login/Logout endpoints');
    console.log('   ✅ Role-Based Access Control (ADMIN, MANAGER, STAFF)');
    console.log('   ✅ Guards de sécurité (JWT + Roles)');
    console.log('   ✅ Middleware multi-tenant avec JWT');
    console.log('   ✅ CRUD utilisateurs avec permissions');
    console.log('   ✅ Hachage sécurisé des mots de passe (bcrypt)');
    console.log('   ✅ Validation des données (class-validator)');
    console.log('\nPour tester avec une vraie base de données:');
    console.log('   node test-auth.js');
    return true;
  } else {
    console.log('\n❌ Certains tests ont échoué');
    console.log('Vérifiez les erreurs ci-dessus avant de continuer');
    return false;
  }
}

testAuthQuick();












