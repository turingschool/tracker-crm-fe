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
  Submitted: 'bg-yellow-200 text-black',
  Interviewing: 'bg-green-100 text-black',
  Offer: 'bg-teal-600 text-white',
  Rejected: 'bg-red-500 text-white',
  'Phone Screen': 'bg-yellow-300 text-black',
  'Code Challenge': 'bg-blue-200 text-black',
  'Not Yet Applied': 'bg-gray-200 text-black',
};