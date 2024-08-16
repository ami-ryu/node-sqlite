const API_KEY = env('OPENAI_API_KEY');

import OpenAI from "openai";
const openai = new OpenAI({apiKey: API_KEY});


async function summarizeArticle(content) {
    // const promptPath = path.join(process.cwd(), 'prompt.txt');
    // const prompt = fs.readFileSync(promptPath, 'utf-8');

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
          { role: "system", content: "You are a helpful assistant." },
          {
              role: "user",
              content: `You are an AI assistant specialized in summarizing articles. This URL ${content} is a technical article.
              read this ${content} article and perform the following tasks in markdown format:
Summary: Summarize the key points of the article in 10 to 15 sentences.
Translation: If the article is in Korean, translate the summary into English. If the article is in English, translate the summary into Korean.
Keywords: Extract 5 key technical keywords from the article and list them separated by commas.
The output should be formatted as follows:
# Summary
- [Insert the 10-15 sentence summary here.]

# Translation
- [Insert the translated summary here.]

# Keywords
- [Insert the 5 key technical keywords here, separated by commas.]
`,
          },
      ],
   });

    const summary = response.choices[0].message.content;
    console.log('summary', summary);

    const tagsResponse = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
          { role: "system", content: "You are a helpful assistant." },
          {
              role: "user",
              content: `${summary}\n\n$에서 주요 키워드를 5개 추출해서 콤마로 구분해줘`,
          },
      ],
   });

    const tags = tagsResponse.choices[0].message.content.split(',').map(tag => tag.trim());
    console.log('tags', tags);
    return { summary, tags };
}

export { summarizeArticle };
