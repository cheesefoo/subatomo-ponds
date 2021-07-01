import math
import os
import shutil
import subprocess
import time
from json import dumps, load, loads
from os import listdir
from os.path import isfile, join, dirname, abspath
from pathlib import PurePath, Path

import gspread
from oauth2client.service_account import ServiceAccountCredentials
from pydrive2.auth import GoogleAuth
from pydrive2.drive import GoogleDrive
from tenacity import retry, wait_random_exponential

# run this from 'src/submissionImportScript'
# Set location of texture packer exe
# client_secrets.json is not committed for security
TEXTURE_PACKER_EXE = join('K:\\Utilities\\TexturePacker\\bin', 'TexturePacker.exe')
# TEXTURE_PACKER_EXE = join('C:\\Program Files\\CodeAndWeb\\TexturePacker\\bin', 'TexturePacker.exe')
ASSETS_DIR = PurePath(dirname(dirname(abspath(__file__))), 'assets')
JSON_DESTINATION_DIR = join(ASSETS_DIR, 'submissions')
RAW_IMAGES_DIR = join(ASSETS_DIR, 'all_submissions_raw')
SPLIT_IMAGES_DIR = join(ASSETS_DIR, 'all_submissions_split')
FANART_DIR = join(ASSETS_DIR, 'fanart')
RAW_FANART_DIR = join(ASSETS_DIR, 'fanart_uncompressed')
SPRITESHEET_DIR = join(ASSETS_DIR, 'submissions')
TEMP_IMAGE_DIR = join(ASSETS_DIR, 'all_submissions_temp')
TEMP_ATLAS_DIR = join(ASSETS_DIR, 'all_submissions_atlas_temp')
SHEETS_ID = '1JhkgvlwjuVTeK9Jwaq9lAgsoCMNhreGbgXQBXZY8eak'
DRIVE_ID = '1x4ErkPqyRwgPn87wGeclYwk1uRY0yy0x'
SUBS_PER_POND = 20
PONDS_PER_ATLAS = 5
SUBMISSIONS = None


def get_duck_subs():
    # authenticate and get sheet
    global SUBMISSIONS
    gc = gspread.service_account('client_secrets.json')
    sh = gc.open_by_key(SHEETS_ID)
    worksheet = sh.get_worksheet(1)

    num_of_entries = worksheet.row_count
    entries = []
    r = 'A1:E' + str(num_of_entries)
    print(f"Getting {num_of_entries} submissions from {r}")
    all_rows = worksheet.batch_get([r])
    all_rows = all_rows[0]

    def try_to_get_row(index):
        row = all_rows[index]
        name = row[0]
        filename = row[1]
        pond = row[4]
        msg = row[2]
        sound = row[3]
        entry = {"name": name,
                 "image": filename,
                 "pond": pond,
                 "message": msg,
                 "sound": sound}
        return entry

    for i in range(1, num_of_entries):
        try:
            entries.append(try_to_get_row(i))
        except IndexError as e:
            pass
            # print("out of range: "+str(i))
    submissions = {"submissions": entries}
    SUBMISSIONS = submissions
    output = dumps(submissions)
    with open(join(JSON_DESTINATION_DIR, 'submissions.json'), 'w') as f:
        f.write(output)
    print('json written to {}'.format(JSON_DESTINATION_DIR))


def get_fanart_subs():
    # authenticate and get sheet
    global SUBMISSIONS
    gc = gspread.service_account('client_secrets.json')
    sh = gc.open_by_key(SHEETS_ID)
    worksheet = sh.get_worksheet(2)

    num_of_entries = worksheet.row_count
    entries = []
    r = 'A1:F' + str(num_of_entries)
    print(f"Getting {num_of_entries} submissions from {r}")
    all_rows = worksheet.batch_get([r])
    all_rows = all_rows[0]

    def try_to_get_row(index):
        row = all_rows[index]
        name = row[0]
        filename = row[1]
        msg = row[2]
        social = row[3]
        link = row[4]
        pond = row[5]
        entry = {"name": name,
                 "filename": filename,
                 "message": msg,
                 "social": social,
                 "link": link,
                 "pond": pond}
        return entry

    for i in range(1, num_of_entries):
        try:
            entries.append(try_to_get_row(i))
        except IndexError as e:
            pass
            # print("out of range: "+str(i))
    submissions = {"submissions": entries}
    output = dumps(submissions)
    with open(join(FANART_DIR, 'fanartSubmissions.json'), 'w') as f:
        f.write(output)
    print('json written to {}'.format(FANART_DIR))


def download_images():
    # auth with service account
    gauth = GoogleAuth()
    gauth.auth_method = 'service'
    scope = ['https://www.googleapis.com/auth/drive']
    gauth.credentials = ServiceAccountCredentials.from_json_keyfile_name('client_secrets.json', scope)
    drive = GoogleDrive(gauth)

    @retry(wait=wait_random_exponential(multiplier=1, max=2))
    def try_download(f, destination):
        f.GetContentFile(destination)

    query = "'{}' in parents and trashed=false".format(DRIVE_ID)
    file_list = drive.ListFile({'q': query}).GetList()
    progress = 0
    total = len(file_list)
    print("going to download " + str(total) + " files")
    for file in file_list:
        progress = progress + 1
        filename = file['title']
        if filename.startswith("TEMPLATE"):
            continue
        if filename.startswith("FANART"):
            dest = join(RAW_FANART_DIR, filename + ".png")
        else:
            dest = join(RAW_IMAGES_DIR, filename + ".png")
        if Path(dest).exists():
            print(str(progress) + ") " + filename + " already on disk")
            continue
        print(str(progress) + ") " + " getting " + filename + " " + str(progress) + " out of " + str(total))
        try_download(file, dest)
    print("downloaded {} files".format(total))


def split_images():
    print("starting to split images...")
    files = [f for f in listdir(RAW_IMAGES_DIR) if isfile(join(RAW_IMAGES_DIR, f))]
    for filename in files:
        if not filename.endswith('png'):
            continue
        args = ['convert', join(RAW_IMAGES_DIR, filename), '-crop', '2x2@', '+repage',
                join(SPLIT_IMAGES_DIR, filename[:-4]) + '-%d.png']
        subprocess.run(args, shell=True, check=True)
    print("images have been split")


def pack_spritesheets_per_atlas():
    global SUBMISSIONS
    with open(join(JSON_DESTINATION_DIR, 'submissions.json'), 'r') as f:
        SUBMISSIONS = load(f)

    total_num_ponds = math.ceil(len(SUBMISSIONS["submissions"]) / SUBS_PER_POND)
    total_iterations = math.ceil(total_num_ponds / PONDS_PER_ATLAS)
    SUBMISSIONS = SUBMISSIONS["submissions"]
    print("gonna put " + str(total_num_ponds) + " ponds into " + str(total_iterations) + " atlases")
    atlas_num = 1
    for i in range(1, total_iterations + 1):
        for i2 in range(i, i + PONDS_PER_ATLAS):
            subs_by_pond = [x for x in SUBMISSIONS if x['pond'] == str(i2)]
            move_some(subs_by_pond)
        time.sleep(0.5)
        pack_spritesheet_free_batches(TEMP_ATLAS_DIR)
        rename_atlas(i)
        remove_files(TEMP_IMAGE_DIR)
        remove_files(TEMP_ATLAS_DIR)
        atlas_num = atlas_num + 1


suffixes = ["-0.png", "-1.png", "-2.png", "-3.png"]


def remove_files(dir):
    for files in os.listdir(dir):
        os.remove(join(dir, files))


def move_some(subs_by_pond):
    global suffixes
    for sub in subs_by_pond:
        for suffix in suffixes:
            if sub['image'] == "TEMPLATE":
                break
            filename = sub['image'] + suffix
            try:
                shutil.move(join(SPLIT_IMAGES_DIR, filename), join(TEMP_IMAGE_DIR, filename))
            except Exception as e:
                print(e)


def rename_atlas(pondnum):
    pondnumstart = pondnum
    for file in os.listdir(TEMP_ATLAS_DIR):
        if file.endswith(".png"):
            newname = "pondbatch-" + str(pondnum)
            # os.rename(join(TEMP_ATLAS_DIR, file), join(SPRITESHEET_DIR, newname + ".png"))
            jsonfile = join(TEMP_ATLAS_DIR, file[:-4] + ".json")
            print(jsonfile)
            with open(jsonfile, 'rb') as f:
                j = load(f)
                j["textures"][0]["image"] = newname + ".png"
                newjson = dumps(j)
            with open(jsonfile, 'w') as f:
                f.write(newjson)

            shutil.move(join(TEMP_ATLAS_DIR, file), join(SPRITESHEET_DIR, newname + ".png"))
            pondnum = pondnum + 1
    merge_json(TEMP_ATLAS_DIR, SPRITESHEET_DIR)
    os.rename(join(SPRITESHEET_DIR, "all_ducks_sheet.json"),
              join(SPRITESHEET_DIR, "pondbatch-" + str(pondnumstart) + ".json"))


def pack_spritesheet_free():
    # free-tex-packer-cli --project /path/to/project.ftpp --output /path/to/output/folder
    project = 'prod.ftpp'
    args = ['free-tex-packer-cli', '--project', project, '--output', SPRITESHEET_DIR]
    subprocess.run(args, shell=True, check=True)
    # merge_json()
    #


def pack_spritesheet_free_batches(destdir):
    # free-tex-packer-cli --project /path/to/project.ftpp --output /path/to/output/folder
    project = 'batches.ftpp'
    args = ['free-tex-packer-cli', '--project', project, '--output', destdir]
    subprocess.call(args, shell=True)


def merge_json(srcdir, destdir):
    single = '{"textures": [], "meta": {"app": "http://github.com/odrick/free-tex-packer-cli", "version": "0.3.0"}}'
    s = loads(single)
    t = s["textures"]
    files = []
    for file in listdir(srcdir):
        if file.endswith("json"):
            with open(join(srcdir, file), 'rb') as f:
                j = load(f)
                t += j["textures"]
                files.append(f)
    output = dumps(s)
    with open(join(destdir, "all_ducks_sheet.json"), 'w') as f:
        f.write(output)


#         for o in files:
#             remove(o.name)


def pack_spritesheet():
    json_filename = join(SPRITESHEET_DIR, 'all_ducks_sheet.json')
    sheet_filename = join(SPRITESHEET_DIR, 'all_ducks_sheet_{n}.png')
    args = [
        TEXTURE_PACKER_EXE, '--format', "phaser", '--png-opt-level', '1', '--multipack', '--data', json_filename,
        '--sheet',
        sheet_filename, '--max-width', '512', '--max-height', '512', SPLIT_IMAGES_DIR]
    subprocess.run(args, shell=True, check=True)


def main():
    get_duck_subs()
    get_fanart_subs()
    # download_images()
    # split_images()
    # pack_spritesheets_per_atlas()


#     pack_spritesheet_free()
# merge_json()
# pack_spritesheet()


if __name__ == '__main__':
    main()
