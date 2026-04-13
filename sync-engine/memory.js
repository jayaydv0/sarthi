/** @type {Record<string, { file_name: string, change_type: string, timestamp: string }[]>} */
const store = {};

export function addChange(projectId, change) {
  if (!store[projectId]) {
    store[projectId] = [];
  }
  store[projectId].push(change);
}

export function getChanges(projectId) {
  return store[projectId] ? [...store[projectId]] : [];
}

export function clearChanges(projectId) {
  delete store[projectId];
}
