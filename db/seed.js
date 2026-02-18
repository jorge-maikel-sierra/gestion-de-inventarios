require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const { Pool } = require('pg');

const pool = new Pool({
  host:     process.env.DB_HOST,
  port:     process.env.DB_PORT,
  database: process.env.DB_NAME,
  user:     process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

async function seed() {
  const client = await pool.connect();
  try {
    console.log('🌱 Iniciando seed de MusicStore Pro...\n');

    await client.query('BEGIN');

    // --------------------------------------------------
    // Limpiar tablas (orden importante por FK)
    // --------------------------------------------------
    await client.query('DELETE FROM items');
    await client.query('DELETE FROM categories');
    await client.query('ALTER SEQUENCE items_id_seq RESTART WITH 1');
    await client.query('ALTER SEQUENCE categories_id_seq RESTART WITH 1');
    console.log('🗑️  Tablas limpiadas correctamente.');

    // --------------------------------------------------
    // Insertar categorías
    // --------------------------------------------------
    const categoriesData = [
      {
        name: 'Guitarras',
        description: 'Guitarras acústicas, eléctricas, clásicas y bajos para todos los niveles.',
      },
      {
        name: 'Teclados y Pianos',
        description: 'Pianos digitales, sintetizadores y teclados para estudio y escenario.',
      },
      {
        name: 'Batería y Percusión',
        description: 'Baterías acústicas, electrónicas, cajones y percusión latina.',
      },
      {
        name: 'Vientos',
        description: 'Saxofones, trompetas, flautas, clarinetes y otros instrumentos de viento.',
      },
      {
        name: 'Cuerdas',
        description: 'Violines, violas, cellos, contrabajos y accesorios para instrumentos de arco.',
      },
      {
        name: 'Accesorios',
        description: 'Cables, correas, afinadores, picas, cuerdas de repuesto y más.',
      },
    ];

    const categoryIds = {};
    for (const cat of categoriesData) {
      const result = await client.query(
        'INSERT INTO categories (name, description) VALUES ($1, $2) RETURNING id',
        [cat.name, cat.description]
      );
      categoryIds[cat.name] = result.rows[0].id;
      console.log(`  ✅ Categoría creada: ${cat.name} (id: ${categoryIds[cat.name]})`);
    }

    // --------------------------------------------------
    // Insertar items
    // --------------------------------------------------
    const itemsData = [
      // Guitarras
      {
        name: 'Fender Stratocaster Player Series',
        description: 'Guitarra eléctrica con cuerpo de aliso, mástil de maple y 3 pastillas Single-Coil. Ideal para blues, rock y pop.',
        price: 849.99,
        quantity: 12,
        category: 'Guitarras',
      },
      {
        name: 'Gibson Les Paul Standard 50s',
        description: 'Guitarra eléctrica de caoba con tapa de arce. Pastillas humbucker Burstbucker. Sonido clásico del rock.',
        price: 2499.00,
        quantity: 5,
        category: 'Guitarras',
      },
      {
        name: 'Yamaha FG800 Acústica',
        description: 'Guitarra acústica con tapa de abeto sólido y laterales de nato. Perfecta para principiantes y músicos intermedios.',
        price: 199.99,
        quantity: 25,
        category: 'Guitarras',
      },
      {
        name: 'Ibanez SR300E Bajo Eléctrico',
        description: 'Bajo eléctrico de 4 cuerdas con cuerpo de sapele, mástil de jatoba y pastillas PowerSpan Dual.',
        price: 349.99,
        quantity: 8,
        category: 'Guitarras',
      },
      {
        name: 'Taylor 214ce Acústica-Eléctrica',
        description: 'Guitarra acústico-eléctrica con tapa de abeto de Sitka y sistema ES2 para amplificación natural.',
        price: 1199.00,
        quantity: 4,
        category: 'Guitarras',
      },

      // Teclados y Pianos
      {
        name: 'Roland FP-30X Piano Digital',
        description: 'Piano digital con 88 teclas pesadas con escapamiento, sonido SuperNATURAL y Bluetooth integrado.',
        price: 749.00,
        quantity: 10,
        category: 'Teclados y Pianos',
      },
      {
        name: 'Yamaha PSR-E373 Teclado',
        description: 'Teclado de 61 teclas sensitivas con 622 voces, 205 estilos de acompañamiento y puerto USB.',
        price: 179.99,
        quantity: 18,
        category: 'Teclados y Pianos',
      },
      {
        name: 'Korg Minilogue XD Sintetizador',
        description: 'Sintetizador analógico de 4 voces con motor digital multi-engine. 200 programas de fábrica.',
        price: 649.00,
        quantity: 6,
        category: 'Teclados y Pianos',
      },
      {
        name: 'Casio PX-S3100 Piano Digital',
        description: 'Piano digital delgado con 88 teclas de acción martillo, 700 timbres y retroiluminación LED.',
        price: 599.00,
        quantity: 7,
        category: 'Teclados y Pianos',
      },

      // Batería y Percusión
      {
        name: 'Pearl Export EXX 5 piezas',
        description: 'Batería acústica completa con 5 piezas, platos incluidos. Ideal para estudiantes y músicos intermedios.',
        price: 699.00,
        quantity: 3,
        category: 'Batería y Percusión',
      },
      {
        name: 'Roland TD-17KVX Batería Electrónica',
        description: 'Batería electrónica V-Drums con cabezal de bombo de doble zona y módulo TD-17 con Bluetooth.',
        price: 1799.00,
        quantity: 4,
        category: 'Batería y Percusión',
      },
      {
        name: 'Cajón Flamenco LP LP1428NY',
        description: 'Cajón flamenco de madera de abedul con cuerdas internas ajustables para snare. Sonido preciso y potente.',
        price: 149.99,
        quantity: 15,
        category: 'Batería y Percusión',
      },
      {
        name: 'Congas LP LP809X 11/12 pulgadas',
        description: 'Par de congas de madera de caoba con aros de aluminio fundido y parches de cuero natural.',
        price: 449.00,
        quantity: 5,
        category: 'Batería y Percusión',
      },

      // Vientos
      {
        name: 'Yamaha YAS-280 Saxofón Alto',
        description: 'Saxofón alto estudiante con llaves niqueladas, acabado lacado y estuche rígido incluido.',
        price: 899.00,
        quantity: 6,
        category: 'Vientos',
      },
      {
        name: 'Bach TR300H2 Trompeta',
        description: 'Trompeta en Si bemol para estudiantes, campana de latón de 123mm y válvulas de movimiento rápido.',
        price: 499.00,
        quantity: 9,
        category: 'Vientos',
      },
      {
        name: 'Buffet Crampon E11 Clarinete',
        description: 'Clarinete de madera de granadilla con anillos plateados. El favorito de estudiantes avanzados.',
        price: 779.00,
        quantity: 4,
        category: 'Vientos',
      },
      {
        name: 'Yamaha YFL-222 Flauta Traversa',
        description: 'Flauta traversa para principiantes con cuerpo de alpaca plateada y llaves cerradas.',
        price: 349.00,
        quantity: 11,
        category: 'Vientos',
      },

      // Cuerdas
      {
        name: 'Stentor Student II Violín 4/4',
        description: 'Violín de talla completa con tapa de abeto, laterales de maple y arco de fibra de carbono incluido.',
        price: 249.00,
        quantity: 14,
        category: 'Cuerdas',
      },
      {
        name: 'Cecilio CECO-1E Cello 4/4',
        description: 'Cello de talla completa con tapa de abeto sólido, mástil de ébano y arco Brasil incluido.',
        price: 499.00,
        quantity: 5,
        category: 'Cuerdas',
      },
      {
        name: 'Scott Cao STV-017 Viola 15 pulgadas',
        description: 'Viola de talla 15" ideal para estudiantes con cuerpo de tilo y tapa de abeto.',
        price: 329.00,
        quantity: 7,
        category: 'Cuerdas',
      },

      // Accesorios
      {
        name: 'D\'Addario EXL110 Cuerdas Guitarra',
        description: 'Set de cuerdas para guitarra eléctrica calibre .010-.046, aleación de níquel. Pack de 3.',
        price: 18.99,
        quantity: 150,
        category: 'Accesorios',
      },
      {
        name: 'Boss TU-3 Afinador Cromático',
        description: 'Afinador de pedal para guitarra y bajo con pantalla de alta resolución y salida bypass.',
        price: 99.00,
        quantity: 30,
        category: 'Accesorios',
      },
      {
        name: 'Ernie Ball P04037 Correa',
        description: 'Correa de polipropileno para guitarra o bajo, 1.5" de ancho, ajustable de 40" a 72".',
        price: 12.99,
        quantity: 80,
        category: 'Accesorios',
      },
      {
        name: 'Mogami Gold INST-06 Cable',
        description: 'Cable de instrumento de 6 pies con conectores gold-plated de baja capacitancia. Ideal para estudio.',
        price: 39.99,
        quantity: 50,
        category: 'Accesorios',
      },
      {
        name: 'On-Stage GS7140 Soporte Guitarra',
        description: 'Soporte de guitarra con diseño A-frame, acolchado protector y base antideslizante. Plegable.',
        price: 24.99,
        quantity: 40,
        category: 'Accesorios',
      },
    ];

    let itemCount = 0;
    for (const item of itemsData) {
      const catId = categoryIds[item.category];
      await client.query(
        `INSERT INTO items (name, description, price, quantity, category_id)
         VALUES ($1, $2, $3, $4, $5)`,
        [item.name, item.description, item.price, item.quantity, catId]
      );
      itemCount++;
    }
    console.log(`\n  ✅ ${itemCount} items insertados correctamente.`);

    await client.query('COMMIT');
    console.log('\n🎸 ¡Seed completado exitosamente!');
    console.log(`   📦 ${categoriesData.length} categorías`);
    console.log(`   🎵 ${itemCount} productos\n`);
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('❌ Error en seed:', err.message);
    throw err;
  } finally {
    client.release();
    await pool.end();
  }
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
