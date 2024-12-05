import { syncNotionData } from '../lib/notion';

async function main() {
  try {
    await syncNotionData();
    console.log('Sync completed successfully');
  } catch (error) {
    console.error('Sync failed:', error);
  }
  process.exit(0);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

