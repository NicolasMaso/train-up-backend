import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';
import 'dotenv/config';

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL as string,
});
const prisma = new PrismaClient({ adapter });

const RAPIDAPI_KEY = process.env.EXERCISEDB_API_KEY || '';
const RAPIDAPI_HOST = 'exercisedb.p.rapidapi.com';
const BASE_URL = 'https://exercisedb.p.rapidapi.com';

// Configuration
const GIFS_DIR = path.join(__dirname, '..', 'public', 'exercises');
const MAX_REQUESTS_PER_RUN = 500; // Leave margin for API exploration
const DELAY_MS = 300; // Delay between requests to avoid rate limiting

async function downloadGif(exerciseId: string): Promise<Buffer | null> {
  const url = `${BASE_URL}/image?resolution=180&exerciseId=${exerciseId}`;
  
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'x-rapidapi-key': RAPIDAPI_KEY,
        'x-rapidapi-host': RAPIDAPI_HOST,
      },
    });

    if (!response.ok) {
      if (response.status === 429) {
        console.log('   ⚠️ Rate limit atingido! Parando...');
        return null;
      }
      console.error(`   ❌ Erro ${response.status} para ${exerciseId}`);
      return null;
    }

    const buffer = await response.arrayBuffer();
    return Buffer.from(buffer);
  } catch (error) {
    console.error(`   ❌ Erro de rede para ${exerciseId}:`, error);
    return null;
  }
}

async function downloadGifsInBatches() {
  console.log('');
  console.log('📥 Download de GIFs - Modo Batch Seguro');
  console.log('========================================');
  console.log('');

  if (!RAPIDAPI_KEY) {
    console.error('❌ EXERCISEDB_API_KEY não configurada');
    return;
  }

  // Create directory
  if (!fs.existsSync(GIFS_DIR)) {
    fs.mkdirSync(GIFS_DIR, { recursive: true });
    console.log(`📁 Diretório criado: ${GIFS_DIR}`);
  }

  // Get exercises that need GIF download (don't have local path yet)
  const exercises = await prisma.exercise.findMany({
    where: {
      externalId: { not: null },
      OR: [
        { gifUrl: { startsWith: 'https://' } }, // Still pointing to API
        { gifUrl: null },
      ],
    },
    select: {
      id: true,
      externalId: true,
      name: true,
    },
    orderBy: { externalId: 'asc' },
  });

  const alreadyDownloaded = await prisma.exercise.count({
    where: {
      gifUrl: { startsWith: '/exercises/' },
    },
  });

  console.log(`📊 Status:`);
  console.log(`   ✅ Já baixados: ${alreadyDownloaded}`);
  console.log(`   🔄 Pendentes: ${exercises.length}`);
  console.log(`   🎯 Limite desta execução: ${MAX_REQUESTS_PER_RUN}`);
  console.log('');

  if (exercises.length === 0) {
    console.log('🎉 Todos os GIFs já foram baixados!');
    return;
  }

  const toDownload = exercises.slice(0, MAX_REQUESTS_PER_RUN);
  console.log(`🔄 Baixando ${toDownload.length} GIFs nesta execução...`);
  console.log('');

  let downloaded = 0;
  let failed = 0;
  let rateLimited = false;

  for (const exercise of toDownload) {
    if (rateLimited) break;

    const filename = `${exercise.externalId}.gif`;
    const filepath = path.join(GIFS_DIR, filename);

    // Double-check if file exists
    if (fs.existsSync(filepath)) {
      // Update DB to local path if file exists but DB wasn't updated
      await prisma.exercise.update({
        where: { id: exercise.id },
        data: { gifUrl: `/exercises/${filename}` },
      });
      continue;
    }

    process.stdout.write(`📥 ${exercise.externalId}: ${exercise.name.substring(0, 40)}...`);
    
    const buffer = await downloadGif(exercise.externalId!);
    
    if (buffer && buffer.length > 100) { // Ensure we got actual content
      fs.writeFileSync(filepath, buffer);
      
      await prisma.exercise.update({
        where: { id: exercise.id },
        data: { gifUrl: `/exercises/${filename}` },
      });
      
      downloaded++;
      console.log(` ✅ (${buffer.length} bytes)`);
    } else if (buffer === null) {
      // Check if it was rate limited
      failed++;
      if (failed > 5) {
        console.log('');
        console.log('⚠️ Muitas falhas consecutivas. Pode ser rate limit.');
        rateLimited = true;
      }
    } else {
      failed++;
      console.log(' ❌ (resposta vazia)');
    }

    // Progress every 50
    if (downloaded > 0 && downloaded % 50 === 0) {
      console.log(`   📊 Progresso: ${downloaded} baixados, ${failed} falhas`);
    }

    // Rate limiting delay
    await new Promise(resolve => setTimeout(resolve, DELAY_MS));
  }

  const remainingAfter = exercises.length - downloaded;

  console.log('');
  console.log('📊 Resultado desta execução:');
  console.log(`   ✅ Baixados: ${downloaded}`);
  console.log(`   ❌ Falhas: ${failed}`);
  console.log(`   📦 Total baixados: ${alreadyDownloaded + downloaded}`);
  console.log(`   � Restantes: ${remainingAfter}`);
  console.log('');

  if (remainingAfter > 0) {
    console.log('💡 Execute novamente o script para continuar o download.');
    console.log('   O script retoma automaticamente de onde parou.');
    console.log('');
    
    const estimatedMonths = Math.ceil(remainingAfter / 500);
    if (estimatedMonths > 1) {
      console.log(`⏰ Estimativa: ${estimatedMonths} execuções mensais para completar.`);
    }
  } else {
    console.log('🎉 Todos os GIFs foram baixados!');
  }

  console.log('');
  console.log(`📁 GIFs salvos em: ${GIFS_DIR}`);
}

downloadGifsInBatches()
  .catch((error) => {
    console.error('❌ Erro:', error.message);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
