const readline = require('readline');
const db = require('./db');
require('./events/logger'); // Initialize event logger
const fs = require('fs');
const path = require('path');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function menu() {
  console.log(`
===== NodeVault =====
1. Add Record
2. List Records
3. Update Record
4. Delete Record
5. Search Records
6. Sort Records
7. Export Data
8. View Vault Statistics
9. Exit
=====================
  `);

  rl.question('Choose option: ', ans => {
    switch (ans.trim()) {
      // ADD RECORD
      case '1':
        (async () => {
          rl.question('Enter name: ', async name => {
            rl.question('Enter value: ', async value => {
              const record = await db.addRecord({ name, value });
              console.log('✅ Record added successfully!', record);
              menu();
            });
          });
        })();
        break;

      // LIST RECORDS
      case '2':
        (async () => {
          const records = await db.listRecords();
          if (records.length === 0) console.log('No records found.');
          else records.forEach(r => console.log(`ID: ${r.id} | Name: ${r.name} | Value: ${r.value}`));
          menu();
        })();
        break;

      // UPDATE RECORD
      case '3':
        (async () => {
          rl.question('Enter record ID to update: ', async id => {
            rl.question('New name: ', async name => {
              rl.question('New value: ', async value => {
                const updated = await db.updateRecord(Number(id), name, value);
                console.log(updated ? '✅ Record updated!' : '❌ Record not found.');
                menu();
              });
            });
          });
        })();
        break;

      // DELETE RECORD
      case '4':
        (async () => {
          rl.question('Enter record ID to delete: ', async id => {
            const deleted = await db.deleteRecord(Number(id));
            console.log(deleted ? '🗑️ Record deleted!' : '❌ Record not found.');
            menu();
          });
        })();
        break;

      // SEARCH RECORDS
      case '5':
        (async () => {
          rl.question('Enter search keyword: ', async keyword => {
            const records = await db.listRecords();
            const results = records.filter(r =>
              r.name.toLowerCase().includes(keyword.toLowerCase()) ||
              r.id.toString() === keyword
            );
            if (results.length === 0) console.log('No records found.');
            else results.forEach(r => console.log(`ID: ${r.id} | Name: ${r.name} | Value: ${r.value}`));
            menu();
          });
        })();
        break;

      // SORT RECORDS
      case '6':
        (async () => {
          rl.question('Sort by (name/date): ', async field => {
            rl.question('Order (asc/desc): ', async order => {
              const records = await db.listRecords();
              const sorted = [...records].sort((a, b) => {
                if (field.toLowerCase() === 'name') {
                  return order.toLowerCase() === 'asc'
                    ? a.name.localeCompare(b.name)
                    : b.name.localeCompare(a.name);
                } else {
                  return order.toLowerCase() === 'asc'
                    ? a.id - b.id
                    : b.id - a.id;
                }
              });
              sorted.forEach(r => console.log(`ID: ${r.id} | Name: ${r.name} | Value: ${r.value}`));
              menu();
            });
          });
        })();
        break;

      // EXPORT DATA
      case '7':
        (async () => {
          const records = await db.listRecords();
          const header = `Exported on: ${new Date().toISOString()}\nTotal Records: ${records.length}\nFile: export.txt\n\n`;
          const content = records.map(r => `ID: ${r.id} | Name: ${r.name} | Value: ${r.value}`).join('\n');
          fs.writeFileSync(path.join(__dirname, 'export.txt'), header + content);
          console.log('📄 Data exported successfully to export.txt');
          menu();
        })();
        break;

      // VIEW VAULT STATISTICS
      case '8':
        (async () => {
          const records = await db.listRecords();
          if (records.length === 0) {
            console.log('No records to show statistics.');
            menu();
            return;
          }

          const total = records.length;
          const lastModified = new Date(Math.max(...records.map(r => new Date(r.created || Date.now())))).toISOString();
          const longestName = records.reduce((a, b) => (b.name.length > a.name.length ? b : a));
          const earliest = new Date(Math.min(...records.map(r => new Date(r.created || Date.now())))).toISOString();
          const latest = new Date(Math.max(...records.map(r => new Date(r.created || Date.now())))).toISOString();

          console.log(`Vault Statistics:
--------------------------
Total Records: ${total}
Last Modified: ${lastModified}
Longest Name: ${longestName.name} (${longestName.name.length} characters)
Earliest Record: ${earliest}
Latest Record: ${latest}`);

          menu();
        })();
        break;

      case '9':
        console.log('👋 Exiting NodeVault...');
        rl.close();
        break;

      default:
        console.log('Invalid option.');
        menu();
    }
  });
}

menu();

