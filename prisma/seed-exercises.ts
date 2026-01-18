import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import 'dotenv/config';

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL as string,
});
const prisma = new PrismaClient({ adapter });

// =========================================================
// CONFIGURAÇÃO
// =========================================================
// Obtenha sua API Key gratuita em: https://rapidapi.com/justin-WFnsXH_t6/api/exercisedb
// O plano gratuito oferece 500,000 requests/mês

const RAPIDAPI_KEY = process.env.EXERCISEDB_API_KEY || 'SUA_API_KEY_AQUI';
const RAPIDAPI_HOST = 'exercisedb.p.rapidapi.com';
const BASE_URL = 'https://exercisedb.p.rapidapi.com';

// =========================================================
// MAPEAMENTOS PARA PORTUGUÊS (Músculos e Equipamentos)
// =========================================================

const muscleGroupMap: Record<string, string> = {
  abs: 'Abdômen',
  abductors: 'Abdutores',
  adductors: 'Adutores',
  biceps: 'Bíceps',
  calves: 'Panturrilhas',
  cardiovascular_system: 'Sistema Cardiovascular',
  delts: 'Deltoides',
  forearms: 'Antebraços',
  glutes: 'Glúteos',
  hamstrings: 'Posterior de Coxa',
  lats: 'Dorsais',
  levator_scapulae: 'Elevador da Escápula',
  pectorals: 'Peitorais',
  quads: 'Quadríceps',
  serratus_anterior: 'Serrátil Anterior',
  spine: 'Coluna',
  traps: 'Trapézio',
  triceps: 'Tríceps',
  upper_back: 'Costas Superiores',
};

const equipmentMap: Record<string, string> = {
  assisted: 'Assistido',
  band: 'Elástico',
  barbell: 'Barra',
  'body weight': 'Peso Corporal',
  bosu_ball: 'Bosu',
  cable: 'Cabo',
  dumbbell: 'Halteres',
  elliptical_machine: 'Elíptico',
  ez_barbell: 'Barra EZ',
  hammer: 'Hammer',
  kettlebell: 'Kettlebell',
  leverage_machine: 'Máquina Articulada',
  medicine_ball: 'Medicine Ball',
  olympic_barbell: 'Barra Olímpica',
  resistance_band: 'Elástico de Resistência',
  roller: 'Rolo',
  rope: 'Corda',
  skierg_machine: 'SkiErg',
  sled_machine: 'Sled',
  smith_machine: 'Smith Machine',
  stability_ball: 'Bola de Estabilidade',
  stationary_bike: 'Bicicleta Ergométrica',
  stepmill_machine: 'Escada',
  tire: 'Pneu',
  trap_bar: 'Trap Bar',
  upper_body_ergometer: 'Ergômetro de Braço',
  weighted: 'Com Peso',
  wheel_roller: 'Roda de Abdômen',
};

// Mapeamento de nomes comuns de exercícios (principais)
const exerciseNameTranslations: Record<string, string> = {
  '3/4 sit-up': 'Abdominal 3/4',
  'air bike': 'Bicicleta no Ar',
  'ankle circles': 'Círculos com Tornozelo',
  'arm circles': 'Círculos com Braços',
  'arnold press': 'Arnold Press',
  'assisted hanging knee raise': 'Elevação de Joelhos Pendurado Assistido',
  'back extension': 'Extensão Lombar',
  'band assisted pull-up': 'Barra Fixa Assistida com Elástico',
  'barbell bench press': 'Supino Reto com Barra',
  'barbell curl': 'Rosca Direta com Barra',
  'barbell deadlift': 'Levantamento Terra',
  'barbell front squat': 'Agachamento Frontal',
  'barbell hip thrust': 'Hip Thrust com Barra',
  'barbell row': 'Remada com Barra',
  'barbell squat': 'Agachamento com Barra',
  'barbell lunge': 'Avanço com Barra',
  'battle rope': 'Corda Naval',
  'bench dip': 'Tríceps no Banco',
  'bent over row': 'Remada Curvada',
  'bicycle crunch': 'Abdominal Bicicleta',
  'box jump': 'Salto na Caixa',
  'burpee': 'Burpee',
  'cable crossover': 'Crucifixo no Cabo',
  'cable crunch': 'Abdominal no Cabo',
  'cable fly': 'Voador no Cabo',
  'cable lateral raise': 'Elevação Lateral no Cabo',
  'cable row': 'Remada no Cabo',
  'calf raise': 'Elevação de Panturrilhas',
  'chest dip': 'Paralelas para Peito',
  'chin-up': 'Barra Fixa Supinada',
  'close grip bench press': 'Supino Fechado',
  'crunch': 'Abdominal',
  'deadlift': 'Levantamento Terra',
  'decline bench press': 'Supino Declinado',
  'decline crunch': 'Abdominal Declinado',
  'dip': 'Paralelas',
  'donkey kick': 'Coice',
  'dumbbell bench press': 'Supino com Halteres',
  'dumbbell curl': 'Rosca com Halteres',
  'dumbbell fly': 'Crucifixo com Halteres',
  'dumbbell lateral raise': 'Elevação Lateral com Halteres',
  'dumbbell lunge': 'Avanço com Halteres',
  'dumbbell press': 'Desenvolvimento com Halteres',
  'dumbbell row': 'Remada com Halteres',
  'dumbbell shoulder press': 'Desenvolvimento com Halteres',
  'dumbbell squat': 'Agachamento com Halteres',
  'face pull': 'Face Pull',
  'flat bench press': 'Supino Reto',
  'floor press': 'Supino no Chão',
  'front raise': 'Elevação Frontal',
  'glute bridge': 'Ponte Glútea',
  'goblet squat': 'Agachamento Goblet',
  'good morning': 'Good Morning',
  'hack squat': 'Hack Squat',
  'hammer curl': 'Rosca Martelo',
  'hanging knee raise': 'Elevação de Joelhos Pendurado',
  'hanging leg raise': 'Elevação de Pernas Pendurado',
  'high knees': 'Elevação de Joelhos',
  'hip thrust': 'Hip Thrust',
  'incline bench press': 'Supino Inclinado',
  'incline dumbbell press': 'Supino Inclinado com Halteres',
  'jumping jack': 'Polichinelo',
  'kettlebell swing': 'Swing com Kettlebell',
  'kneeling pushup': 'Flexão Ajoelhada',
  'lat pulldown': 'Puxada Frontal',
  'lateral raise': 'Elevação Lateral',
  'leg curl': 'Mesa Flexora',
  'leg extension': 'Cadeira Extensora',
  'leg press': 'Leg Press',
  'leg raise': 'Elevação de Pernas',
  'lunge': 'Avanço',
  'lying leg curl': 'Mesa Flexora Deitado',
  'military press': 'Desenvolvimento Militar',
  'mountain climber': 'Escalador',
  'overhead press': 'Desenvolvimento',
  'pec deck fly': 'Voador na Máquina',
  'plank': 'Prancha',
  'preacher curl': 'Rosca Scott',
  'pull-up': 'Barra Fixa',
  'push-up': 'Flexão de Braços',
  'push up': 'Flexão de Braços',
  'pushup': 'Flexão de Braços',
  'rear delt fly': 'Voador Invertido',
  'reverse crunch': 'Abdominal Reverso',
  'reverse fly': 'Voador Invertido',
  'romanian deadlift': 'Levantamento Terra Romeno',
  'rope pushdown': 'Tríceps na Corda',
  'russian twist': 'Torção Russa',
  'seated cable row': 'Remada Sentada no Cabo',
  'seated row': 'Remada Sentada',
  'shoulder press': 'Desenvolvimento',
  'shrug': 'Encolhimento de Ombros',
  'side plank': 'Prancha Lateral',
  'single leg squat': 'Agachamento Unilateral',
  'sit-up': 'Abdominal Completo',
  'skull crusher': 'Tríceps Testa',
  'squat': 'Agachamento',
  'standing calf raise': 'Panturrilha em Pé',
  'step up': 'Subida no Step',
  'stiff leg deadlift': 'Stiff',
  'sumo deadlift': 'Levantamento Terra Sumo',
  'sumo squat': 'Agachamento Sumô',
  't-bar row': 'Remada Cavalinho',
  'tricep dip': 'Tríceps nas Paralelas',
  'tricep extension': 'Extensão de Tríceps',
  'tricep pushdown': 'Tríceps no Pulley',
  'upright row': 'Remada Alta',
  'walking lunge': 'Avanço Caminhando',
  'wall sit': 'Agachamento na Parede',
  'wide grip pulldown': 'Puxada Aberta',
};

interface ExerciseDBExercise {
  bodyPart: string;
  equipment: string;
  gifUrl: string;
  id: string;
  name: string;
  target: string;
  secondaryMuscles: string[];
  instructions: string[];
}

async function translateExerciseName(name: string): Promise<string> {
  // Check if we have a direct translation
  const lowerName = name.toLowerCase();
  if (exerciseNameTranslations[lowerName]) {
    return exerciseNameTranslations[lowerName];
  }

  // Check partial matches
  for (const [key, value] of Object.entries(exerciseNameTranslations)) {
    if (lowerName.includes(key) || key.includes(lowerName)) {
      return value;
    }
  }

  // Capitalize the original name if no translation found
  return name
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

async function fetchExercisesBatch(limit: number, offset: number): Promise<ExerciseDBExercise[]> {
  const response = await fetch(`${BASE_URL}/exercises?limit=${limit}&offset=${offset}`, {
    method: 'GET',
    headers: {
      'x-rapidapi-key': RAPIDAPI_KEY,
      'x-rapidapi-host': RAPIDAPI_HOST,
    },
  });

  if (!response.ok) {
    const text = await response.text();
    console.error('Resposta da API:', text);
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

async function fetchAllExercises(): Promise<ExerciseDBExercise[]> {
  console.log('📡 Conectando à ExerciseDB API...');
  console.log(`🔑 API Host: ${RAPIDAPI_HOST}`);
  console.log('');
  
  const allExercises: ExerciseDBExercise[] = [];
  const batchSize = 10;
  let offset = 0;
  let hasMore = true;
  
  console.log('🔄 Buscando exercícios em lotes de 10...');
  
  while (hasMore) {
    const batch = await fetchExercisesBatch(batchSize, offset);
    
    if (batch.length === 0) {
      hasMore = false;
    } else {
      allExercises.push(...batch);
      console.log(`   ✅ Offset ${offset}: ${batch.length} exercícios (total: ${allExercises.length})`);
      offset += batchSize;
      
      // Small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }
  
  console.log('');
  console.log(`� Total de exercícios encontrados: ${allExercises.length}`);
  
  return allExercises;
}

async function seedExercises() {
  if (RAPIDAPI_KEY === 'SUA_API_KEY_AQUI') {
    console.log('');
    console.log('⚠️  ATENÇÃO: Você precisa configurar sua API Key!');
    console.log('');
    console.log('1. Acesse: https://rapidapi.com/justin-WFnsXH_t6/api/exercisedb');
    console.log('2. Clique em "Subscribe" (plano gratuito)');
    console.log('3. Copie sua API Key');
    console.log('4. Adicione ao arquivo .env:');
    console.log('   EXERCISEDB_API_KEY=sua_key_aqui');
    console.log('');
    console.log('5. Execute novamente: npx ts-node prisma/seed-exercises.ts');
    console.log('');
    return;
  }

  const exercises = await fetchAllExercises();
  
  const existingCount = await prisma.exercise.count();
  console.log(`📊 Exercícios já no banco: ${existingCount}`);
  console.log('');
  console.log('🔄 Importando exercícios...');

  let created = 0;
  let skipped = 0;

  for (const exercise of exercises) {
    // Skip if already exists
    const existing = await prisma.exercise.findUnique({
      where: { externalId: exercise.id },
    });

    if (existing) {
      skipped++;
      continue;
    }

    // Translate name
    const translatedName = await translateExerciseName(exercise.name);
    
    // Translate muscles and equipment
    const muscleGroup = muscleGroupMap[exercise.target] || exercise.target;
    const equipment = equipmentMap[exercise.equipment] || exercise.equipment;
    const secondaryMuscles = exercise.secondaryMuscles
      .map(m => muscleGroupMap[m] || m)
      .join(', ');

    // Join instructions into a single text
    const instructions = exercise.instructions.join('\n\n');

    // Construct GIF URL using the /image endpoint pattern
    const gifUrl = `https://exercisedb.p.rapidapi.com/image?resolution=180&exerciseId=${exercise.id}`;

    await prisma.exercise.create({
      data: {
        externalId: exercise.id,
        name: translatedName,
        description: `Exercício para ${muscleGroup}`,
        instructions,
        gifUrl,
        muscleGroup,
        secondaryMuscles: secondaryMuscles || null,
        equipment,
      },
    });

    created++;

    if (created % 100 === 0) {
      console.log(`   ✅ ${created} exercícios importados...`);
    }
  }

  console.log('');
  console.log('🎉 Importação concluída!');
  console.log(`   ✅ Criados: ${created}`);
  console.log(`   ⏭️  Ignorados (já existiam): ${skipped}`);
  console.log(`   📊 Total no banco: ${existingCount + created}`);
}

seedExercises()
  .catch((error) => {
    console.error('❌ Erro:', error.message);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
