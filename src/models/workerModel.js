export function normalizeWorker(worker) {
  if (!worker) return null;
  return { ...worker, id: worker.id || worker._id, categories: worker.categories || [] };
}
