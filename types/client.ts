export interface Client {
  id: string;
  dealname: string;
  main_folder_id: string;
  main_folder_link: string;
  binder_master_folder_link: string;
  client_last_name: string;
  client_working_folder_link: string;
  createdate: string;
  dealstage: string;
  hs_lastmodifieddate: string;
  hs_object_id: string;
}

export interface PhotoData {
  clientId: string;
  dealFolderId: string;
  photoType: string;
  subType: string;
  localUri?: string;
  uploaded: boolean;
}
