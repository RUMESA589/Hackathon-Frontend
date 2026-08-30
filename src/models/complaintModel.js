export function normalizeComplaint(complaint) {
  if (!complaint) return null;
  return { ...complaint, id: complaint.id || complaint._id };
}

export function complaintIsActive(complaint) {
  return complaint?.status === "pending" || complaint?.status === "accepted";
}
