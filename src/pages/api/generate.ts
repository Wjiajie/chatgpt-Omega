import type { APIRoute } from 'astro'
import { createParser, ParsedEvent, ReconnectInterval } from 'eventsource-parser'
// const apiKey = import.meta.env.OPENAI_API_KEY
const apiKey = process.env.OPENAI_API_KEY

export const post: APIRoute = async (context) => {
  const body = await context.request.json()
  const messages = body.messages
  const encoder = new TextEncoder()
  const decoder = new TextDecoder()

  if (!messages) {
    return new Response('No input text')
  }

  const completion = await fetch('https://api.openai.com/v1/chat/completions', {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    method: 'POST',
    body: JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages,
      temperature: 0.6,
      stream: true,
    }),
  })

  const stream = new ReadableStream({
    async start(controller) {
      const streamParser = (event: ParsedEvent | ReconnectInterval) => {
        if (event.type === 'event') {
          const data = event.data
          if (data === '[DONE]') {
            controller.close()
            return
          }
          try {
            const json = JSON.parse(data)
            const text = json.choices[0].delta?.content            
            const queue = encoder.encode(text)
            controller.enqueue(queue)
          } catch (e) {
            controller.error(e)
          }
        }
      }

      const parser = createParser(streamParser)
      for await (const chunk of completion.body as any) {
        parser.feed(decoder.decode(chunk))
      }
    },
  })

  return new Response(stream)
}
