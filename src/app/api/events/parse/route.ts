import { NextRequest } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { text, organizerId } = await request.json();

    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `You are an AI assistant that parses event information from unstructured text. 
          Extract event details and return them as a JSON object with an "events" array. 
          
          For each event, include these fields:
          - title (required) - the event name
          - description - detailed description of the event
          - start_date (YYYY-MM-DD format, required)
          - start_time (HH:MM format, 24-hour time)
          - end_date (YYYY-MM-DD format) - only if different from start_date
          - end_time (HH:MM format, 24-hour time)
          - venue_name - name of the venue
          - venue_address - street address
          - city - city name
          - state - state/province
          - category - type of event (concert, workshop, conference, meetup, etc.)
          - price - ticket price as a number (omit if free)
          - capacity - maximum attendees as a number
          - confidence (0-1) - how confident you are in the parsing accuracy
          - issues (array of strings) - list any missing or unclear information
          
          Guidelines:
          - Be conservative with confidence scores (0.7+ only if very certain)
          - If time is missing, note in issues but don't guess
          - Extract multiple events if present in the text
          - If capacity/price aren't mentioned, omit them
          - Include venue details even if incomplete
          
          Return format: {"events": [event1, event2, ...]}
          `
        },
        {
          role: "user", 
          content: text
        }
      ],
      temperature: 0.1,
    });

    const content = response.choices[0]?.message?.content;
    if (!content) throw new Error('No response from AI');

    let parsedData;
    try {
      parsedData = JSON.parse(content);
    } catch (parseError) {
      console.error('Failed to parse AI response as JSON:', content);
      throw new Error('AI returned invalid JSON');
    }

    // Ensure we have the expected structure
    const events = parsedData.events || parsedData || [];
    
    // Validate each event has required fields
    const validatedEvents = events.filter((event: any) => {
      if (!event.title || !event.start_date) {
        console.warn('Skipping invalid event:', event);
        return false;
      }
      return true;
    });

    return Response.json({ 
      events: validatedEvents,
      usage: response.usage,
      originalCount: events.length,
      validCount: validatedEvents.length,
    });

  } catch (error) {
    console.error('Event parsing error:', error);
    return Response.json(
      { 
        error: 'Failed to parse events', 
        details: error instanceof Error ? error.message : 'Unknown error'
      }, 
      { status: 500 }
    );
  }
}