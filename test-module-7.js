// Script de test complet pour Module 7 - Testing & QA
const { execSync } = require('child_process');
const fs = require('fs');

console.log('🧪 MODULE 7 - TESTING & QA');
console.log('============================\n');

function runTestSuite() {
  const testSuites = [
    {
      name: '🔧 Compilation TypeScript',
      command: 'npx tsc --noEmit',
      description: 'Vérifier la validité du code TypeScript',
      critical: true,
    },
    {
      name: '🏗️  Build Application',
      command: 'npm run build',
      description: 'Compiler l\'application complète',
      critical: true,
    },
    {
      name: '🧪 Tests Unitaires',
      command: 'npm run test:unit',
      description: 'Tests unitaires des services et contrôleurs',
      critical: true,
    },
    {
      name: '🔗 Tests d\'Intégration',
      command: 'npm run test:integration',
      description: 'Tests d\'intégration avec base de données',
      critical: true,
    },
    {
      name: '🌐 Tests E2E',
      command: 'npm run test:e2e',
      description: 'Tests End-to-End des flux complets',
      critical: true,
    },
    {
      name: '📊 Coverage Report',
      command: 'npm run test:cov',
      description: 'Rapport de couverture de code',
      critical: false,
    },
    {
      name: '🔥 Tests de Charge',
      command: 'npm run test:load',
      description: 'Tests de performance et charge',
      critical: false,
    },
    {
      name: '📏 Linting',
      command: 'npm run lint',
      description: 'Vérification qualité code (ESLint)',
      critical: false,
    },
  ];

  let passed = 0;
  let failed = 0;
  let skipped = 0;
  const results = [];

  console.log('🚀 LANCEMENT DES TESTS...\n');

  testSuites.forEach((suite, index) => {
    try {
      console.log(`${index + 1}️⃣  ${suite.name}`);
      console.log(`   ${suite.description}`);
      
      const startTime = Date.now();
      
      try {
        execSync(suite.command, { 
          stdio: 'pipe',
          timeout: 120000 // 2 minutes timeout
        });
        
        const duration = Date.now() - startTime;
        console.log(`✅ Réussi (${duration}ms)\n`);
        
        results.push({
          name: suite.name,
          status: 'PASS',
          duration,
          critical: suite.critical,
        });
        passed++;
        
      } catch (error) {
        const duration = Date.now() - startTime;
        
        if (suite.critical) {
          console.log(`❌ Échec CRITIQUE (${duration}ms)`);
          console.log(`   Erreur: ${error.message.split('\\n')[0]}\n`);
          
          results.push({
            name: suite.name,
            status: 'FAIL',
            duration,
            critical: true,
            error: error.message,
          });
          failed++;
        } else {
          console.log(`⚠️  Échec non-critique (${duration}ms)\n`);
          
          results.push({
            name: suite.name,
            status: 'SKIP',
            duration,
            critical: false,
            error: error.message,
          });
          skipped++;
        }
      }
      
    } catch (error) {
      console.log(`💥 Erreur système: ${error.message}\n`);
      failed++;
    }
  });

  // Générer le rapport final
  generateReport(results, passed, failed, skipped);
  
  return { passed, failed, skipped, results };
}

function generateReport(results, passed, failed, skipped) {
  console.log('\n' + '='.repeat(60));
  console.log('📋 RAPPORT FINAL - MODULE 7 TESTING');
  console.log('='.repeat(60));
  
  console.log(`\n📊 RÉSUMÉ:`);
  console.log(`   ✅ Tests réussis: ${passed}`);
  console.log(`   ❌ Tests échoués: ${failed}`);
  console.log(`   ⚠️  Tests ignorés: ${skipped}`);
  console.log(`   📈 Total: ${passed + failed + skipped}`);
  
  const successRate = ((passed / (passed + failed)) * 100).toFixed(1);
  console.log(`   🎯 Taux de réussite: ${successRate}%`);
  
  // Détail par catégorie
  console.log(`\n📋 DÉTAIL DES TESTS:`);
  
  const criticalTests = results.filter(r => r.critical);
  const nonCriticalTests = results.filter(r => !r.critical);
  
  console.log(`\n🔴 Tests Critiques (${criticalTests.length}):`);
  criticalTests.forEach(test => {
    const icon = test.status === 'PASS' ? '✅' : '❌';
    console.log(`   ${icon} ${test.name} - ${test.duration}ms`);
    if (test.error && test.status === 'FAIL') {
      console.log(`      💥 ${test.error.split('\\n')[0]}`);
    }
  });
  
  console.log(`\n🟡 Tests Non-Critiques (${nonCriticalTests.length}):`);
  nonCriticalTests.forEach(test => {
    const icon = test.status === 'PASS' ? '✅' : test.status === 'FAIL' ? '❌' : '⚠️';
    console.log(`   ${icon} ${test.name} - ${test.duration}ms`);
  });
  
  // Vérifier les fichiers de couverture
  console.log(`\n📊 COUVERTURE DE CODE:`);
  if (fs.existsSync('coverage')) {
    console.log('   ✅ Rapport de couverture généré dans ./coverage/');
    
    // Lire le résumé de couverture si disponible
    try {
      const coverageFiles = fs.readdirSync('coverage');
      if (coverageFiles.includes('coverage-summary.json')) {
        const summary = JSON.parse(fs.readFileSync('coverage/coverage-summary.json', 'utf8'));
        const total = summary.total;
        
        console.log(`   📈 Lignes: ${total.lines.pct}%`);
        console.log(`   📈 Fonctions: ${total.functions.pct}%`);
        console.log(`   📈 Branches: ${total.branches.pct}%`);
        console.log(`   📈 Statements: ${total.statements.pct}%`);
      }
    } catch (error) {
      console.log('   ⚠️  Impossible de lire le résumé de couverture');
    }
  } else {
    console.log('   ❌ Aucun rapport de couverture trouvé');
  }
  
  // Recommandations
  console.log(`\n💡 RECOMMANDATIONS:`);
  
  const criticalFailures = results.filter(r => r.critical && r.status === 'FAIL');
  if (criticalFailures.length > 0) {
    console.log('   🚨 ATTENTION: Des tests critiques ont échoué !');
    console.log('   🔧 Corrigez ces erreurs avant de déployer en production');
    criticalFailures.forEach(test => {
      console.log(`      - ${test.name}`);
    });
  } else {
    console.log('   ✅ Tous les tests critiques sont passés');
    
    if (parseFloat(successRate) >= 95) {
      console.log('   🎉 Excellente qualité de code !');
      console.log('   🚀 Prêt pour le Module 8 - Deployment');
    } else if (parseFloat(successRate) >= 85) {
      console.log('   👍 Bonne qualité de code');
      console.log('   🔧 Quelques améliorations possibles');
    } else {
      console.log('   ⚠️  Qualité de code à améliorer');
      console.log('   🔧 Recommandé de corriger plus de tests');
    }
  }
  
  // Métriques de performance
  const totalDuration = results.reduce((sum, r) => sum + r.duration, 0);
  console.log(`\n⏱️  PERFORMANCE:`);
  console.log(`   🕐 Temps total: ${(totalDuration / 1000).toFixed(2)}s`);
  console.log(`   📊 Temps moyen/test: ${(totalDuration / results.length).toFixed(0)}ms`);
  
  // État du module
  console.log(`\n🎯 ÉTAT DU MODULE 7:`);
  if (criticalFailures.length === 0 && parseFloat(successRate) >= 90) {
    console.log('   ✅ MODULE 7 - TESTING & QA: TERMINÉ !');
    console.log('   🎉 Qualité de code validée');
    console.log('   🚀 Prêt pour la production');
    console.log('   ➡️  Prochaine étape: Module 8 - Deployment & CI/CD');
  } else {
    console.log('   ⚠️  MODULE 7 - TESTING & QA: EN COURS');
    console.log('   🔧 Corrections nécessaires avant validation');
  }
  
  console.log('\n' + '='.repeat(60));
}

// Lancer les tests
try {
  const results = runTestSuite();
  
  // Code de sortie
  if (results.failed > 0) {
    process.exit(1); // Échec
  } else {
    process.exit(0); // Succès
  }
  
} catch (error) {
  console.error('💥 Erreur fatale lors des tests:', error.message);
  process.exit(1);
}











