import { Client } from '@notionhq/client';
import { PrismaClient } from '@prisma/client';
import type { Certificate } from '@prisma/client';
import type { PageObjectResponse } from '@notionhq/client/build/src/api-endpoints';
import { NOTION_API_KEY, NOTION_DATABASE_ID, NOTION_INTEGRATION_ENABLED } from './config';

const notion = new Client({ auth: NOTION_API_KEY });
const prisma = new PrismaClient();

interface NotionPageProperties {
  'Participant Name': { title: Array<{ plain_text: string }> };
  'Course Name': { rich_text: Array<{ plain_text: string }> };
  'Course Description': { rich_text: Array<{ plain_text: string }> };
  'Author Name': { rich_text: Array<{ plain_text: string }> };
  'Completion Date': { date: { start: string } };
}

export async function syncNotionData(): Promise<{ 
  processedPages: number, 
  createdCertificates: number, 
  updatedCertificates: number,
  errors: number
}> {
  if (!NOTION_INTEGRATION_ENABLED) {
    console.log('Notion integration is disabled');
    return { processedPages: 0, createdCertificates: 0, updatedCertificates: 0, errors: 0 };
  }

  let processedPages = 0;
  let createdCertificates = 0;
  let updatedCertificates = 0;
  let errors = 0;

  try {
    await notion.databases.retrieve({ database_id: NOTION_DATABASE_ID as string });
    const results = await notion.databases.query({ 
      database_id: NOTION_DATABASE_ID as string 
    });

    for (const page of results.results as PageObjectResponse[]) {
      processedPages++;
      console.log(`Processing page ${processedPages}:`, page.id);
      
      const properties = page.properties as unknown as NotionPageProperties;
      
      // Check if all required fields exist and have values
      const participantName = properties['Participant Name']?.title?.[0]?.plain_text;
      const courseName = properties['Course Name']?.rich_text?.[0]?.plain_text;
      const courseDescription = properties['Course Description']?.rich_text?.[0]?.plain_text;
      const authorName = properties['Author Name']?.rich_text?.[0]?.plain_text;
      const completionDate = properties['Completion Date']?.date?.start;

      if (!participantName || !courseName || !courseDescription || !authorName || !completionDate) {
        console.error('Missing required fields for page:', page.id);
        errors++;
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

        let certificate: Certificate;
        if (existingCertificate) {
          // Update existing certificate
          certificate = await prisma.certificate.update({
            where: { notionPageId: page.id },
            data: certificateData,
          });
          updatedCertificates++;
          console.log(`Updated certificate for page ${page.id}`);
        } else {
          // Create new certificate
          certificate = await prisma.certificate.create({
            data: certificateData,
          });
          createdCertificates++;
          console.log(`Created new certificate for page ${page.id}`);
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
        console.error('Error processing certificate:', error instanceof Error ? error.message : String(error));
        errors++;
      }
    }

    console.log('Notion data sync summary:', {
      processedPages,
      createdCertificates,
      updatedCertificates,
      errors
    });
    return { processedPages, createdCertificates, updatedCertificates, errors };
  } catch (error) {
    console.error('Error syncing Notion data:', error instanceof Error ? error.message : String(error));
    throw error;
  }
}

