export interface NotionCertificate {
    id: string;
    properties: {
      participantName: { title: [{ plain_text: string }] };
      courseName: { rich_text: [{ plain_text: string }] };
      courseDescription: { rich_text: [{ plain_text: string }] };
      authorName: { rich_text: [{ plain_text: string }] };
      completionDate: { date: { start: string } };
      certificateUrl: { url: string };
    };
  }
  
  export interface NotionDatabase {
    id: string;
    title: [{ plain_text: string }];
  }
  
  