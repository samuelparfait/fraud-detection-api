import { getDB } from '@/src/connector/db';

export async function generateReports(userKey: string, endDate: Date) {
  const db = getDB();
  const eventsCollection = db.collection('events');

  const periods = [
    {
      id: 'oneYear',
      start: new Date(endDate).setFullYear(endDate.getFullYear() - 1),
    },
    {
      id: 'threeYears',
      start: new Date(endDate).setFullYear(endDate.getFullYear() - 3),
    },
    {
      id: 'fiveYears',
      start: new Date(endDate).setFullYear(endDate.getFullYear() - 5),
    },
    {
      id: 'sevenYears',
      start: new Date(endDate).setFullYear(endDate.getFullYear() - 7),
    },
    {
      id: 'tenYears',
      start: new Date(endDate).setFullYear(endDate.getFullYear() - 10),
    },
  ];

  const reports = [];

  for (const period of periods) {
    const { id, start } = period;

    const report = await eventsCollection
      .aggregate([
        {
          $match: {
            key: userKey,
            date: { $gte: new Date(start), $lt: new Date(endDate) },
          },
        },
        {
          $group: {
            _id: '$key',
            approved: {
              $sum: {
                $cond: [{ $eq: ['$status', 'approved'] }, 1, 0],
              },
            },
            declined: {
              $sum: {
                $cond: [{ $eq: ['$status', 'declined'] }, 1, 0],
              },
            },
            pending: {
              $sum: {
                $cond: [{ $eq: ['$status', 'pending'] }, 1, 0],
              },
            },
            rejected: {
              $sum: {
                $cond: [{ $eq: ['$status', 'rejected'] }, 1, 0],
              },
            },
          },
        },
        {
          $project: {
            _id: 0,
            totals: {
              approved: { $ifNull: ['$approved', 0] },
              declined: { $ifNull: ['$declined', 0] },
              pending: { $ifNull: ['$pending', 0] },
              rejected: { $ifNull: ['$rejected', 0] },
            },
          },
        },
      ])
      .toArray();

    if (report.length > 0) {
      reports.push({
        id,
        end: new Date(endDate),
        start: new Date(start),
        totals: report[0].totals,
      });
    } else {
      console.log(`No data found for userKey: ${userKey} in period ${id}`);
    }
  }

  return reports;
}
