import readline from 'node:readline';
import { openDb, initializeDb } from './db.js';
import { summarizeArticle } from './gpt.js';
import fs from 'node:fs';

async function main() {
    const db = await initializeDb();

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    rl.question('아티클 URL을 입력하세요: ', async (url) => {
        const { summary, tags } = await summarizeArticle(url);
        
        const insert = db.prepare('INSERT INTO articles (url, summary, tags) VALUES (?, ?, ?)');
        insert.run(url, summary, JSON.stringify(tags));
        
        const query = db.prepare('SELECT * FROM articles');
        console.log(query.all());

        await db.close();

        rl.close();
    });
}
main();
