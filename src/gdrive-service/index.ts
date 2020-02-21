import * as Assert from 'assert';
import * as Inquirer from 'inquirer';
import { google } from 'googleapis';
import * as FileService from '../file-service';

type oAuth2Client = InstanceType<typeof google.auth.OAuth2>;
type GDrive = ReturnType<typeof google.drive>;

const SCOPES = [ 'https://www.googleapis.com/auth/drive.file' ];
const TOKEN_FILENAME = 'oauth2-token.json';
const GDRIVE_FOLDERNAME = 'nnn-backup';
const GDRIVE_FILENAME = FileService.utils.DATA_FILENAME;

Assert(process.env.CLIENT_ID, 'Missing CLIENT_ID env');
Assert(process.env.CLIENT_SECRET, 'Missing CLIENT_SECRET env');
Assert(process.env.REDIRECT_URI, 'Missing REDIRECT_URI env');

type _getOAuth2ClientType = () => oAuth2Client;
const _getOAuth2Client: _getOAuth2ClientType = () => new google.auth.OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    process.env.REDIRECT_URI
);

type _getOrGenerateTokenType = (oAuth2Client: oAuth2Client) => object;
const _getOrGenerateToken: _getOrGenerateTokenType = async (oAuth2Client) => {

    const cachedToken = FileService.utils.readFromAppDir(TOKEN_FILENAME);
    if (cachedToken) {
        return cachedToken;
    }

    const authUrl = oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: SCOPES,
    });
    console.log(`Authorize this app by visiting this url: ${authUrl}`);
    const answer = await Inquirer.prompt([{
        type: 'input',
        name: 'code',
        message: 'Enter the code from that page here:',
        default: ''
    }]);

    const generatedToken = await oAuth2Client.getToken(answer.code);
    FileService.utils.writeToAppDir(TOKEN_FILENAME, generatedToken.tokens);

    return generatedToken.tokens;
};

type _getGDriveType = () => Promise<GDrive>;
const _getGDrive: _getGDriveType = async () => {

    const oAuth2Client = _getOAuth2Client();
    const token = await _getOrGenerateToken(oAuth2Client);
    oAuth2Client.setCredentials(token);

    return google.drive({ version: 'v3', auth: oAuth2Client });
};

type _getFolderIdType = (gdrive: GDrive) => Promise<string | null>;
const _getFolderId: _getFolderIdType = async (gdrive) => {

    const res = await gdrive.files.list({
        q: `mimeType = 'application/vnd.google-apps.folder' and name = '${GDRIVE_FOLDERNAME}' and trashed = false`,
        pageSize: 1,
        fields: 'files(id)',
    });
    return res?.data?.files?.[0]?.id || null;
};

type _createFolderType = (gdrive: GDrive) => Promise<string | null>;
const _createFolder: _createFolderType = async (gdrive) => {

    const requestBody = {
        mimeType: 'application/vnd.google-apps.folder',
        name: GDRIVE_FOLDERNAME,
    };
    const res = await gdrive.files.create({
        requestBody,
        fields: 'id'
    });
    return res?.data?.id || null;
}

type _getFileIdType = (gdrive: GDrive) => Promise<string | null>;
const _getFileId: _getFileIdType = async (gdrive) => {

    const res = await gdrive.files.list({
        q: `mimeType = 'application/json' and name = '${GDRIVE_FILENAME}' and trashed = false`,
        pageSize: 1,
        fields: 'files(id)',
    });
    return res?.data?.files?.[0]?.id || null;
};

type _upsertFileType = (gdrive: GDrive, folderId: string, fileId: string | null) => Promise<string | null>;
const _upsertFile: _upsertFileType = async (gdrive, folderId, fileId) => {

    const media = {
        mimeType: 'application/json',
        body: FileService.utils.getDataAsReadable()
    };
    let res;
    if (fileId) {
        res = await gdrive.files.update({
            fileId,
            media,
            fields: 'id'
        });
    }
    else {
        res = await gdrive.files.create({
            requestBody: {
                name: GDRIVE_FILENAME,
                parents: [folderId]
            },
            media,
            fields: 'id'
        });
    }
    return res?.data?.id || null;
};

type makeDataBackupType = () => void;
export const makeDataBackup: makeDataBackupType = async () => {

    const gdrive = await _getGDrive();
    const folderId = await _getFolderId(gdrive) || await _createFolder(gdrive);
    if (!folderId) {
        return console.error('Backup failed. Did not succeed to create/find parent folder on gdrive.');
    }
    let fileId = await _getFileId(gdrive);
    fileId = await _upsertFile(gdrive, folderId, fileId);
    if (!fileId) {
        return console.error('Backup failed. Did not suceed to create/update data file.');
    }
    return console.log('Backup successful.');
};
