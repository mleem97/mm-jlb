import Dexie, { Table } from "dexie";

/* eslint-disable @typescript-eslint/no-explicit-any */
export type ApplicationRecord = {
  id: string;
  data: any; // Full application state snapshot
  updatedAt: Date;
};

export type AttachmentRecord = {
  id: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  category: string;
  blob: Blob;
  addedAt: Date;
};

class ApplicationDb extends Dexie {
  applications!: Table<ApplicationRecord, string>;
  attachments!: Table<AttachmentRecord, string>;

  constructor() {
    super("jlb-applications");

    this.version(1).stores({
      applications: "id,updatedAt",
    });

    this.version(2).stores({
      applications: "id,updatedAt",
      attachments: "id,fileName,category,addedAt",
    });
  }
}

export const applicationDb = new ApplicationDb();
