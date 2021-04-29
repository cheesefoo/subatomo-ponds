from json import dumps
from os import listdir
from os.path import isfile, join, dirname, abspath
from pathlib import PurePath
from subprocess import run

import gspread
from gspread.exceptions import APIError
from oauth2client.service_account import ServiceAccountCredentials
from pydrive2.auth import GoogleAuth
from pydrive2.drive import GoogleDrive
from tenacity import retry, retry_if_exception_type, wait_random_exponential

# run this from 'src/submissionImportScript'
# Set location of texture packer exe
# client_secrets.json is not committed for security
TEXTURE_PACKER_EXE = join('K:\\Utilities\\TexturePacker\\bin', 'TexturePacker.exe')
# TEXTURE_PACKER_EXE = join('C:\\Program Files\\CodeAndWeb\\TexturePacker\\bin', 'TexturePacker.exe')
ASSETS_DIR = PurePath(dirname(dirname(abspath(__file__))), 'assets')
JSON_DESTINATION_DIR = join(ASSETS_DIR, 'submissions')
RAW_IMAGES_DIR = join(ASSETS_DIR, 'all_submissions_raw')
SPLIT_IMAGES_DIR = join(ASSETS_DIR, 'all_submissions_split')
SPRITESHEET_DIR = join(ASSETS_DIR, 'submissions')
SHEETS_ID = '1JhkgvlwjuVTeK9Jwaq9lAgsoCMNhreGbgXQBXZY8eak'
DRIVE_ID = '1x4ErkPqyRwgPn87wGeclYwk1uRY0yy0x'


def download_json():
    # authenticate and get sheet
    gc = gspread.service_account('client_secrets.json')
    sh = gc.open_by_key(SHEETS_ID)
    worksheet = sh.sheet1

    num_of_entries = worksheet.row_count
    entries = []

    @retry(retry=retry_if_exception_type(APIError),
           wait=wait_random_exponential(multiplier=1, max=60))
    def try_to_get_row(index):
        row = worksheet.row_values(index)
        name = row[1]
        filename = row[5]
        pond = row[8]
        msg = row[6]
        sound = row[7]
        entry = {"name": name,
                 "image": filename,
                 "pond": pond,
                 "message": msg,
                 "sound": sound}
        return entry

    for i in range(2, num_of_entries):
        entries.append(try_to_get_row(i))

    submissions = {"submissions": entries}
    output = dumps(submissions)
    with open(join(JSON_DESTINATION_DIR, 'submissions.json'), 'w') as f:
        f.write(output)
    print('json written to {}'.format(JSON_DESTINATION_DIR))


def download_images():
    # auth with service account
    gauth = GoogleAuth()
    gauth.auth_method = 'service'
    scope = ['https://www.googleapis.com/auth/drive']
    gauth.credentials = ServiceAccountCredentials.from_json_keyfile_name('client_secrets.json', scope)
    drive = GoogleDrive(gauth)

    @retry(wait=wait_random_exponential(multiplier=1, max=60))
    def try_download(f, destination):
        f.GetContentFile(destination)

    query = "'{}' in parents and trashed=false".format(DRIVE_ID)
    file_list = drive.ListFile({'q': query}).GetList()
    for file in file_list:
        filename = file['title']
        dest = join(RAW_IMAGES_DIR, filename + ".png")
        try_download(file, dest)
    print("downloaded {} files".format(len(file_list)))


def split_images():
    files = [f for f in listdir(RAW_IMAGES_DIR) if isfile(join(RAW_IMAGES_DIR, f))]
    for filename in files:
        if not filename.endswith('png'):
            continue
        args = ['convert', join(RAW_IMAGES_DIR, filename), '-crop', '2x2@', '+repage',
                join(SPLIT_IMAGES_DIR, filename[:-4]) + '%d.png']
        run(args, shell=True, check=True)


def pack_spritesheet():
    json_filename = join(SPRITESHEET_DIR, 'all_ducks_sheet.json')
    sheet_filename = join(SPRITESHEET_DIR, 'all_ducks_sheet_{n}.png')
    args = [
        TEXTURE_PACKER_EXE, '--format', "phaser", '--png-opt-level', '1', '--multipack', '--data', json_filename,
        '--sheet',
        sheet_filename, '--max-width', '512', '--max-height', '512', SPLIT_IMAGES_DIR]
    run(args, shell=True, check=True)


def main():
    download_json()
    download_images()
    split_images()
    pack_spritesheet()


if __name__ == '__main__':
    main()
