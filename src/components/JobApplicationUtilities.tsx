export const statusMap: { [key: number]: string } = {
  1: 'Submitted',
  2: 'Interviewing',
  3: 'Offer',
  4: 'Rejected',
  5: 'Phone Screen',
  6: 'Code Challenge',
  7: 'Not Yet Applied',
};

export const statusStyles: { [key: string]: string } = {
  Submitted: 'bg-yellow-200 text-yellow-800',
  Interviewing: 'bg-green-200 text-green-800',
  Offer: 'bg-teal-300 text-teal-900',
  Rejected: 'bg-red-200 text-red-800',
  'Phone Screen': 'bg-yellow-300 text-yellow-900',
  'Code Challenge': 'bg-blue-200 text-blue-800',
  'Not Yet Applied': 'bg-orange-200 text-orange-800',
};