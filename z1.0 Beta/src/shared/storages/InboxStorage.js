// src/shared/storages/InboxStorage.js
import { createStorage, StorageType } from './base';

const Inbox = {
  conversations: [],
  settings: {
    notifications: true,
    autoPlayMedia: false,
    autoTranslate: false,
    autoScroll: true,
    showUnreadCount: true,
    showContactPhotos: true,
    showContactNames: true,
    showContactStatus: true,
    showContactLastSeen: true,
    showContactGroups: true,
    showContactLabels: true,
    showContactNotes: true,
    showContactTags: true,
    showContactCategories: true,
    showContactCustomFields: true,
    showContactCustomFieldsInList: true,
    showContactCustomFieldsInDetails: true,
    showContactCustomFieldsInSearch: true,
    showContactCustomFieldsInFilters: true,
    showContactCustomFieldsInSort: true,
    showContactCustomFieldsInExport: true,
    showContactCustomFieldsInImport: true,
    showContactCustomFieldsInTemplates: true,
    showContactCustomFieldsInReports: true,
    showContactCustomFieldsInAnalytics: true,
    showContactCustomFieldsInAutomation: true,
    showContactCustomFieldsInIntegration: true,
    showContactCustomFieldsInApi: true,
    showContactCustomFieldsInWebhook: true
  }
};

const storage = createStorage('inbox_storage', Inbox, {
  storageType: StorageType.Local,
  liveUpdate: true,
  sessionAccessForContentScripts: true
});

export default storage;