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
  Submitted: 'bg-[#e7e07e] text-black',
  Interviewing: 'bg-[#e1f3e4] text-black',
  Offer: 'bg-[#10a689] text-white',
  Rejected: 'bg-[#cd644f] text-white',
  'Phone Screen': 'bg-[#fac712] text-black',
  'Code Challenge': 'bg-blue-200 text-black',
  'Not Yet Applied': 'bg-[#e6e6e6] text-black',
};