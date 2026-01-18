import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import 'dotenv/config';

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL as string,
});
const prisma = new PrismaClient({ adapter });

// Google Cloud Translation API
const GOOGLE_API_KEY = process.env.GOOGLE_TRANSLATE_API_KEY || '';
const TRANSLATE_URL = 'https://translation.googleapis.com/language/translate/v2';

// Rate limiting
const BATCH_SIZE = 50; // Translate 50 exercises per run to stay within free tier
const DELAY_MS = 100;

async function translateText(text: string): Promise<string | null> {
  if (!text || text.trim() === '') return null;

  try {
    const response = await fetch(`${TRANSLATE_URL}?key=${GOOGLE_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        q: text,
        source: 'en',
        target: 'pt',
        format: 'text',
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('   ❌ Erro na tradução:', error);
      return null;
    }

    const data = await response.json();
    return data.data?.translations?.[0]?.translatedText || null;
  } catch (error) {
    console.error('   ❌ Erro de rede:', error);
    return null;
  }
}

async function translateInstructions() {
  console.log('');
  console.log('🌐 Tradução de Instruções - Google Translate API');
  console.log('=================================================');
  console.log('');

  if (!GOOGLE_API_KEY) {
    console.log('❌ GOOGLE_TRANSLATE_API_KEY não configurada!');
    console.log('');
    console.log('📋 Para configurar:');
    console.log('');
    console.log('1. Acesse: https://console.cloud.google.com/');
    console.log('2. Crie um novo projeto ou selecione existente');
    console.log('3. Vá em "APIs & Services" > "Library"');
    console.log('4. Pesquise "Cloud Translation API" e ative');
    console.log('5. Vá em "APIs & Services" > "Credentials"');
    console.log('6. Clique "Create Credentials" > "API Key"');
    console.log('7. Copie a chave e adicione ao .env:');
    console.log('   GOOGLE_TRANSLATE_API_KEY=sua_chave_aqui');
    console.log('');
    console.log('💰 Limite gratuito: 500.000 caracteres/mês');
    console.log('');
    return;
  }

  // Find exercises with English instructions (not yet translated)
  // We'll mark translated ones by checking if they contain common Portuguese words
  const exercises = await prisma.exercise.findMany({
    where: {
      instructions: { not: null },
      // Simple heuristic: if it starts with lowercase common English words
      OR: [
        { instructions: { startsWith: 'Lie' } },
        { instructions: { startsWith: 'Stand' } },
        { instructions: { startsWith: 'Sit' } },
        { instructions: { startsWith: 'Hold' } },
        { instructions: { startsWith: 'Place' } },
        { instructions: { startsWith: 'Begin' } },
        { instructions: { startsWith: 'Start' } },
        { instructions: { startsWith: 'Position' } },
        { instructions: { startsWith: 'Grab' } },
        { instructions: { startsWith: 'Keep' } },
        { instructions: { startsWith: 'Using' } },
        { instructions: { startsWith: 'With' } },
        { instructions: { startsWith: 'Step' } },
        { instructions: { startsWith: 'Set' } },
        { instructions: { startsWith: 'Get' } },
        { instructions: { startsWith: 'Attach' } },
        { instructions: { startsWith: 'Take' } },
        { instructions: { startsWith: 'Adjust' } },
        { instructions: { startsWith: 'Assume' } },
        { instructions: { startsWith: 'Select' } },
      ],
    },
    select: {
      id: true,
      name: true,
      instructions: true,
    },
    take: BATCH_SIZE,
  });

  const totalNeedTranslation = await prisma.exercise.count({
    where: {
      instructions: { not: null },
      OR: [
        { instructions: { startsWith: 'Lie' } },
        { instructions: { startsWith: 'Stand' } },
        { instructions: { startsWith: 'Sit' } },
        { instructions: { startsWith: 'Hold' } },
        { instructions: { startsWith: 'Place' } },
        { instructions: { startsWith: 'Begin' } },
        { instructions: { startsWith: 'Start' } },
        { instructions: { startsWith: 'Position' } },
        { instructions: { startsWith: 'Grab' } },
        { instructions: { startsWith: 'Keep' } },
        { instructions: { startsWith: 'Using' } },
        { instructions: { startsWith: 'With' } },
        { instructions: { startsWith: 'Step' } },
        { instructions: { startsWith: 'Set' } },
        { instructions: { startsWith: 'Get' } },
        { instructions: { startsWith: 'Attach' } },
        { instructions: { startsWith: 'Take' } },
        { instructions: { startsWith: 'Adjust' } },
        { instructions: { startsWith: 'Assume' } },
        { instructions: { startsWith: 'Select' } },
      ],
    },
  });

  console.log(`📊 Status:`);
  console.log(`   🔄 Pendentes de tradução: ${totalNeedTranslation}`);
  console.log(`   🎯 Traduzindo nesta execução: ${Math.min(exercises.length, BATCH_SIZE)}`);
  console.log('');

  if (exercises.length === 0) {
    console.log('🎉 Todas as instruções já foram traduzidas!');
    return;
  }

  let translated = 0;
  let failed = 0;
  let totalChars = 0;

  for (const exercise of exercises) {
    if (!exercise.instructions) continue;

    process.stdout.write(`🌐 ${exercise.name.substring(0, 40)}... `);

    const translatedText = await translateText(exercise.instructions);

    if (translatedText) {
      await prisma.exercise.update({
        where: { id: exercise.id },
        data: { instructions: translatedText },
      });
      translated++;
      totalChars += exercise.instructions.length;
      console.log('✅');
    } else {
      failed++;
      console.log('❌');
    }

    await new Promise(resolve => setTimeout(resolve, DELAY_MS));
  }

  const remaining = totalNeedTranslation - translated;

  console.log('');
  console.log('📊 Resultado desta execução:');
  console.log(`   ✅ Traduzidos: ${translated}`);
  console.log(`   ❌ Falhas: ${failed}`);
  console.log(`   📝 Caracteres usados: ~${totalChars}`);
  console.log(`   🔄 Restantes: ${remaining}`);
  console.log('');

  if (remaining > 0) {
    console.log('💡 Execute novamente para continuar traduzindo.');
    const estimatedRuns = Math.ceil(remaining / BATCH_SIZE);
    console.log(`   Estimativa: ${estimatedRuns} execuções restantes.`);
  } else {
    console.log('🎉 Todas as instruções foram traduzidas!');
  }
}

translateInstructions()
  .catch((error) => {
    console.error('❌ Erro:', error.message);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
