const fileDB = require('./file');
const recordUtils = require('./record');
const vaultEvents = require('../events');

async function addRecord({ name, value }) {
  recordUtils.validateRecord({ name, value });
  const data = await fileDB.readDB();
  const newRecord = { id: recordUtils.generateId(), name, value };
  data.push(newRecord);
  await fileDB.writeDB(data);
  vaultEvents.emit('recordAdded', newRecord);
  return newRecord;
}

async function listRecords() {
  return await fileDB.readDB();
}

async function updateRecord(id, newName, newValue) {
  const data = await fileDB.readDB();
  const record = data.find(r => r.id === id);
  if (!record) return null;
  record.name = newName;
  record.value = newValue;
  await fileDB.writeDB(data);
  vaultEvents.emit('recordUpdated', record);
  return record;
}

async function deleteRecord(id) {
  let data = await fileDB.readDB();
  const record = data.find(r => r.id === id);
  if (!record) return null;
  data = data.filter(r => r.id !== id);
  await fileDB.writeDB(data);
  vaultEvents.emit('recordDeleted', record);
  return record;
}

module.exports = { addRecord, listRecords, updateRecord, deleteRecord };

