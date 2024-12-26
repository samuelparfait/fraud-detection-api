import { connectDB } from '@/src/connector/db';
import { insertEvent } from '@/src/lib/insertEvent';
import {
  getRandomIndex,
  generateRandomDate,
  generateRandomKey,
} from '@/src/lib/utils';

const statuses = ['approved', 'declined', 'pending', 'rejected'];

const generateRandomStatus = () => getRandomIndex(statuses);

export async function generateBulkEvents(
  numOfUsers = 5,
  numOfEventsPerUser = 10,
  startYear = 2014,
  endYear = 2024
) {
  await connectDB('fraud_detection');

  const users = Array.from({ length: numOfUsers }, () => generateRandomKey());

  for (const userKey of users) {
    console.log(`Generating events for user: ${userKey}`);

    for (let year = startYear; year <= endYear; year++) {
      for (let i = 0; i < numOfEventsPerUser; i++) {
        const status = generateRandomStatus();
        const event = {
          key: userKey,
          date: generateRandomDate(year),
          status,
        };

        try {
          await insertEvent(event);

          console.log(
            `Inserted event for user ${userKey} on ${event.date.toISOString()}`
          );
        } catch (error) {
          console.error(
            `Failed to insert event for user ${userKey} on ${event.date}`
          );
        }
      }
    }
  }

  console.log('Event generation completed.');
}
