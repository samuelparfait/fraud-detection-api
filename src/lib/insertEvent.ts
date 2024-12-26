import { getDB } from '@/src/connector/db';

export async function insertEvent(event: any) {
  const db = getDB();
  const eventsCollection = db.collection('events');

  const filter = { key: event.key, date: event.date };
  const update = {
    $set: event,
  };
  const options = { upsert: true };

  try {
    const result = await eventsCollection.updateOne(filter, update, options);
    return result;
  } catch (error) {
    console.error('Error inserting/updating event:', error);
    throw error;
  }
}
