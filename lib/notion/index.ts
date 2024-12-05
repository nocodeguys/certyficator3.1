const { Client } = require('@notionhq/client');
const { PrismaClient } = require('@prisma/client');
const { NOTION_API_KEY, NOTION_DATABASE_ID, NOTION_INTEGRATION_ENABLED } = require('./config');

const notion = new Client({ auth: NOTION_API_KEY });
const prisma = new PrismaClient();

export const syncNotionData = async () => {
  if (!NOTION_INTEGRATION_ENABLED) {
    console.log('Notion integration is disabled');
    return;
  }

  try {
    const database = await notion.databases.retrieve({ database_id: NOTION_DATABASE_ID });
    const results = await notion.databases.query({ database_id: NOTION_DATABASE_ID });

    for (const page of results.results) {
      console.log('Processing page properties:', page.properties);
      
      // Check if all required fields exist and have values
      const participantName = page.properties['Participant Name']?.title?.[0]?.plain_text;
      const courseName = page.properties['Course Name']?.rich_text?.[0]?.plain_text;
      const courseDescription = page.properties['Course Description']?.rich_text?.[0]?.plain_text;
      const authorName = page.properties['Author Name']?.rich_text?.[0]?.plain_text;
      const completionDate = page.properties['Completion Date']?.date?.start;

      if (!participantName || !courseName || !courseDescription || !authorName || !completionDate) {
        console.error('Missing required fields for page:', page.id);
        console.error({
          participantName,
          courseName,
          courseDescription,
          authorName,
          completionDate
        });
        continue;
      }

      const certificateData = {
        participantName,
        courseName,
        courseDescription,
        authorName,
        completionDate: new Date(completionDate),
        notionPageId: page.id
      };

      try {
        // Try to find existing certificate
        const existingCertificate = await prisma.certificate.findUnique({
          where: { notionPageId: page.id }
        });

        let certificate;
        if (existingCertificate) {
          // Update existing certificate
          certificate = await prisma.certificate.update({
            where: { notionPageId: page.id },
            data: certificateData,
          });
        } else {
          // Create new certificate
          certificate = await prisma.certificate.create({
            data: certificateData,
          });
        }

        // Update Notion with the certificate URL
        await notion.pages.update({
          page_id: page.id,
          properties: {
            'Certificate URL': {
              url: `${process.env.NEXT_PUBLIC_APP_URL}/certificates/${certificate.id}`,
            },
          },
        });
      } catch (error) {
        console.error('Error processing certificate:', error);
        throw error;
      }
    }

    console.log('Notion data synced successfully');
  } catch (error) {
    console.error('Error syncing Notion data:', error);
    throw error;
  }
}

module.exports = { syncNotionData };

