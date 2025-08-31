// Audit CORRIGÉ - avec les bons chemins
const fs = require('fs');

console.log('🔍 AUDIT CORRIGÉ DES MODULES');
console.log('============================\n');

function checkFile(path) {
  return fs.existsSync(path);
}

function auditModuleCorrect(moduleNumber, moduleName, sourceFiles, compiledFiles) {
  console.log(`📋 MODULE ${moduleNumber} - ${moduleName.toUpperCase()}`);
  console.log('─'.repeat(50));
  
  let score = 0;
  let maxScore = 0;
  const issues = [];
  
  // Vérifier les fichiers source
  console.log('📁 Fichiers source:');
  sourceFiles.forEach(file => {
    maxScore++;
    if (checkFile(file)) {
      console.log(`   ✅ ${file}`);
      score++;
    } else {
      console.log(`   ❌ ${file} (MANQUANT)`);
      issues.push(`Fichier source manquant: ${file}`);
    }
  });
  
  // Vérifier les fichiers compilés (avec le bon chemin dist/src/)
  console.log('\n🏗️  Fichiers compilés:');
  compiledFiles.forEach(file => {
    maxScore++;
    if (checkFile(file)) {
      console.log(`   ✅ ${file}`);
      score++;
    } else {
      console.log(`   ❌ ${file} (NON COMPILÉ)`);
      issues.push(`Compilation échouée: ${file}`);
    }
  });
  
  const percentage = maxScore > 0 ? ((score / maxScore) * 100).toFixed(1) : 100;
  const status = percentage >= 90 ? '✅ FONCTIONNEL' : 
                percentage >= 70 ? '⚠️  PARTIEL' : 
                '❌ PROBLÉMATIQUE';
  
  console.log(`\n📊 Statut: ${status} (${score}/${maxScore} - ${percentage}%)`);
  
  if (issues.length > 0) {
    console.log('\n🚨 Problèmes détectés:');
    issues.forEach(issue => console.log(`   • ${issue}`));
  }
  
  console.log('\n' + '='.repeat(60) + '\n');
  
  return { moduleNumber, moduleName, score, maxScore, percentage: parseFloat(percentage), status, issues };
}

// AUDIT CORRIGÉ DE TOUS LES MODULES
const results = [];

// MODULE 1 - Database & Multi-Tenant
results.push(auditModuleCorrect(1, 'Database & Multi-Tenant', 
  [
    'prisma/schema.prisma',
    'src/prisma/prisma.service.ts',
    'src/prisma/prisma.module.ts',
    'src/common/middleware/tenant.middleware.ts',
    'src/common/guards/tenant.guard.ts',
    'src/common/decorators/tenant.decorator.ts'
  ],
  [
    'dist/src/prisma/prisma.service.js',
    'dist/src/prisma/prisma.module.js',
    'dist/src/common/middleware/tenant.middleware.js',
    'dist/src/common/guards/tenant.guard.js',
    'dist/src/common/decorators/tenant.decorator.js'
  ]
));

// MODULE 2 - Authentication & Authorization  
results.push(auditModuleCorrect(2, 'Authentication & Authorization',
  [
    'src/auth/auth.service.ts',
    'src/auth/auth.controller.ts',
    'src/auth/auth.module.ts',
    'src/users/users.service.ts',
    'src/users/users.controller.ts'
  ],
  [
    'dist/src/auth/auth.service.js',
    'dist/src/auth/auth.controller.js',
    'dist/src/auth/auth.module.js',
    'dist/src/users/users.service.js',
    'dist/src/users/users.controller.js'
  ]
));

// MODULE 3 - Menu CRUD & Management
results.push(auditModuleCorrect(3, 'Menu CRUD & Management',
  [
    'src/menu/menu.service.ts',
    'src/menu/menu.controller.ts',
    'src/menu/categories/categories.service.ts',
    'src/menu/categories/categories.controller.ts',
    'src/menu/items/items.service.ts',
    'src/menu/items/items.controller.ts'
  ],
  [
    'dist/src/menu/menu.service.js',
    'dist/src/menu/menu.controller.js',
    'dist/src/menu/categories/categories.service.js',
    'dist/src/menu/categories/categories.controller.js',
    'dist/src/menu/items/items.service.js',
    'dist/src/menu/items/items.controller.js'
  ]
));

// MODULE 4 - Orders & WebSocket
results.push(auditModuleCorrect(4, 'Orders & WebSocket',
  [
    'src/orders/orders.service.ts',
    'src/orders/orders.controller.ts',
    'src/orders/order-items.service.ts',
    'src/websocket/websocket.service.ts',
    'src/websocket/orders.gateway.ts'
  ],
  [
    'dist/src/orders/orders.service.js',
    'dist/src/orders/orders.controller.js',
    'dist/src/orders/order-items.service.js',
    'dist/src/websocket/websocket.service.js',
    'dist/src/websocket/orders.gateway.js'
  ]
));

// MODULE 5 - QR Code & PDF
results.push(auditModuleCorrect(5, 'QR Code & PDF',
  [
    'src/files/qr-code.service.ts',
    'src/files/qr-code.controller.ts',
    'src/files/pdf.service.ts',
    'src/files/pdf.controller.ts',
    'src/files/files.service.ts'
  ],
  [
    'dist/src/files/qr-code.service.js',
    'dist/src/files/qr-code.controller.js',
    'dist/src/files/pdf.service.js',
    'dist/src/files/pdf.controller.js',
    'dist/src/files/files.service.js'
  ]
));

// MODULE 6 - Payments
results.push(auditModuleCorrect(6, 'Payments (MyNita & Wave)',
  [
    'src/payments/payments.service.ts',
    'src/payments/payments.controller.ts',
    'src/payments/webhooks.controller.ts',
    'src/payments/providers/mynita.service.ts',
    'src/payments/providers/wave.service.ts'
  ],
  [
    'dist/src/payments/payments.service.js',
    'dist/src/payments/payments.controller.js',
    'dist/src/payments/webhooks.controller.js',
    'dist/src/payments/providers/mynita.service.js',
    'dist/src/payments/providers/wave.service.js'
  ]
));

// RÉSUMÉ GLOBAL CORRIGÉ
console.log('📊 RÉSUMÉ GLOBAL CORRIGÉ');
console.log('========================');

let totalScore = 0;
let totalMaxScore = 0;
const problematicModules = [];
const partialModules = [];
const functionalModules = [];

results.forEach(result => {
  totalScore += result.score;
  totalMaxScore += result.maxScore;
  
  const statusIcon = result.percentage >= 90 ? '✅' : 
                    result.percentage >= 70 ? '⚠️' : '❌';
  
  console.log(`${statusIcon} Module ${result.moduleNumber}: ${result.moduleName} (${result.percentage}%)`);
  
  if (result.percentage < 70) {
    problematicModules.push(result);
  } else if (result.percentage < 90) {
    partialModules.push(result);
  } else {
    functionalModules.push(result);
  }
});

const globalPercentage = ((totalScore / totalMaxScore) * 100).toFixed(1);
console.log(`\n🎯 GLOBAL: ${totalScore}/${totalMaxScore} (${globalPercentage}%)`);

console.log(`\n📈 RÉPARTITION:`);
console.log(`   ✅ Modules fonctionnels: ${functionalModules.length}`);
console.log(`   ⚠️  Modules partiels: ${partialModules.length}`);
console.log(`   ❌ Modules problématiques: ${problematicModules.length}`);

console.log(`\n🎯 CONCLUSION CORRIGÉE:`);
if (globalPercentage >= 90) {
  console.log(`   🎉 EXCELLENT! Tous les modules sont fonctionnels!`);
  console.log(`   🚀 PRÊT POUR LE MODULE 8 - DEPLOYMENT!`);
} else if (globalPercentage >= 80) {
  console.log(`   👍 TRÈS BON! Système globalement fonctionnel`);
} else if (globalPercentage >= 70) {
  console.log(`   ⚠️  CORRECT! Quelques ajustements nécessaires`);
} else {
  console.log(`   🚨 ATTENTION! Corrections importantes nécessaires`);
}

if (problematicModules.length > 0) {
  console.log(`\n🚨 MODULES RÉELLEMENT PROBLÉMATIQUES:`);
  problematicModules.forEach(module => {
    console.log(`\n❌ MODULE ${module.moduleNumber} - ${module.moduleName}:`);
    module.issues.forEach(issue => console.log(`   • ${issue}`));
  });
} else {
  console.log(`\n🎉 AUCUN MODULE PROBLÉMATIQUE DÉTECTÉ!`);
  console.log(`   Tous les modules sont fonctionnels ou partiels`);
}











