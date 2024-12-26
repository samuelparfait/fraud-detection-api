import { Hono } from 'hono';

import { connectDB } from '@/src/connector/db';
import { insertEvent } from '@/src/lib/insertEvent';
import { generateReports } from '@/src/lib/generateReports';
import { generateBulkEvents } from '@/src/lib/generateBulkEvents';

const app = new Hono();
const port = process.env.PORT || 3001;

await connectDB('fraud_detection');

app.post('/api/events', async (c) => {
  try {
    const event = await c.req.json();
    await insertEvent(event);

    return c.json({ message: 'Event inserted successfully!' }, 201);
  } catch (error) {
    return c.json({ error: 'Failed to insert event' }, 500);
  }
});

app.post('/api/events/bulk', async (c) => {
  const numOfUsers = parseInt(c.req.query('numOfUsers') || '5', 10);
  const numOfEventsPerUser = parseInt(
    c.req.query('numOfEventsPerUser') || '10',
    10
  );
  const startYear = parseInt(c.req.query('startYear') || '2014', 10);
  const endYear = parseInt(c.req.query('endYear') || '2024', 10);

  try {
    await generateBulkEvents(
      numOfUsers,
      numOfEventsPerUser,
      startYear,
      endYear
    );

    return c.json({ message: 'Bulk events generated successfully!' });
  } catch (error) {
    return c.json(
      {
        error: 'Error generating bulk events',
        details: error instanceof Error && error.message,
      },
      500
    );
  }
});

app.get('/api/reports/:userKey/:endDate', async (c) => {
  const userKey = c.req.param('userKey');
  const endDateString = c.req.param('endDate');

  const endDate = new Date(endDateString.split('\n')[0]);

  if (isNaN(endDate.getTime())) {
    return c.json({ error: 'Invalid date format' }, 400);
  }

  try {
    const reports = await generateReports(userKey, endDate);

    return c.json(reports, 200);
  } catch (error) {
    return c.json({ error: 'Failed to generate reports' }, 500);
  }
});

export default {
  port,
  fetch: app.fetch,
};
