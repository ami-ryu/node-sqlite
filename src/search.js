import readline from 'readline';
import { openDb } from './db.js';

async function searchByTag() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  rl.question('검색할 태그를 입력하세요: ', async (tag) => {
    const db = await openDb();

    const query = db.prepare(`
      SELECT id, url, summary, json_extract(tags, '$') as parsed_tags
      FROM articles
      WHERE EXISTS (
          SELECT 1
          FROM json_each(tags)
          WHERE json_each.value LIKE '%' || ? || '%'
      );
    `);
    const articles = await query.all(tag);
    console.log(articles);

    if (articles.length ===  0) {
      console.log('해당 태그와 관련된 아티클이 없습니다.');
    }

    await db.close();
    rl.close();
  });
}

searchByTag();
